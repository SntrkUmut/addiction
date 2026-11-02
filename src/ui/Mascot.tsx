/**
 * Mascot component (rev 5.5)
 * Data-driven fox with accessory overlays and decorative FX from PR #1.
 *
 * FX are hidden from accessibility, skipped on light scenes, and stay static
 * until reduce-motion is known and off. Smoke/fire effects are not loaded.
 */

import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import accessoryData from '../../assets/mascot/accessories.json';
import {
  isMascotMotionEnabled,
  layerMascotEffects,
  sanitizeMascotEffects,
  type MascotEffect,
} from './mascotEffects';

type Pose = 'asleep' | 'content' | 'hopeful' | 'joyful' | 'neutral' | 'smug' | 'wistful';

interface MascotProps {
  pose: Pose;
  accessories?: string[];
  size?: number;
  darkScene?: boolean;
  effects?: readonly string[];
  style?: StyleProp<ViewStyle>;
}

const POSE_MAP: Record<Pose, number> = {
  asleep: require('../../assets/mascot/asleep.png'),
  content: require('../../assets/mascot/content.png'),
  hopeful: require('../../assets/mascot/hopeful.png'),
  joyful: require('../../assets/mascot/joyful.png'),
  neutral: require('../../assets/mascot/hopeful.png'),
  smug: require('../../assets/mascot/smug.png'),
  wistful: require('../../assets/mascot/wistful.png'),
};

const POSE_TO_ACCESSORY_POSE: Record<Pose, string> = {
  asleep: 'fox_sleepy',
  content: 'fox_calm',
  hopeful: 'fox_idle',
  joyful: 'fox_cheer',
  neutral: 'fox_idle',
  smug: 'fox_happy',
  wistful: 'fox_wave',
};

const BASE_ACCESSORY_MAP: Record<string, number> = {
  'it-atki': require('../../assets/mascot/it-atki.png'),
  'it-bere': require('../../assets/mascot/it-bere.png'),
  'it-hasir-sapka': require('../../assets/mascot/it-hasir-sapka.png'),
  'it-lastik-cizme': require('../../assets/mascot/it-lastik-cizme.png'),
  'it-semsiye': require('../../assets/mascot/it-semsiye.png'),
  'it-sirt-cantasi': require('../../assets/mascot/it-sirt-cantasi.png'),
  'it-yuvarlak-gozluk': require('../../assets/mascot/it-yuvarlak-gozluk.png'),
  'it-yildiz-rozeti': require('../../assets/mascot/it-yildiz-rozeti.png'),
};

const PER_POSE_ACCESSORY_MAPS: Record<string, Record<string, number>> = {
  'it-orgu-eldiven': {
    fox_idle: require('../../assets/mascot/it-orgu-eldiven.png'),
    fox_wave: require('../../assets/mascot/it-orgu-eldiven-wave.png'),
    fox_calm: require('../../assets/mascot/it-orgu-eldiven-calm.png'),
    fox_sleepy: require('../../assets/mascot/it-orgu-eldiven-sleepy.png'),
    fox_happy: require('../../assets/mascot/it-orgu-eldiven-happy.png'),
  },
  'it-ruzgarlik': {
    fox_idle: require('../../assets/mascot/it-ruzgarlik.png'),
    fox_wave: require('../../assets/mascot/it-ruzgarlik-wave.png'),
    fox_calm: require('../../assets/mascot/it-ruzgarlik-calm.png'),
    fox_cheer: require('../../assets/mascot/it-ruzgarlik-cheer.png'),
    fox_happy: require('../../assets/mascot/it-ruzgarlik-happy.png'),
  },
};

const EFFECT_ASSETS: Record<MascotEffect, number> = {
  shield: require('../../assets/mascot/fx/fx_shield.png'),
  breath_ring: require('../../assets/mascot/fx/fx_breath_ring.png'),
  bubbles: require('../../assets/mascot/fx/fx_bubbles.png'),
  sparkles: require('../../assets/mascot/fx/fx_sparkles.png'),
  crystals: require('../../assets/mascot/fx/fx_crystals.png'),
};

type AccessoryData = {
  name: string;
  id: string;
  bbox: number[];
  layer: string;
  per_pose_files?: boolean;
  [key: string]: unknown;
};

function useReduceMotion(): boolean | null {
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => setReduceMotion(enabled ?? false))
      .catch(() => setReduceMotion(false));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', enabled => {
      setReduceMotion(enabled);
    });
    return () => subscription.remove();
  }, []);

  return reduceMotion;
}

function ShieldEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!motionEnabled) {
      cancelAnimation(rotate);
      cancelAnimation(scale);
      rotate.value = 0;
      scale.value = 1;
      return;
    }
    rotate.value = withRepeat(withTiming(360, { duration: 20000, easing: Easing.linear }), -1, false);
    scale.value = withRepeat(withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true);
    return () => {
      cancelAnimation(rotate);
      cancelAnimation(scale);
      rotate.value = 0;
      scale.value = 1;
    };
  }, [motionEnabled, rotate, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.shield}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

function BreathRingEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    if (!motionEnabled) {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 0.85;
      opacity.value = 0.7;
      return;
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.85, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.7, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 0.85;
      opacity.value = 0.7;
    };
  }, [motionEnabled, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.breath_ring}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

function BubblesEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!motionEnabled) {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      translateY.value = 0;
      opacity.value = 0;
      return;
    }
    translateY.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-40, { duration: 5500, easing: Easing.out(Easing.ease) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(0, { duration: 5500, easing: Easing.in(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      translateY.value = 0;
      opacity.value = 0;
    };
  }, [motionEnabled, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.bubbles}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

function SparklesEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (!motionEnabled) {
      cancelAnimation(opacity);
      cancelAnimation(scale);
      opacity.value = 0.4;
      scale.value = 0.95;
      return;
    }
    opacity.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
    scale.value = withRepeat(withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
    return () => {
      cancelAnimation(opacity);
      cancelAnimation(scale);
      opacity.value = 0.4;
      scale.value = 0.95;
    };
  }, [motionEnabled, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.sparkles}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

function CrystalsEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!motionEnabled) {
      cancelAnimation(translateY);
      translateY.value = 0;
      return;
    }
    translateY.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-6, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(translateY);
      translateY.value = 0;
    };
  }, [motionEnabled, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.crystals}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

function renderEffect(effect: MascotEffect, size: number, motionEnabled: boolean) {
  switch (effect) {
    case 'shield':
      return <ShieldEffect key={effect} size={size} motionEnabled={motionEnabled} />;
    case 'breath_ring':
      return <BreathRingEffect key={effect} size={size} motionEnabled={motionEnabled} />;
    case 'sparkles':
      return <SparklesEffect key={effect} size={size} motionEnabled={motionEnabled} />;
    case 'bubbles':
      return <BubblesEffect key={effect} size={size} motionEnabled={motionEnabled} />;
    case 'crystals':
      return <CrystalsEffect key={effect} size={size} motionEnabled={motionEnabled} />;
  }
}

export function Mascot({
  pose,
  accessories = [],
  size = 200,
  darkScene = false,
  effects = [],
  style,
}: MascotProps) {
  const accessoryPoseName = POSE_TO_ACCESSORY_POSE[pose];
  const reduceMotion = useReduceMotion();
  const motionEnabled = isMascotMotionEnabled(reduceMotion);
  const shownEffects = darkScene ? sanitizeMascotEffects(effects) : [];
  const { back, mid } = layerMascotEffects(shownEffects);
  const poseScale = shownEffects.length > 0 ? 0.62 : 1;

  return (
    <View
      style={[styles.container, { width: size, height: size }, style]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {back.map(effect => renderEffect(effect, size, motionEnabled))}
      {mid.map(effect => renderEffect(effect, size, motionEnabled))}

      <Image
        source={POSE_MAP[pose]}
        style={[styles.pose, { width: size * poseScale, height: size * poseScale }]}
        resizeMode="contain"
        accessible={false}
        importantForAccessibility="no"
      />

      {accessories.map((slug) => {
        const data = accessoryData[slug as keyof typeof accessoryData] as AccessoryData;
        if (!data || !data.bbox) return null;

        let accessorySource;
        if (data.per_pose_files && PER_POSE_ACCESSORY_MAPS[slug]) {
          accessorySource = PER_POSE_ACCESSORY_MAPS[slug][accessoryPoseName];
          if (!accessorySource) return null;
        } else {
          accessorySource = BASE_ACCESSORY_MAP[slug];
        }

        if (!accessorySource) return null;

        const [left, top, right, bottom] = data.bbox;
        const width = (right - left) * 100;
        const height = (bottom - top) * 100;
        const isUmbrella = slug === 'it-semsiye';

        return (
          <Image
            key={slug}
            source={accessorySource}
            accessible={false}
            importantForAccessibility="no"
            style={[
              styles.accessory,
              {
                left: `${left * 100}%`,
                top: `${top * 100}%`,
                width: `${width}%`,
                height: `${height}%`,
                overflow: isUmbrella ? 'visible' : 'hidden',
              },
            ]}
            resizeMode="contain"
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pose: {
    position: 'absolute',
  },
  accessory: {
    position: 'absolute',
  },
  effectLayer: {
    position: 'absolute',
  },
});
