import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { completeAuthCallback } from '../../data/store';

export default function AuthCallback() {
  const { code, error, error_description: errorDescription } = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const [message, setMessage] = useState('E-posta doğrulaması tamamlanıyor…');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const finish = async () => {
      if (error || errorDescription) throw new Error(errorDescription || error || 'Doğrulama bağlantısı geçersiz.');
      if (typeof code !== 'string' || !code) throw new Error('Bağlantıda doğrulama kodu bulunamadı. E-postandaki en yeni bağlantıyı tekrar aç.');
      await completeAuthCallback(code);
    };
    finish().then(() => {
      if (!active) return;
      setMessage('E-posta doğrulandı. Hesabın hazır.');
      setTimeout(() => router.replace('/'), 900);
    }).catch((cause: unknown) => {
      if (!active) return;
      setFailed(true);
      setMessage(cause instanceof Error ? cause.message : 'Doğrulama tamamlanamadı. Yeni bir bağlantı isteyip tekrar dene.');
    });
    return () => { active = false; };
  }, [code, error, errorDescription]);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {!failed && <ActivityIndicator color="#567765" size="large" />}
        <Text style={styles.title}>{failed ? 'Bağlantı açılamadı' : 'E-posta doğrulaması'}</Text>
        <Text style={styles.body}>{message}</Text>
        {failed && <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={styles.button}>
          <Text style={styles.buttonText}>Uygulamaya dön</Text>
        </Pressable>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F6F1', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#FFFEFC', borderRadius: 24, padding: 26, alignItems: 'center', gap: 14 },
  title: { color: '#202522', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  body: { color: '#7B817B', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  button: { marginTop: 6, borderRadius: 14, backgroundColor: '#567765', paddingHorizontal: 20, paddingVertical: 13 },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
