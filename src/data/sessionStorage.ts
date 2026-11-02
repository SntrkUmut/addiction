import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AESEncryptionKey, AESSealedData, aesDecryptAsync, aesEncryptAsync } from 'expo-crypto';
import * as aesjs from 'aes-js';

/**
 * Supabase sessions can exceed SecureStore's practical per-item size limit.
 * Keep the AES key in the OS keychain/keystore and the encrypted payload in
 * AsyncStorage. The browser preview uses its normal localStorage adapter.
 */
class EncryptedSessionStorage {
  private queue: Promise<void> = Promise.resolve();
  private keyName(key: string) { return `${key}:aes-gcm-v2`; }

  private async serialized<T>(operation: () => Promise<T>): Promise<T> {
    const previous = this.queue;
    let release = () => {};
    this.queue = new Promise<void>((resolve) => { release = resolve; });
    await previous;
    try {
      return await operation();
    } finally {
      release();
    }
  }

  private async encryptV2(key: string, value: string) {
    const keyName = this.keyName(key);
    let encryptionKey: AESEncryptionKey;
    const savedKey = await SecureStore.getItemAsync(keyName);
    if (savedKey) encryptionKey = await AESEncryptionKey.import(savedKey, 'hex');
    else {
      encryptionKey = await AESEncryptionKey.generate(256);
      await SecureStore.setItemAsync(keyName, await encryptionKey.encoded('hex'));
    }
    const sealed = await aesEncryptAsync(new TextEncoder().encode(value), encryptionKey);
    return `v2:${await sealed.combined('base64')}`;
  }

  private async decryptLegacy(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) return null;
    const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  private async decryptV2(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(this.keyName(key));
    if (!encryptionKeyHex) return null;
    const encryptionKey = await AESEncryptionKey.import(encryptionKeyHex, 'hex');
    const sealed = AESSealedData.fromCombined(value.slice(3));
    const cleartext = await aesDecryptAsync(sealed, encryptionKey, { output: 'bytes' });
    return new TextDecoder().decode(cleartext as Uint8Array<ArrayBuffer>);
  }

  async getItem(key: string) {
    return this.serialized(async () => {
      const encrypted = await AsyncStorage.getItem(key);
      if (!encrypted) return encrypted;
      if (encrypted.startsWith('v2:')) return this.decryptV2(key, encrypted);
      // Preserve existing signed-in sessions and transparently migrate them.
      const cleartext = await this.decryptLegacy(key, encrypted);
      if (cleartext === null) return null;
      const migrated = await this.encryptV2(key, cleartext);
      await AsyncStorage.setItem(key, migrated);
      await SecureStore.deleteItemAsync(key);
      return cleartext;
    });
  }

  async setItem(key: string, value: string) {
    return this.serialized(async () => {
      const encrypted = await this.encryptV2(key, value);
      await AsyncStorage.setItem(key, encrypted);
    });
  }

  async removeItem(key: string) {
    return this.serialized(async () => {
      await AsyncStorage.removeItem(key);
      await SecureStore.deleteItemAsync(key);
      await SecureStore.deleteItemAsync(this.keyName(key));
    });
  }
}

export function createAuthStorage() {
  return Platform.OS === 'web' ? localStorage : new EncryptedSessionStorage();
}
