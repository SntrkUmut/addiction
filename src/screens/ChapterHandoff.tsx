/**
 * Chapter handoff (spec §16 `rev4-bolum2-2-bahce`, generic for every chapter).
 * Next chapter intro from the bundled manifest; last chapter uses upcoming copy.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, PrimaryButton, LightChip, Card } from '../ui/components';
import { Mascot } from '../ui/Mascot';
import { ArrowRight } from '../ui/icons';
import { ContentIcon } from '../ui/contentIcons';
import { CHAPTER_CHROME, handoffCopy, lightsPerPieceOf, type ChapterFlow } from '../domain/chapters';
import type { Manifest } from '../domain/content';

interface Props {
  flow: ChapterFlow;
  manifest: Manifest;
  lights: number;
  onContinue: () => void;
}

export function ChapterHandoff({ flow, manifest, lights, onContinue }: Props) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const copy = handoffCopy(flow, manifest.upcoming);
  const next = flow.next;
  const lpp = lightsPerPieceOf(manifest);
  const priorPieces = manifest.chapters
    .filter(chapter => chapter.order <= flow.order)
    .reduce((sum, chapter) => sum + chapter.pieces.length, 0);
  const firstPieceAt = (priorPieces + 1) * lpp;
  const remainingToFirst = Math.max(0, firstPieceAt - lights);

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={330} horizonY={240}>
      <View style={[styles.top, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
        <LightChip count={lights} variant={isDark ? 'night' : 'day'} />
        <Mascot pose="hopeful" size={160} />
      </View>
      <ScrollView
        style={[styles.sheet, { backgroundColor: colors.bg.canvas }]}
        contentContainerStyle={[styles.sheetContent, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {copy.eyebrow ? (
          <Text style={[styles.eyebrow, { color: colors.text.accent }]}>{copy.eyebrow}</Text>
        ) : null}
        <Text style={[styles.title, { color: colors.text.primary }]} accessibilityRole="header">{copy.title}</Text>
        <Text style={[styles.body, { color: colors.text.secondary }]}>{copy.body}</Text>

        {next ? (
          <View style={styles.grid}>
            {next.pieces.map((piece, index) => {
              const featured = index === 0;
              return (
                <Card
                  key={piece.id}
                  style={[
                    styles.tile,
                    featured ? { borderColor: colors.accent.gold, borderWidth: 1.5 } : null,
                  ]}
                >
                  <View
                    style={[
                      styles.tileIcon,
                      {
                        backgroundColor: featured ? colors.surface.rewardSoft : colors.surface.sunken,
                      },
                    ]}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                  >
                    <ContentIcon
                      name={piece.icon}
                      size={24}
                      color={featured ? colors.accent.goldDeep : colors.text.tertiary}
                      weight={featured ? 'fill' : 'regular'}
                    />
                  </View>
                  <Text style={[styles.tileName, { color: colors.text.primary }]} numberOfLines={2}>
                    {piece.name}
                  </Text>
                  {featured ? (
                    <Text style={[styles.tileCaption, { color: colors.accent.goldText }]}>
                      {CHAPTER_CHROME.remainingLights(remainingToFirst)}
                    </Text>
                  ) : null}
                </Card>
              );
            })}
          </View>
        ) : null}

        <View style={styles.actions}>
          <PrimaryButton label={copy.cta || CHAPTER_CHROME.continueCta} onPress={onContinue} icon={ArrowRight} />
        </View>
      </ScrollView>
    </Scene>
  );
}

const styles = StyleSheet.create({
  top: {
    height: 280,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 10,
  },
  eyebrow: {
    ...typography.label.sm,
    letterSpacing: 1.2,
  },
  title: {
    ...typography.display.sm,
  },
  body: {
    ...typography.body.md,
    lineHeight: 22,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  tile: {
    width: '31%',
    flexGrow: 1,
    minWidth: 100,
    maxWidth: '32%',
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  tileIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileName: {
    ...typography.caption.bold,
    textAlign: 'center',
  },
  tileCaption: {
    ...typography.caption.regular,
    textAlign: 'center',
  },
  actions: {
    marginTop: 16,
  },
});
