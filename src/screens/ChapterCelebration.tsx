/**
 * Chapter-complete celebration (spec §16 `rev4-bolum2-1-tamam`, generic for every chapter).
 * Night scene, one Success haptic on entry, static if reduce-motion is on or still unknown.
 */

import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, View, Text, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, PrimaryButton, TextButton, LightChip } from '../ui/components';
import { Mascot } from '../ui/Mascot';
import { ArrowRight } from '../ui/icons';
import { ContentIcon } from '../ui/contentIcons';
import { haptic } from '../ui/haptics';
import { isMascotMotionEnabled } from '../ui/mascotEffects';
import { CHAPTER_CHROME, celebrationCopy, type ChapterFlow } from '../domain/chapters';

interface Props {
  flow: ChapterFlow;
  lights: number;
  onContinue: () => void;
  onHome: () => void;
}

function PiecePop({
  icon,
  index,
  motion,
  fill,
  glyph,
}: {
  icon: string;
  index: number;
  motion: boolean;
  fill: string;
  glyph: string;
}) {
  const scale = useSharedValue(motion ? 0.6 : 1);

  useEffect(() => {
    if (!motion) {
      scale.value = 1;
      return undefined;
    }
    scale.value = withDelay(index * 80, withTiming(1, { duration: 180 }));
    return () => {
      cancelAnimation(scale);
    };
  }, [motion, index, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.pieceDot, { backgroundColor: fill }, animatedStyle]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ContentIcon name={icon} size={22} color={glyph} weight="fill" />
    </Animated.View>
  );
}

export function ChapterCelebration({ flow, lights, onContinue, onHome }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const motion = isMascotMotionEnabled(reduceMotion);
  const copy = celebrationCopy(flow.completed);

  useEffect(() => {
    haptic('success');
  }, []);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => setReduceMotion(enabled ?? false))
      .catch(() => setReduceMotion(false));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', enabled => {
      setReduceMotion(enabled);
    });
    return () => sub.remove();
  }, []);

  return (
    <Scene variant="night" height={700} horizonY={700}>
      <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 24) + 12, paddingBottom: Math.max(insets.bottom, 24) }]}>
        <LightChip count={lights} variant="night" />
        <Mascot pose="hopeful" size={180} darkScene effects={['sparkles']} />
        <View
          style={styles.pieceRow}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {flow.completed.pieces.map((piece, index) => (
            <PiecePop
              key={piece.id}
              icon={piece.icon}
              index={index}
              motion={motion}
              fill={colors.action.primary}
              glyph={colors.text.onAccent}
            />
          ))}
        </View>
        <Text style={[styles.eyebrow, { color: colors.accent.gold }]}>{copy.eyebrow}</Text>
        <Text style={[styles.title, { color: colors.text.onDark }]} accessibilityRole="header">{copy.title}</Text>
        <Text style={[styles.body, { color: colors.text.onDarkMuted }]}>{copy.body}</Text>
        <View style={styles.actions}>
          <PrimaryButton label={copy.cta} onPress={onContinue} icon={ArrowRight} />
          <TextButton label={CHAPTER_CHROME.homeCta} onPress={onHome} secondary />
        </View>
      </View>
    </Scene>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  pieceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  pieceDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    ...typography.label.sm,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  title: {
    ...typography.display.sm,
    textAlign: 'center',
  },
  body: {
    ...typography.body.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
});
