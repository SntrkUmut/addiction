/**
 * İstek + coping tools, including Nefes.
 * Night scene, no extra animation polish.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, Card, PrimaryButton, TextButton, Eyebrow } from '../ui/components';
import { Mascot } from '../ui/Mascot';
import { COPING_CHOICES } from '../domain/progress';
import { haptic } from '../ui/haptics';

type Panel = 'tools' | 'timer' | 'done';
type Tool = (typeof COPING_CHOICES)[number];

interface Props {
  reason?: string;
  unlockedPieceName?: string | null;
  onCravingOpened: () => void;
  onComplete: (tool: Tool) => void;
  onResult: (result: string) => void;
  onClose: () => void;
}

export function Istek({
  reason,
  unlockedPieceName,
  onCravingOpened,
  onComplete,
  onResult,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const [panel, setPanel] = useState<Panel>('tools');
  const [selected, setSelected] = useState<Tool>(COPING_CHOICES[0]);
  const [remaining, setRemaining] = useState(COPING_CHOICES[0].minutes * 60);
  const [inhale, setInhale] = useState(true);
  const [completed, setCompleted] = useState(false);
  const openedRef = React.useRef(false);

  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    onCravingOpened();
  }, [onCravingOpened]);

  useEffect(() => {
    if (panel !== 'timer') return undefined;
    const tick = setInterval(() => {
      setRemaining(value => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [panel]);

  useEffect(() => {
    if (panel !== 'timer' || selected.id !== 'breath') return undefined;
    const cue = setInterval(() => {
      setInhale(value => !value);
      haptic('soft');
    }, 4000);
    return () => clearInterval(cue);
  }, [panel, selected.id]);

  const startTool = (tool: Tool) => {
    setSelected(tool);
    setRemaining(tool.minutes * 60);
    setInhale(true);
    setPanel('timer');
    haptic('selection');
  };

  const finishTool = async () => {
    if (!completed) {
      onComplete(selected);
      setCompleted(true);
    }
    await haptic('success');
    setPanel('done');
  };

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');

  return (
    <Scene variant="night" height={520} horizonY={220}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={onClose} accessibilityLabel="İstek aracını kapat" style={styles.backHit}>
            <Text style={[styles.back, { color: colors.text.onDark }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.text.onDark }]}>İstek anı</Text>
          <View style={styles.backHit} />
        </View>

        {panel === 'tools' && (
          <View style={styles.block}>
            <Mascot pose="wistful" size={120} darkScene effects={['shield', 'crystals']} />
            <Text style={[styles.headline, { color: colors.text.onDark }]}>
              Şu an bir sonraki küçük adımı seç.
            </Text>
            <Text style={[styles.body, { color: colors.text.onDarkMuted }]}>
              Bu anı hemen çözmek zorunda değilsin. Sana uygun bir araç seçebilir ya da nedenlerini hatırlayabilirsin.
            </Text>
            {COPING_CHOICES.map(tool => (
              <TouchableOpacity key={tool.id} onPress={() => startTool(tool)} activeOpacity={0.7}>
                <Card style={styles.toolCard}>
                  <Text style={[styles.toolTitle, { color: colors.text.primary }]}>{tool.title}</Text>
                  <Text style={[styles.toolDetail, { color: colors.text.secondary }]}>
                    {tool.detail} · {tool.minutes} dk
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
            <TextButton label="Şimdi değil" onPress={onClose} secondary />
          </View>
        )}

        {panel === 'timer' && (
          <View style={styles.block}>
            <Eyebrow>{selected.title}</Eyebrow>
            <Mascot
              pose={selected.id === 'breath' ? 'content' : 'hopeful'}
              size={80}
              darkScene
              effects={selected.id === 'breath' ? ['breath_ring', 'bubbles'] : []}
            />
            <Text style={[styles.headline, { color: colors.text.onDark }]}>Sadece bu ana odaklan.</Text>
            <View style={[styles.timerFace, { borderColor: colors.accent.teal }]}>
              {selected.id === 'breath' && (
                <Text style={[styles.cue, { color: colors.accent.teal }]}>
                  {inhale ? 'Nefes al' : 'Nefes ver'}
                </Text>
              )}
              <Text style={[styles.timer, { color: colors.text.onDark }]}>{mins}:{secs}</Text>
              <Text style={[styles.timerLabel, { color: colors.text.onDarkMuted }]}>kendine ayırdığın süre</Text>
            </View>
            <Text style={[styles.body, { color: colors.text.onDarkMuted, textAlign: 'center' }]}>
              {selected.id === 'breath'
                ? 'Rahat ettiğin bir ritimde nefes al. Saymak zorunda değilsin; istediğin an durabilirsin.'
                : selected.id === 'reasons'
                  ? (reason ? `“${reason}”` : 'Kendine bu kararı neden verdiğini düşünmek için birkaç sakin an ver.')
                  : selected.detail}
            </Text>
            <PrimaryButton label="Bu adımı tamamladım" onPress={finishTool} />
            <TextButton label="Başka bir araç seç" onPress={() => setPanel('tools')} secondary />
          </View>
        )}

        {panel === 'done' && (
          <View style={styles.block}>
            <Mascot pose="joyful" size={120} darkScene effects={['sparkles']} />
            <Text style={[styles.headline, { color: colors.text.onDark }]}>
              Bu an için kendine alan açtın.
            </Text>
            <Text style={[styles.body, { color: colors.text.onDarkMuted }]}>İstek şimdi nasıl?</Text>
            <View style={styles.feelings}>
              {['Azaldı', 'Aynı', 'Geri geldi'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => { onResult(item); onClose(); }}
                  style={[styles.chip, { backgroundColor: colors.surface.card }]}
                >
                  <Text style={[styles.chipText, { color: colors.text.primary }]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {unlockedPieceName ? (
              <Card style={[styles.pieceCard, { backgroundColor: colors.surface.rewardSoft }]}>
                <Text style={[styles.toolTitle, { color: colors.text.primary }]}>
                  Yeni parça açıldı: {unlockedPieceName}
                </Text>
                <Text style={[styles.toolDetail, { color: colors.text.secondary }]}>
                  Sığınağında seni bekliyor.
                </Text>
              </Card>
            ) : null}
            <PrimaryButton label="Ana ekrana dön" onPress={onClose} />
          </View>
        )}
      </ScrollView>
    </Scene>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    fontSize: 32,
    lineHeight: 36,
  },
  navTitle: {
    ...typography.label.md,
  },
  block: {
    alignItems: 'center',
    gap: 12,
  },
  headline: {
    ...typography.display.sm,
    textAlign: 'center',
  },
  body: {
    ...typography.body.md,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  toolCard: {
    width: '100%',
    padding: 16,
    marginBottom: 8,
  },
  toolTitle: {
    ...typography.body.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  toolDetail: {
    ...typography.body.sm,
  },
  timerFace: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  cue: {
    ...typography.display.sm,
    marginBottom: 8,
  },
  timer: {
    ...typography.display.lg,
  },
  timerLabel: {
    ...typography.body.sm,
    marginTop: 4,
  },
  feelings: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  chip: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    ...typography.label.md,
  },
  pieceCard: {
    width: '100%',
    padding: 16,
  },
});
