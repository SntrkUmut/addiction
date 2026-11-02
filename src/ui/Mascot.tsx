/**
 * Mascot component (rev 5.1)
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
 */

import React from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
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

const ACCESSORY_MAP: Record<string, any> = {
  'it-atki': require('../../assets/mascot/it-atki.png'),
  'it-bere': require('../../assets/mascot/it-bere.png'),
  'it-hasir-sapka': require('../../assets/mascot/it-hasir-sapka.png'),
  'it-lastik-cizme': require('../../assets/mascot/it-lastik-cizme.png'),
  'it-semsiye': require('../../assets/mascot/it-semsiye.png'),
  'it-sirt-cantasi': require('../../assets/mascot/it-sirt-cantasi.png'),
  'it-yuvarlak-gozluk': require('../../assets/mascot/it-yuvarlak-gozluk.png'),
};

type AccessoryData = {
  name: string;
  id: string;
  bbox: number[];
  layer: string;
  [key: string]: any;
};

export function Mascot({ pose, accessories = [], size = 200, darkScene = false, style }: MascotProps) {
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
        if (!data || !data.bbox || !ACCESSORY_MAP[slug]) return null;

        const [left, top, right, bottom] = data.bbox;
        const width = (right - left) * 100;
        const height = (bottom - top) * 100;
        const isUmbrella = slug === 'it-semsiye';

        return (
          <Image
            key={slug}
            source={ACCESSORY_MAP[slug]}
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
