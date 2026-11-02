/**
 * Main App Component — MVP tab shell with onboarding, İstek, milestones.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { AppState, emptyAppState, loadAppState, saveAppState } from './src/data/store';
import type { MilestoneKey } from './src/data/schema';
import { initHaptics, haptic } from './src/ui/haptics';
import { initTheme, ThemeProvider, useTheme } from './src/ui/theme';
import { Onboarding, type OnboardingData } from './src/screens/Onboarding';
import { Yuva } from './src/screens/Yuva';
import { Siginak } from './src/screens/Siginak';
import { Rotam } from './src/screens/Rotam';
import { Ben } from './src/screens/Ben';
import { Istek } from './src/screens/Istek';
import { Milestone } from './src/screens/Milestone';
import { typography } from './src/theme/typography';
import { journeyDay } from './src/domain/journey';
import { getManifest, getPiece, type Manifest } from './src/domain/content';
import {
  appendEvent,
  estimatedSavings,
  formatMoney,
  lightsFrom,
  todayIso,
  unlockedPieceCount,
  withSyncedCollection,
  hasLoggedSlip,
} from './src/domain/progress';
import { latestUnseenMilestone, milestoneByDay, type MilestoneCopy } from './src/domain/milestones';
import { earnedLight } from './src/domain/rewards';
import { createExportJson } from './src/domain/export';
import { House, MapTrifold, Campfire, User } from 'phosphor-react-native';

type Tab = 'yuva' | 'siginak' | 'rotam' | 'ben';
type DialogAction = { label: string; onPress: () => void; destructive?: boolean };
type DialogState = { title: string; message: string; actions?: DialogAction[] } | null;

function newEventId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppInner />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function AppInner() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState>(emptyAppState());
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [urgeVisible, setUrgeVisible] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<MilestoneCopy | null>(null);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [unlockedPieceName, setUnlockedPieceName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('yuva');
  const [dialog, setDialog] = useState<DialogState>(null);

  useEffect(() => {
    const init = async () => {
      await initHaptics();
      await initTheme();
      const [loaded, remoteManifest] = await Promise.all([
        loadAppState(),
        getManifest().catch(() => null),
      ]);
      const nextManifest = remoteManifest;
      const nextState = nextManifest ? withSyncedCollection(loaded, nextManifest) : loaded;
      setManifest(nextManifest);
      setState(nextState);
      if (!nextState.profile?.quitDate) {
        setOnboardingVisible(true);
      } else {
        const unseen = latestUnseenMilestone(
          journeyDay(nextState.profile.quitDate),
          nextState.milestones?.seen.map(item => item.key) ?? [],
        );
        if (unseen) setActiveMilestone(unseen);
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (loading) return;
    saveAppState(state).catch(err => {
      if (__DEV__) console.warn('[App] Save failed', err);
    });
  }, [state, loading]);

  const updateState = useCallback((updater: (current: AppState) => AppState) => {
    setState(current => {
      const next = updater(current);
      return manifest ? withSyncedCollection(next, manifest) : next;
    });
  }, [manifest]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    const packPrice = parseFloat(data.packPrice) || 0;
    const packSize = packPrice > 0 ? (parseInt(data.packSize, 10) || 20) : 0;
    const quitDate = /^\d{4}-\d{2}-\d{2}$/.test(data.quitDate) ? data.quitDate : todayIso();
    updateState(current => ({
      ...current,
      schemaVersion: 2,
      profile: {
        name: current.profile?.name || '',
        reason: current.profile?.reason || '',
        cigarettesPerDay: parseFloat(data.cigarettesPerDay) || 0,
        packPrice,
        packSize,
        currency: 'TRY',
        quitDate,
      },
    }));
    setOnboardingVisible(false);
    await haptic('success');
  };

  const handleCheckIn = async () => {
    const today = todayIso();
    if (checkedInAlready(state, today)) {
      setDialog({ title: 'Bugün tamam', message: 'Bugünkü check-in zaten kayıtlı.' });
      return;
    }
    updateState(current => appendEvent(current, {
      id: newEventId('checkin'),
      at: new Date().toISOString(),
      kind: 'checkin',
      details: {},
    }));
    await haptic('light');
    setDialog({ title: 'Check-in kaydedildi', message: '+1 ışık kazandın!' });
  };

  const openUrge = () => {
    setUnlockedPieceName(null);
    setUrgeVisible(true);
  };

  const handleCravingOpened = useCallback(() => {
    updateState(current => appendEvent(current, {
      id: newEventId('craving'),
      at: new Date().toISOString(),
      kind: 'craving',
      details: {},
    }));
  }, [updateState]);

  const handleCopingComplete = (tool: { title: string }) => {
    const before = lightsFrom(state);
    updateState(current => {
      const next = appendEvent(current, {
        id: newEventId('coping'),
        at: new Date().toISOString(),
        kind: 'coping',
        details: { tool: tool.title },
      });
      const after = earnedLight(next.events);
      const perPiece = manifest?.lightsPerPiece ?? 2;
      if (manifest && Math.floor(after / perPiece) > Math.floor(before / perPiece)) {
        const piece = getPiece(manifest, unlockedPieceCount(after, perPiece) - 1);
        setUnlockedPieceName(piece?.piece.name ?? null);
      }
      return next;
    });
  };

  const handleUrgeResult = async (result: string) => {
    updateState(current => appendEvent(current, {
      id: newEventId('urge'),
      at: new Date().toISOString(),
      kind: 'urge_result',
      details: { result },
    }));
    await haptic('light');
  };

  const handleQuestTap = (questId: string) => {
    if (questId === 'check-in') handleCheckIn();
    else openUrge();
  };

  const handleSlip = () => {
    setDialog({
      title: 'Kayma kaydı',
      message: 'Bugün sigara içtiysen bunu kaydedebilirsin. Işıkların, parçaların ve gün sayın yerinde kalır.',
      actions: [
        { label: 'Vazgeç', onPress: () => {} },
        {
          label: 'Kaydet',
          onPress: () => {
            updateState(current => appendEvent(current, {
              id: newEventId('slip'),
              at: new Date().toISOString(),
              kind: 'slip',
              details: {},
            }));
          },
        },
      ],
    });
  };

  const handleNodeTap = (_pieceIndex: number, pieceName: string) => {
    setDialog({ title: pieceName, message: 'Bu parça sığınağında duruyor. Kayma onu geri almaz.' });
  };

  const openMilestone = (day: number, markSeen: boolean) => {
    const milestone = milestoneByDay(day);
    if (!milestone) return;
    setActiveMilestone(milestone);
    if (markSeen) {
      updateState(current => {
        const seen = current.milestones?.seen ?? [];
        if (seen.some(item => item.key === milestone.key)) return current;
        return {
          ...current,
          milestones: {
            seen: [...seen, {
              key: milestone.key as MilestoneKey,
              seenAt: new Date().toISOString(),
              variant: hasLoggedSlip(current) ? 'slip' : 'default',
            }],
          },
        };
      });
    }
  };

  const handleMilestoneTap = (day: number) => {
    haptic('selection');
    openMilestone(day, false);
  };

  const closeMilestone = (goShelter: boolean) => {
    if (activeMilestone) openMilestone(activeMilestone.day, true);
    setActiveMilestone(null);
    if (goShelter) setActiveTab('siginak');
    else setActiveTab('yuva');
  };

  const handleCollectionTap = () => setCollectionVisible(true);

  const handleCalcTap = () => {
    const saved = estimatedSavings(state);
    setDialog({
      title: 'Hesaplama',
      message: saved === null
        ? 'İçilmeyen tahmini, bırakma tarihin ve günlük ortalamanla hesaplanır. Tasarruf için paket fiyatını plana ekle.'
        : `Tasarruf tahmini, içilmeyen adet × paket fiyatı ÷ paketteki adet formülünü kullanır. Şu an yaklaşık ${formatMoney(saved, state.profile?.currency || 'TRY')}.`,
    });
  };

  const handleSupport = () => {
    setDialog({
      title: 'Destek',
      message: 'Bu uygulama öz yönetim desteği sunar; sağlık profesyonelinin önerilerinin yerine geçmez. Türkiye’de ALO 171 sigara bırakma danışma hattını arayabilirsin.',
      actions: [
        { label: 'Kapat', onPress: () => {} },
        { label: 'ALO 171', onPress: () => { Linking.openURL('tel:171').catch(() => {}); } },
      ],
    });
  };

  const handleExport = async () => {
    try {
      const payload = createExportJson(state);
      const file = new File(Paths.cache, 'quit-veri.json');
      await file.write(payload);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Verini dışa aktar' });
      } else {
        setDialog({ title: 'Dışa aktarma', message: 'Bu cihazda paylaşım kullanılamıyor. Verin yine de cihazda güvende.' });
      }
    } catch {
      setDialog({ title: 'Dışa aktarma', message: 'Dosya oluşturulamadı. Verin cihazda duruyor.' });
    }
  };

  const collectionItems = useMemo(() => {
    const earned = new Set(state.collection?.earned.map(item => item.id) ?? []);
    return (manifest?.items ?? []).map(item => ({
      ...item,
      earned: earned.has(item.id),
    }));
  }, [manifest, state.collection]);

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.bg.canvas, paddingTop: insets.top }]}>
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Yükleniyor...</Text>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.canvas }]}>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {activeTab === 'yuva' && (
          <Yuva
            state={state}
            onCheckIn={handleCheckIn}
            onCraving={openUrge}
            onQuestTap={handleQuestTap}
            onSlip={handleSlip}
          />
        )}
        {activeTab === 'siginak' && manifest && (
          <Siginak
            state={state}
            manifest={manifest}
            onNodeTap={handleNodeTap}
            onMilestoneTap={handleMilestoneTap}
            onCollectionTap={handleCollectionTap}
          />
        )}
        {activeTab === 'rotam' && (
          <Rotam
            state={state}
            onMilestoneTap={handleMilestoneTap}
            onCalcTap={handleCalcTap}
            onSlip={handleSlip}
          />
        )}
        {activeTab === 'ben' && (
          <Ben
            state={state}
            onEditPlan={() => setOnboardingVisible(true)}
            onSupport={handleSupport}
            onExport={handleExport}
          />
        )}
      </View>

      <View style={[
        styles.tabbar,
        {
          backgroundColor: colors.surface.card,
          borderTopColor: colors.border.default,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
      >
        {([
          ['yuva', 'Yuva', House],
          ['siginak', 'Sığınak', Campfire],
          ['rotam', 'Rotam', MapTrifold],
          ['ben', 'Ben', User],
        ] as const).map(([id, label, Icon]) => {
          const active = activeTab === id;
          const color = active ? colors.text.accent : colors.text.tertiary;
          return (
            <TouchableOpacity
              key={id}
              style={styles.tabButton}
              onPress={() => { setActiveTab(id); haptic('light'); }}
              activeOpacity={0.7}
            >
              <Icon weight={active ? 'fill' : 'regular'} color={color} size={24} />
              <Text style={[styles.tabLabel, { color, fontWeight: active ? '700' : '600' }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal visible={onboardingVisible} animationType="slide" presentationStyle="fullScreen">
        <Onboarding
          onComplete={handleOnboardingComplete}
          isEditing={!!state.profile?.quitDate}
          initialProfile={state.profile}
        />
      </Modal>

      <Modal visible={urgeVisible} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setUrgeVisible(false)}>
        <Istek
          reason={state.profile?.reason}
          unlockedPieceName={unlockedPieceName}
          onCravingOpened={handleCravingOpened}
          onComplete={handleCopingComplete}
          onResult={handleUrgeResult}
          onClose={() => setUrgeVisible(false)}
        />
      </Modal>

      <Modal visible={!!activeMilestone} animationType="fade" presentationStyle="fullScreen" onRequestClose={() => closeMilestone(false)}>
        {activeMilestone && (
          <Milestone
            milestone={activeMilestone}
            slipped={hasLoggedSlip(state)}
            onShelter={() => closeMilestone(true)}
            onHome={() => closeMilestone(false)}
          />
        )}
      </Modal>

      <Modal visible={collectionVisible} animationType="slide" onRequestClose={() => setCollectionVisible(false)}>
        <View style={[styles.collectionScreen, { backgroundColor: colors.bg.canvas, paddingTop: insets.top }]}>
          <Text style={[styles.dialogTitle, { color: colors.text.primary }]}>Koleksiyon</Text>
          {collectionItems.length === 0 ? (
            <Text style={[styles.dialogMessage, { color: colors.text.secondary }]}>Henüz öğe yok.</Text>
          ) : collectionItems.map(item => (
            <View key={item.id} style={[styles.collectionRow, { borderBottomColor: colors.border.default }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.collectionName, { color: colors.text.primary }]}>{item.name}</Text>
                <Text style={[styles.collectionHint, { color: colors.text.tertiary }]}>{item.hint}</Text>
              </View>
              <Text style={{ color: item.earned ? colors.action.primary : colors.text.tertiary }}>
                {item.earned ? 'Kazandı' : 'Kilitli'}
              </Text>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.dialogButton, { backgroundColor: colors.action.primary, marginTop: 24 }]}
            onPress={() => setCollectionVisible(false)}
          >
            <Text style={[styles.dialogButtonText, { color: '#FFFFFF' }]}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {dialog && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setDialog(null)}>
          <TouchableOpacity style={styles.dialogBackdrop} activeOpacity={1} onPress={() => setDialog(null)}>
            <View style={[styles.dialogCard, { backgroundColor: colors.surface.card }]}>
              <Text style={[styles.dialogTitle, { color: colors.text.primary }]}>{dialog.title}</Text>
              <Text style={[styles.dialogMessage, { color: colors.text.secondary }]}>{dialog.message}</Text>
              <View style={styles.dialogActions}>
                {(dialog.actions ?? [{ label: 'Tamam', onPress: () => {} }]).map((action, i, actions) => (
                  <TouchableOpacity
                    key={action.label}
                    style={[
                      styles.dialogButton,
                      {
                        backgroundColor: action.destructive
                          ? '#B45D4B'
                          : i === actions.length - 1
                            ? colors.action.primary
                            : colors.action.secondary,
                      },
                    ]}
                    onPress={() => {
                      setDialog(null);
                      action.onPress();
                    }}
                  >
                    <Text style={[
                      styles.dialogButtonText,
                      { color: action.destructive || i === actions.length - 1 ? '#FFFFFF' : colors.text.primary },
                    ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

function checkedInAlready(state: AppState, today: string) {
  return state.events.some(event => event.kind === 'checkin' && event.at.startsWith(today));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body.lg,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: 8,
  },
  tabLabel: {
    ...typography.label.sm,
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
  },
  dialogTitle: {
    ...typography.display.sm,
    marginBottom: 12,
  },
  dialogMessage: {
    ...typography.body.md,
    lineHeight: 22,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  dialogButton: {
    minHeight: 44,
    minWidth: 80,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogButtonText: {
    ...typography.label.md,
    fontWeight: '700',
  },
  collectionScreen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  collectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  collectionName: {
    ...typography.body.md,
    fontWeight: '600',
  },
  collectionHint: {
    ...typography.body.sm,
  },
});
