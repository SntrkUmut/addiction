/**
 * Rotam (Journey/Progress) screen (rev 5.1 §17)
 * Shows journey timeline, milestones track, stats, and history
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, Eyebrow } from '../ui/components';
import { journeyDay, formatTurkishDateSince, formatEventTime } from '../domain/journey';

interface Props {
  state: any;
  onMilestoneTap: (day: number) => void;
  onCalcTap: () => void;
}

export function Rotam({ state, onMilestoneTap, onCalcTap }: Props) {
  const { colors, isDark } = useTheme();
  const days = journeyDay(state.profile.quitDate);
  const lightsEarned = state.lights || 0;

  // Mock last 7 days strip
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const hasLight = state.events.some((e: any) => e.kind === 'checkin' && e.at.startsWith(dateStr));
    return { date, hasLight };
  });

  // Mock recent events
  const recentEvents = [
    { type: 'checkin', title: 'Check-in', time: new Date(), lights: 1 },
    { type: 'breath', title: 'Nefes egzersizi', time: new Date(0 - 3600000), lights: 1 },
    { type: 'milestone', title: 'Gün 7 km taşı', time: new Date(0 - 86400000), lights: 0 },
  ];

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Eyebrow style={styles.eyebrow}>
          SENİN YOLCULUĞUN
        </Eyebrow>

        {/* Journey hero */}
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.text.primary }]}>
            {formatTurkishDateSince(state.profile.quitDate)}
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.text.secondary }]}>
            {days} gün · {lightsEarned} ışık kazanıldı
          </Text>
        </View>

        {/* Milestones track */}
        <View style={styles.milestonesSection}>
          <Eyebrow style={styles.sectionEyebrow}>
            KİLOMETRE TAŞLARI
          </Eyebrow>
          <View style={[
            styles.milestonesTrack,
            { backgroundColor: colors.surface.card, borderColor: colors.border.default }
          ]}>
            <Text style={[styles.trackPlaceholder, { color: colors.text.tertiary }]}>
              🎯 Horizontal milestone stops
            </Text>
            <Text style={[styles.trackSubtitle, { color: colors.text.secondary }]}>
              Gün 1, 7, 14, 30, 60, 90...
            </Text>
          </View>
        </View>

        {/* Last 7 days strip */}
        <View style={styles.last7DaysSection}>
          <Eyebrow style={styles.sectionEyebrow}>
            SON 7 GÜN
          </Eyebrow>
          <View style={styles.daysStrip}>
            {last7Days.map((day, i) => (
              <View
                key={i}
                style={[
                  styles.dayDot,
                  {
                    backgroundColor: day.hasLight
                      ? colors.accent.gold
                      : 'transparent',
                    borderColor: colors.border.default,
                    borderWidth: day.hasLight ? 0 : 1.5,
                    borderStyle: day.hasLight ? 'solid' : 'dashed',
                  }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              İÇİLMEYEN TAHMİNİ
            </Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {state.profile.cigarettesPerDay > 0
                ? Math.round(days * state.profile.cigarettesPerDay)
                : '—'}
            </Text>
            <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>
              {state.profile.cigarettesPerDay > 0 ? 'adet · yaklaşık' : 'Günlük miktarı ekle'}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              TAHMİNİ TASARRUF
            </Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              —
            </Text>
            <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>
              Paket fiyatı ekle
            </Text>
          </Card>
        </View>

        {/* Recent history */}
        <View style={styles.historySection}>
          <Eyebrow style={styles.sectionEyebrow}>
            SON KAYITLARIN
          </Eyebrow>
          {recentEvents.map((event, i) => (
            <Card key={i} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={[styles.historyTitle, { color: colors.text.primary }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.historyTime, { color: colors.text.tertiary }]}>
                    {formatEventTime(event.time.toISOString())}
                  </Text>
                </View>
                {event.lights > 0 && (
                  <Text style={[styles.historyLights, { color: colors.accent.goldText }]}>
                    +{event.lights}
                  </Text>
                )}
              </View>
            </Card>
          ))}
        </View>

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
  eyebrow: {
    marginBottom: 16,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    ...typography.display.lg,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.body.lg,
  },
  milestonesSection: {
    marginBottom: 32,
  },
  sectionEyebrow: {
    marginBottom: 12,
  },
  milestonesTrack: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  trackPlaceholder: {
    fontSize: 28,
    marginBottom: 8,
  },
  trackSubtitle: {
    ...typography.body.sm,
  },
  last7DaysSection: {
    marginBottom: 32,
  },
  daysStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.label.sm,
    marginBottom: 8,
  },
  statValue: {
    ...typography.display.md,
    marginBottom: 4,
  },
  statUnit: {
    ...typography.body.sm,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 24,
  },
  historyCard: {
    padding: 16,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flex: 1,
  },
  historyTitle: {
    ...typography.body.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyTime: {
    ...typography.body.sm,
  },
  historyLights: {
    ...typography.label.md,
    fontWeight: '700',
  },
});
