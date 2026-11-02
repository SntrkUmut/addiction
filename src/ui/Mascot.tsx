/**
 * Mascot component (rev 5.5)
 * Data-driven fox with accessory overlays
 * 
 * Usage:
 *   <Mascot
 *     pose="asleep" | "content" | "hopeful" | "joyful" | "neutral" | "smug" | "wistful"
 *     accessories={["it-atki", "it-sirt-cantasi"]}
 *     size={200}
 *     darkScene={false}
 *   />
 * 
 * Accessories are positioned per accessories.json bbox and only rendered on dark scenes
 * (unless explicitly overridden). umbrella (it-semsiye) uses overflow: 'visible'.
 * 
 * Rev 5.5 additions:
 * - Supports per_pose_files (e.g., it-ruzgarlik-calm.png for windbreaker on calm pose)
 * - Uses anchor positioning from accessories.json
 * - 10 total accessories (new: it-orgu-eldiven, it-ruzgarlik, it-yildiz-rozeti)
 */

import React from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import accessoryData from '../../assets/mascot/accessories.json';

type Pose = 'asleep' | 'content' | 'hopeful' | 'joyful' | 'neutral' | 'smug' | 'wistful';

interface MascotProps {
  pose: Pose;
  accessories?: string[];
  size?: number;
  darkScene?: boolean;
  style?: StyleProp<ViewStyle>;
}

const POSE_MAP: Record<Pose, any> = {
  asleep: require('../../assets/mascot/asleep.png'),
  content: require('../../assets/mascot/content.png'),
  hopeful: require('../../assets/mascot/hopeful.png'),
  joyful: require('../../assets/mascot/joyful.png'),
  neutral: require('../../assets/mascot/neutral.png'),
  smug: require('../../assets/mascot/smug.png'),
  wistful: require('../../assets/mascot/wistful.png'),
};

// Pose name mapping: component pose -> accessories.json pose key
const POSE_TO_ACCESSORY_POSE: Record<Pose, string> = {
  asleep: 'fox_sleepy',
  content: 'fox_calm',
  hopeful: 'fox_idle',
  joyful: 'fox_cheer',
  neutral: 'fox_idle',
  smug: 'fox_happy',
  wistful: 'fox_wave',
};

// Base accessory map (single-file accessories)
const BASE_ACCESSORY_MAP: Record<string, any> = {
  'it-atki': require('../../assets/mascot/it-atki.png'),
  'it-bere': require('../../assets/mascot/it-bere.png'),
  'it-hasir-sapka': require('../../assets/mascot/it-hasir-sapka.png'),
  'it-lastik-cizme': require('../../assets/mascot/it-lastik-cizme.png'),
  'it-semsiye': require('../../assets/mascot/it-semsiye.png'),
  'it-sirt-cantasi': require('../../assets/mascot/it-sirt-cantasi.png'),
  'it-yuvarlak-gozluk': require('../../assets/mascot/it-yuvarlak-gozluk.png'),
  'it-yildiz-rozeti': require('../../assets/mascot/it-yildiz-rozeti.png'),
};

// Per-pose accessory maps (for gloves and windbreaker)
const PER_POSE_ACCESSORY_MAPS: Record<string, Record<string, any>> = {
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

type AccessoryData = {
  name: string;
  id: string;
  bbox: number[];
  layer: string;
  per_pose_files?: boolean;
  [key: string]: any;
};

export function Mascot({ pose, accessories = [], size = 200, darkScene = false, style }: MascotProps) {
  const accessoryPoseName = POSE_TO_ACCESSORY_POSE[pose];

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* Base pose */}
      <Image
        source={POSE_MAP[pose]}
        style={styles.pose}
        resizeMode="contain"
      />

      {/* Accessories (only on dark scenes) */}
      {darkScene && accessories.map((slug) => {
        const data = accessoryData[slug as keyof typeof accessoryData] as AccessoryData;
        if (!data || !data.bbox) return null;

        // Determine the accessory image source
        let accessorySource;
        if (data.per_pose_files && PER_POSE_ACCESSORY_MAPS[slug]) {
          accessorySource = PER_POSE_ACCESSORY_MAPS[slug][accessoryPoseName];
          if (!accessorySource) return null; // No file for this pose
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
  },
  pose: {
    width: '100%',
    height: '100%',
  },
  accessory: {
    position: 'absolute',
  },
});
