/**
 * Day milestone celebration, including kayma copy.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../ui/theme';
import { typography } from '../theme/typography';
import { Scene, PrimaryButton, TextButton, DayChip } from '../ui/components';
import { Mascot } from '../ui/Mascot';
import { resolveMilestoneCopy, type MilestoneCopy } from '../domain/milestones';
import { haptic } from '../ui/haptics';

interface Props {
  milestone: MilestoneCopy;
  slipped: boolean;
  onShelter: () => void;
  onHome: () => void;
}

export function Milestone({ milestone, slipped, onShelter, onHome }: Props) {
  const { colors } = useTheme();
  const copy = resolveMilestoneCopy(milestone, slipped);

  useEffect(() => {
    haptic('success');
  }, []);

  return (
    <Scene variant="night" height={520} horizonY={200}>
      <View style={styles.wrap}>
        <DayChip day={copy.day} variant="night" />
        <Mascot pose="joyful" size={140} darkScene />
        <Text style={[styles.eyebrow, { color: colors.accent.gold }]}>{copy.eyebrow}</Text>
        <Text style={[styles.number, { color: colors.text.onDark }]}>{copy.day} gün</Text>
        <Text style={[styles.lead, { color: colors.text.onDark }]}>{copy.lead}</Text>
        <Text style={[styles.body, { color: colors.text.onDarkMuted }]}>{copy.body}</Text>
        <View style={styles.actions}>
          <PrimaryButton label="Sığınağı gör" onPress={onShelter} />
          <TextButton label="Ana ekrana dön" onPress={onHome} secondary />
        </View>
      </View>
    </Scene>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 12,
  },
  eyebrow: {
    ...typography.label.sm,
    letterSpacing: 1.2,
  },
  number: {
    ...typography.display.lg,
  },
  lead: {
    ...typography.display.sm,
    textAlign: 'center',
  },
  body: {
    ...typography.body.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
});
