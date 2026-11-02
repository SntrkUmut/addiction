/**
 * Onboarding flow (rev 5.1 §5.3)
 * 5 steps: welcome, cigs/day, pack price (optional), quit date, summary
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, PrimaryButton, TextButton, Eyebrow } from '../ui/components';
import type { Profile } from '../data/schema';

type OnboardingStep = 'welcome' | 'cigs' | 'price' | 'date' | 'summary';

export interface OnboardingData {
  cigarettesPerDay: string;
  packPrice: string;
  packSize: string;
  currency: string;
  quitDate: string;
}

interface Props {
  onComplete: (data: OnboardingData) => void;
  onEdit?: (data: Partial<OnboardingData>) => void;
  isEditing?: boolean;
  initialProfile?: Profile | null;
}

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function Onboarding({ onComplete, onEdit, isEditing = false, initialProfile }: Props) {
  const { colors, isDark } = useTheme();
  const [step, setStep] = useState<OnboardingStep>(isEditing ? 'cigs' : 'welcome');
  const [data, setData] = useState<OnboardingData>({
    cigarettesPerDay: initialProfile?.cigarettesPerDay ? String(initialProfile.cigarettesPerDay) : '',
    packPrice: initialProfile?.packPrice ? String(initialProfile.packPrice) : '',
    packSize: initialProfile?.packSize ? String(initialProfile.packSize) : '20',
    currency: 'TRY',
    quitDate: initialProfile?.quitDate?.slice(0, 10) || todayIso(),
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
    if (onEdit) onEdit(updates);
  };

  const handleNext = () => {
    if (step === 'welcome') setStep('cigs');
    else if (step === 'cigs') setStep('price');
    else if (step === 'price') setStep('date');
    else if (step === 'date') setStep('summary');
    else if (step === 'summary') onComplete({ ...data, currency: 'TRY' });
  };

  const handleSkipPrice = () => {
    updateData({ packPrice: '', packSize: '' });
    setStep('date');
  };

  return (
    <Scene variant={isDark ? 'dusk' : 'day'} height={800} horizonY={160}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressBar}>
            {(['welcome', 'cigs', 'price', 'date', 'summary'] as const).map((s, i) => (
              <View
                key={s}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      i <= ['welcome', 'cigs', 'price', 'date', 'summary'].indexOf(step)
                        ? colors.action.primary
                        : colors.border.default,
                  },
                ]}
              />
            ))}
          </View>

          {step === 'welcome' && (
            <View style={styles.stepContent}>
              <Eyebrow style={styles.eyebrow}>HOŞ GELDİN</Eyebrow>
              <Text style={[styles.title, { color: colors.text.primary }]}>Sigarayı bırakma yolculuğuna başla</Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Burada her gün yeni bir adım, her adım bir ışık. İlerleme kaydedilir; istediğin
                zaman geri dönebilirsin.
              </Text>
            </View>
          )}

          {step === 'cigs' && (
            <View style={styles.stepContent}>
              <Eyebrow style={styles.eyebrow}>
                {isEditing ? 'PLANINI DÜZENLE' : 'ADIM 1 · BAŞLANGIÇ NOKTAN'}
              </Eyebrow>
              <Text style={[styles.title, { color: colors.text.primary }]}>Günde yaklaşık kaç sigara içiyorsun?</Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Yaklaşık bir sayı yeterli. Bu bilgi, kişisel ilerleme tahminini oluşturur.
              </Text>
              <Card style={styles.inputCard}>
                <Text style={[styles.inputLabel, { color: colors.text.accent }]}>GÜNLÜK ORTALAMA</Text>
                <View style={styles.numberRow}>
                  <TextInput
                    value={data.cigarettesPerDay}
                    onChangeText={val => updateData({ cigarettesPerDay: val })}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    placeholder="Örn. 10"
                    placeholderTextColor={colors.text.tertiary}
                    style={[styles.numberInput, { color: colors.text.primary, backgroundColor: colors.surface.sunken }]}
                  />
                  <Text style={[styles.inputUnit, { color: colors.text.secondary }]}>sigara / gün</Text>
                </View>
                <Text style={[styles.fieldHint, { color: colors.text.tertiary }]}>
                  Yaklaşık değer yeterli; bu alanı daha sonra da doldurabilirsin.
                </Text>
              </Card>
            </View>
          )}

          {step === 'price' && (
            <View style={styles.stepContent}>
              <Eyebrow style={styles.eyebrow}>ADIM 2 · İSTEĞE BAĞLI</Eyebrow>
              <Text style={[styles.title, { color: colors.text.primary }]}>Tasarrufunu da takip edelim mi?</Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Paket fiyatını bilirsen yaklaşık tasarrufunu gösterebiliriz. Emin değilsen bu
                adımı geçebilirsin.
              </Text>
              <Card style={styles.inputCard}>
                <Text style={[styles.inputLabel, { color: colors.text.accent }]}>PAKET FİYATI</Text>
                <View style={styles.numberRow}>
                  <TextInput
                    value={data.packPrice}
                    onChangeText={val => updateData({ packPrice: val })}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    placeholder="Örn. 65"
                    placeholderTextColor={colors.text.tertiary}
                    style={[styles.numberInput, { color: colors.text.primary, backgroundColor: colors.surface.sunken }]}
                  />
                  <Text style={[styles.inputUnit, { color: colors.text.secondary }]}>₺ / paket</Text>
                </View>
                <View style={[styles.numberRow, { marginTop: 16 }]}>
                  <TextInput
                    value={data.packSize}
                    onChangeText={val => updateData({ packSize: val })}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    placeholder="20"
                    placeholderTextColor={colors.text.tertiary}
                    style={[styles.numberInput, { color: colors.text.primary, backgroundColor: colors.surface.sunken, flex: 0, width: 80 }]}
                  />
                  <Text style={[styles.inputUnit, { color: colors.text.secondary }]}>adet / paket</Text>
                </View>
                <Text style={[styles.fieldHint, { color: colors.text.tertiary }]}>
                  Bu bilgiyi daha sonra Rotam&apos;dan ekleyebilir veya değiştirebilirsin.
                </Text>
              </Card>
            </View>
          )}

          {step === 'date' && (
            <View style={styles.stepContent}>
              <Eyebrow style={styles.eyebrow}>ADIM 3 · BAŞLANGIÇ TARİHİ</Eyebrow>
              <Text style={[styles.title, { color: colors.text.primary }]}>Sigarayı bırakmaya ne zaman başladın?</Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Bugün başlıyorsan &quot;bugün&quot; seç. Daha önce başladıysan o tarihi girebilirsin.
              </Text>
              <Card style={styles.inputCard}>
                <Text style={[styles.inputLabel, { color: colors.text.accent }]}>BAŞLANGIÇ TARİHİ</Text>
                <TextInput
                  value={data.quitDate}
                  onChangeText={val => updateData({ quitDate: val })}
                  placeholder="YYYY-AA-GG"
                  placeholderTextColor={colors.text.tertiary}
                  style={[styles.numberInput, { color: colors.text.primary, backgroundColor: colors.surface.sunken, fontSize: 18 }]}
                />
                <Text style={[styles.fieldHint, { color: colors.text.tertiary }]}>
                  Bu tarih yolculuk günlerini belirler. İstediğin zaman değiştirebilirsin.
                </Text>
              </Card>
            </View>
          )}

          {step === 'summary' && (
            <View style={styles.stepContent}>
              <Eyebrow style={styles.eyebrow}>ÖZET</Eyebrow>
              <Text style={[styles.title, { color: colors.text.primary }]}>Hazırsın</Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Planın hazır. Başlamaya hazır olduğunda devam et; hesap açmadan kullanmaya
                başlayabilirsin.
              </Text>
              <Card style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Günlük ortalama</Text>
                  <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
                    {data.cigarettesPerDay || '—'} sigara
                  </Text>
                </View>
                {data.packPrice ? (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Paket fiyatı</Text>
                    <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
                      {data.packPrice} ₺ / {data.packSize || 20} adet
                    </Text>
                  </View>
                ) : (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Tasarruf hesabı</Text>
                    <Text style={[styles.summaryValue, { color: colors.text.primary }]}>Şimdilik eklenmedi</Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Başlangıç tarihi</Text>
                  <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{data.quitDate}</Text>
                </View>
              </Card>
            </View>
          )}

          <View style={styles.buttons}>
            {step === 'welcome' && <PrimaryButton onPress={handleNext} label="Başla" />}
            {step === 'cigs' && (
              <PrimaryButton
                onPress={handleNext}
                disabled={!data.cigarettesPerDay || parseFloat(data.cigarettesPerDay) <= 0}
                label="Devam et"
              />
            )}
            {step === 'price' && (
              <>
                <PrimaryButton
                  onPress={handleNext}
                  disabled={!data.packPrice || parseFloat(data.packPrice) <= 0}
                  label="Devam et"
                />
                <TextButton onPress={handleSkipPrice} label="Bu adımı geç" />
              </>
            )}
            {step === 'date' && <PrimaryButton onPress={handleNext} label="Devam et" />}
            {step === 'summary' && (
              <PrimaryButton onPress={handleNext} label="Yolculuğa başla" />
            )}
          </View>

          {!isEditing && (
            <Text style={[styles.footerHint, { color: colors.text.tertiary }]}>
              {step === 'welcome'
                ? 'Yaklaşık 1 dakika · Adımlarını istediğin zaman değiştirebilirsin'
                : step === 'summary'
                  ? 'Hesap açmadan kullanmaya başlayabilirsin'
                  : 'İlerleme kaydedilir · Dilediğinde geri dönebilirsin'}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Scene>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepContent: {
    flex: 1,
    paddingTop: 24,
  },
  eyebrow: {
    marginBottom: 16,
  },
  title: {
    ...typography.display.md,
    marginBottom: 12,
  },
  subtitle: {
    ...typography.body.lg,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputCard: {
    padding: 20,
  },
  inputLabel: {
    ...typography.label.sm,
    marginBottom: 12,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberInput: {
    ...typography.display.sm,
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  inputUnit: {
    ...typography.body.md,
  },
  fieldHint: {
    ...typography.body.sm,
    marginTop: 12,
  },
  summaryCard: {
    padding: 20,
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.body.md,
  },
  summaryValue: {
    ...typography.body.md,
    fontWeight: '600',
  },
  buttons: {
    marginTop: 32,
    marginBottom: 24,
  },
  footerHint: {
    ...typography.body.sm,
    textAlign: 'center',
  },
});
