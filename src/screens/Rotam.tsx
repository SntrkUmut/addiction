/**
 * Rotam — journey timeline, milestones, stats, history.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, Eyebrow } from '../ui/components';
import { journeyDay, formatTurkishDateSince, formatEventTime } from '../domain/journey';
import {
  cigarettesAvoided,
  estimatedSavings,
  eventTitle,
  formatMoney,
  lightsFrom,
  todayIso,
} from '../domain/progress';
import { DAY_MILESTONES } from '../domain/milestones';
import type { AppState } from '../data/schema';

interface Props {
  state: AppState;
  onMilestoneTap: (day: number) => void;
  onCalcTap: () => void;
  onSlip: () => void;
}

export function Rotam({ state, onMilestoneTap, onCalcTap, onSlip }: Props) {
  const { colors, isDark } = useTheme();
  const quitDate = state.profile?.quitDate ?? todayIso();
  const days = journeyDay(quitDate);
  const lightsEarned = lightsFrom(state);
  const avoided = cigarettesAvoided(state);
  const saved = estimatedSavings(state);
  const recent = state.events.slice(0, 12);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = todayIso(date);
    const hasLight = state.events.some(event =>
      (event.kind === 'checkin' || event.kind === 'coping') && event.at.startsWith(dateStr),
    );
    return { date, hasLight };
  });

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow style={styles.eyebrow}>SENİN YOLCULUĞUN</Eyebrow>

        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.text.primary }]}>
            {formatTurkishDateSince(quitDate)}
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.text.secondary }]}>
            {days} gün · {lightsEarned} ışık kazanıldı
          </Text>
        </View>

        <View style={styles.milestonesSection}>
          <Eyebrow style={styles.sectionEyebrow}>KİLOMETRE TAŞLARI</Eyebrow>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.track}>
            {DAY_MILESTONES.map(ms => {
              const reached = days >= ms.day;
              return (
                <TouchableOpacity
                  key={ms.day}
                  onPress={() => reached && onMilestoneTap(ms.day)}
                  disabled={!reached}
                >
                  <Card style={[
                    styles.trackCard,
                    { backgroundColor: reached ? colors.surface.rewardSoft : colors.surface.sunken },
                  ]}
                  >
                    <Text style={[styles.trackDay, { color: colors.text.primary }]}>Gün {ms.day}</Text>
                    <Text style={[styles.trackState, { color: reached ? colors.action.primary : colors.text.tertiary }]}>
                      {reached ? 'Ulaşıldı' : `${ms.day - days} gün sonra`}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.last7DaysSection}>
          <Eyebrow style={styles.sectionEyebrow}>SON 7 GÜN</Eyebrow>
          <View style={styles.daysStrip}>
            {last7Days.map((day, i) => (
              <View
                key={i}
                style={[
                  styles.dayDot,
                  {
                    backgroundColor: day.hasLight ? colors.accent.gold : 'transparent',
                    borderColor: colors.border.default,
                    borderWidth: day.hasLight ? 0 : 1.5,
                    borderStyle: day.hasLight ? 'solid' : 'dashed',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>İÇİLMEYEN TAHMİNİ</Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {state.profile && state.profile.cigarettesPerDay > 0 ? avoided : '—'}
            </Text>
            <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>
              {state.profile && state.profile.cigarettesPerDay > 0 ? 'adet · yaklaşık' : 'Günlük miktarı ekle'}
            </Text>
          </Card>
          <TouchableOpacity style={{ flex: 1 }} onPress={onCalcTap} activeOpacity={0.7}>
            <Card style={styles.statCard}>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>TAHMİNİ TASARRUF</Text>
              <Text style={[styles.statValue, { color: colors.text.primary }]}>
                {saved === null ? '—' : formatMoney(saved, state.profile?.currency || 'TRY')}
              </Text>
              <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>
                {saved === null ? 'Paket fiyatı ekle' : 'girdiğin paket fiyatıyla'}
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.historySection}>
          <Eyebrow style={styles.sectionEyebrow}>SON KAYITLARIN</Eyebrow>
          {recent.length === 0 ? (
            <Card style={styles.historyCard}>
              <Text style={[styles.historyTitle, { color: colors.text.primary }]}>Burada yolculuğun görünecek</Text>
              <Text style={[styles.historyTime, { color: colors.text.tertiary }]}>
                Check-in veya baş etme aracı kullandığında kayıtların burada toplanır.
              </Text>
            </Card>
          ) : recent.map(event => (
            <Card key={event.id} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={[styles.historyTitle, { color: colors.text.primary }]}>
                    {eventTitle(event)}
                  </Text>
                  <Text style={[styles.historyTime, { color: colors.text.tertiary }]}>
                    {formatEventTime(event.at)}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <TouchableOpacity onPress={onSlip} style={styles.slipLink}>
          <Text style={[styles.slipText, { color: colors.text.accent }]}>Kayma kaydet</Text>
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
  track: {
    gap: 8,
    paddingRight: 16,
  },
  trackCard: {
    padding: 16,
    minWidth: 96,
  },
  trackDay: {
    ...typography.body.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  trackState: {
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
  slipLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slipText: {
    ...typography.label.md,
  },
});
