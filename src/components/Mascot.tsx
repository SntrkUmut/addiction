import { useEffect, useState } from 'react';
import { AccessibilityInfo, Image, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

// Currently used poses. To re-enable unused poses, add them back to this union
// and to the POSE_ASSETS map below, then import the corresponding PNG assets.
// Unused poses available in assets/mascot/fox/: happy, sad_coal, sleepy, hero
export type MascotPose =
  | 'idle'      // Yuva (home), Sığınak (shelter), timer fallback
  | 'wave'      // Onboarding karşılama
  | 'craving'   // İstek akışı tool seçimi
  | 'calm'      // Timer nefes egzersizi
  | 'cheer';    // Tamamlama ekranı

// Effects restored for upcoming dark-background screens. Not currently used on light screens.
export type MascotEffect = 'smoke' | 'shield' | 'breath_ring' | 'bubbles' | 'sparkles' | 'crystals';

type MascotProps = {
  pose: MascotPose;
  size?: number;
  effects?: MascotEffect[];
  accessibilityLabel?: string;
  decorative?: boolean;
};

// Custom hook to track reduce motion setting with live updates
function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Get initial value
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled ?? false);
    });

    // Subscribe to changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotion(enabled);
      }
    );

    return () => subscription.remove();
  }, []);

  return reduceMotion;
}

// Only currently used poses are imported. Unused poses (happy, sad_coal, sleepy, hero)
// remain in assets/mascot/fox/ but are not bundled until re-enabled above.
const POSE_ASSETS = {
  idle: require('../../assets/mascot/fox/fox_idle.png'),
  wave: require('../../assets/mascot/fox/fox_wave.png'),
  craving: require('../../assets/mascot/fox/fox_craving.png'),
  calm: require('../../assets/mascot/fox/fox_calm.png'),
  cheer: require('../../assets/mascot/fox/fox_cheer.png'),
} as const;

// Effects restored for upcoming dark-background screens (compressed with pngquant).
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
  craving: 'Kararlı duran tilki maskot',
  calm: 'Bağdaş kurmuş meditasyon yapan tilki maskot',
  cheer: 'Başparmak yukarı cesaretlendiren tilki maskot',
};

function SmokeEffect({ size, motionEnabled }: { size: number; motionEnabled: boolean }) {
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
        withTiming(-24, { duration: 3500, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 0 }),
        withTiming(0, { duration: 3500, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      translateY.value = 0;
      opacity.value = 0;
    };
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
    if (!motionEnabled) {
      cancelAnimation(rotate);
      cancelAnimation(scale);
      rotate.value = 0;
      scale.value = 1;
      return;
    }
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
    return () => {
      cancelAnimation(rotate);
      cancelAnimation(scale);
      rotate.value = 0;
      scale.value = 1;
    };
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
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 0.85;
      opacity.value = 0.7;
    };
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
        withTiming(-40, { duration: 5500, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(0, { duration: 5500, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      translateY.value = 0;
      opacity.value = 0;
    };
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
    if (!motionEnabled) {
      cancelAnimation(opacity);
      cancelAnimation(scale);
      opacity.value = 0.4;
      scale.value = 0.95;
      return;
    }
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
    return () => {
      cancelAnimation(opacity);
      cancelAnimation(scale);
      opacity.value = 0.4;
      scale.value = 0.95;
    };
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
    if (!motionEnabled) {
      cancelAnimation(translateY);
      translateY.value = 0;
      return;
    }
    translateY.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-6, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    return () => {
      cancelAnimation(translateY);
      translateY.value = 0;
    };
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
  decorative = true,
}: MascotProps) {
  const reducedMotion = useReduceMotion();

  const motionEnabled = !reducedMotion;
  const label = POSE_LABELS[pose];

  const uniqueEffects = [...new Set(effects)];
  const hasEffects = uniqueEffects.length > 0;
  const poseScale = hasEffects ? 0.62 : 0.95;

  const backEffects = uniqueEffects.filter((e) => ['breath_ring', 'shield', 'sparkles'].includes(e));
  const midEffects = uniqueEffects.filter((e) => ['bubbles', 'crystals'].includes(e));
  const frontEffects = uniqueEffects.filter((e) => e === 'smoke');

  // Only accessible when decorative=false; effects do not make it accessible by themselves
  const isAccessible = !decorative;
  const finalLabel = accessibilityLabel ?? label;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessible={isAccessible}
      accessibilityLabel={isAccessible ? finalLabel : undefined}
      accessibilityRole={isAccessible ? 'image' : undefined}
      accessibilityElementsHidden={!isAccessible}
      importantForAccessibility={!isAccessible ? 'no-hide-descendants' : 'auto'}
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
        style={[styles.poseImage, { width: size * poseScale, height: size * poseScale }]}
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
