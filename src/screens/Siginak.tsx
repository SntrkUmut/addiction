/**
 * Sığınak — chapters, pieces, milestones, collection from the bundled manifest.
 * Path ends with a static fog teaser (§19.2) or the end-of-content card (§19.6).
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, Eyebrow, LightChip } from '../ui/components';
import { CloudFog, Hourglass } from '../ui/icons';
import { ContentIcon } from '../ui/contentIcons';
import { journeyDay } from '../domain/journey';
import { chapterProgress, lightsFrom, todayIso } from '../domain/progress';
import {
  CHAPTER_CHROME,
  endOfContentView,
  nextChapterFogTeaser,
  type EndOfContentView,
  type FogTeaser,
} from '../domain/chapters';
import { DAY_MILESTONES } from '../domain/milestones';
import { isMascotMotionEnabled } from '../ui/mascotEffects';
import type { AppState } from '../data/schema';
import type { Manifest } from '../domain/content';

interface Props {
  state: AppState;
  manifest: Manifest;
  onNodeTap: (pieceIndex: number, pieceName: string) => void;
  onMilestoneTap: (day: number) => void;
  onCollectionTap: () => void;
  focusChapterId?: string | null;
}

function FogTeaserCard({ teaser }: { teaser: FogTeaser }) {
  const { colors, isDark } = useTheme();
  const fogFill = isDark ? 'rgba(32, 43, 55, 0.72)' : 'rgba(255, 254, 252, 0.9)';

  return (
    <View style={styles.fogWrap}>
      <LinearGradient
        colors={['transparent', colors.bg.canvas]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View
        pointerEvents="none"
        style={[styles.fogBlob, styles.fogBlobA, { backgroundColor: fogFill }]}
      />
      <View
        pointerEvents="none"
        style={[styles.fogBlob, styles.fogBlobB, { backgroundColor: fogFill }]}
      />
      <View
        pointerEvents="none"
        style={[styles.fogBlob, styles.fogBlobC, { backgroundColor: fogFill }]}
      />
      <Card style={[styles.teaserCard, { backgroundColor: colors.surface.sunken }]}>
        <View style={styles.teaserHeader}>
          <View
            style={[styles.gate, { borderColor: colors.text.tertiary }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <ContentIcon name={teaser.gateIcon} size={24} color={colors.text.tertiary} weight="regular" />
          </View>
          <View style={styles.teaserCopy}>
            <View style={styles.teaserEyebrowRow}>
              <CloudFog size={16} color={colors.text.secondary} weight="regular" />
              <Text style={[styles.teaserEyebrow, { color: colors.text.secondary }]}>
                {teaser.eyebrow}
              </Text>
            </View>
            <Text style={[styles.teaserText, { color: colors.text.primary }]}>
              {teaser.line}
            </Text>
            <Text style={[styles.teaserCaption, { color: colors.text.tertiary }]}>
              {CHAPTER_CHROME.fogCaption(teaser.threshold, teaser.remaining)}
            </Text>
          </View>
        </View>
        {teaser.previewIcons.length > 0 ? (
          <View
            style={styles.previewRow}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {teaser.previewIcons.map((icon, iconIndex) => (
              <View key={`${icon}-${iconIndex}`} style={[styles.previewDot, { backgroundColor: colors.surface.card }]}>
                <ContentIcon name={icon} size={16} color={colors.text.tertiary} weight="regular" />
              </View>
            ))}
          </View>
        ) : null}
      </Card>
    </View>
  );
}

function EndOfContentCard({
  view,
  onCollectionTap,
}: {
  view: EndOfContentView;
  onCollectionTap: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Card style={styles.endCard}>
      <View style={styles.teaserEyebrowRow}>
        <CloudFog size={16} color={colors.text.accent} weight="regular" />
        <Text style={[styles.teaserEyebrow, { color: colors.text.accent }]}>{view.eyebrow}</Text>
      </View>
      <Text style={[styles.endTitle, { color: colors.text.primary }]}>{view.title}</Text>
      <Text style={[styles.endBody, { color: colors.text.secondary }]}>{view.body}</Text>

      <View style={[styles.countdown, { backgroundColor: colors.surface.sunken }]}>
        <View
          style={[styles.hourglass, { backgroundColor: colors.surface.rewardSoft }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Hourglass size={22} color={colors.accent.goldDeep} weight="fill" />
        </View>
        <View
          style={{ flex: 1 }}
          accessible
          accessibilityRole="text"
          accessibilityLabel={view.opensA11y}
        >
          <Text style={[styles.countdownLabel, { color: colors.text.secondary }]}>{view.opensLabel}</Text>
          <Text style={[styles.countdownValue, { color: colors.text.primary }]}>{view.opensValue}</Text>
        </View>
        {view.bankedLights > 0 ? (
          <View
            style={styles.banked}
            accessible
            accessibilityRole="text"
            accessibilityLabel={view.bankedA11y}
          >
            <Text style={[styles.countdownValue, { color: colors.text.primary, textAlign: 'right' }]}>
              {view.lightsReadyLabel}
            </Text>
            <Text style={[styles.countdownLabel, { color: colors.text.secondary, textAlign: 'right' }]}>
              {view.firstPieceHint}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.meanwhile, { color: colors.text.tertiary }]}>{view.meanwhile}</Text>
      <TouchableOpacity onPress={onCollectionTap} activeOpacity={0.7}>
        <Card style={[styles.meanwhileCard, { backgroundColor: colors.surface.sunken }]}>
          <Text style={[styles.collectionTitle, { color: colors.text.primary }]}>{view.collectionLabel}</Text>
          <Text style={[styles.collectionSubtitle, { color: colors.text.secondary }]}>
            Kristaller ve aksesuarlar
          </Text>
        </Card>
      </TouchableOpacity>
    </Card>
  );
}

export function Siginak({
  state,
  manifest,
  onNodeTap,
  onMilestoneTap,
  onCollectionTap,
  focusChapterId,
}: Props) {
  const { colors, isDark } = useTheme();
  const lightsEarned = lightsFrom(state);
  const days = journeyDay(state.profile?.quitDate ?? todayIso());
  const chapters = chapterProgress(manifest, lightsEarned);
  const earnedCount = state.collection?.earned.length ?? 0;
  const itemTotal = manifest.items?.length ?? earnedCount;
  const teaser = nextChapterFogTeaser(manifest, lightsEarned);
  const end = endOfContentView(manifest, lightsEarned);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const yMap = useRef<Record<string, number>>({});
  const sectionY = useRef(0);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  const chapterOffsets = chapters.map((_, index) => (
    chapters.slice(0, index).reduce((sum, chapter) => sum + chapter.total, 0)
  ));

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => setReduceMotion(enabled ?? false))
      .catch(() => setReduceMotion(false));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', enabled => {
      setReduceMotion(enabled);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!focusChapterId) return;
    const y = yMap.current[focusChapterId];
    if (y == null) return;
    const animated = isMascotMotionEnabled(reduceMotion);
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated });
    }, 50);
    return () => clearTimeout(timer);
  }, [focusChapterId, chapters, teaser, end, reduceMotion]);

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        ref={scrollRef}
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

        <View
          style={styles.chaptersSection}
          onLayout={event => {
            sectionY.current = event.nativeEvent.layout.y;
          }}
        >
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
          {chapters.filter(chapter => chapter.entered).map((chapter, index) => {
            const offset = chapterOffsets[chapters.findIndex(item => item.id === chapter.id)];
            return (
              <View
                key={chapter.id}
                style={styles.chapterBlock}
                onLayout={event => {
                  yMap.current[chapter.id] = sectionY.current + event.nativeEvent.layout.y;
                }}
              >
                <Card style={styles.chapterCard}>
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
                {chapter.pieces.map((piece, pieceIndex) => (
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

          {end ? (
            <View
              onLayout={event => {
                yMap.current.__end__ = sectionY.current + event.nativeEvent.layout.y;
              }}
            >
              <EndOfContentCard view={end} onCollectionTap={onCollectionTap} />
            </View>
          ) : teaser ? (
            <FogTeaserCard teaser={teaser} />
          ) : null}
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
  fogWrap: {
    marginTop: 8,
    paddingTop: 24,
    minHeight: 170,
    position: 'relative',
  },
  fogBlob: {
    position: 'absolute',
    borderRadius: 999,
  },
  fogBlobA: {
    width: 220,
    height: 90,
    left: -20,
    top: 10,
    opacity: 0.85,
  },
  fogBlobB: {
    width: 180,
    height: 80,
    right: -10,
    top: 36,
    opacity: 0.75,
  },
  fogBlobC: {
    width: 140,
    height: 70,
    left: 80,
    top: 70,
    opacity: 0.7,
  },
  teaserCard: {
    padding: 16,
    gap: 12,
  },
  teaserHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  gate: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teaserCopy: {
    flex: 1,
    gap: 4,
  },
  teaserEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teaserEyebrow: {
    ...typography.label.sm,
  },
  teaserText: {
    ...typography.body.md,
    fontWeight: '700',
  },
  teaserCaption: {
    ...typography.caption.regular,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 8,
  },
  previewDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCard: {
    padding: 20,
    marginTop: 8,
    gap: 10,
  },
  endTitle: {
    ...typography.display.sm,
  },
  endBody: {
    ...typography.body.md,
    lineHeight: 22,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
  },
  hourglass: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownLabel: {
    ...typography.caption.regular,
  },
  countdownValue: {
    ...typography.body.md,
    fontWeight: '700',
  },
  banked: {
    maxWidth: 120,
  },
  meanwhile: {
    ...typography.label.sm,
    letterSpacing: 1.2,
    marginTop: 8,
  },
  meanwhileCard: {
    padding: 16,
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
