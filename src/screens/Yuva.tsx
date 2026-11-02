/**
 * Yuva (Home) screen (rev 5.1 §5.1)
 * Main home screen with day chips, mascot, quest rows, craving button
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import {
  Scene,
  Card,
  PrimaryButton,
  SecondaryButton,
  Eyebrow,
  LightChip,
  DayChip,
  ProgressRing,
} from '../ui/components';
import { journeyDay, formatTurkishDateSince } from '../domain/journey';

interface Props {
  state: any; // AppState from schema
  onCheckIn: () => void;
  onCraving: () => void;
  onQuestTap: (questId: string) => void;
}

export function Yuva({ state, onCheckIn, onCraving, onQuestTap }: Props) {
  const { colors, isDark } = useTheme();
  const days = journeyDay(state.profile.quitDate);
  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = state.events.some((e: any) => e.kind === 'checkin' && e.at.startsWith(today));
  const lightsEarned = state.lights || 0;

  // Mock quests for now
  const quests = [
    { id: 'check-in', title: 'Bugünkü check-in', done: checkedInToday, lights: 1 },
    { id: 'coping', title: 'Bir baş etme aracı kullan', done: false, lights: 1 },
    { id: 'breath', title: 'Nefes egzersizi yap', done: false, lights: 1 },
  ];

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with day chips */}
        <View style={styles.header}>
          <DayChip day={days} variant={isDark ? 'night' : 'day'} />
          <LightChip count={lightsEarned} variant={isDark ? 'night' : 'day'} />
        </View>

        {/* Journey days */}
        <View style={styles.hero}>
          <Eyebrow style={[styles.eyebrow, { color: colors.text.accent }] as any}>
            SENİN YOLCULUĞUN
          </Eyebrow>
          <Text style={[styles.heroTitle, { color: colors.text.primary }]}>
            {formatTurkishDateSince(state.profile.quitDate)}
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.text.secondary }]}>
            {days} gün · {lightsEarned} ışık
          </Text>
        </View>

        {/* Mascot area (placeholder) */}
        <View style={[
          styles.mascotArea,
          { backgroundColor: colors.surface.card, borderColor: colors.border.default }
        ]}>
          <Text style={[styles.mascotPlaceholder, { color: colors.text.tertiary }]}>
            🦊 Mascot + ring
          </Text>
          <Text style={[styles.speechBubble, { color: colors.text.secondary }]}>
            {checkedInToday
              ? 'Bugün harika gidiyorsun!'
              : 'Check-in yapmaya hazır mısın?'}
          </Text>
        </View>

        {/* Today's quests */}
        <View style={styles.questsSection}>
          <Eyebrow style={[styles.sectionEyebrow, { color: colors.text.accent }] as any}>
            BUGÜN
          </Eyebrow>
          {quests.map(quest => (
            <TouchableOpacity
              key={quest.id}
              onPress={() => onQuestTap(quest.id)}
              activeOpacity={0.7}
            >
              <Card style={[
                styles.questCard,
                quest.done ? { backgroundColor: colors.surface.rewardSoft } : null
              ] as any}>
                <View style={styles.questRow}>
                  <View style={styles.questLeft}>
                    <View style={[
                      styles.questDot,
                      {
                        backgroundColor: quest.done
                          ? colors.action.primary
                          : colors.border.default
                      }
                    ]} />
                    <Text style={[
                      styles.questTitle,
                      {
                        color: colors.text.primary,
                        opacity: quest.done ? 0.6 : 1,
                      }
                    ]}>
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

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              İÇİLMEYEN
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
              TASARRUF
            </Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              —
            </Text>
            <Text style={[styles.statUnit, { color: colors.text.tertiary }]}>
              Paket fiyatı ekle
            </Text>
          </Card>
        </View>

        {/* Craving button */}
        <SecondaryButton label="İstek geldi mi?" onPress={onCraving} />

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
    marginBottom: 32,
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
  },
  mascotPlaceholder: {
    fontSize: 48,
    marginBottom: 16,
  },
  speechBubble: {
    ...typography.body.md,
    textAlign: 'center',
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
  cravingButton: {
    marginTop: 8,
  },
});
