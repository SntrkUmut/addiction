/**
 * Yuva (Home) screen (rev 5.1 §5.1)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import {
  Scene,
  Card,
  SecondaryButton,
  Eyebrow,
  LightChip,
  DayChip,
} from '../ui/components';
import { Mascot } from '../ui/Mascot';
import { journeyDay, formatTurkishDateSince } from '../domain/journey';
import {
  checkedInOn,
  cigarettesAvoided,
  estimatedSavings,
  eventOnLocalDay,
  formatMoney,
  foxAccessories,
  lightsFrom,
  todayIso,
} from '../domain/progress';
import type { AppState } from '../data/schema';

interface Props {
  state: AppState;
  onCheckIn: () => void;
  onCraving: () => void;
  onQuestTap: (questId: string) => void;
  onSlip: () => void;
}

export function Yuva({ state, onCheckIn, onCraving, onQuestTap, onSlip }: Props) {
  const { colors, isDark } = useTheme();
  const quitDate = state.profile?.quitDate ?? todayIso();
  const days = journeyDay(quitDate);
  const today = todayIso();
  const checkedInToday = checkedInOn(state, today);
  const lightsEarned = lightsFrom(state);
  const avoided = cigarettesAvoided(state);
  const saved = estimatedSavings(state);
  const copingToday = state.events.some(event => event.kind === 'coping' && eventOnLocalDay(event, today));
  const breathToday = state.events.some(event =>
    event.kind === 'coping' && eventOnLocalDay(event, today) && event.details.tool === 'Yavaş nefes',
  );
  const accessories = foxAccessories(state);

  const quests = [
    { id: 'check-in', title: checkedInToday ? 'Bugünün ışığı parladı' : 'Bugünün ışığını kazan', done: checkedInToday, lights: 1 },
    { id: 'coping', title: 'Bir baş etme aracı kullan', done: copingToday, lights: 1 },
    { id: 'breath', title: 'Nefes egzersizi yap', done: breathToday, lights: 1 },
  ];

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <DayChip day={days} variant={isDark ? 'night' : 'day'} />
          <LightChip count={lightsEarned} variant={isDark ? 'night' : 'day'} />
        </View>

        <View style={styles.hero}>
          <Eyebrow style={styles.eyebrow}>
            SENİN YOLCULUĞUN
          </Eyebrow>
          <Text style={[styles.heroTitle, { color: colors.text.primary }]}>
            {formatTurkishDateSince(quitDate)}
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.text.secondary }]}>
            {days} gün · {lightsEarned} ışık
          </Text>
        </View>

        <View style={styles.mascotArea}>
          <Mascot
            pose={checkedInToday ? 'content' : 'hopeful'}
            accessories={accessories}
            size={160}
            darkScene={isDark}
          />
          <Text style={[styles.speechBubble, { color: colors.text.secondary }]}>
            {checkedInToday
              ? 'Bugün harika gidiyorsun!'
              : 'Check-in yapmaya hazır mısın?'}
          </Text>
        </View>

        <View style={styles.questsSection}>
          <Eyebrow style={styles.sectionEyebrow}>
            BUGÜN
          </Eyebrow>
          {quests.map(quest => (
            <TouchableOpacity
              key={quest.id}
              onPress={() => (quest.id === 'check-in' ? onCheckIn() : onQuestTap(quest.id))}
              activeOpacity={0.7}
            >
              <Card style={[
                styles.questCard,
                quest.done ? { backgroundColor: colors.surface.rewardSoft } : null,
              ]}
              >
                <View style={styles.questRow}>
                  <View style={styles.questLeft}>
                    <View style={[
                      styles.questDot,
                      {
                        backgroundColor: quest.done
                          ? colors.action.primary
                          : colors.border.default,
                      },
                    ]}
                    />
                    <Text style={[
                      styles.questTitle,
                      {
                        color: colors.text.primary,
                        opacity: quest.done ? 0.6 : 1,
                      },
                    ]}
                    >
                      {quest.title}
                    </Text>
                  </View>
                  <Text style={[styles.questLights, { color: colors.accent.goldText || colors.accent.gold }]}>
                    {quest.done ? '✓' : `+${quest.lights}`}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              İÇİLMEYEN
            </Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {state.profile && state.profile.cigarettesPerDay > 0 ? avoided : '—'}
            </Text>
            <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>
              {state.profile && state.profile.cigarettesPerDay > 0 ? 'adet · yaklaşık' : 'Günlük miktarı ekle'}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              TASARRUF
            </Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {saved === null ? '—' : formatMoney(saved, state.profile?.currency || 'TRY')}
            </Text>
            <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>
              {saved === null ? 'Paket fiyatı ekle' : 'kendi girdilerine göre'}
            </Text>
          </Card>
        </View>

        <SecondaryButton label="İstek geldi mi?" onPress={onCraving} />
        <TouchableOpacity onPress={onSlip} style={styles.slipLink} accessibilityRole="button">
          <Text style={[styles.slipText, { color: colors.text.secondary }]}>
            Bugün sigara içtiysen <Text style={{ color: colors.text.accent }}>kaydet, yargı yok</Text>
          </Text>
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
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  eyebrow: {
    marginBottom: 8,
  },
  heroTitle: {
    ...typography.display.lg,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.body.lg,
  },
  mascotArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  speechBubble: {
    ...typography.body.md,
    textAlign: 'center',
    marginTop: 8,
  },
  questsSection: {
    marginBottom: 24,
  },
  sectionEyebrow: {
    marginBottom: 12,
  },
  questCard: {
    padding: 16,
    marginBottom: 8,
  },
  questRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  questDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  questTitle: {
    ...typography.body.md,
    flex: 1,
  },
  questLights: {
    ...typography.label.md,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
  slipLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  slipText: {
    ...typography.body.sm,
    textAlign: 'center',
  },
});
