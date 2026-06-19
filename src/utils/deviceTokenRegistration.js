import { notificationService } from '../services/notificationService';

const STORAGE_KEY = 'smart-parking.device-token';

function detectPlatform() {
  if (typeof navigator === 'undefined') return 'WEB';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'ANDROID';
  if (/iphone|ipad|ipod/i.test(ua)) return 'IOS';
  return 'WEB';
}

async function tryGetFcmToken() {
  try {
    const messaging = await import('firebase/messaging').then((m) => m.getMessaging());
    const { getToken } = await import('firebase/messaging');
    return await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
  } catch {
    return null;
  }
}

function getOrCreatePlaceholderToken() {
  if (typeof window === 'undefined') return null;
  let token = window.localStorage.getItem(STORAGE_KEY);
  if (!token) {
    token = `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(STORAGE_KEY, token);
  }
  return token;
}

export async function registerDeviceTokenForCurrentUser() {
  if (typeof window === 'undefined') return;

  const fcmToken = await tryGetFcmToken();
  const token = fcmToken || getOrCreatePlaceholderToken();
  if (!token) return;

  await notificationService.registerDeviceToken({
    token,
    platform: detectPlatform(),
  });
}
