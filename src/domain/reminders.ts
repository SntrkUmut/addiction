import 'expo-sqlite/localStorage/install';
import * as Notifications from 'expo-notifications';
import { REMINDER_KEY } from '../data/wipe';

// Do not interrupt the user with a reminder banner while the app is already open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export type ReminderSettings = { enabled: boolean; time: string; notificationId?: string };
const DEFAULT: ReminderSettings = { enabled: false, time: '19:00' };

export async function loadReminderSettings(): Promise<ReminderSettings> {
  try {
    const raw = await localStorage.getItem(REMINDER_KEY);
    if (!raw) return DEFAULT;
    const value = JSON.parse(raw) as Partial<ReminderSettings>;
    if (typeof value.enabled !== 'boolean' || typeof value.time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value.time)) return DEFAULT;
    return { enabled: value.enabled, time: value.time, ...(typeof value.notificationId === 'string' ? { notificationId: value.notificationId } : {}) };
  } catch { return DEFAULT; }
}

export async function configureDailyReminder(time: string): Promise<ReminderSettings> {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Saati SS:DD biçiminde gir.');
  const permission = await Notifications.getPermissionsAsync();
  const granted = permission.granted || (await Notifications.requestPermissionsAsync()).granted;
  if (!granted) throw new Error('Bildirim izni verilmedi. İstersen cihaz ayarlarından daha sonra açabilirsin.');
  const current = await loadReminderSettings();
  const [hour, minute] = time.split(':').map(Number);
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: { title: 'Küçük bir ara', body: 'Bugün kendin için ayırdığın kısa bir an var. İstersen uygulamaya uğra.' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
  const next = { enabled: true, time, notificationId };
  try {
    await localStorage.setItem(REMINDER_KEY, JSON.stringify(next));
  } catch (error) {
    await Notifications.cancelScheduledNotificationAsync(notificationId).catch(() => {});
    throw error;
  }
  if (current.notificationId) await Notifications.cancelScheduledNotificationAsync(current.notificationId).catch(() => {});
  return next;
}

export async function disableDailyReminder(): Promise<ReminderSettings> {
  const current = await loadReminderSettings();
  const next = { enabled: false, time: current.time };
  await localStorage.setItem(REMINDER_KEY, JSON.stringify(next));
  if (current.notificationId) await Notifications.cancelScheduledNotificationAsync(current.notificationId).catch(() => {});
  return next;
}
