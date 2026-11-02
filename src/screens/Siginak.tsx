/**
 * Sığınak (Chapters/Path) screen (rev 5.1 §5.2)
 * Shows chapter path with nodes, milestones, and collection
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, Eyebrow, LightChip } from '../ui/components';

interface Props {
  state: any;
  onNodeTap: (pieceIndex: number) => void;
  onMilestoneTap: (day: number) => void;
  onCollectionTap: () => void;
}

export function Siginak({ state, onNodeTap, onMilestoneTap, onCollectionTap }: Props) {
  const { colors, isDark } = useTheme();
  const lightsEarned = state.lights || 0;

  // Mock chapters data
  const chapters = [
    { id: 'ch-temel', title: 'Sığınağın ilk odası', pieces: 6, unlocked: 6, theme: 'day' },
    { id: 'ch-bahce', title: 'Sığınağın bahçesi', pieces: 6, unlocked: 3, theme: 'day' },
    { id: 'ch-dere', title: 'Dere kenarı', pieces: 6, unlocked: 0, theme: 'day' },
  ];

  const milestones = [
    { day: 1, unlocked: true },
    { day: 7, unlocked: true },
    { day: 14, unlocked: false },
    { day: 30, unlocked: false },
  ];

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Eyebrow style={[styles.eyebrow, { color: colors.text.accent }] as any}>
            SIĞINAK
          </Eyebrow>
          <LightChip count={lightsEarned} variant={isDark ? 'night' : 'day'} />
        </View>

        {/* Path visualization */}
        <View style={[
          styles.pathContainer,
          { backgroundColor: colors.surface.card, borderColor: colors.border.default }
        ] as any}>
          <Text style={[styles.pathPlaceholder, { color: colors.text.tertiary }]}>
            📍 Path visualization
          </Text>
          <Text style={[styles.pathSubtitle, { color: colors.text.secondary }]}>
            Milestone stops, chapter nodes with 3D edges
          </Text>
        </View>

        {/* Chapters list */}
        <View style={styles.chaptersSection}>
          {chapters.map((chapter, index) => {
            const locked = chapter.unlocked === 0;
            return (
              <TouchableOpacity
                key={chapter.id}
                onPress={() => !locked && onNodeTap(index)}
                activeOpacity={0.7}
                disabled={locked}
              >
                <Card style={[
                  styles.chapterCard,
                  locked ? { opacity: 0.5 } : null
                ] as any}>
                  <View style={styles.chapterRow}>
                    <View style={styles.chapterLeft}>
                      <Text style={[
                        styles.chapterNumber,
                        { color: colors.accent.goldText }
                      ]}>
                        {index + 1}
                      </Text>
                      <View style={styles.chapterInfo}>
                        <Text style={[styles.chapterTitle, { color: colors.text.primary }]}>
                          {chapter.title}
                        </Text>
                        <Text style={[styles.chapterProgress, { color: colors.text.secondary }]}>
                          {chapter.unlocked} / {chapter.pieces} parça
                        </Text>
                      </View>
                    </View>
                    {chapter.unlocked === chapter.pieces && (
                      <Text style={[styles.checkmark, { color: colors.action.primary }]}>✓</Text>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}

          {/* Upcoming chapter teaser */}
          <Card style={[styles.teaserCard, { backgroundColor: colors.surface.sunken }] as any}>
            <Text style={[styles.teaserEyebrow, { color: colors.text.accent }] as any}>
              SONRA
            </Text>
            <Text style={[styles.teaserText, { color: colors.text.secondary }]}>
              Uzaktan bir su sesi geliyor...
            </Text>
          </Card>
        </View>

        {/* Milestones section */}
        <View style={styles.milestonesSection}>
          <Eyebrow style={[styles.sectionEyebrow, { color: colors.text.accent }] as any}>
            KİLOMETRE TAŞLARI
          </Eyebrow>
          <View style={styles.milestonesGrid}>
            {milestones.map(ms => (
            <TouchableOpacity
              key={ms.day}
              onPress={() => ms.unlocked && onMilestoneTap(ms.day)}
              activeOpacity={0.7}
              disabled={!ms.unlocked}
            >
              <Card style={[
                styles.milestoneCard,
                { backgroundColor: ms.unlocked ? colors.surface.rewardSoft : colors.surface.sunken },
                !ms.unlocked && { opacity: 0.5 }
              ] as any}>
                  <Text style={[styles.milestoneDay, { color: colors.text.primary }]}>
                    Gün {ms.day}
                  </Text>
                  {ms.unlocked && (
                    <Text style={[styles.milestoneCheck, { color: colors.action.primary }]}>
                      ✓
                    </Text>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Collection button */}
        <TouchableOpacity onPress={onCollectionTap} activeOpacity={0.7}>
          <Card style={styles.collectionCard}>
            <Text style={[styles.collectionLabel, { color: colors.text.accent }]}>
              KOLEKSİYON
            </Text>
            <Text style={[styles.collectionTitle, { color: colors.text.primary }]}>
              Kristaller ve aksesuarlar
            </Text>
            <Text style={[styles.collectionSubtitle, { color: colors.text.secondary }]}>
              4 / 15 öğe kazanıldı
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
    marginBottom: 24,
  },
  eyebrow: {
    marginBottom: 0,
  },
  pathContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
    minHeight: 200,
    justifyContent: 'center',
  },
  pathPlaceholder: {
    fontSize: 32,
    marginBottom: 12,
  },
  pathSubtitle: {
    ...typography.body.sm,
    textAlign: 'center',
  },
  chaptersSection: {
    marginBottom: 32,
  },
  chapterCard: {
    padding: 16,
    marginBottom: 8,
  },
  chapterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  teaserCard: {
    padding: 16,
    marginTop: 16,
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
