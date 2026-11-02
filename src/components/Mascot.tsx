import { Image, StyleSheet, View } from 'react-native';

// Currently used poses. To re-enable unused poses, add them back to this union
// and to the POSE_ASSETS map below, then import the corresponding PNG assets.
// Unused poses available in assets/mascot/fox/: happy, sad_coal, sleepy, hero
export type MascotPose =
  | 'idle'      // Yuva (home), Sığınak (shelter), timer fallback
  | 'wave'      // Onboarding karşılama
  | 'craving'   // İstek akışı tool seçimi
  | 'calm'      // Timer nefes egzersizi
  | 'cheer';    // Tamamlama ekranı

// Currently no effects are used (removed for light backgrounds in item 7).
// To re-enable effects, add them back to this union and to the EFFECT_ASSETS map below.
// Available effects in assets/mascot/fx/: smoke, shield, breath_ring, bubbles, sparkles, crystals
export type MascotEffect = never;

type MascotProps = {
  pose: MascotPose;
  size?: number;
  effects?: MascotEffect[];
  accessibilityLabel?: string;
};

// Only currently used poses are imported. Unused poses (happy, sad_coal, sleepy, hero)
// remain in assets/mascot/fox/ but are not bundled until re-enabled above.
const POSE_ASSETS = {
  idle: require('../../assets/mascot/fox/fox_idle.png'),
  wave: require('../../assets/mascot/fox/fox_wave.png'),
  craving: require('../../assets/mascot/fox/fox_craving.png'),
  calm: require('../../assets/mascot/fox/fox_calm.png'),
  cheer: require('../../assets/mascot/fox/fox_cheer.png'),
} as const;

// No effects currently used (removed for light backgrounds). Effect assets remain
// in assets/mascot/fx/ but are not bundled. To re-enable: add to MascotEffect type above,
// restore EFFECT_ASSETS map with require() statements, and restore effect components from git history.

const POSE_LABELS: Record<MascotPose, string> = {
  idle: 'Dinlenen tilki maskot',
  wave: 'El sallayan tilki maskot',
  craving: 'Kararlı duran tilki maskot',
  calm: 'Bağdaş kurmuş meditasyon yapan tilki maskot',
  cheer: 'Başparmak yukarı cesaretlendiren tilki maskot',
};

// Effect components removed since MascotEffect = never (no effects currently used).
// To re-enable effects: restore effect types above, uncomment EFFECT_ASSETS requires,
// and restore these component implementations from git history.

export function Mascot({
  pose,
  size = 92,
  effects = [],
  accessibilityLabel,
}: MascotProps) {
  const label = POSE_LABELS[pose];

  // Effects are currently disabled (MascotEffect = never), so poseScale is always 0.95
  const poseScale = 0.95;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityElementsHidden={!accessibilityLabel}
      importantForAccessibility={!accessibilityLabel ? 'no-hide-descendants' : 'auto'}
    >
      <Image
        source={POSE_ASSETS[pose]}
        style={[styles.poseImage, { width: size * poseScale, height: size * poseScale }]}
        resizeMode="contain"
        accessible={false}
      />
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
