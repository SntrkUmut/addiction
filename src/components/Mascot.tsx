import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';

export type MascotPose =
  | 'idle'
  | 'wave'
  | 'happy'
  | 'sad_coal'
  | 'craving'
  | 'calm'
  | 'cheer'
  | 'sleepy'
  | 'hero';

export type MascotEffect = 'smoke' | 'shield' | 'breath_ring' | 'bubbles' | 'sparkles' | 'crystals';

type MascotProps = {
  pose: MascotPose;
  size?: number;
  effects?: MascotEffect[];
  accessibilityLabel?: string;
};

const POSE_ASSETS = {
  idle: require('../../assets/mascot/fox/fox_idle.png'),
  wave: require('../../assets/mascot/fox/fox_wave.png'),
  happy: require('../../assets/mascot/fox/fox_happy.png'),
  sad_coal: require('../../assets/mascot/fox/fox_sad_coal.png'),
  craving: require('../../assets/mascot/fox/fox_craving.png'),
  calm: require('../../assets/mascot/fox/fox_calm.png'),
  cheer: require('../../assets/mascot/fox/fox_cheer.png'),
  sleepy: require('../../assets/mascot/fox/fox_sleepy.png'),
  hero: require('../../assets/mascot/fox/fox_hero.png'),
} as const;

const EFFECT_ASSETS = {
  smoke: require('../../assets/mascot/fx/fx_smoke.png'),
  shield: require('../../assets/mascot/fx/fx_shield.png'),
  breath_ring: require('../../assets/mascot/fx/fx_breath_ring.png'),
  bubbles: require('../../assets/mascot/fx/fx_bubbles.png'),
  sparkles: require('../../assets/mascot/fx/fx_sparkles.png'),
  crystals: require('../../assets/mascot/fx/fx_crystals.png'),
} as const;

const POSE_LABELS: Record<MascotPose, string> = {
  idle: 'Dinlenen tilki maskot',
  wave: 'El sallayan tilki maskot',
  happy: 'Sevinçle zıplayan tilki maskot',
  sad_coal: 'Kömür taşı tutan üzgün tilki maskot',
  craving: 'Kararlı duran, kristal kömür taşlı tilki maskot',
  calm: 'Bağdaş kurmuş meditasyon yapan tilki maskot',
  cheer: 'Başparmak yukarı cesaretlendiren tilki maskot',
  sleepy: 'Esneyen uykulu tilki maskot',
  hero: 'Kahraman pelerin ve gözlüklü tilki maskot',
};

function SmokeEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    if (!motionEnabled) return;
    translateY.value = withRepeat(
      withTiming(-24, { duration: 3500, easing: Easing.linear }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 3500, easing: Easing.linear }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: 0.55 }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.smoke}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
    />
  );
}

function ShieldEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!motionEnabled) return;
    rotate.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
    scale.value = withRepeat(
      withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.shield}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
    />
  );
}

function BreathRingEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    if (!motionEnabled) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.85, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.7, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.breath_ring}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
    />
  );
}

function BubblesEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!motionEnabled) return;
    translateY.value = withRepeat(
      withTiming(-40, { duration: 5500, easing: Easing.linear }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 5500, easing: Easing.linear }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.bubbles}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
    />
  );
}

function SparklesEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (!motionEnabled) return;
    opacity.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.sparkles}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
    />
  );
}

function CrystalsEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!motionEnabled) return;
    translateY.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-6, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Image
      source={EFFECT_ASSETS.crystals}
      style={[styles.effectLayer, { width: size, height: size }, animatedStyle]}
      accessible={false}
    />
  );
}

export function Mascot({
  pose,
  size = 92,
  effects = [],
  accessibilityLabel,
}: MascotProps) {
  const reducedMotion = useReducedMotion();

  const motionEnabled = !reducedMotion;
  const label = accessibilityLabel ?? POSE_LABELS[pose];

  const backEffects = effects.filter((e) => ['breath_ring', 'shield', 'sparkles'].includes(e));
  const midEffects = effects.filter((e) => ['bubbles', 'crystals'].includes(e));
  const frontEffects = effects.filter((e) => e === 'smoke');

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessible
      accessibilityLabel={label}
      accessibilityRole="image"
    >
      {backEffects.map((effect) => {
        if (effect === 'breath_ring') return <BreathRingEffect key={effect} size={size} motionEnabled={motionEnabled} />;
        if (effect === 'shield') return <ShieldEffect key={effect} size={size} motionEnabled={motionEnabled} />;
        if (effect === 'sparkles') return <SparklesEffect key={effect} size={size} motionEnabled={motionEnabled} />;
        return null;
      })}

      {midEffects.map((effect) => {
        if (effect === 'bubbles') return <BubblesEffect key={effect} size={size} motionEnabled={motionEnabled} />;
        if (effect === 'crystals') return <CrystalsEffect key={effect} size={size} motionEnabled={motionEnabled} />;
        return null;
      })}

      <Image
        source={POSE_ASSETS[pose]}
        style={[styles.poseImage, { width: size * 0.62, height: size * 0.62 }]}
        resizeMode="contain"
        accessible={false}
      />

      {frontEffects.map((effect) => {
        if (effect === 'smoke') return <SmokeEffect key={effect} size={size} motionEnabled={motionEnabled} />;
        return null;
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
  poseImage: {
    position: 'absolute',
  },
  effectLayer: {
    position: 'absolute',
  },
});
