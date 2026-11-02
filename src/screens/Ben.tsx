/**
 * Ben (Profile/Settings)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, Eyebrow } from '../ui/components';
import { journeyDay } from '../domain/journey';
import { getHapticsEnabled, setHapticsEnabled } from '../ui/haptics';
import { lightsFrom, todayIso } from '../domain/progress';
import {
  configureDailyReminder,
  disableDailyReminder,
  loadReminderSettings,
  type ReminderSettings,
} from '../domain/reminders';
import type { AppState } from '../data/schema';
import {
  CLOUD_SYNC_CARD_TITLE,
  cloudSyncStatusSubtitle,
  ON_DEVICE_DATA_NOTE,
  shouldShowCloudSyncCard,
} from '../domain/buildEnv';

interface Props {
  state: AppState;
  onEditPlan: () => void;
  onSupport: () => void;
  onExport: () => void;
}

export function Ben({ state, onEditPlan, onSupport, onExport }: Props) {
  const { colors, isDark, themeMode, setMode } = useTheme();
  const days = journeyDay(state.profile?.quitDate ?? todayIso());
  const [hapticsOn, setHapticsOn] = React.useState(() => getHapticsEnabled());
  const [reminder, setReminder] = React.useState<ReminderSettings>({ enabled: false, time: '19:00' });
  const [reminderTime, setReminderTime] = React.useState('19:00');
  const [reminderBusy, setReminderBusy] = React.useState(false);
  const [reminderError, setReminderError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadReminderSettings().then(value => {
      setReminder(value);
      setReminderTime(value.time);
    }).catch(() => {});
  }, []);

  const toggleHaptics = async (value: boolean) => {
    setHapticsOn(value);
    await setHapticsEnabled(value);
  };

  const cycleTheme = async () => {
    const modes: ('system' | 'light' | 'dark')[] = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    await setMode(nextMode);
  };

  const toggleReminder = async (enabled: boolean) => {
    setReminderBusy(true);
    setReminderError(null);
    try {
      const next = enabled
        ? await configureDailyReminder(reminderTime)
        : await disableDailyReminder();
      setReminder(next);
      setReminderTime(next.time);
    } catch (error) {
      setReminderError(error instanceof Error ? error.message : 'Hatırlatma güncellenemedi.');
    } finally {
      setReminderBusy(false);
    }
  };

  const themeLabelMap = {
    system: 'Sistem',
    light: 'Açık',
    dark: 'Koyu',
  };

  const showCloudSyncCard = shouldShowCloudSyncCard();
  const supabaseConfigured = Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={180}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow style={styles.eyebrow}>PROFİL</Eyebrow>

        <View style={styles.summary}>
          <Text style={[styles.summaryTitle, { color: colors.text.primary }]}>Yolculuğun</Text>
          <Text style={[styles.summarySubtitle, { color: colors.text.secondary }]}>
            {days} gün · {lightsFrom(state)} ışık
          </Text>
        </View>

        <View style={styles.section}>
          <Eyebrow style={styles.sectionEyebrow}>PLAN</Eyebrow>
          <TouchableOpacity onPress={onEditPlan} activeOpacity={0.7}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Planını düzenle</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                    Başlangıç tarihi, günlük miktar, paket fiyatı
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Eyebrow style={styles.sectionEyebrow}>HATIRLATMALAR</Eyebrow>
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Check-in hatırlatması</Text>
                <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                  Günlük yerel bildirim
                </Text>
              </View>
              <Switch
                value={reminder.enabled}
                disabled={reminderBusy}
                onValueChange={toggleReminder}
                trackColor={{ false: colors.surface.sunken, true: colors.action.primary }}
              />
            </View>
            <View style={[styles.settingRow, { marginTop: 12 }]}>
              <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>Saat (SS:DD)</Text>
              <TextInput
                value={reminderTime}
                onChangeText={setReminderTime}
                onEndEditing={() => { if (reminder.enabled) toggleReminder(true); }}
                placeholder="19:00"
                placeholderTextColor={colors.text.tertiary}
                style={[styles.timeInput, { color: colors.text.primary, borderColor: colors.border.default }]}
              />
            </View>
            {reminderError ? (
              <Text style={[styles.settingSubtitle, { color: colors.text.accent, marginTop: 8 }]}>{reminderError}</Text>
            ) : null}
          </Card>
        </View>

        <View style={styles.section}>
          <Eyebrow style={styles.sectionEyebrow}>DENEYİM</Eyebrow>
          <TouchableOpacity onPress={cycleTheme} activeOpacity={0.7}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Görünüm</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                    {themeLabelMap[themeMode]}
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>

          <Card style={[styles.settingCard, { marginTop: 8 }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Titreşimli geri bildirim</Text>
                <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>Hafif titreşimler</Text>
              </View>
              <Switch
                value={hapticsOn}
                onValueChange={toggleHaptics}
                trackColor={{ false: colors.surface.sunken, true: colors.action.primary }}
              />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Eyebrow style={styles.sectionEyebrow}>
            {showCloudSyncCard ? 'VERİ VE EŞİTLEME' : 'VERİ'}
          </Eyebrow>
          {showCloudSyncCard ? (
            <Card style={styles.settingCard}>
              <View style={styles.settingLeft}>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                  {CLOUD_SYNC_CARD_TITLE}
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                  {cloudSyncStatusSubtitle(supabaseConfigured)}
                </Text>
              </View>
            </Card>
          ) : (
            <Text style={[styles.deviceNote, { color: colors.text.secondary }]}>
              {ON_DEVICE_DATA_NOTE}
            </Text>
          )}
          <TouchableOpacity
            onPress={onExport}
            activeOpacity={0.7}
            style={{ marginTop: showCloudSyncCard ? 8 : 12 }}
          >
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Verini dışa aktar</Text>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Eyebrow style={styles.sectionEyebrow}>DESTEK VE BİLGİ</Eyebrow>
          <TouchableOpacity onPress={onSupport} activeOpacity={0.7}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Yardım ve geri bildirim</Text>
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
  deviceNote: {
    ...typography.body.sm,
    marginBottom: 4,
  },
  chevron: {
    fontSize: 28,
    lineHeight: 28,
    marginLeft: 12,
  },
  timeInput: {
    minWidth: 72,
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});
