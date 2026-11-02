import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState as RNAppState,
  DimensionValue,
  KeyboardAvoidingView,
  Linking,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { configureDailyReminder, disableDailyReminder, loadReminderSettings, ReminderSettings } from './src/domain/reminders';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  AppState,
  CopingChoice,
  EventKind,
  Profile,
  ProgressEvent,
  loadAppState,
  saveAppState,
  pullSnapshot,
  pushSnapshot,
  currentUserEmail,
  removeAccount,
  clearLocalState,
  flushPendingSnapshot,
  signIn,
  signOut,
  signUp,
  subscribeToAuthChanges,
  supabaseReady,
} from './src/data/store';
import { earnedLight } from './src/domain/rewards';
import { createExportJson } from './src/domain/export';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type Tab = 'home' | 'shelter' | 'progress' | 'settings';
type Panel = 'idle' | 'tool' | 'timer' | 'done' | 'checkin';
type OnboardingStep = 'welcome' | 'smoking' | 'spending' | 'quitDate' | 'reason' | 'summary';
const onboardingSteps: OnboardingStep[] = ['welcome', 'smoking', 'spending', 'quitDate', 'reason', 'summary'];

const C = {
  bg: '#F8F6F1', paper: '#FFFEFC', ink: '#202522', muted: '#7B817B',
  faint: '#A4A79F', line: '#EAE4DC', green: '#E05D38', darkGreen: '#A5412B',
  softGreen: '#FDF0EC', orange: '#D96E4F', softOrange: '#F7E9E2', gold: '#D9AC58',
  paleGold: '#F7F0DC', blue: '#778DA0', softBlue: '#EAF0F3', red: '#B45D4B', white: '#FFFFFF',
};

type DialogAction = { label: string; onPress: () => void; destructive?: boolean };
type DialogState = { title: string; message: string; actions?: DialogAction[] } | null;
const DialogContext = createContext<(dialog: DialogState) => void>(() => {});

const copingChoices: CopingChoice[] = [
  { id: 'breath', title: 'Yavaş nefes', detail: 'Ritmi yumuşat, omuzlarını bırak.', icon: '≈', minutes: 3 },
  { id: 'walk', title: 'Kısa bir yürüyüş', detail: 'Bulunduğun yeri değiştir ve biraz hareket et.', icon: '↗', minutes: 5 },
  { id: 'water', title: 'Su iç', detail: 'Bir bardak su alıp yavaşça iç.', icon: '◡', minutes: 2 },
  { id: 'reasons', title: 'Nedenlerimi hatırla', detail: 'Bırakmaya karar verdiğin nedeni yeniden oku.', icon: '✳', minutes: 1 },
];
const ONBOARDING_DRAFT_KEY = 'quit-onboarding-draft-v1';

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return { days, hours, minutes };
}

type ElapsedDuration = ReturnType<typeof formatDuration>;

function localDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function planDate(value: string) {
  // New plans store a date-only value so a timezone conversion cannot move
  // the user's chosen quit day. Older snapshots stored ISO timestamps.
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
}

function isValidLocalDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return parsed.getFullYear() === Number(year)
    && parsed.getMonth() === Number(month) - 1
    && parsed.getDate() === Number(day);
}

function money(value: number, currency: string) {
  try { return new Intl.NumberFormat('tr-TR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value); }
  catch { return `${Math.round(value)} ${currency}`; }
}

function FoxMascot({ size = 92 }: { size?: number }) {
  return <Image source={require('./assets/mascot/fox-resting.png')} accessibilityLabel="Dinlenirken görünen tilki maskot" resizeMode="cover" style={{ width: size, height: size, borderRadius: Math.min(22, size * 0.24), backgroundColor: '#202B37' }} />;
}

function Button({ title, onPress, kind = 'primary', disabled = false }: {
  title: string; onPress: () => void; kind?: 'primary' | 'secondary' | 'quiet' | 'danger'; disabled?: boolean;
}) {
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [
    styles.button, kind === 'primary' && styles.buttonPrimary, kind === 'secondary' && styles.buttonSecondary,
    kind === 'quiet' && styles.buttonQuiet, kind === 'danger' && styles.buttonDanger,
    pressed && styles.pressed, disabled && { opacity: 0.45 },
  ]} accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled }}><Text style={[styles.buttonText, kind !== 'primary' && { color: kind === 'danger' ? C.red : C.ink }]}>{title}</Text></Pressable>;
}

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export default function App() {
  const [data, setData] = useState<AppState | null>(null);
  const dataRef = useRef<AppState | null>(null);
  const [clock, setClock] = useState(0);
  const [tab, setTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncIssue, setSyncIssue] = useState(false);
  const [reminder, setReminder] = useState<ReminderSettings>({ enabled: false, time: '19:00' });
  const [reminderTime, setReminderTime] = useState('19:00');
  const [reminderBusy, setReminderBusy] = useState(false);
  const [panel, setPanel] = useState<Panel>('idle');
  const [selectedTool, setSelectedTool] = useState<CopingChoice>(copingChoices[0]);
  const [remaining, setRemaining] = useState(180);
  const remainingRef = useRef(180);
  const timerDeadlineRef = useRef<number | null>(null);
  const urgeSessionIdRef = useRef<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [editing, setEditing] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const showDialog = (value: DialogState) => setDialog(value);
  const [cloudEmail, setCloudEmail] = useState<string | null>(null);
  const [restoreEmail, setRestoreEmail] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [restoreBusy, setRestoreBusy] = useState(false);
  const [onboardName, setOnboardName] = useState('');
  const [cigs, setCigs] = useState('');
  const [packPrice, setPackPrice] = useState('');
  const [packSize, setPackSize] = useState('');
  const [quitDate, setQuitDate] = useState(localDateInput(new Date()));
  const [reason, setReason] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadReminderSettings().then((value) => { setReminder(value); setReminderTime(value.time); }).catch(() => {});
    loadAppState().then((loaded) => {
      setClock(Date.now());
      dataRef.current = loaded;
      setData(loaded);
      if (loaded?.profile) {
        setCigs(loaded.profile.cigarettesPerDay > 0 ? String(loaded.profile.cigarettesPerDay) : '');
        setPackPrice(loaded.profile.packPrice > 0 ? String(loaded.profile.packPrice) : '');
        setPackSize(loaded.profile.packSize > 0 ? String(loaded.profile.packSize) : '');
        setQuitDate(localDateInput(planDate(loaded.profile.quitDate)));
        setReason(loaded.profile.reason ?? '');
        setOnboardName(loaded.profile.name ?? '');
      }
    }).finally(() => setLoading(false));
    currentUserEmail().then(setCloudEmail).catch(() => {});
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    let active = true;
    const retrySync = async () => {
      try {
        const result = await flushPendingSnapshot();
        if (active && result !== null) setSyncIssue(!result);
      } catch {
        if (active) setSyncIssue(true);
      }
    };
    const unsubscribeAuth = subscribeToAuthChanges(setCloudEmail);
    const unsubscribeNetwork = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) void retrySync();
    });
    const appStateSubscription = RNAppState.addEventListener('change', (state) => {
      if (state === 'active') void retrySync();
    });
    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeNetwork();
      appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (panel !== 'timer') return;
    timerDeadlineRef.current ??= Date.now() + remainingRef.current * 1000;
    const updateRemaining = () => {
      remainingRef.current = Math.max(0, Math.ceil(((timerDeadlineRef.current ?? Date.now()) - Date.now()) / 1000));
      setRemaining(remainingRef.current);
      if (remainingRef.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerDeadlineRef.current = null;
        setPanel('done');
      }
    };
    updateRemaining();
    timerRef.current = setInterval(updateRemaining, 1000);
    const appStateSubscription = RNAppState.addEventListener('change', (state) => {
      if (state === 'active') updateRemaining();
    });
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      appStateSubscription.remove();
    };
  }, [panel]);

  const persist = async (next: AppState): Promise<boolean> => {
    try {
      const { cloudSync } = await saveAppState(next);
      dataRef.current = next;
      setData(next);
      if (cloudSync) {
        void cloudSync.then((result) => {
          if (result !== null) setSyncIssue(!result);
        }).catch(() => setSyncIssue(true));
      }
      return true;
    } catch {
      showDialog({ title: 'Kaydedilemedi', message: 'Bu adım cihaza yazılamadı. Biraz sonra tekrar deneyebilirsin.' });
      return false;
    }
  };

  const retryCloudSync = async () => {
    setSyncing(true);
    try {
      const result = await flushPendingSnapshot();
      if (result === true) {
        setSyncIssue(false);
        showDialog({ title: 'Eşitleme tamamlandı', message: 'Cihazındaki son kayıt bulut hesabına gönderildi.' });
      } else {
        setSyncIssue(true);
        showDialog({ title: 'Eşitleme tamamlanamadı', message: result === false
          ? 'Cihazındaki kayıtlar güvende. Bağlantını kontrol edip yeniden deneyebilirsin.'
          : 'Bu hesapla eşitlenecek kayıt bulunamadı. Hesabına tekrar giriş yapıp deneyebilirsin.' });
      }
    } catch {
      setSyncIssue(true);
      showDialog({ title: 'Eşitleme tamamlanamadı', message: 'Cihazındaki kayıtlar güvende. Bağlantını kontrol edip yeniden deneyebilirsin.' });
    } finally {
      setSyncing(false);
    }
  };

  const record = async (kind: EventKind, details: Record<string, unknown> = {}, idempotencyKey?: string) => {
    const current = dataRef.current;
    if (!current) return false;
    const id = idempotencyKey
      ? `${kind}:${idempotencyKey}`
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    if (current.events.some((event) => event.id === id)) return true;
    const next: AppState = {
      ...current,
      events: [{ id, kind, at: new Date().toISOString(), details }, ...current.events],
    };
    return persist(next);
  };

  const removeEvent = (event: ProgressEvent) => showDialog({
    title: 'Bu kaydı kaldır?',
    message: 'Yalnızca seçtiğin kayıt kaldırılır. İlgili sayaç, ışık toplamı ve parça eşikleri yeniden hesaplanır.',
    actions: [{ label: 'Vazgeç', onPress: () => {} }, { label: 'Kaydı kaldır', destructive: true, onPress: () => {
      const current = dataRef.current;
      if (!current) return;
      void persist({ ...current, events: current.events.filter((item) => item.id !== event.id) });
    } }],
  });

  const profile = data?.profile;
  const plannedStart = profile ? planDate(profile.quitDate).getTime() : 0;
  const quitStarted = Boolean(profile && clock >= plannedStart);
  const lastSlipAt = useMemo(() => (data?.events ?? []).reduce<string | null>((latest, event) => {
    if (event.kind !== 'slip' || !Number.isFinite(Date.parse(event.at)) || Date.parse(event.at) > clock) return latest;
    return !latest || Date.parse(event.at) > Date.parse(latest) ? event.at : latest;
  }, null), [data, clock]);
  const lastSlipTime = lastSlipAt ? Date.parse(lastSlipAt) : plannedStart;
  const trackingStart = quitStarted ? Math.max(plannedStart, lastSlipTime) : plannedStart;
  const elapsed = useMemo(() => profile
    ? formatDuration(quitStarted ? clock - trackingStart : plannedStart - clock)
    : null, [profile, clock, quitStarted, trackingStart, plannedStart]);
  const hasLoggedSlip = Boolean(quitStarted && lastSlipAt && lastSlipTime >= plannedStart);
  const recordedSlipsSincePlan = (data?.events ?? []).filter((event) => event.kind === 'slip'
    && Date.parse(event.at) >= plannedStart && Date.parse(event.at) <= clock).length;
  const cigarettesAvoided = profile && elapsed && quitStarted
    ? Math.max(0, Math.floor((clock - plannedStart) / 86400000 * profile.cigarettesPerDay) - recordedSlipsSincePlan) : 0;
  const savedEstimate = profile && profile.cigarettesPerDay > 0 && profile.packPrice > 0 && profile.packSize > 0
    ? cigarettesAvoided * profile.packPrice / profile.packSize : null;
  const coins = earnedLight(data?.events ?? []);
  const builtPieces = Math.min(6, Math.floor(coins / 2));
  const todayKey = localDateInput(new Date());
  const checkedInToday = (data?.events ?? []).some((e) => e.kind === 'checkin' && localDateInput(new Date(e.at)) === todayKey);

  const startPlan = async () => {
    const daily = Number(cigs.replace(',', '.'));
    const price = packPrice.trim() ? Number(packPrice.replace(',', '.')) : 0;
    const size = packSize.trim() ? Number(packSize.replace(',', '.')) : 0;
    if (!Number.isFinite(daily) || daily < 0 || daily > 100 || (daily > 0 && daily < 1)) {
      showDialog({ title: 'Bilgiyi kontrol et', message: 'Günde 1 ile 100 arasında bir değer gir.' });
      return;
    }
    if ((price === 0) !== (size === 0) || !Number.isFinite(price) || price < 0 || price > 10_000_000 || !Number.isFinite(size) || size < 0 || size > 100) {
      showDialog({ title: 'Paket bilgisini kontrol et', message: 'Tasarruf hesabı için paket fiyatı ve adedini birlikte gir veya bu adımı atla.' });
      return;
    }
    if (!isValidLocalDate(quitDate)) {
      showDialog({ title: 'Tarihi kontrol et', message: 'Bırakma tarihini YYYY-AA-GG biçiminde geçerli bir takvim günü olarak gir.' });
      return;
    }
    const next: AppState = {
      profile: { name: onboardName.trim(), cigarettesPerDay: daily, packPrice: price, packSize: size, quitDate, reason: reason.trim(), currency: 'TRY' },
      events: editing && dataRef.current ? dataRef.current.events : [],
    };
    if (!(await persist(next))) return;
    setEditing(false);
    try { await localStorage.removeItem(ONBOARDING_DRAFT_KEY); } catch { /* clearing a draft is best effort */ }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const checkIn = async () => {
    if (checkedInToday) { showDialog({ title: 'Bugün tamam', message: 'Bugünkü check-in zaten kayıtlı. İstersen Rotam’daki son kayıtlardan kaldırıp yeniden ekleyebilirsin.' }); return; }
    setPanel('checkin');
  };

  const logSlip = () => showDialog({ title: 'Bir sigara içtin mi?', message: 'Bu kayıt önceki emeğini silmez. Yalnızca bugünkü durumu not ederiz.', actions: [{ label: 'Vazgeç', onPress: () => {} }, { label: 'Evet, kaydet', onPress: () => { void record('slip').then((saved) => { if (saved) showDialog({ title: 'Kaydedildi', message: 'İstersen şimdi bir sonraki küçük adımını seçebilirsin.' }); }); } }] });

  const openUrge = () => { urgeSessionIdRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; setPanel('tool'); timerDeadlineRef.current = null; remainingRef.current = 180; setRemaining(180); };
  const closeUrge = () => { if (timerRef.current) clearInterval(timerRef.current); timerDeadlineRef.current = null; urgeSessionIdRef.current = null; setPanel('idle'); setTab('home'); };

  const completeCoping = async () => {
    timerDeadlineRef.current = null;
    if (!(await record('coping', { toolId: selectedTool.id, minutes: selectedTool.minutes }, urgeSessionIdRef.current ?? undefined))) return;
    setPanel('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const connectCloud = async () => {
    if (!supabaseReady) { showDialog({ title: 'Supabase ayarı gerekli', message: 'Önce mobile/.env dosyasına Supabase URL ve publishable key eklenmeli. Başlangıç yönergeleri README’de.' }); return; }
    if (!email.includes('@') || password.length < 8) { showDialog({ title: 'Bilgileri kontrol et', message: 'Geçerli e-posta ve en az 8 karakterli parola gir.' }); return; }
    setAuthBusy(true);
    try {
      const message = authMode === 'signup' ? await signUp(email.trim(), password) : await signIn(email.trim(), password);
      setPassword('');
        setCloudEmail(await currentUserEmail());
      if (!message) {
        setSyncing(true);
        const remote = await pullSnapshot();
        if (remote && remote.profile && data?.profile) {
          showDialog({ title: 'Kayıtlı veri bulundu', message: 'Bu cihazdaki veriyi buluta yükleyebilir veya buluttaki veriyi bu cihaza alabilirsin.', actions: [
            { label: 'Buluttakini al', onPress: () => { void persist(remote).then((saved) => { if (saved) showDialog({ title: 'Eşitleme tamamlandı', message: 'Bulut kopyası bu cihaza alındı.' }); }); } },
            { label: 'Bu cihazı yükle', onPress: () => { void pushSnapshot(data).then(() => { setSyncIssue(false); showDialog({ title: 'Eşitleme tamamlandı', message: 'Bu cihazdaki kayıtlar buluta yüklendi.' }); }).catch((error) => { setSyncIssue(true); showDialog({ title: 'Eşitleme olmadı', message: error instanceof Error ? error.message : 'Daha sonra tekrar deneyebilirsin.' }); }); } },
          ] });
        } else if (remote?.profile) {
          if (!(await persist(remote))) return;
          showDialog({ title: 'Bulut eşitleme açık', message: 'Kayıtların hesabından bu cihaza alındı.' });
        } else {
          await pushSnapshot(data ?? { profile: null, events: [] });
          setSyncIssue(false);
          showDialog({ title: 'Bulut eşitleme açık', message: 'Kayıtların Supabase hesabına yedeklendi.' });
        }
      } else {
        showDialog({ title: 'E-postanı kontrol et', message });
      }
    } catch (error) {
      showDialog({ title: 'Bağlantı kurulamadı', message: error instanceof Error ? error.message : 'Bir hata oluştu. Tekrar deneyebilirsin.' });
    } finally { setAuthBusy(false); setSyncing(false); }
  };

  const doSignOut = async () => {
    await signOut();
    showDialog({ title: 'Hesaptan çıkıldı', message: 'Kayıtların bu cihazda kalır.' });
    setCloudEmail(null);
  };

  const doDeleteAccount = () => showDialog({ title: 'Hesabı ve verileri sil?', message: 'Bu işlem Supabase hesabını ve bu cihazdaki kayıtlarını kalıcı olarak siler.', actions: [
    { label: 'Vazgeç', onPress: () => {} },
    { label: 'Hesabı sil', destructive: true, onPress: async () => {
      try {
        await removeAccount();
        await cancelReminderForDataRemoval();
        setCloudEmail(null);
        dataRef.current = null;
        setData(null);
        showDialog({ title: 'Hesap silindi', message: 'Hesabın ve bu cihazdaki kayıtların silindi.' });
      } catch (error) { showDialog({ title: 'Silme tamamlanamadı', message: error instanceof Error ? error.message : 'Tekrar deneyebilirsin.' }); }
    } },
  ] });

  const restoreCloud = async () => {
    if (!supabaseReady) { showDialog({ title: 'Supabase ayarı gerekli', message: 'Önce mobile/.env dosyasına Supabase URL ve publishable key eklenmeli.' }); return; }
    if (!restoreEmail.includes('@') || restorePassword.length < 8) { showDialog({ title: 'Bilgileri kontrol et', message: 'Geçerli e-posta ve en az 8 karakterli parola gir.' }); return; }
    setRestoreBusy(true);
    try {
      await signIn(restoreEmail.trim(), restorePassword);
      setRestorePassword('');
      const remote = await pullSnapshot();
      if (!remote?.profile) { showDialog({ title: 'Yedek bulunamadı', message: 'Bu hesapta henüz bir plan yedeği yok.' }); return; }
      if (!(await persist(remote))) return;
      setCloudEmail(await currentUserEmail());
      showDialog({ title: 'Yedek geri yüklendi', message: 'Planın ve kayıtların bu cihaza alındı.' });
    } catch (error) {
      showDialog({ title: 'Giriş yapılamadı', message: error instanceof Error ? error.message : 'E-posta ve parolanı kontrol et.' });
    } finally { setRestoreBusy(false); }
  };

  const doClearLocal = () => showDialog({ title: 'Bu cihazdaki kayıtları sil?', message: cloudEmail ? 'Bu işlem yalnızca cihazdaki kopyayı siler. Bulut yedeği hesabında kalır.' : 'Bu işlem bırakma planını ve bu cihazdaki kayıtlarını siler.', actions: [
    { label: 'Vazgeç', onPress: () => {} },
    { label: 'Cihaz verisini sil', destructive: true, onPress: async () => {
      await cancelReminderForDataRemoval();
      await clearLocalState();
      dataRef.current = null;
      setData(null);
    } },
  ] });

  const exportData = async () => {
    try {
      const exportedAt = new Date();
      const fileName = `ilerleme-verilerim-${exportedAt.toISOString().replace(/[:.]/g, '-')}.json`;
      const content = createExportJson(data!, exportedAt);
      if (Platform.OS === 'web') {
        const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      }
      const file = new File(Paths.cache, fileName);
      await file.write(content);
      await Sharing.shareAsync(file.uri, { dialogTitle: 'İlerleme verilerimi paylaş', mimeType: 'application/json' });
    }
    catch { showDialog({ title: 'Dışa aktarılamadı', message: 'Biraz sonra tekrar deneyebilirsin.' }); }
  };

  const updateReminder = async (enabled: boolean, time = reminder.time) => {
    setReminderBusy(true);
    try {
      const next = enabled ? await configureDailyReminder(time) : await disableDailyReminder();
      setReminder(next);
      setReminderTime(next.time);
      showDialog({ title: enabled ? 'Hatırlatma açıldı' : 'Hatırlatma kapatıldı', message: enabled ? `Her gün ${time} saatinde cihazında hatırlatılacaksın.` : 'Daha önce planlanan hatırlatma iptal edildi.' });
    } catch (error) {
      showDialog({ title: 'Hatırlatma ayarlanamadı', message: error instanceof Error ? error.message : 'Cihaz ayarlarını kontrol edip tekrar deneyebilirsin.' });
    } finally { setReminderBusy(false); }
  };

  const cancelReminderForDataRemoval = async () => {
    try {
      const next = await disableDailyReminder();
      setReminder(next);
      setReminderTime(next.time);
    } catch { /* data removal must still complete if notification cleanup fails */ }
  };

  if (loading) return <View style={styles.loading}><StatusBar style="dark"/><Text style={styles.loadingMark}>✦</Text><Text style={styles.loadingText}>Küçük adımlar hazırlanıyor…</Text></View>;

  if (!profile || editing) return <DialogContext.Provider value={showDialog}><View style={{ flex: 1 }}><Onboarding name={onboardName} setName={setOnboardName} cigs={cigs} setCigs={setCigs} packPrice={packPrice} setPackPrice={setPackPrice} packSize={packSize} setPackSize={setPackSize} quitDate={quitDate} setQuitDate={setQuitDate} reason={reason} setReason={setReason} onSubmit={startPlan} onCancel={editing ? () => setEditing(false) : undefined} restoreEmail={restoreEmail} setRestoreEmail={setRestoreEmail} restorePassword={restorePassword} setRestorePassword={setRestorePassword} restoreBusy={restoreBusy} restoreCloud={restoreCloud}/><InAppDialog dialog={dialog} onClose={() => setDialog(null)}/></View></DialogContext.Provider>;

  if (panel === 'checkin') return <DialogContext.Provider value={showDialog}><View style={{ flex: 1 }}><CheckinFlow onClose={() => setPanel('idle')} onSelect={async (mood: string) => {
    if (!(await record('checkin', { mood }, localDateInput(new Date())))) return;
    setPanel('idle');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }}/><InAppDialog dialog={dialog} onClose={() => setDialog(null)}/></View></DialogContext.Provider>;

  if (panel !== 'idle') return <DialogContext.Provider value={showDialog}><View style={{ flex: 1 }}><UrgeFlow panel={panel} setPanel={setPanel} selected={selectedTool} setSelected={setSelectedTool} remaining={remaining} setRemaining={setRemaining} remainingRef={remainingRef} reason={profile?.reason} onComplete={completeCoping} onClose={closeUrge} onResult={(result: string) => record('urge_result', { result })}/><InAppDialog dialog={dialog} onClose={() => setDialog(null)}/></View></DialogContext.Provider>;

  return <DialogContext.Provider value={showDialog}><View style={styles.app}>
    <StatusBar style="dark"/>
    <View style={styles.topbar}>
      <View><Text style={styles.eyebrow}>BUGÜN · KENDİ ROTAN</Text><Text style={styles.topTitle}>{tab === 'home' ? 'Yuva' : tab === 'shelter' ? 'Sığınağın' : tab === 'progress' ? 'Rotan' : 'Ayarlar'}</Text></View>
      <View style={styles.pointsPill} accessible accessibilityLabel={`Biriktirdiğin ışık: ${coins}`}><Text style={{ color: C.gold, fontSize: 15 }} accessible={false}>✦</Text><Text style={styles.pointsText} accessible={false}>{coins} ışık</Text></View>
    </View>
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {tab === 'home' && <Home profile={profile} elapsed={elapsed!} quitStarted={quitStarted} hasLoggedSlip={hasLoggedSlip} cigarettesAvoided={cigarettesAvoided} savedEstimate={savedEstimate} checkedInToday={checkedInToday} openUrge={openUrge} checkIn={checkIn} logSlip={logSlip} onShelter={() => setTab('shelter')} onProgress={() => setTab('progress')}/>}
      {tab === 'shelter' && <Shelter coins={coins} builtPieces={builtPieces} checkIn={checkIn} checkedInToday={checkedInToday} openUrge={openUrge}/>}
      {tab === 'progress' && <Progress profile={profile} elapsed={elapsed!} quitStarted={quitStarted} hasLoggedSlip={hasLoggedSlip} cigarettesAvoided={cigarettesAvoided} savedEstimate={savedEstimate} events={data!.events} logSlip={logSlip} checkIn={checkIn} removeEvent={removeEvent}/>}
      {tab === 'settings' && <Settings profile={profile} reminder={reminder} reminderTime={reminderTime} setReminderTime={setReminderTime} reminderBusy={reminderBusy} updateReminder={updateReminder} email={email} setEmail={setEmail} password={password} setPassword={setPassword} authMode={authMode} setAuthMode={setAuthMode} authBusy={authBusy} syncing={syncing} cloudEmail={cloudEmail} syncIssue={syncIssue} retryCloudSync={retryCloudSync} connectCloud={connectCloud} doSignOut={doSignOut} doDeleteAccount={doDeleteAccount} doClearLocal={doClearLocal} exportData={exportData} onEdit={() => { setOnboardName(profile.name); setCigs(String(profile.cigarettesPerDay)); setPackPrice(String(profile.packPrice)); setPackSize(String(profile.packSize)); setQuitDate(localDateInput(planDate(profile.quitDate))); setReason(profile.reason ?? ''); setEditing(true); }}/ >}
    </ScrollView>
    <View style={styles.tabbar} accessibilityRole="tablist" accessibilityLabel="Ana gezinme">
      <TabButton icon="⌂" label="Yuva" active={tab === 'home'} onPress={() => setTab('home')}/>
      <TabButton icon="⌑" label="Sığınak" active={tab === 'shelter'} onPress={() => setTab('shelter')}/>
      <TabButton icon="↗" label="Rotam" active={tab === 'progress'} onPress={() => setTab('progress')}/>
      <TabButton icon="☼" label="Ben" active={tab === 'settings'} onPress={() => setTab('settings')}/>
    </View>
    <InAppDialog dialog={dialog} onClose={() => setDialog(null)}/>
  </View></DialogContext.Provider>;
}

type OnboardingProps = {
  name: string;
  setName: (value: string) => void;
  cigs: string;
  setCigs: (value: string) => void;
  packPrice: string;
  setPackPrice: (value: string) => void;
  packSize: string;
  setPackSize: (value: string) => void;
  quitDate: string;
  setQuitDate: (value: string) => void;
  reason: string;
  setReason: (value: string) => void;
  onSubmit: () => Promise<void>;
  onCancel?: () => void;
  restoreEmail: string;
  setRestoreEmail: (value: string) => void;
  restorePassword: string;
  setRestorePassword: (value: string) => void;
  restoreBusy: boolean;
  restoreCloud: () => Promise<void>;
};

function Onboarding({ name, setName, cigs, setCigs, packPrice, setPackPrice, packSize, setPackSize, quitDate, setQuitDate, reason, setReason, onSubmit, onCancel, restoreEmail, setRestoreEmail, restorePassword, setRestorePassword, restoreBusy, restoreCloud }: OnboardingProps) {
  const steps = onboardingSteps;
  const [step, setStep] = useState<OnboardingStep>(onCancel ? 'smoking' : 'welcome');
  const [showRestore, setShowRestore] = useState(false);
  const isEditing = Boolean(onCancel);
  const [draftReady, setDraftReady] = useState(Boolean(onCancel));
  useEffect(() => {
    if (onCancel) return;
    let active = true;
    const restoreDraft = async () => {
      try {
        const raw = await localStorage.getItem(ONBOARDING_DRAFT_KEY);
        if (!raw) return;
        const draft = JSON.parse(raw) as Record<string, unknown>;
        if (typeof draft.step === 'string' && steps.includes(draft.step as OnboardingStep)) setStep(draft.step as OnboardingStep);
        if (typeof draft.cigs === 'string' && draft.cigs.length <= 6) setCigs(draft.cigs);
        if (typeof draft.packPrice === 'string' && draft.packPrice.length <= 12) setPackPrice(draft.packPrice);
        if (typeof draft.packSize === 'string' && draft.packSize.length <= 4) setPackSize(draft.packSize);
        if (typeof draft.quitDate === 'string' && isValidLocalDate(draft.quitDate)) setQuitDate(draft.quitDate);
        if (typeof draft.reason === 'string' && draft.reason.length <= 240) setReason(draft.reason);
      } catch {
        try { await localStorage.removeItem(ONBOARDING_DRAFT_KEY); } catch { /* damaged draft is optional */ }
      } finally {
        if (active) setDraftReady(true);
      }
    };
    void restoreDraft();
    return () => { active = false; };
  }, [onCancel]);
  useEffect(() => {
    if (!draftReady || isEditing) return;
    const timeout = setTimeout(() => {
      const draft = { step, cigs, packPrice, packSize, quitDate, reason };
      void (async () => { try { await localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft)); } catch { /* draft recovery is best effort */ } })();
    }, 300);
    return () => clearTimeout(timeout);
  }, [draftReady, isEditing, step, cigs, packPrice, packSize, quitDate, reason]);
  const nextStep = () => setStep(steps[Math.min(steps.indexOf(step) + 1, steps.length - 1)]);
  const previousStep = () => setStep(steps[Math.max(steps.indexOf(step) - 1, 0)]);
  const smokingValid = !cigs.trim() || (Number.isFinite(Number(cigs.replace(',', '.'))) && Number(cigs.replace(',', '.')) >= 1 && Number(cigs.replace(',', '.')) <= 100);
  const costValid = (!packPrice.trim() && !packSize.trim()) || (Number(packPrice.replace(',', '.')) > 0 && Number(packPrice.replace(',', '.')) <= 10_000_000 && Number(packSize.replace(',', '.')) >= 1 && Number(packSize.replace(',', '.')) <= 100);
  const setupStep = steps.indexOf(step);
  const dateText = planDate(quitDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const proceed = () => {
    if (step === 'smoking' && !smokingValid) return setFormError('Günlük ortalama 1 ile 100 arasında olmalı. İstersen boş bırakıp sonra ekleyebilirsin.');
    if (step === 'spending' && !costValid) return setFormError('Paket fiyatı ve sigara adedini birlikte doldur veya ikisini de boş bırak.');
    if (step === 'quitDate' && !isValidLocalDate(quitDate)) return setFormError('Geçerli bir bırakma günü seç.');
    setFormError('');
    nextStep();
  };
  const [formError, setFormError] = useState('');
  if (isEditing) return <KeyboardAvoidingView style={styles.app} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <StatusBar style="dark"/>
    <View style={styles.onboardingShell}>
      <View style={styles.onboardingHeader}><Pressable onPress={onCancel} accessibilityRole="button" accessibilityLabel="Ayarlarıma dön" style={styles.onboardingNav}><Text style={styles.onboardingBack}>‹  Ayarlarıma dön</Text></Pressable><Text style={styles.onboardingStepCount}>PLAN AYARLARI</Text></View>
      <ScrollView style={styles.onboardingScroll} contentContainerStyle={styles.onboardingContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.onboardingEyebrow}>KİŞİSEL PLANIN</Text><Text style={styles.onboardingTitle}>Bilgilerini güncelle.</Text><Text style={styles.onboardingSubtitle}>Tüm plan alanların burada. Değişiklikleri kaydetmeden önce kontrol edebilirsin.</Text>
        <Card style={styles.onboardingQuestionCard}><Text style={styles.onboardingInputLabel}>GÜNLÜK SİGARA ORTALAMASI</Text><View style={styles.onboardingNumberRow}><TextInput value={cigs} onChangeText={setCigs} keyboardType="decimal-pad" returnKeyType="done" accessibilityLabel="Günde içilen sigara sayısı" placeholder="Örn. 10" placeholderTextColor={C.faint} style={styles.onboardingNumberInput}/><Text style={styles.onboardingInputUnit}>sigara / gün</Text></View><Text style={styles.onboardingFieldHint}>İlerleme tahmini için kullanılır. İstersen boş bırak.</Text></Card>
        <Card style={styles.onboardingQuestionCard}><Text style={styles.onboardingInputLabel}>PAKET FİYATI</Text><View style={styles.onboardingNumberRow}><Text style={styles.onboardingCurrency}>₺</Text><TextInput value={packPrice} onChangeText={setPackPrice} keyboardType="decimal-pad" returnKeyType="done" accessibilityLabel="Bir paket sigara fiyatı" placeholder="Örn. 100" placeholderTextColor={C.faint} style={styles.onboardingNumberInput}/></View><View style={styles.onboardingDivider}/><Text style={styles.onboardingInputLabel}>PAKETTEKİ SİGARA ADEDİ</Text><View style={styles.onboardingNumberRow}><TextInput value={packSize} onChangeText={setPackSize} keyboardType="number-pad" returnKeyType="done" accessibilityLabel="Bir paketteki sigara adedi" placeholder="Örn. 20" placeholderTextColor={C.faint} style={styles.onboardingNumberInput}/><Text style={styles.onboardingInputUnit}>adet</Text></View><Text style={styles.onboardingFieldHint}>Tasarruf hesabı için iki alanı birlikte doldur.</Text></Card>
        <Card style={styles.onboardingQuestionCard}><Text style={styles.onboardingInputLabel}>BIRAKMA TARİHİ</Text>{Platform.OS === 'web' ? <TextInput value={quitDate} onChangeText={setQuitDate} placeholder="YYYY-AA-GG" accessibilityLabel="Bırakma tarihi" style={styles.onboardingDateWeb}/> : Platform.OS === 'ios' ? <View style={styles.onboardingNativeDate}><DateTimePicker value={planDate(quitDate)} mode="date" display="compact" locale="tr-TR" onValueChange={(_, date) => setQuitDate(localDateInput(date))}/></View> : <Pressable accessibilityRole="button" accessibilityLabel={`Bırakma tarihini seç: ${dateText}`} onPress={() => DateTimePickerAndroid.open({ value: planDate(quitDate), mode: 'date', display: 'calendar', onValueChange: (_, date) => setQuitDate(localDateInput(date)) })} style={styles.onboardingDateButton}><Text style={styles.onboardingDateText}>{dateText}</Text><Text style={styles.datePickerIcon}>▦</Text></Pressable>}</Card>
        <Card style={styles.onboardingQuestionCard}><Text style={styles.onboardingInputLabel}>KENDİ NEDENİN (İSTEĞE BAĞLI)</Text><TextInput value={reason} onChangeText={setReason} placeholder="Örneğin: Daha özgür hissetmek…" placeholderTextColor={C.faint} multiline maxLength={240} textAlignVertical="top" accessibilityLabel="Bırakma nedenin" style={styles.onboardingReasonInput}/><Text style={styles.onboardingFieldHint}>En fazla 240 karakter</Text></Card>
        {formError ? <Text accessibilityRole="alert" style={styles.inlineError}>{formError}</Text> : null}
      </ScrollView>
      <View style={styles.onboardingFooter}><Button title="Değişiklikleri kaydet" onPress={() => { if (!smokingValid) setFormError('Günlük ortalama 1 ile 100 arasında olmalı. Boş bırakabilirsin.'); else if (!costValid) setFormError('Paket fiyatı ve adedi birlikte doldurulmalı ya da ikisi boş bırakılmalı.'); else if (!isValidLocalDate(quitDate)) setFormError('Geçerli bir bırakma günü seç.'); else { setFormError(''); void onSubmit(); } }}/></View>
    </View>
  </KeyboardAvoidingView>;
  return <KeyboardAvoidingView style={styles.app} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <StatusBar style="dark"/>
    <View style={styles.onboardingShell}>
      <View style={styles.onboardingHeader}>
        {isEditing ? <Pressable onPress={onCancel} accessibilityRole="button" accessibilityLabel="Plan düzenlemeyi kapat" style={styles.onboardingNav}><Text style={styles.onboardingBack}>‹  Ayarlarıma dön</Text></Pressable> : setupStep === 0 ? <Text style={styles.onboardingBrand}>YENİ BİR BAŞLANGIÇ</Text> : <Pressable onPress={previousStep} accessibilityRole="button" accessibilityLabel="Önceki kurulum adımına dön" style={styles.onboardingNav}><Text style={styles.onboardingBack}>‹  Geri</Text></Pressable>}
        {!isEditing && <Text style={styles.onboardingStepCount}>{step === 'welcome' ? 'BAŞLANGIÇ' : `ADIM ${setupStep} / 5`}</Text>}
      </View>
      {!isEditing && <View accessibilityRole="progressbar" accessibilityLabel={`Kurulum adımı ${setupStep} / 5`} style={styles.onboardingProgress}><View style={[styles.onboardingProgressFill, { width: `${Math.max(0, setupStep) / 5 * 100}%` }]}/></View>}
      <ScrollView key={step} style={styles.onboardingScroll} contentContainerStyle={styles.onboardingContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {formError ? <Text accessibilityRole="alert" style={styles.inlineError}>{formError}</Text> : null}
        {step === 'welcome' && <>
          <View style={styles.onboardingHero}><FoxMascot size={112}/><Text style={styles.onboardingHeroTitle}>Bırakma yolun{ '\n' }sana ait.</Text><Text style={[styles.onboardingSubtitle, { textAlign: 'center' }]}>Her şeyi bugün çözmek zorunda değilsin. Sana iyi gelecek bir sonraki küçük adımı bulmana yardım edeceğiz.</Text></View>
          <View style={styles.onboardingFeature}><Text style={styles.onboardingFeatureIcon}>≈</Text><View style={{ flex: 1 }}><Text style={styles.onboardingFeatureTitle}>İstek geldiğinde yanında</Text><Text style={styles.onboardingFeatureCopy}>Kısa, uygulanabilir baş etme araçları.</Text></View></View>
          <View style={styles.onboardingFeature}><Text style={styles.onboardingFeatureIcon}>⌂</Text><View style={{ flex: 1 }}><Text style={styles.onboardingFeatureTitle}>Kendi sığınağını kur</Text><Text style={styles.onboardingFeatureCopy}>Küçük adımlarınla yaşayan bir alan.</Text></View></View>
          <View style={styles.onboardingFeature}><Text style={styles.onboardingFeatureIcon}>↺</Text><View style={{ flex: 1 }}><Text style={styles.onboardingFeatureTitle}>Yolun kesilmez</Text><Text style={styles.onboardingFeatureCopy}>Bir kayma önceki emeğini silmez.</Text></View></View>
          <Text style={styles.onboardingPrivacy}>Hesap açman gerekmez. Planın önce bu cihazda saklanır.</Text>
        </>}
        {step === 'smoking' && <>
          <Text style={styles.onboardingEyebrow}>{isEditing ? 'PLANINI DÜZENLE' : 'ADIM 1 · BAŞLANGIÇ NOKTAN'}</Text><Text style={styles.onboardingTitle}>Günde yaklaşık kaç sigara içiyorsun?</Text><Text style={styles.onboardingSubtitle}>Yaklaşık bir sayı yeterli. Bu bilgi, kişisel ilerleme tahminini oluşturur.</Text>
          <Card style={styles.onboardingQuestionCard}><Text style={styles.onboardingInputLabel}>GÜNLÜK ORTALAMA</Text><View style={styles.onboardingNumberRow}><TextInput value={cigs} onChangeText={setCigs} keyboardType="decimal-pad" returnKeyType="done" accessibilityLabel="Günde içilen sigara sayısı" placeholder="Örn. 10" placeholderTextColor={C.faint} style={styles.onboardingNumberInput}/><Text style={styles.onboardingInputUnit}>sigara / gün</Text></View><Text style={styles.onboardingFieldHint}>Yaklaşık değer yeterli; bu alanı daha sonra da doldurabilirsin.</Text></Card>
          <Text style={styles.onboardingPrivacy}>Bu sayı yalnızca kişisel tahminler içindir ve planından değiştirilebilir.</Text>
        </>}
        {step === 'spending' && <>
          <Text style={styles.onboardingEyebrow}>ADIM 2 · İSTEĞE BAĞLI</Text><Text style={styles.onboardingTitle}>Tasarrufunu da takip edelim mi?</Text><Text style={styles.onboardingSubtitle}>Paket fiyatını bilirsen yaklaşık tasarrufunu gösterebiliriz. Emin değilsen bu adımı geçebilirsin.</Text>
          <Card style={styles.onboardingQuestionCard}><Text style={styles.onboardingInputLabel}>PAKET FİYATI</Text><View style={styles.onboardingNumberRow}><Text style={styles.onboardingCurrency}>₺</Text><TextInput value={packPrice} onChangeText={setPackPrice} keyboardType="decimal-pad" returnKeyType="done" accessibilityLabel="Bir paket sigara fiyatı" placeholder="Örn. 100" placeholderTextColor={C.faint} style={styles.onboardingNumberInput}/></View><Text style={styles.onboardingFieldHint}>Kullandığın para birimi: Türk lirası</Text><View style={styles.onboardingDivider}/><Text style={styles.onboardingInputLabel}>PAKETTE KAÇ SİGARA VAR?</Text><View style={styles.onboardingNumberRow}><TextInput value={packSize} onChangeText={setPackSize} keyboardType="number-pad" returnKeyType="done" accessibilityLabel="Bir paketteki sigara adedi" placeholder="Örn. 20" placeholderTextColor={C.faint} style={styles.onboardingNumberInput}/><Text style={styles.onboardingInputUnit}>adet</Text></View></Card>
        </>}
        {step === 'quitDate' && <>
          <Text style={styles.onboardingEyebrow}>ADIM 3 · KENDİ ZAMANIN</Text><Text style={styles.onboardingTitle}>Bırakma gününü seç.</Text><Text style={styles.onboardingSubtitle}>Bugün başlayabilir ya da hazırlanmak için kendine bir tarih belirleyebilirsin. Bu kararı daha sonra değiştirebilirsin.</Text>
          <Card style={styles.onboardingQuestionCard}><Text style={styles.onboardingInputLabel}>BAŞLANGIÇ TARİHİ</Text>{Platform.OS === 'web' ? <TextInput value={quitDate} onChangeText={setQuitDate} placeholder="YYYY-AA-GG" accessibilityLabel="Bırakma tarihi" style={styles.onboardingDateWeb}/> : Platform.OS === 'ios' ? <View style={styles.onboardingNativeDate}><DateTimePicker value={planDate(quitDate)} mode="date" display="compact" locale="tr-TR" onValueChange={(_, date) => setQuitDate(localDateInput(date))}/></View> : <Pressable accessibilityRole="button" accessibilityLabel={`Bırakma tarihini seç: ${dateText}`} onPress={() => DateTimePickerAndroid.open({ value: planDate(quitDate), mode: 'date', display: 'calendar', onValueChange: (_, date) => setQuitDate(localDateInput(date)) })} style={styles.onboardingDateButton}><Text style={styles.onboardingDateText}>{dateText}</Text><Text style={styles.datePickerIcon}>▦</Text></Pressable>}<Text style={styles.onboardingFieldHint}>Takvimden dilediğin günü seçebilirsin.</Text></Card>
          <Pressable onPress={() => setQuitDate(localDateInput(new Date()))} accessibilityRole="button" accessibilityLabel="Bırakma gününü bugün olarak ayarla" style={styles.onboardingQuickChoice}><Text style={styles.onboardingQuickChoiceText}>Bugün başlamak istiyorum</Text></Pressable>
        </>}
        {step === 'reason' && <>
          <Text style={styles.onboardingEyebrow}>ADIM 4 · KENDİ NEDENİN</Text><Text style={styles.onboardingTitle}>Bırakma kararın sana ne ifade ediyor?</Text><Text style={styles.onboardingSubtitle}>İstersen kısa bir not ekle. Zorlandığın bir anda sana kendi nedenini hatırlatabiliriz.</Text>
          <Card style={styles.onboardingQuestionCard}><Text style={styles.onboardingInputLabel}>KENDİNE NOTUN</Text><TextInput value={reason} onChangeText={setReason} placeholder="Örneğin: Daha özgür hissetmek…" placeholderTextColor={C.faint} multiline maxLength={240} textAlignVertical="top" accessibilityLabel="Bırakma nedenin" style={styles.onboardingReasonInput}/><Text style={styles.onboardingFieldHint}>İsteğe bağlı · en fazla 240 karakter</Text></Card>
        </>}
        {step === 'summary' && <>
          <Text style={styles.onboardingEyebrow}>ADIM 5 / 5 · HAZIR</Text><Text style={styles.onboardingTitle}>{name?.trim() ? `${name.trim()}, planın hazır.` : 'İlk adımın hazır.'}</Text><Text style={styles.onboardingSubtitle}>İstediğin zaman plan bilgilerini ayarlardan düzenleyebilirsin.</Text>
          <Card style={styles.onboardingSummaryCard}><SummaryRow label="Günlük ortalama" value={cigs ? `${cigs} sigara` : 'Şimdilik eklenmedi'}/><SummaryRow label="Bırakma günü" value={dateText}/><SummaryRow label="Tasarruf hesabı" value={Number(packPrice) > 0 && Number(packSize) > 0 ? `${money(Number(packPrice), 'TRY')} / ${packSize} adet` : 'Şimdilik eklenmedi'}/>{reason.trim() ? <View style={styles.onboardingSummaryReason}><Text style={styles.onboardingInputLabel}>SANA ÖZEL NOT</Text><Text style={styles.onboardingSummaryNote}>“{reason.trim()}”</Text></View> : null}</Card>
          <Text style={styles.onboardingPrivacy}>Planın bu cihazda saklanır. Hesap ve bulut eşitlemesi isteğe bağlıdır.</Text>
          {showRestore && <Card style={styles.onboardingRestoreCard}><Text style={styles.cardTitle}>Yedekten devam et</Text><Text style={styles.cardBody}>Supabase hesabınla giriş yaparak önceki planını al.</Text><TextInput value={restoreEmail} onChangeText={setRestoreEmail} placeholder="E-posta" accessibilityLabel="Hesap e-posta adresi" autoCapitalize="none" keyboardType="email-address" style={styles.input}/><TextInput value={restorePassword} onChangeText={setRestorePassword} placeholder="Parola" accessibilityLabel="Hesap parolası" secureTextEntry style={styles.input}/><Button title={restoreBusy ? 'Geri yükleniyor…' : 'Giriş yap ve yedeği al'} disabled={restoreBusy} onPress={restoreCloud}/></Card>}
          {!isEditing && <Pressable onPress={() => setShowRestore((value) => !value)} accessibilityRole="button" accessibilityLabel={showRestore ? 'Yedek girişini kapat' : 'Mevcut hesabından yedeğini geri yükle'} accessibilityState={{ expanded: showRestore }} style={styles.onboardingRestoreToggle}><Text style={styles.mutedLink}>{showRestore ? 'Yedek girişini kapat' : 'Zaten hesabın var mı? Yedeğini geri yükle'}</Text></Pressable>}
          <Text style={styles.disclaimer}>Uygulama öz yönetim desteği sunar; sağlık profesyonelinin önerilerinin veya tedavinin yerine geçmez.</Text>
        </>}
      </ScrollView>
      <View style={styles.onboardingFooter}>
        {step === 'welcome' ? <Button title="Küçük adımlarla başla" onPress={nextStep}/> : step === 'summary' ? <Button title={isEditing ? 'Değişiklikleri kaydet' : 'Planımı oluştur'} onPress={onSubmit}/> : step === 'spending' || step === 'reason' ? <><Button title="Devam et" onPress={proceed}/>{!isEditing && <Pressable onPress={() => { if (step === 'spending') { setPackPrice(''); setPackSize(''); } else setReason(''); nextStep(); }} accessibilityRole="button" accessibilityLabel="Bu isteğe bağlı adımı atla" style={styles.onboardingFooterSkip}><Text style={styles.onboardingSkipText}>Bu adımı atla</Text></Pressable>}</> : step === 'smoking' ? <><Button title="Devam et" onPress={proceed}/>{!isEditing && !cigs.trim() && <Pressable onPress={nextStep} accessibilityRole="button" accessibilityLabel="Sigara miktarını daha sonra doldur" style={styles.onboardingFooterSkip}><Text style={styles.onboardingSkipText}>Bu alanı daha sonra doldur</Text></Pressable>}</> : <Button title="Devam et" onPress={proceed}/>}
        {!isEditing && <Text style={styles.onboardingFooterHint}>{step === 'welcome' ? 'Yaklaşık 1 dakika · Adımlarını istediğin zaman değiştirebilirsin' : step === 'summary' ? 'Hesap açmadan kullanmaya başlayabilirsin' : 'İlerleme kaydedilir · Dilediğinde geri dönebilirsin'}</Text>}
      </View>
    </View>
  </KeyboardAvoidingView>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.onboardingSummaryRow}><Text style={styles.onboardingSummaryLabel}>{label}</Text><Text style={styles.onboardingSummaryValue}>{value}</Text></View>;
}

function InAppDialog({ dialog, onClose }: { dialog: DialogState; onClose: () => void }) {
  const actions = dialog?.actions?.length ? dialog.actions : [{ label: 'Tamam', onPress: () => {} }];
  return <Modal transparent visible={Boolean(dialog)} animationType="fade" onRequestClose={onClose}>
    <View style={styles.dialogBackdrop}>
      <View style={styles.dialogCard} accessibilityRole="alert" accessibilityViewIsModal>
        <Text style={styles.dialogTitle}>{dialog?.title}</Text>
        <Text style={styles.dialogMessage}>{dialog?.message}</Text>
        <View style={styles.dialogActions}>{actions.map((action, index) => <Pressable key={action.label} onPress={() => { onClose(); action.onPress(); }} accessibilityRole="button" style={[styles.dialogButton, index === 0 && actions.length > 1 ? styles.dialogButtonSecondary : action.destructive ? styles.dialogButtonDanger : styles.dialogButtonPrimary]}><Text style={index === 0 && actions.length > 1 ? styles.dialogButtonSecondaryText : styles.dialogButtonText}>{action.label}</Text></Pressable>)}</View>
      </View>
    </View>
  </Modal>;
}

type HomeProps = {
  profile: Profile;
  elapsed: ElapsedDuration;
  quitStarted: boolean;
  hasLoggedSlip: boolean;
  cigarettesAvoided: number;
  savedEstimate: number | null;
  checkedInToday: boolean;
  openUrge: () => void;
  checkIn: () => Promise<void>;
  logSlip: () => void;
  onShelter: () => void;
  onProgress: () => void;
};

function Home({ profile, elapsed, quitStarted, hasLoggedSlip, cigarettesAvoided, savedEstimate, checkedInToday, openUrge, checkIn, logSlip, onShelter, onProgress }: HomeProps) {
  return <>
    <View style={styles.hero}>
      <View style={styles.heroDecorA}/><View style={styles.heroDecorB}/>
      <View style={styles.heroHeader}><View style={styles.dayChip}><View style={styles.greenDot}/><Text style={styles.dayChipText}>{quitStarted ? hasLoggedSlip ? 'Son sigara kaydından beri' : 'Kendi yolunda' : 'Bırakma günün yaklaşıyor'}</Text></View><Text style={styles.heroSymbol}>✧</Text></View>
      <View style={styles.heroMiddle}><View><Text style={styles.heroSmall}>{quitStarted ? hasLoggedSlip ? 'SON SİGARA KAYDINDAN BERİ' : 'YOLCULUĞUN BAŞLAYALI' : 'BAŞLANGICA KALAN SÜRE'}</Text><Text style={styles.heroNumber}>{elapsed.days}<Text style={styles.heroUnit}> gün</Text></Text><Text style={styles.heroSub}>{elapsed.hours} saat · {elapsed.minutes} dakika</Text></View><FoxMascot size={90}/></View>
      <View style={styles.heroBottom}><Text style={styles.heroBottomText}>{quitStarted ? 'Bugün kendin için yeni bir alan açtın.' : `${localDateInput(planDate(profile.quitDate))} için kendine bir başlangıç seçtin.`}</Text><Pressable onPress={onShelter} accessibilityRole="button" accessibilityLabel="Sığınağını gör"><Text style={styles.heroLink}>Sığınağı gör →</Text></Pressable></View>
    </View>

    <View style={styles.statsRow}>
      <Card style={styles.statCard}><Text style={styles.statIcon}>◌</Text><Text style={styles.statLabel}>İÇİLMEYEN TAHMİNİ</Text><Text style={styles.statValue}>{profile.cigarettesPerDay > 0 ? cigarettesAvoided : '—'}</Text><Text style={styles.statFoot}>{profile.cigarettesPerDay > 0 ? 'adet · yaklaşık' : 'Günlük miktarı ekleyince hesaplanır'}</Text></Card>
      <Card style={styles.statCard}><Text style={styles.statIcon}>₺</Text><Text style={styles.statLabel}>CEBİNDE KALAN</Text><Text style={styles.statValue}>{savedEstimate === null ? '—' : money(savedEstimate, profile.currency)}</Text><Text style={styles.statFoot}>{savedEstimate === null ? 'Paket bilgisini eklersen hesaplanır' : 'kendi girdilerine göre'}</Text></Card>
    </View>

    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Şu an nasıl hissediyorsun?</Text><Text style={styles.sectionAside}>1 dakikadan kısa</Text></View>
    <Pressable onPress={openUrge} accessibilityRole="button" accessibilityLabel="İstek geldi. Bir destek aracı seç." style={({ pressed }) => [styles.urgeCard, pressed && styles.pressed]}>
      <View style={styles.urgeIcon}><Text style={{ color: C.orange, fontSize: 23 }}>≈</Text></View>
      <View style={{ flex: 1 }}><Text style={styles.urgeTitle}>İstek geldi</Text><Text style={styles.urgeDesc}>Küçük bir sonraki adımı birlikte seçelim.</Text></View><Text style={styles.chevron}>›</Text>
    </Pressable>

    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Bugünün küçük adımı</Text><Text style={styles.sectionAside}>Baskı yok</Text></View>
    <Card style={styles.checkinCard}>
      <View style={styles.checkinTop}><View style={styles.checkinIcon}><Text style={{ fontSize: 19, color: C.green }}>•</Text></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{checkedInToday ? 'Bugün kendin için buradaydın' : 'Kendine kısa bir check-in yap'}</Text><Text style={styles.cardBody}>İstersen nasıl geçtiğini kaydet. Atlamak da sorun değil.</Text></View></View>
      <Button title={checkedInToday ? 'Bugün kaydedildi ✓' : 'Günümü kaydet'} kind="secondary" onPress={checkIn}/>
    </Card>

    <Pressable onPress={onProgress} accessibilityRole="button" accessibilityLabel="Bugün sigara içtiysen yargılanmadan kaydet" style={styles.slipLink}><Text style={styles.slipText}>Bugün sigara içtiysen </Text><Text style={styles.slipAction}>kaydet, yargı yok</Text><Text style={{ color: C.faint }}> →</Text></Pressable>
    <View style={styles.supportNote}><Text style={styles.supportMark}>i</Text><Text style={styles.supportText}>Bırakma desteği almak istersen bulunduğun yerdeki sağlık profesyoneline başvurabilirsin. Türkiye’de ALO 171 sigara bırakma danışma hattı hakkında bilgi ayarlarda.</Text></View>
  </>;
}

type UrgeFlowProps = {
  panel: Panel;
  setPanel: (panel: Panel) => void;
  selected: CopingChoice;
  setSelected: (choice: CopingChoice) => void;
  remaining: number;
  setRemaining: (seconds: number) => void;
  remainingRef: { current: number };
  reason?: string;
  onComplete: () => Promise<void>;
  onClose: () => void;
  onResult: (result: string) => Promise<boolean>;
};

function UrgeFlow({ panel, setPanel, selected, setSelected, remaining, setRemaining, remainingRef, reason, onComplete, onClose, onResult }: UrgeFlowProps) {
  const showDialog = useContext(DialogContext);
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const finish = async () => { await onComplete(); };
  return <View style={styles.urgeScreen}>
    <StatusBar style="dark"/>
    <View style={styles.urgeNav}><Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="İstek aracını kapat" style={styles.backButtonHit}><Text style={styles.backButton}>‹</Text></Pressable><Text style={styles.urgeNavTitle}>İstek anı</Text><View style={{ width: 44 }}/></View>
    <ScrollView contentContainerStyle={styles.urgeContent}>
      {panel === 'tool' && <>
        <FoxMascot size={100}/>
        <Text style={styles.urgeHeadline}>Şu an bir sonraki küçük adımı seç.</Text>
        <Text style={styles.bodyCopy}>Bu anı hemen çözmek zorunda değilsin. Sana uygun bir araç seçebilir ya da nedenlerini hatırlayabilirsin.</Text>
        {copingChoices.map((item) => <Pressable key={item.id} onPress={() => { setSelected(item); remainingRef.current = item.minutes * 60; setRemaining(item.minutes * 60); setPanel('timer'); }} accessibilityRole="button" accessibilityLabel={`${item.title}. ${item.detail} ${item.minutes} dakika.`} style={styles.toolChoice}>
          <View style={styles.toolIcon}><Text style={{ fontSize: 20, color: C.green }}>{item.icon}</Text></View><View style={{ flex: 1 }}><Text style={styles.toolTitle}>{item.title}</Text><Text style={styles.toolDetail}>{item.detail}</Text></View><Text style={styles.chevron}>›</Text>
        </Pressable>)}
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="İstek aracını şimdi kapat" style={{ minHeight: 48, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }}><Text style={styles.mutedLink}>Şimdi değil</Text></Pressable>
      </>}
      {panel === 'timer' && <>
        <Text style={styles.eyebrow}>{selected.title.toLocaleUpperCase('tr-TR')}</Text>
        <Text style={styles.urgeHeadline}>Sadece bu ana odaklan.</Text>
        <View style={styles.timerFace} accessible accessibilityLabel={`${mins} dakika ${secs} saniye kaldı`}><View style={styles.timerRing} accessible={false}><Text style={styles.timerText} accessible={false}>{mins}:{secs}</Text><Text style={styles.timerLabel} accessible={false}>kendine ayırdığın süre</Text></View></View>
        <Text style={[styles.bodyCopy, { textAlign: 'center' }]}>{selected.id === 'breath' ? 'Rahat ettiğin bir ritimde nefes al. Saymak zorunda değilsin; istediğin an durabilirsin.' : selected.id === 'reasons' ? (reason ? `“${reason}”` : 'Kendine bu kararı neden verdiğini düşünmek için birkaç sakin an ver.') : selected.detail}</Text>
        <Button title="Bu adımı tamamladım" onPress={finish}/>
        <Button title="Başka bir araç seç" kind="quiet" onPress={() => setPanel('tool')}/>
      </>}
      {panel === 'done' && <>
        <View style={styles.doneBadge}><Text style={{ fontSize: 42, color: C.green }}>✦</Text></View>
        <Text style={styles.urgeHeadline}>Bu an için kendine alan açtın.</Text>
        <Text style={styles.bodyCopy}>İstek şimdi nasıl?</Text>
        <View style={styles.feelingRow}>{['Azaldı', 'Aynı', 'Geri geldi'].map((item) => <Pressable key={item} onPress={() => { recordUrgeResult(item); }} accessibilityRole="button" accessibilityLabel={`İstek ${item.toLocaleLowerCase('tr-TR')}`} style={styles.feelingChip}><Text style={styles.feelingText}>{item}</Text></Pressable>)}</View>
        <Button title="Ana ekrana dön" onPress={onClose}/>
      </>}
    </ScrollView>
  </View>;

  async function recordUrgeResult(result: string) {
    await onComplete();
    if (!(await onResult(result))) return;
    showDialog({ title: 'Not edildi', message: `“${result}” olarak kaydedildi. İstekler zamanla değişebilir; bir sonraki adım sana ait.` });
    onClose();
  }
}

function CheckinFlow({ onClose, onSelect }: { onClose: () => void; onSelect: (mood: string) => void }) {
  return <View style={styles.urgeScreen}>
    <StatusBar style="dark"/>
    <View style={styles.urgeNav}><Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Check-in ekranını kapat" style={styles.backButtonHit}><Text style={styles.backButton}>‹</Text></Pressable><Text style={styles.urgeNavTitle}>Kısa check-in</Text><View style={{ width: 44 }}/></View>
    <View style={styles.checkinFlowContent}>
      <View style={styles.doneBadge}><Text style={{ fontSize: 36, color: C.green }}>✳</Text></View>
      <Text style={styles.urgeHeadline}>Şu an nasıl hissediyorsun?</Text>
      <Text style={[styles.bodyCopy, { textAlign: 'center' }]}>Burada doğru ya da yanlış cevap yok. İstersen seçimini kaydet, istersen atla.</Text>
      {['İyi', 'Karışık', 'Zor'].map((mood) => <Pressable key={mood} onPress={() => onSelect(mood)} accessibilityRole="button" accessibilityLabel={`Bugün ${mood.toLocaleLowerCase('tr-TR')} hissediyorum`} style={styles.moodChoice}><Text style={styles.moodChoiceText}>{mood}</Text><Text style={styles.chevron}>›</Text></Pressable>)}
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Check-in adımını atla" style={{ minHeight: 48, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' }}><Text style={styles.mutedLink}>Atla</Text></Pressable>
    </View>
  </View>;
}

function Shelter({ coins, builtPieces, checkIn, checkedInToday, openUrge }: { coins: number; builtPieces: number; checkIn: () => Promise<void>; checkedInToday: boolean; openUrge: () => void }) {
  const pieces = ['Sığınak temeli', 'Sıcak ışıklar', 'Dinlenme köşesi', 'Pencere', 'Yeşil köşe', 'Kitaplık'];
  const nextThreshold = Math.min(12, (builtPieces + 1) * 2);
  const lightsToNext = Math.max(0, nextThreshold - coins);
  return <>
    <View style={styles.shelterHero}><View style={styles.shelterSky}><Text style={styles.shelterStar1}>✦</Text><Text style={styles.shelterStar2}>·</Text><Text style={styles.shelterStar3}>✧</Text><View style={styles.moon}/><View style={styles.hillBack}/><View style={styles.hillFront}/><View style={styles.den}><View style={styles.denRoof}/><View style={styles.denBody}/><View style={styles.denDoor}/><View style={styles.denWindow}/></View><View style={styles.shelterMascot}><FoxMascot size={74}/></View></View>
      <Text style={styles.shelterTitle}>Sığınağın, adım adım</Text><Text style={styles.shelterCaption}>Işıklar küçük adımlarının kaydı. Her 2 ışık yeni bir parçayı açar. Kayma, kurduğun alanı veya biriktirdiklerini silmez.</Text><View style={styles.shelterProgress} accessibilityRole="progressbar" accessibilityLabel="Sığınak parçalarının ilerlemesi" accessibilityValue={{ min: 0, max: pieces.length, now: builtPieces, text: `${builtPieces} / ${pieces.length} parça açıldı` }}><View style={[styles.shelterProgressFill, { width: `${Math.min(100, builtPieces / pieces.length * 100)}%` as DimensionValue }]}/></View><Text style={styles.shelterCount}>{builtPieces} / {pieces.length} parça açık · {coins} ışık biriktirdin</Text>
    </View>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Sıradaki adım</Text><Text style={styles.sectionAside}>{builtPieces === pieces.length ? 'Sığınak tamamlandı' : `${lightsToNext} ışık kaldı`}</Text></View>
    <Card style={styles.nextPieceCard}><View style={[styles.pieceArt, styles.pieceUnlocked]}><Text style={{ fontSize: 25, color: C.orange }}>{builtPieces === pieces.length ? '⌂' : ['⌂', '☼', '◡', '□', '❋', '▤'][builtPieces]}</Text></View><View style={{ flex: 1, marginLeft: 13 }}><Text style={styles.cardTitle}>{builtPieces === pieces.length ? 'Sığınağın tamamlandı' : pieces[builtPieces]}</Text><Text style={styles.cardBody}>{builtPieces === pieces.length ? 'Bütün alanı küçük adımlarla kurdun.' : `${nextThreshold} ışıkta açılır · ${lightsToNext} ışık daha`}</Text></View></Card>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Sığınak parçaları</Text><Text style={styles.sectionAside}>Her biri 2 ışık</Text></View>
    <View style={styles.piecesGrid}>{pieces.map((piece, i) => <Card key={piece} style={styles.pieceCard}><View style={[styles.pieceArt, i < builtPieces ? styles.pieceUnlocked : styles.pieceLocked]}><Text style={{ fontSize: 24, color: i < builtPieces ? C.orange : C.faint }}>{i < builtPieces ? ['⌂', '☼', '◡', '□', '❋', '▤'][i] : '·'}</Text></View><Text style={styles.pieceName}>{piece}</Text><Text style={styles.pieceCost}>{i < builtPieces ? 'Açıldı' : `${(i + 1) * 2} ışık`}</Text></Card>)}</View>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Işık nasıl kazanılır?</Text></View>
    <Card><Text style={styles.cardTitle}>Check-in veya baş etme denemesi</Text><Text style={styles.cardBody}>Günün ilk check-in’i 1 ışık kazandırır. Tamamladığın her ayrı destek oturumu da 1 ışık kazandırır. Aynı oturum tekrar sayılmaz; kayma ışıklarını azaltmaz.</Text><Button title={checkedInToday ? 'Bugünkü check-in tamam' : 'Check-in yap · 1 ışık'} kind="secondary" onPress={checkIn}/><Button title="İstek geldi · destek oturumu" kind="primary" onPress={openUrge}/></Card>
  </>;
}

function Progress({ profile, elapsed, quitStarted, hasLoggedSlip, cigarettesAvoided, savedEstimate, events, logSlip, checkIn, removeEvent }: { profile: Profile; elapsed: ElapsedDuration; quitStarted: boolean; hasLoggedSlip: boolean; cigarettesAvoided: number; savedEstimate: number | null; events: ProgressEvent[]; logSlip: () => void; checkIn: () => Promise<void>; removeEvent: (event: ProgressEvent) => void }) {
  const recent = events.slice(0, 8);
  return <>
    <Card style={styles.progressHero}><Text style={styles.eyebrow}>{quitStarted ? hasLoggedSlip ? 'SON SİGARA KAYDINDAN BERİ' : 'SENİN YOLCULUĞUN' : 'BAŞLANGIÇ PLANIN'}</Text><Text style={styles.progressDay}>{elapsed.days}<Text style={{ fontSize: 21 }}> gün</Text></Text><Text style={styles.cardBody}>{quitStarted ? 'Sayaç, son sigara kaydından sonra yeniden başlar. Önceki ilerlemen ve sığınak adımların korunur.' : `${localDateInput(planDate(profile.quitDate))} günü için bir başlangıç planladın. Hazır olduğunda bu tarihi ayarlardan değiştirebilirsin.`}</Text></Card>
    <View style={styles.statsRow}><Card style={styles.statCard}><Text style={styles.statLabel}>İÇİLMEYEN TAHMİNİ</Text><Text style={styles.statValue}>{profile.cigarettesPerDay > 0 ? cigarettesAvoided : '—'}</Text><Text style={styles.statFoot}>{profile.cigarettesPerDay > 0 ? 'adet · yaklaşık' : 'Günlük miktarı ekle'}</Text></Card><Card style={styles.statCard}><Text style={styles.statLabel}>TAHMİNİ TASARRUF</Text><Text style={[styles.statValue, { fontSize: 21 }]}>{savedEstimate === null ? '—' : money(savedEstimate, profile.currency)}</Text><Text style={styles.statFoot}>{savedEstimate === null ? 'Paket ve günlük miktarı ekle' : 'girdiğin paket fiyatıyla'}</Text></Card></View>
    <Card style={styles.noteCard}><Text style={styles.cardTitle}>Hesap nasıl yapılıyor?</Text><Text style={styles.cardBody}>{savedEstimate === null ? 'İçilmeyen tahmini adet, seçtiğin bırakma tarihi ve günlük ortalamanla hesaplanır. Tasarruf tahmini için paket fiyatını ve adetini ayarlardan istediğin zaman ekleyebilirsin.' : 'İçilmeyen tahmini adet, seçtiğin bırakma tarihi ve günlük ortalamanla hesaplanır; kaydettiğin sigaralar tahminden düşülür. Tasarruf tahmini, içilmeyen adet × paket fiyatı ÷ paketteki adet formülünü kullanır. Gerçek miktar kişisel tüketimine göre değişebilir.'}</Text></Card>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Son kayıtların</Text><Text style={styles.sectionAside}>{events.length} kayıt</Text></View>
    {recent.length === 0 ? <Card><Text style={styles.cardTitle}>Burada yolculuğun görünecek</Text><Text style={styles.cardBody}>Check-in veya baş etme aracı kullandığında kayıtların burada toplanır.</Text></Card> : recent.map((event) => <View key={event.id} style={styles.eventRow}><View style={styles.eventDot}><Text style={{ color: C.green }}>{event.kind === 'slip' ? '↺' : '✦'}</Text></View><View style={{ flex: 1 }}><Text style={styles.eventTitle}>{event.kind === 'slip' ? 'Bir sigara içtiğini kaydettin' : event.kind === 'checkin' ? `Check-in: ${String(event.details.mood ?? '')}` : event.kind === 'coping' ? 'Bir baş etme adımı denedin' : event.kind === 'urge_result' ? `İstek sonrası: ${String(event.details.result ?? 'yanıtın kaydedildi')}` : 'İstek anı için destek açtın'}</Text><Text style={styles.eventDate}>{new Date(event.at).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text></View><Pressable onPress={() => removeEvent(event)} accessibilityRole="button" accessibilityLabel="Bu kaydı kaldır" style={styles.removeEventButton}><Text style={styles.removeEventText}>Kaldır</Text></Pressable></View>)}
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}><View style={{ flex: 1 }}><Button title="Check-in" kind="secondary" onPress={checkIn}/></View><View style={{ flex: 1 }}><Button title="Kayma kaydet" kind="quiet" onPress={logSlip}/></View></View>
    <View style={styles.supportNote}><Text style={styles.supportMark}>i</Text><Text style={styles.supportText}>Bu göstergeler yaklaşık kişisel takip değerleridir; sağlık sonucunu ölçmez veya garanti etmez.</Text></View>
  </>;
}

type SettingsProps = {
  profile: Profile;
  reminder: ReminderSettings;
  reminderTime: string;
  setReminderTime: (time: string) => void;
  reminderBusy: boolean;
  updateReminder: (enabled: boolean, time?: string) => Promise<void>;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  authMode: 'signup' | 'signin';
  setAuthMode: (mode: 'signup' | 'signin') => void;
  authBusy: boolean;
  syncing: boolean;
  cloudEmail: string | null;
  syncIssue: boolean;
  retryCloudSync: () => Promise<void>;
  connectCloud: () => Promise<void>;
  doSignOut: () => Promise<void>;
  doDeleteAccount: () => void;
  doClearLocal: () => void;
  exportData: () => Promise<void>;
  onEdit: () => void;
};

function Settings({ profile, reminder, reminderTime, setReminderTime, reminderBusy, updateReminder, email, setEmail, password, setPassword, authMode, setAuthMode, authBusy, syncing, cloudEmail, syncIssue, retryCloudSync, connectCloud, doSignOut, doDeleteAccount, doClearLocal, exportData, onEdit }: SettingsProps) {
  const showDialog = useContext(DialogContext);
  return <>
    <Card><Text style={styles.cardTitle}>Bırakma planın</Text><Text style={styles.cardBody}>{profile.cigarettesPerDay > 0 ? `${profile.cigarettesPerDay} adet/gün` : 'Günlük miktar eklenmedi'} · {profile.packPrice > 0 && profile.packSize > 0 ? `paket ${money(profile.packPrice, profile.currency)} / ${profile.packSize} adet` : 'tasarruf hesabı eklenmedi'}</Text><Text style={styles.cardBody}>Bırakma tarihi: {localDateInput(planDate(profile.quitDate))}</Text>{profile.reason ? <Text style={styles.reasonQuote}>“{profile.reason}”</Text> : null}<Button title="Plan bilgilerini düzenle" kind="secondary" onPress={onEdit}/></Card>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Hatırlatmalar</Text><Text style={styles.sectionAside}>İsteğe bağlı</Text></View>
    <Card><Text style={styles.cardTitle}>Günlük kısa check-in</Text><Text style={styles.cardBody}>Hatırlatma yalnızca cihazında planlanır. İstediğin zaman kapatabilirsin.</Text><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}><TextInput value={reminderTime} onChangeText={setReminderTime} placeholder="19:00" accessibilityLabel="Hatırlatma saati, saat ve dakika" keyboardType="numbers-and-punctuation" maxLength={5} style={[styles.input, { flex: 1, marginTop: 0, marginBottom: 0 }]}/>{reminder.enabled && reminderTime !== reminder.time ? <Button title={reminderBusy ? 'Kaydediliyor…' : 'Saati kaydet'} kind="secondary" disabled={reminderBusy} onPress={() => updateReminder(true, reminderTime)}/> : <Button title={reminderBusy ? 'Kaydediliyor…' : reminder.enabled ? 'Kapat' : 'Aç'} kind={reminder.enabled ? 'quiet' : 'secondary'} disabled={reminderBusy} onPress={() => updateReminder(!reminder.enabled, reminderTime)}/>}</View><Text style={styles.cardBody}>{reminder.enabled ? `Her gün ${reminder.time} için açık.` : 'Kapalı. Aç seçeneğine dokununca bildirim izni istenir.'}</Text></Card>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Veri ve eşitleme</Text><Text style={styles.sectionAside}>Önce gizlilik</Text></View>
    <Card><View style={styles.localBadge}><View style={styles.greenDot}/><Text style={styles.localText}>Bu cihazda saklanıyor</Text></View><Text style={styles.cardBody}>Uygulamayı hesap açmadan kullanabilirsin. Supabase bulut eşitlemesi için hesabınla giriş yap; e-posta doğrulaması ayarına bağlı olabilir.</Text>
      {cloudEmail ? <Text style={styles.cloudConnected}>Bulut hesabı: {cloudEmail}</Text> : null}
      {syncIssue ? <Text style={styles.syncWarning}>Son kayıt buluta eşitlenemedi; cihaz kopyan güvende. Bağlantını kontrol edip yeniden deneyebilirsin.</Text> : null}
      {syncIssue && cloudEmail ? <Button title={syncing ? 'Yeniden deneniyor…' : 'Eşitlemeyi yeniden dene'} kind="secondary" disabled={syncing} onPress={retryCloudSync}/> : null}
      {!supabaseReady ? <Text style={styles.configHint}>Supabase bağlantısı henüz yapılandırılmadı. Kurulum adımları mobile/README.md dosyasında.</Text> : <>
        <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" accessibilityLabel="Hesap e-posta adresi" autoCapitalize="none" keyboardType="email-address" style={styles.input}/>
        <TextInput value={password} onChangeText={setPassword} placeholder="Parola (en az 8 karakter)" accessibilityLabel="Hesap parolası" secureTextEntry style={styles.input}/>
        <Button title={authBusy || syncing ? 'Bağlanıyor…' : authMode === 'signup' ? 'Hesap oluştur ve eşitle' : 'Giriş yap ve eşitle'} disabled={authBusy || syncing} onPress={connectCloud}/>
        <Pressable onPress={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')} accessibilityRole="button" accessibilityLabel={authMode === 'signup' ? 'Mevcut hesabımla giriş yap' : 'Yeni hesap oluştur'} style={styles.settingsAction}><Text style={styles.mutedLink}>{authMode === 'signup' ? 'Zaten hesabın var mı? Giriş yap' : 'Yeni misin? Hesap oluştur'}</Text></Pressable>
        {cloudEmail ? <Pressable onPress={doSignOut} accessibilityRole="button" accessibilityLabel="Bulut hesabından çıkış yap" style={styles.settingsAction}><Text style={styles.mutedLink}>Bulut hesabından çıkış</Text></Pressable> : null}
        {cloudEmail ? <Pressable onPress={doDeleteAccount} accessibilityRole="button" accessibilityLabel="Bulut hesabımı ve verilerimi sil" style={styles.settingsAction}><Text style={{ color: C.red, fontSize: 10, fontWeight: '700' }}>Hesabımı ve verilerimi sil</Text></Pressable> : null}
      </>}
      <View style={{ height: 10 }}/><Button title="Verilerimi dışa aktar" kind="secondary" onPress={exportData}/>
      <Pressable onPress={doClearLocal} accessibilityRole="button" accessibilityLabel="Bu cihazdaki kayıtları sil" style={styles.settingsAction}><Text style={{ color: C.red, fontSize: 10, fontWeight: '700' }}>Bu cihazdaki kayıtları sil</Text></Pressable>
    </Card>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Destek ve bilgi</Text></View>
    <Card><Text style={styles.cardTitle}>Profesyonel destek</Text><Text style={styles.cardBody}>ALO 171, Sağlık Bakanlığının sigara bırakma danışma hattıdır ve 7 gün 24 saat hizmet verir.</Text><Pressable onPress={() => Linking.openURL('tel:171').catch(() => showDialog({ title: 'Arama açılamadı', message: 'Telefonundan 171 numarasını arayabilirsin.' }))} accessibilityRole="link" accessibilityLabel="ALO 171 Sigara Bırakma Danışma Hattını ara" style={styles.settingsAction}><Text style={{ color: C.green, fontSize: 11, fontWeight: '700' }}>171’i ara ↗</Text></Pressable><Pressable onPress={() => Linking.openURL('https://alo171.saglik.gov.tr/TR-66752/nasil-destek-alabilirim-.html')} accessibilityRole="link" accessibilityLabel="Sağlık Bakanlığının ALO 171 destek bilgilerini aç" style={styles.settingsAction}><Text style={{ color: C.green, fontSize: 11, fontWeight: '700' }}>Resmî destek bilgilerini aç ↗</Text></Pressable><Text style={styles.cardBody}>Bu uygulama tıbbi tavsiye, tanı veya tedavi sunmaz. Acil durumda yerel acil yardım hizmetlerine başvur.</Text></Card>
    <Text style={styles.versionText}>Çalışma adı · MVP önizlemesi · Verilerin bu cihazda kalır{ '\n' }Hesap eşitlemesi açıldığında Supabase kullanılır.</Text>
  </>;
}

function TabButton({ icon, label, active, onPress }: { icon: string; label: string; active: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.tabButton} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: active }}><Text style={[styles.tabIcon, active && { color: C.green }]} accessible={false}>{icon}</Text><Text style={[styles.tabLabel, active && { color: C.green, fontWeight: '700' }]} accessible={false}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  onboardingShell: { flex: 1, backgroundColor: C.bg },
  onboardingHeader: { minHeight: 49, paddingTop: Platform.OS === 'ios' ? 58 : 31, paddingHorizontal: 22, paddingBottom: 7, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  onboardingBrand: { color: C.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.3 },
  onboardingNav: { minHeight: 44, justifyContent: 'center', paddingRight: 14 },
  onboardingBack: { color: C.green, fontSize: 12, fontWeight: '700' },
  onboardingStepCount: { color: C.muted, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  onboardingProgress: { height: 4, marginHorizontal: 22, backgroundColor: '#E9E5DC', borderRadius: 8, overflow: 'hidden' },
  onboardingProgressFill: { height: '100%', backgroundColor: C.green, borderRadius: 8 },
  onboardingScroll: { flex: 1 },
  onboardingContent: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 27, paddingBottom: 20 },
  onboardingHero: { alignItems: 'center', paddingTop: 6, paddingBottom: 16 },
  onboardingTitle: { color: C.ink, fontSize: 29, lineHeight: 36, fontWeight: '800', letterSpacing: -0.7, marginTop: 9 },
  onboardingHeroTitle: { color: C.ink, fontSize: 30, lineHeight: 37, fontWeight: '800', letterSpacing: -0.8, textAlign: 'center', marginTop: 14 },
  onboardingSubtitle: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 9, marginBottom: 22 },
  onboardingFeature: { minHeight: 64, backgroundColor: C.paper, borderColor: C.line, borderWidth: 1, borderRadius: 17, paddingHorizontal: 13, paddingVertical: 10, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  onboardingFeatureIcon: { width: 39, height: 39, borderRadius: 14, backgroundColor: C.softGreen, color: C.green, textAlign: 'center', textAlignVertical: 'center', fontSize: 22, fontWeight: '700', overflow: 'hidden' },
  onboardingFeatureTitle: { color: C.ink, fontSize: 12, lineHeight: 17, fontWeight: '700' },
  onboardingFeatureCopy: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 2 },
  onboardingPrivacy: { color: C.muted, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 17, paddingHorizontal: 10 },
  onboardingEyebrow: { color: C.green, fontSize: 9, lineHeight: 14, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  onboardingQuestionCard: { marginTop: 5, padding: 17, borderRadius: 20 },
  onboardingInputLabel: { color: C.muted, fontSize: 9, lineHeight: 14, fontWeight: '800', letterSpacing: 0.8 },
  onboardingNumberRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: C.line },
  onboardingNumberInput: { flex: 1, color: C.ink, fontSize: 27, lineHeight: 34, fontWeight: '700', paddingVertical: 8, paddingHorizontal: 2 },
  onboardingCurrency: { color: C.green, fontSize: 22, fontWeight: '700', marginRight: 8 },
  onboardingInputUnit: { color: C.muted, fontSize: 11, fontWeight: '600' },
  onboardingFieldHint: { color: C.faint, fontSize: 10, lineHeight: 15, marginTop: 9 },
  onboardingDivider: { height: 1, backgroundColor: C.line, marginVertical: 15 },
  onboardingSkip: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 15 },
  onboardingSkipText: { color: C.green, fontSize: 11, fontWeight: '700' },
  onboardingDateButton: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: C.line, borderRadius: 13, backgroundColor: C.white },
  onboardingDateText: { color: C.ink, fontSize: 14, fontWeight: '600' },
  onboardingDateWeb: { minHeight: 50, borderWidth: 1, borderColor: C.line, borderRadius: 13, marginTop: 10, paddingHorizontal: 12, color: C.ink, backgroundColor: C.white },
  onboardingNativeDate: { alignSelf: 'flex-start', marginTop: 11, minHeight: 44, justifyContent: 'center' },
  onboardingQuickChoice: { alignSelf: 'center', minHeight: 48, justifyContent: 'center', paddingHorizontal: 14 },
  onboardingQuickChoiceText: { color: C.green, fontSize: 11, fontWeight: '700' },
  onboardingReasonInput: { minHeight: 112, color: C.ink, fontSize: 14, lineHeight: 21, paddingVertical: 12, paddingHorizontal: 1 },
  onboardingSummaryCard: { padding: 18, borderRadius: 20 },
  onboardingSummaryRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderBottomWidth: 1, borderBottomColor: C.line },
  onboardingSummaryLabel: { color: C.muted, fontSize: 11 },
  onboardingSummaryValue: { color: C.ink, fontSize: 11, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
  onboardingSummaryReason: { paddingTop: 16 },
  onboardingSummaryNote: { color: C.green, fontSize: 12, lineHeight: 18, fontStyle: 'italic', marginTop: 8 },
  onboardingRestoreCard: { marginTop: 12 },
  onboardingRestoreToggle: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 13 },
  onboardingFooter: { paddingHorizontal: 21, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 27 : 12, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.bg },
  onboardingFooterSkip: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', paddingHorizontal: 16 },
  onboardingFooterHint: { color: C.faint, textAlign: 'center', fontSize: 9, lineHeight: 14, marginTop: 7 },
  inlineError: { color: '#9C3825', backgroundColor: '#FCE9E2', padding: 12, borderRadius: 13, fontSize: 12, lineHeight: 18, marginBottom: 10 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  loadingMark: { color: C.green, fontSize: 32 }, loadingText: { color: C.muted, marginTop: 12, fontSize: 14 },
  topbar: { paddingTop: Platform.OS === 'ios' ? 61 : 35, paddingHorizontal: 23, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: C.muted, fontWeight: '700', fontSize: 9, letterSpacing: 1.1 }, topTitle: { color: C.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.7, marginTop: 3 },
  pointsPill: { borderRadius: 30, backgroundColor: '#F0EDE5', paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', gap: 6, alignItems: 'center' }, pointsText: { color: C.ink, fontSize: 11, fontWeight: '700' },
  scroll: { paddingHorizontal: 19, paddingBottom: 28 },
  hero: { backgroundColor: '#FCEBE3', borderRadius: 26, padding: 18, overflow: 'hidden', marginBottom: 12, minHeight: 227 },
  heroDecorA: { position: 'absolute', width: 165, height: 165, borderRadius: 90, backgroundColor: '#F8F1E3', right: -57, top: -62 }, heroDecorB: { position: 'absolute', width: 88, height: 88, borderRadius: 45, backgroundColor: '#F5D9CA', left: -46, bottom: -42 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, dayChip: { flexDirection: 'row', gap: 7, alignItems: 'center', backgroundColor: '#FFFFFFA8', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 30 }, greenDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: C.green }, dayChipText: { fontSize: 10, color: C.darkGreen, fontWeight: '700' }, heroSymbol: { color: C.gold, fontSize: 20 },
  heroMiddle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingRight: 3 }, heroSmall: { color: C.muted, fontSize: 8, letterSpacing: 1, fontWeight: '700' }, heroNumber: { color: C.ink, fontSize: 43, lineHeight: 49, fontWeight: '800', letterSpacing: -2 }, heroUnit: { fontSize: 19, fontWeight: '600', letterSpacing: 0 }, heroSub: { color: C.muted, fontSize: 11, marginTop: 1 },
  heroBottom: { borderTopWidth: 1, borderTopColor: '#EFD5C9', marginTop: 14, paddingTop: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, heroBottomText: { fontSize: 10, color: C.darkGreen, flex: 1 }, heroLink: { color: C.green, fontWeight: '700', fontSize: 10 },
  mascotHalo: { backgroundColor: '#F6F3E8', alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: '#E5E4D8' }, mascotCore: { backgroundColor: '#DCE8DB', alignItems: 'center', justifyContent: 'center' }, mascotEyes: { position: 'absolute', flexDirection: 'row', gap: 12, top: '48%' }, mascotEye: { width: 3, height: 3, borderRadius: 2, backgroundColor: C.darkGreen }, mascotSmile: { position: 'absolute', width: 8, height: 4, borderBottomWidth: 1.5, borderColor: C.darkGreen, borderRadius: 8, top: '59%' }, mascotSpark1: { position: 'absolute', width: 5, height: 5, borderRadius: 5, backgroundColor: C.gold, top: 12, right: 12 }, mascotSpark2: { position: 'absolute', width: 4, height: 4, borderRadius: 4, backgroundColor: '#B8C8AE', bottom: 13, left: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 7 }, card: { backgroundColor: C.paper, borderRadius: 19, borderWidth: 1, borderColor: C.line, padding: 15, marginBottom: 9 }, statCard: { flex: 1, minHeight: 117, padding: 13, marginBottom: 0 }, statIcon: { color: C.green, fontSize: 16, fontWeight: '700' }, statLabel: { color: C.faint, fontSize: 8, fontWeight: '700', letterSpacing: 0.6, marginTop: 7 }, statValue: { color: C.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.8, marginTop: 4 }, statFoot: { color: C.muted, fontSize: 9, marginTop: 1 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 17, marginBottom: 9, paddingHorizontal: 2 }, sectionTitle: { color: C.ink, fontSize: 14, fontWeight: '700' }, sectionAside: { color: C.faint, fontSize: 9 },
  urgeCard: { backgroundColor: '#FFF9F4', borderColor: '#F0DDD2', borderWidth: 1, borderRadius: 19, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 }, urgeIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.softOrange, alignItems: 'center', justifyContent: 'center' }, urgeTitle: { color: C.ink, fontSize: 13, fontWeight: '700' }, urgeDesc: { color: C.muted, fontSize: 10, marginTop: 3 }, chevron: { color: C.faint, fontSize: 23, paddingHorizontal: 3 },
  checkinCard: { padding: 14 }, checkinTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 11 }, checkinIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: C.softGreen, alignItems: 'center', justifyContent: 'center' }, cardTitle: { color: C.ink, fontWeight: '700', fontSize: 12 }, cardBody: { color: C.muted, fontSize: 10, lineHeight: 16, marginTop: 5 },
  button: { minHeight: 48, borderRadius: 15, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', marginTop: 9 }, buttonPrimary: { backgroundColor: C.green }, buttonSecondary: { backgroundColor: '#F2F1EB', borderColor: C.line, borderWidth: 1 }, buttonQuiet: { backgroundColor: 'transparent' }, buttonDanger: { backgroundColor: C.softOrange }, buttonText: { color: C.white, fontSize: 12, fontWeight: '700' }, pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  slipLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 19, padding: 9 }, slipText: { color: C.muted, fontSize: 10 }, slipAction: { color: C.green, fontWeight: '700', fontSize: 10 },
  supportNote: { flexDirection: 'row', gap: 9, backgroundColor: '#F0F1EC', borderRadius: 14, padding: 12, marginTop: 18, marginBottom: 12 }, supportMark: { color: C.green, fontWeight: '800', fontSize: 13 }, supportText: { color: C.muted, flex: 1, fontSize: 9, lineHeight: 14 },
  tabbar: { minHeight: 68, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFFEFCF2', borderTopColor: C.line, borderTopWidth: 1, paddingBottom: Platform.OS === 'ios' ? 8 : 2 }, tabButton: { alignItems: 'center', justifyContent: 'center', minWidth: 64, minHeight: 48, paddingHorizontal: 8, paddingVertical: 4 }, tabIcon: { color: C.faint, fontSize: 19, lineHeight: 22 }, tabLabel: { color: C.faint, fontSize: 9, marginTop: 1, fontWeight: '600' },
  bodyCopy: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 9, marginBottom: 16 }, placeholderCaption: { color: C.faint, fontSize: 9, textAlign: 'center', marginTop: 8 }, privacyNote: { color: C.muted, fontSize: 9, textAlign: 'center', lineHeight: 14, marginTop: 9, paddingHorizontal: 10 }, input: { minHeight: 45, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, marginTop: 7, marginBottom: 14, paddingHorizontal: 12, color: C.ink, fontSize: 12 }, datePickerButton: { minHeight: 45, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, marginTop: 7, marginBottom: 14, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, datePickerText: { color: C.ink, fontSize: 13 }, datePickerIcon: { color: C.green, fontSize: 17 }, label: { color: C.ink, fontWeight: '600', fontSize: 10, marginTop: 8 }, rowInputs: { flexDirection: 'row', gap: 10 }, disclaimer: { color: C.faint, fontSize: 9, lineHeight: 14, textAlign: 'center', marginVertical: 17, paddingHorizontal: 9 },
  urgeScreen: { flex: 1, backgroundColor: C.bg }, urgeNav: { paddingTop: Platform.OS === 'ios' ? 59 : 32, paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, backButtonHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, backButton: { width: 40, height: 40, textAlign: 'center', textAlignVertical: 'center', color: C.ink, fontSize: 30, backgroundColor: C.paper, borderRadius: 13, overflow: 'hidden' }, urgeNavTitle: { color: C.ink, fontWeight: '700', fontSize: 13 }, urgeContent: { alignItems: 'center', paddingHorizontal: 22, paddingTop: 15, paddingBottom: 40 }, checkinFlowContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 30 }, moodChoice: { width: '100%', minHeight: 54, paddingHorizontal: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 16 }, moodChoiceText: { color: C.ink, fontSize: 13, fontWeight: '600' }, urgeHeadline: { color: C.ink, fontSize: 24, lineHeight: 30, fontWeight: '800', textAlign: 'center', letterSpacing: -0.7, marginTop: 17, marginBottom: 6 }, toolChoice: { width: '100%', borderRadius: 17, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, minHeight: 72, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 9 }, toolIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: C.softGreen, alignItems: 'center', justifyContent: 'center' }, toolTitle: { color: C.ink, fontSize: 12, fontWeight: '700' }, toolDetail: { color: C.muted, fontSize: 9, marginTop: 4 }, mutedLink: { color: C.muted, fontSize: 11, fontWeight: '600' }, timerFace: { width: 215, height: 215, borderRadius: 115, borderWidth: 12, borderColor: '#E7EDE5', backgroundColor: '#F1F4ED', alignItems: 'center', justifyContent: 'center', marginVertical: 26 }, timerRing: { width: 177, height: 177, borderRadius: 90, borderWidth: 1, borderColor: '#D5E1D5', backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' }, timerText: { fontSize: 46, fontWeight: '800', color: C.darkGreen, letterSpacing: -1 }, timerLabel: { color: C.muted, fontSize: 9, marginTop: 3 }, doneBadge: { width: 100, height: 100, borderRadius: 55, backgroundColor: C.softGreen, alignItems: 'center', justifyContent: 'center', marginTop: 30 }, feelingRow: { flexDirection: 'row', gap: 7, marginVertical: 20 }, feelingChip: { minHeight: 44, justifyContent: 'center', borderRadius: 22, backgroundColor: C.paper, borderColor: C.line, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10 }, feelingText: { color: C.ink, fontSize: 10, fontWeight: '600' },
  shelterHero: { backgroundColor: C.paper, borderRadius: 24, borderColor: C.line, borderWidth: 1, overflow: 'hidden', paddingBottom: 17, alignItems: 'center' }, shelterSky: { width: '100%', height: 228, backgroundColor: '#202B37', position: 'relative', overflow: 'hidden' }, moon: { width: 37, height: 37, borderRadius: 20, backgroundColor: '#F5E7BD', position: 'absolute', top: 27, right: 32 }, shelterStar1: { position: 'absolute', top: 34, left: 37, color: C.gold, fontSize: 15 }, shelterStar2: { position: 'absolute', top: 69, left: 95, color: C.white, fontSize: 28 }, shelterStar3: { position: 'absolute', top: 57, right: 98, color: C.white, fontSize: 16 }, hillBack: { position: 'absolute', bottom: -45, left: -28, width: 300, height: 155, borderRadius: 150, backgroundColor: '#8B5C49' }, hillFront: { position: 'absolute', bottom: -73, right: -54, width: 310, height: 160, borderRadius: 150, backgroundColor: '#A96E50' }, den: { position: 'absolute', bottom: 32, left: '39%', alignItems: 'center' }, denRoof: { width: 104, height: 70, backgroundColor: '#A87855', transform: [{ rotate: '45deg' }], borderRadius: 9, position: 'absolute', top: -28 }, denBody: { width: 88, height: 74, backgroundColor: '#E8D5B7', borderRadius: 9, marginTop: 11, borderWidth: 2, borderColor: '#C7AF8D' }, denDoor: { width: 23, height: 38, backgroundColor: '#8B6A50', position: 'absolute', bottom: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12 }, denWindow: { width: 17, height: 17, backgroundColor: '#F4DF9F', position: 'absolute', top: 27, right: 9, borderRadius: 5, borderWidth: 2, borderColor: '#B99569' }, shelterMascot: { position: 'absolute', bottom: 34, left: '7%' }, shelterTitle: { color: C.ink, fontSize: 18, fontWeight: '800', marginTop: 16 }, shelterCaption: { color: C.muted, fontSize: 10, textAlign: 'center', paddingHorizontal: 18, marginTop: 5 }, shelterProgress: { width: '84%', height: 6, borderRadius: 8, backgroundColor: '#ECEBE5', marginTop: 17, overflow: 'hidden' }, shelterProgressFill: { height: '100%', backgroundColor: C.green, borderRadius: 8 }, shelterCount: { color: C.muted, fontSize: 9, marginTop: 7 }, piecesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, pieceCard: { width: '31.7%', alignItems: 'center', padding: 9, marginBottom: 0 }, pieceArt: { width: 55, height: 53, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, pieceUnlocked: { backgroundColor: C.softGreen }, pieceLocked: { backgroundColor: '#F2F1EC' }, pieceName: { color: C.muted, fontSize: 8, marginTop: 7, textAlign: 'center' }, pieceCost: { color: C.faint, fontSize: 8, fontWeight: '700', marginTop: 3 }, nextPieceCard: { flexDirection: 'row', alignItems: 'center', padding: 13 }, removeEventButton: { minWidth: 54, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, removeEventText: { color: C.green, fontSize: 10, fontWeight: '700' },
  dialogBackdrop: { flex: 1, backgroundColor: '#17151488', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 27 }, dialogCard: { width: '100%', maxWidth: 410, backgroundColor: C.paper, borderColor: C.line, borderWidth: 1, borderRadius: 25, padding: 21, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 22, shadowOffset: { width: 0, height: 12 }, elevation: 12 }, dialogTitle: { color: C.ink, fontSize: 20, fontWeight: '800', letterSpacing: -0.4 }, dialogMessage: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 8 }, dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 9, marginTop: 20 }, dialogButton: { minHeight: 48, minWidth: 96, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 15 }, dialogButtonPrimary: { backgroundColor: C.green }, dialogButtonSecondary: { backgroundColor: '#F3EFEA' }, dialogButtonDanger: { backgroundColor: C.red }, dialogButtonText: { color: C.white, fontSize: 13, fontWeight: '700' }, dialogButtonSecondaryText: { color: C.ink, fontSize: 13, fontWeight: '700' },
  progressHero: { backgroundColor: C.softGreen, padding: 18 }, progressDay: { color: C.darkGreen, fontSize: 38, fontWeight: '800', marginTop: 4 }, noteCard: { backgroundColor: '#F1F1EB' }, eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomColor: C.line, borderBottomWidth: 1 }, eventDot: { width: 32, height: 32, borderRadius: 12, backgroundColor: C.softGreen, alignItems: 'center', justifyContent: 'center' }, eventTitle: { color: C.ink, fontSize: 10, fontWeight: '600' }, eventDate: { color: C.faint, fontSize: 9, marginTop: 3 }, reasonQuote: { color: C.green, fontSize: 11, fontStyle: 'italic', marginTop: 9 }, settingsAction: { minHeight: 48, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 }, localBadge: { flexDirection: 'row', gap: 7, alignItems: 'center', backgroundColor: C.softGreen, padding: 9, alignSelf: 'flex-start', borderRadius: 18 }, localText: { color: C.darkGreen, fontWeight: '700', fontSize: 10 }, configHint: { fontSize: 10, color: C.muted, lineHeight: 15, marginTop: 12, padding: 11, borderRadius: 12, backgroundColor: '#F3F1EA' }, versionText: { color: C.faint, fontSize: 9, textAlign: 'center', lineHeight: 15, marginVertical: 22 }, cloudConnected: { color: C.darkGreen, backgroundColor: C.softGreen, borderRadius: 12, padding: 10, fontSize: 10, marginTop: 10 }, syncWarning: { color: C.red, backgroundColor: '#F9ECE8', borderRadius: 12, padding: 10, fontSize: 10, lineHeight: 14, marginTop: 9 },
});
