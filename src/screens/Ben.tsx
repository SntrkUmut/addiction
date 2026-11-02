/**
 * Ben (Profile/Settings) screen (rev 5.1 §18)
 * Shows user profile, settings, cloud sync, support
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme , getThemeMode, setThemeMode } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, Eyebrow } from '../ui/components';
import { journeyDay } from '../domain/journey';
import { getHapticsEnabled, setHapticsEnabled } from '../ui/haptics';

interface Props {
  state: any;
  onEditPlan: () => void;
  onReminders: () => void;
  onSupport: () => void;
}

export function Ben({ state, onEditPlan, onReminders, onSupport }: Props) {
  const { colors, isDark, themeMode } = useTheme();
  const days = journeyDay(state.profile.quitDate);

  const [hapticsOn, setHapticsOn] = React.useState(() => getHapticsEnabled());

  const toggleHaptics = async (value: boolean) => {
    setHapticsOn(value);
    await setHapticsEnabled(value);
  };

  const cycleTheme = async () => {
    const modes: ('system' | 'light' | 'dark')[] = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    await setThemeMode(nextMode);
  };

  const themeLabelMap = {
    system: 'Sistem',
    light: 'Açık',
    dark: 'Koyu',
  };

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Eyebrow style={[styles.eyebrow, { color: colors.text.accent }] as any}>
          PROFİL
        </Eyebrow>

        {/* User summary */}
        <View style={styles.summary}>
          <Text style={[styles.summaryTitle, { color: colors.text.primary }]}>
            Yolculuğun
          </Text>
          <Text style={[styles.summarySubtitle, { color: colors.text.secondary }]}>
            {days} gün · {state.lights || 0} ışık
          </Text>
        </View>

        {/* Plan section */}
        <View style={styles.section}>
          <Eyebrow style={[styles.sectionEyebrow, { color: colors.text.accent }] as any}>
            PLAN
          </Eyebrow>
          <TouchableOpacity onPress={onEditPlan} activeOpacity={0.7}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                    Planını düzenle
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                    Başlangıç tarihi, günlük miktar, paket fiyatı
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Reminders section */}
        <View style={styles.section}>
          <Eyebrow style={[styles.sectionEyebrow, { color: colors.text.accent }]}>
            HATIRLATMALAR
          </Eyebrow>
          <TouchableOpacity onPress={onReminders} activeOpacity={0.7}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                    Bildirimler
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                    Check-in hatırlatması
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Experience section */}
        <View style={styles.section}>
          <Eyebrow style={[styles.sectionEyebrow, { color: colors.text.accent }]}>
            DENEYİM
          </Eyebrow>

          {/* Theme toggle */}
          <TouchableOpacity onPress={cycleTheme} activeOpacity={0.7}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                    Görünüm
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                    {themeLabelMap[themeMode]}
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>

          {/* Haptics toggle */}
          <Card style={[styles.settingCard, { marginTop: 8 }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                  Titreşimli geri bildirim
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                  Hafif titreşimler
                </Text>
              </View>
              <Switch
                value={hapticsOn}
                onValueChange={toggleHaptics}
                trackColor={{
                  false: colors.surface.sunken,
                  true: colors.action.primary,
                }}
              />
            </View>
          </Card>
        </View>

        {/* Cloud sync section */}
        <View style={styles.section}>
          <Eyebrow style={[styles.sectionEyebrow, { color: colors.text.accent }]}>
            VERİ VE EŞİTLEME
          </Eyebrow>
          <Card style={styles.settingCard}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                Bulut eşitleme
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                {process.env.EXPO_PUBLIC_SUPABASE_URL
                  ? 'Verileriniz güvenli bir şekilde saklanıyor'
                  : 'Bağlı değil · Tüm veriler cihazda'}
              </Text>
            </View>
          </Card>
        </View>

        {/* Support section */}
        <View style={styles.section}>
          <Eyebrow style={[styles.sectionEyebrow, { color: colors.text.accent }]}>
            DESTEK VE BİLGİ
          </Eyebrow>
          <TouchableOpacity onPress={onSupport} activeOpacity={0.7}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                    Yardım ve geri bildirim
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
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
  summary: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  summaryTitle: {
    ...typography.display.md,
    marginBottom: 8,
  },
  summarySubtitle: {
    ...typography.body.lg,
  },
  section: {
    marginBottom: 24,
  },
  sectionEyebrow: {
    marginBottom: 12,
  },
  settingCard: {
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    ...typography.body.sm,
  },
  chevron: {
    fontSize: 28,
    lineHeight: 28,
    marginLeft: 12,
  },
});
