/**
 * Sığınak — chapters, pieces, milestones, collection from the bundled manifest.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, Eyebrow, LightChip } from '../ui/components';
import { journeyDay } from '../domain/journey';
import { chapterProgress, lightsFrom, todayIso } from '../domain/progress';
import { DAY_MILESTONES } from '../domain/milestones';
import type { AppState } from '../data/schema';
import type { Manifest } from '../domain/content';

interface Props {
  state: AppState;
  manifest: Manifest;
  onNodeTap: (pieceIndex: number, pieceName: string) => void;
  onMilestoneTap: (day: number) => void;
  onCollectionTap: () => void;
}

export function Siginak({ state, manifest, onNodeTap, onMilestoneTap, onCollectionTap }: Props) {
  const { colors, isDark } = useTheme();
  const lightsEarned = lightsFrom(state);
  const days = journeyDay(state.profile?.quitDate ?? todayIso());
  const chapters = chapterProgress(manifest, lightsEarned);
  const upcoming = manifest.upcoming;
  const earnedCount = state.collection?.earned.length ?? 0;
  const itemTotal = manifest.items?.length ?? earnedCount;

  const chapterOffsets = chapters.map((_, index) => (
    chapters.slice(0, index).reduce((sum, chapter) => sum + chapter.total, 0)
  ));

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Eyebrow style={styles.eyebrow}>SIĞINAK</Eyebrow>
          <LightChip count={lightsEarned} variant={isDark ? 'night' : 'day'} />
        </View>

        <Text style={[styles.caption, { color: colors.text.secondary }]}>
          Her 2 ışık yolda yeni bir durak açar. Kayma yolu geri sarmaz; açtığın duraklar hep yerinde kalır.
        </Text>

        <View style={styles.chaptersSection}>
          {chapters.length === 0 ? (
            <Card style={styles.chapterCard}>
              <Text style={[styles.chapterTitle, { color: colors.text.primary }]}>
                Sığınak henüz yüklenemedi.
              </Text>
              <Text style={[styles.chapterProgress, { color: colors.text.secondary }]}>
                Çevrimdışı kopya birazdan açılır. Açtığın duraklar yerinde kalır.
              </Text>
            </Card>
          ) : null}
          {chapters.map((chapter, index) => {
            const offset = chapterOffsets[index];
            return (
              <View key={chapter.id} style={styles.chapterBlock}>
                <Card style={[styles.chapterCard, chapter.locked ? { opacity: 0.5 } : null]}>
                  <Text style={[styles.chapterNumber, { color: colors.accent.goldText }]}>{index + 1}</Text>
                  <View style={styles.chapterInfo}>
                    <Text style={[styles.chapterEyebrow, { color: colors.text.accent }]}>{chapter.eyebrow}</Text>
                    <Text style={[styles.chapterTitle, { color: colors.text.primary }]}>{chapter.title}</Text>
                    <Text style={[styles.chapterProgress, { color: colors.text.secondary }]}>
                      {chapter.unlockedCount} / {chapter.total} parça
                    </Text>
                  </View>
                  {chapter.complete && (
                    <Text style={[styles.checkmark, { color: colors.action.primary }]}>✓</Text>
                  )}
                </Card>
                {!chapter.locked && chapter.pieces.map((piece, pieceIndex) => (
                  <TouchableOpacity
                    key={piece.id}
                    onPress={() => onNodeTap(offset + pieceIndex, piece.name)}
                    activeOpacity={0.7}
                  >
                    <Card style={[
                      styles.pieceCard,
                      piece.unlocked ? null : { backgroundColor: colors.surface.sunken },
                    ]}
                    >
                      <Text style={[styles.pieceName, { color: colors.text.primary }]}>{piece.name}</Text>
                      <Text style={[styles.pieceStatus, { color: piece.unlocked ? colors.action.primary : colors.text.tertiary }]}>
                        {piece.unlocked ? 'Açıldı' : `${(offset + pieceIndex + 1) * (manifest.lightsPerPiece ?? 2)} ışık`}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}

          {upcoming && (
            <Card style={[styles.teaserCard, { backgroundColor: colors.surface.sunken }]}>
              <Text style={[styles.teaserEyebrow, { color: colors.text.accent }]}>
                {upcoming.eyebrow || 'SONRA'}
              </Text>
              <Text style={[styles.teaserText, { color: colors.text.secondary }]}>
                {upcoming.teaserLine || upcoming.title}
              </Text>
            </Card>
          )}
        </View>

        <View style={styles.milestonesSection}>
          <Eyebrow style={styles.sectionEyebrow}>KİLOMETRE TAŞLARI</Eyebrow>
          <View style={styles.milestonesGrid}>
            {DAY_MILESTONES.map(ms => {
              const reached = days >= ms.day;
              return (
                <TouchableOpacity
                  key={ms.day}
                  onPress={() => reached && onMilestoneTap(ms.day)}
                  activeOpacity={0.7}
                  disabled={!reached}
                >
                  <Card style={[
                    styles.milestoneCard,
                    { backgroundColor: reached ? colors.surface.rewardSoft : colors.surface.sunken },
                    !reached && { opacity: 0.5 },
                  ]}
                  >
                    <Text style={[styles.milestoneDay, { color: colors.text.primary }]}>
                      Gün {ms.day}
                    </Text>
                    {reached && (
                      <Text style={[styles.milestoneCheck, { color: colors.action.primary }]}>✓</Text>
                    )}
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity onPress={onCollectionTap} activeOpacity={0.7}>
          <Card style={styles.collectionCard}>
            <Text style={[styles.collectionLabel, { color: colors.text.accent }]}>KOLEKSİYON</Text>
            <Text style={[styles.collectionTitle, { color: colors.text.primary }]}>
              Kristaller ve aksesuarlar
            </Text>
            <Text style={[styles.collectionSubtitle, { color: colors.text.secondary }]}>
              {earnedCount} / {itemTotal} öğe kazanıldı
            </Text>
          </Card>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </Scene>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyebrow: {
    marginBottom: 0,
  },
  caption: {
    ...typography.body.sm,
    marginBottom: 24,
    lineHeight: 20,
  },
  chaptersSection: {
    marginBottom: 32,
  },
  chapterBlock: {
    marginBottom: 12,
  },
  chapterCard: {
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  chapterNumber: {
    ...typography.display.sm,
    fontWeight: '800',
    minWidth: 32,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterEyebrow: {
    ...typography.label.sm,
    marginBottom: 4,
  },
  chapterTitle: {
    ...typography.body.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  chapterProgress: {
    ...typography.body.sm,
  },
  checkmark: {
    fontSize: 20,
  },
  pieceCard: {
    padding: 14,
    marginBottom: 6,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pieceName: {
    ...typography.body.md,
    flex: 1,
  },
  pieceStatus: {
    ...typography.label.sm,
  },
  teaserCard: {
    padding: 16,
    marginTop: 8,
  },
  teaserEyebrow: {
    ...typography.label.sm,
    marginBottom: 8,
  },
  teaserText: {
    ...typography.body.md,
    fontStyle: 'italic',
  },
  milestonesSection: {
    marginBottom: 32,
  },
  sectionEyebrow: {
    marginBottom: 12,
  },
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  milestoneCard: {
    padding: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  milestoneDay: {
    ...typography.body.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  milestoneCheck: {
    fontSize: 16,
  },
  collectionCard: {
    padding: 20,
  },
  collectionLabel: {
    ...typography.label.sm,
    marginBottom: 8,
  },
  collectionTitle: {
    ...typography.body.lg,
    fontWeight: '600',
    marginBottom: 4,
  },
  collectionSubtitle: {
    ...typography.body.md,
  },
});
