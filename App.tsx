/**
 * Main App Component (rev 5.1)
 * Tab-based navigation with Yuva, Sığınak, Rotam, Ben
 */

import React, { useState, useEffect, createContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppState, loadAppState, saveAppState } from './src/data/store';
import { initHaptics, haptic } from './src/ui/haptics';
import { initTheme, ThemeProvider } from './src/ui/theme';
import { Onboarding } from './src/screens/Onboarding';
import { Yuva } from './src/screens/Yuva';
import { Siginak } from './src/screens/Siginak';
import { Rotam } from './src/screens/Rotam';
import { Ben } from './src/screens/Ben';
import { semanticLight, semanticDark } from './src/theme/colors';
import { typography } from './src/theme/typography';
import { journeyDay } from './src/domain/journey';

type Tab = 'yuva' | 'siginak' | 'rotam' | 'ben';

type DialogAction = { label: string; onPress: () => void; destructive?: boolean };
type DialogState = { title: string; message: string; actions?: DialogAction[] } | null;
const DialogContext = createContext<(dialog: DialogState) => void>(() => {});

export default function App() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState | null>(null);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('yuva');
  const [dialog, setDialog] = useState<DialogState>(null);

  // Initialize
  useEffect(() => {
    const init = async () => {
      await initHaptics();
      await initTheme();
      
      const loaded = await loadAppState();
      setState(loaded);
      
      // Show onboarding if no quit date set
      if (!loaded || !loaded.profile || !loaded.profile.quitDate) {
        setOnboardingVisible(true);
      }
      
      setLoading(false);
    };
    
    init();
  }, []);

  // Auto-save state changes
  useEffect(() => {
    if (state && !loading) {
      saveAppState(state).catch(err => {
        if (__DEV__) console.warn('[App] Save failed', err);
      });
    }
  }, [state, loading]);

  // Onboarding completion
  const handleOnboardingComplete = async (data: any) => {
    if (!state) return;
    
    const updatedState: AppState = {
      ...state,
      profile: {
        name: state.profile?.name || '',
        reason: state.profile?.reason || '',
        cigarettesPerDay: parseFloat(data.cigarettesPerDay) || 0,
        packPrice: parseFloat(data.packPrice) || 0,
        packSize: parseInt(data.packSize) || 20,
        currency: data.currency || '₺',
        quitDate: data.quitDate,
      },
    };
    
    setState(updatedState);
    setOnboardingVisible(false);
    await haptic('success');
  };

  // Check-in
  const handleCheckIn = async () => {
    if (!state) return;
    
    const today = new Date().toISOString().split('T')[0];
    const alreadyCheckedIn = state.events.some(e => 
      e.kind === 'checkin' && e.at.startsWith(today)
    );
    
    if (alreadyCheckedIn) {
      setDialog({
        title: 'Bugün tamam',
        message: 'Bugünkü check-in zaten kayıtlı.',
      });
      return;
    }
    
    const updatedState: AppState = {
      ...state,
      lights: (state.lights || 0) + 1,
      events: [
        ...state.events,
        {
          id: `checkin-${Date.now()}`,
          at: new Date().toISOString(),
          kind: 'checkin',
          details: {},
        },
      ],
    };
    
    setState(updatedState);
    await haptic('light');
    
    setDialog({
      title: 'Check-in kaydedildi',
      message: '+1 ışık kazandın!',
    });
  };

  // Craving flow
  const handleCraving = () => {
    setDialog({
      title: 'İstek akışı',
      message: 'İstek, Nefes ve craving-end ekranları henüz implement edilmedi. Yakında eklenecek.',
    });
  };

  // Quest tap
  const handleQuestTap = (questId: string) => {
    if (questId === 'check-in') {
      handleCheckIn();
    } else {
      setDialog({
        title: 'Görev',
        message: `"${questId}" görevi henüz implement edilmedi.`,
      });
    }
  };

  // Node tap (Sığınak)
  const handleNodeTap = (pieceIndex: number) => {
    setDialog({
      title: 'Parça',
      message: `Parça ${pieceIndex + 1} detayı yakında eklenecek.`,
    });
  };

  // Milestone tap
  const handleMilestoneTap = (day: number) => {
    setDialog({
      title: `Gün ${day}`,
      message: `Gün ${day} kilometre taşı ekranı yakında eklenecek.`,
    });
  };

  // Collection tap
  const handleCollectionTap = () => {
    setDialog({
      title: 'Koleksiyon',
      message: 'Koleksiyon ekranı yakında eklenecek.',
    });
  };

  // Edit plan
  const handleEditPlan = () => {
    setOnboardingVisible(true);
  };

  // Reminders
  const handleReminders = () => {
    setDialog({
      title: 'Hatırlatmalar',
      message: 'Hatırlatma ayarları yakında eklenecek.',
    });
  };

  // Support
  const handleSupport = () => {
    setDialog({
      title: 'Destek',
      message: 'Destek ve geri bildirim yakında eklenecek.',
    });
  };

  // Calc tap
  const handleCalcTap = () => {
    setDialog({
      title: 'Hesaplama',
      message: 'Tasarruf hesaplama detayları yakında eklenecek.',
    });
  };

  // Loading screen
  if (loading) {
    return (
      <ThemeProvider>
        <View style={[styles.loading, { backgroundColor: semanticLight.bg.canvas }]}>
          <Text style={[styles.loadingText, { color: semanticLight.text.secondary }]}>
            Yükleniyor...
          </Text>
          <StatusBar style="dark" />
        </View>
      </ThemeProvider>
    );
  }

  if (!state) {
    return (
      <ThemeProvider>
        <View style={[styles.loading, { backgroundColor: semanticLight.bg.canvas }]}>
          <Text style={[styles.loadingText, { color: semanticLight.text.accent }]}>
            Veri yüklenemedi
          </Text>
          <StatusBar style="dark" />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <DialogContext.Provider value={setDialog}>
        <View style={styles.container}>
          {/* Tab content */}
          {activeTab === 'yuva' && (
            <Yuva
              state={state}
              onCheckIn={handleCheckIn}
              onCraving={handleCraving}
              onQuestTap={handleQuestTap}
            />
          )}
          {activeTab === 'siginak' && (
            <Siginak
              state={state}
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
            />
          )}
          {activeTab === 'ben' && (
            <Ben
              state={state}
              onEditPlan={handleEditPlan}
              onReminders={handleReminders}
              onSupport={handleSupport}
            />
          )}

          {/* Tab bar */}
          <View style={[
            styles.tabbar,
            { backgroundColor: semanticLight.surface.card, borderTopColor: semanticLight.border.default }
          ]}>
            <TabButton
              icon="🏠"
              label="Yuva"
              active={activeTab === 'yuva'}
              onPress={() => setActiveTab('yuva')}
            />
            <TabButton
              icon="🏔️"
              label="Sığınak"
              active={activeTab === 'siginak'}
              onPress={() => setActiveTab('siginak')}
            />
            <TabButton
              icon="📍"
              label="Rotam"
              active={activeTab === 'rotam'}
              onPress={() => setActiveTab('rotam')}
            />
            <TabButton
              icon="👤"
              label="Ben"
              active={activeTab === 'ben'}
              onPress={() => setActiveTab('ben')}
            />
          </View>

          {/* Onboarding modal */}
          <Modal
            visible={onboardingVisible}
            animationType="slide"
            presentationStyle="fullScreen"
          >
            <Onboarding
              onComplete={handleOnboardingComplete}
              onEdit={() => {}}
              isEditing={!!(state?.profile?.quitDate)}
            />
          </Modal>

          {/* Dialog */}
          {dialog && (
            <Modal visible transparent animationType="fade" onRequestClose={() => setDialog(null)}>
              <TouchableOpacity
                style={styles.dialogBackdrop}
                activeOpacity={1}
                onPress={() => setDialog(null)}
              >
                <View style={[styles.dialogCard, { backgroundColor: semanticLight.surface.card }]}>
                  <Text style={[styles.dialogTitle, { color: semanticLight.text.primary }]}>
                    {dialog.title}
                  </Text>
                  <Text style={[styles.dialogMessage, { color: semanticLight.text.secondary }]}>
                    {dialog.message}
                  </Text>
                  <View style={styles.dialogActions}>
                    {dialog.actions ? (
                      dialog.actions.map((action, i) => (
                        <TouchableOpacity
                          key={i}
                          style={[
                            styles.dialogButton,
                            action.destructive
                              ? { backgroundColor: '#B45D4B' }
                              : i === dialog.actions!.length - 1
                                ? { backgroundColor: semanticLight.action.primary }
                                : { backgroundColor: semanticLight.action.secondary },
                          ]}
                          onPress={() => {
                            setDialog(null);
                            action.onPress();
                          }}
                        >
                          <Text
                            style={[
                              styles.dialogButtonText,
                              {
                                color:
                                  action.destructive || i === dialog.actions!.length - 1
                                    ? '#FFFFFF'
                                    : semanticLight.text.primary,
                              },
                            ]}
                          >
                            {action.label}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <TouchableOpacity
                        style={[styles.dialogButton, { backgroundColor: semanticLight.action.primary }]}
                        onPress={() => setDialog(null)}
                      >
                        <Text style={[styles.dialogButtonText, { color: '#FFFFFF' }]}>Tamam</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          )}

          <StatusBar style="dark" />
        </View>
      </DialogContext.Provider>
    </ThemeProvider>
  );
}

function TabButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.tabIcon, active && { opacity: 1 }]}>{icon}</Text>
      <Text
        style={[
          styles.tabLabel,
          {
            color: active ? semanticLight.text.accent : semanticLight.text.tertiary,
            fontWeight: active ? '700' : '600',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
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
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: 8,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
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
});
