/**
 * Shared UI components (rev 4).
 * Implements the merged visual language with design tokens.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { semantic, sceneDay, sceneNight } from '../theme/colors';
import { textStyles, spacing, radii, heights } from '../theme/typography';
import { Sparkle, MapPin } from 'phosphor-react-native';

// Icon type for dynamic usage
type IconComponent = typeof Sparkle;

/**
 * Scene component (day or night)
 */
interface SceneProps {
  variant: 'day' | 'night';
  height: number;
  horizonY: number;
  sparkles?: { x: number; y: number; width: number; opacity: number };
  fadeBottom?: boolean;
  children?: React.ReactNode;
}

export function Scene({ variant, height, horizonY, sparkles, fadeBottom, children }: SceneProps) {
  const colors = variant === 'day' ? sceneDay : sceneNight;
  
  return (
    <View style={{ height, position: 'relative', overflow: 'hidden' }}>
      <LinearGradient
        colors={colors.sky as any}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Horizon hill */}
      <View
        style={{
          position: 'absolute',
          top: horizonY,
          left: -80,
          width: 550,
          height: 260,
          borderRadius: 275,
          backgroundColor: colors.horizon,
        }}
      />
      {/* Inner hill */}
      <View
        style={{
          position: 'absolute',
          top: horizonY + 22,
          left: 50,
          width: 290,
          height: 54,
          borderRadius: 145,
          backgroundColor: colors.innerHill,
          opacity: 0.75,
        }}
      />
      {sparkles && (
        <View
          style={{
            position: 'absolute',
            left: sparkles.x,
            top: sparkles.y,
            width: sparkles.width,
            height: sparkles.width,
            opacity: sparkles.opacity,
          }}
        >
          {/* Placeholder for sparkles FX - would use actual asset */}
        </View>
      )}
      {fadeBottom && (
        <LinearGradient
          colors={['transparent', semantic.bg.canvas]}
          locations={[0.7, 1]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: height * 0.3,
          }}
        />
      )}
      {children}
    </View>
  );
}

/**
 * Sheet component (card with top radius)
 */
interface SheetProps {
  fromY: number;
  style?: ViewStyle;
  children: React.ReactNode;
}

export function Sheet({ fromY, style, children }: SheetProps) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          top: fromY,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: semantic.bg.canvas,
          borderTopLeftRadius: radii.sheetTop,
          borderTopRightRadius: radii.sheetTop,
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xxl,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Card component
 */
interface CardProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

export function Card({ style, children }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: semantic.surface.card,
          borderRadius: radii.card,
          borderWidth: 1,
          borderColor: semantic.border.default,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Primary button (3D pill with shadow edge)
 */
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconComponent;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, icon: IconComp, disabled }: PrimaryButtonProps) {
  const [pressed, setPressed] = React.useState(false);
  
  return (
    <View
      style={{
        backgroundColor: semantic.action.primaryEdge,
        borderRadius: radii.pill,
        paddingBottom: pressed ? 0 : 4,
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
        style={{
          height: heights.primaryButton,
          backgroundColor: pressed ? semantic.action.primaryPressed : semantic.action.primary,
          borderRadius: radii.pill,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.xxl,
          gap: spacing.md,
          transform: [{ translateY: pressed ? 4 : 0 }],
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text
          style={[
            textStyles.labelButton,
            { color: semantic.text.onAccent },
          ]}
        >
          {label}
        </Text>
        {IconComp && (
          <IconComp
            size={20}
            color={semantic.text.onAccent}
            weight="regular"
          />
        )}
      </Pressable>
    </View>
  );
}

/**
 * Secondary button (light background)
 */
interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconComponent;
}

export function SecondaryButton({ label, onPress, icon: IconComp }: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: heights.secondaryButton,
        backgroundColor: semantic.action.secondary,
        borderRadius: radii.pill,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xxl,
        gap: spacing.md,
      }}
    >
      <Text style={[textStyles.labelButton, { color: semantic.text.primary }]}>
        {label}
      </Text>
      {IconComp && (
        <IconComp
          size={20}
          color={semantic.text.primary}
          weight="regular"
        />
      )}
    </Pressable>
  );
}

/**
 * Text button
 */
interface TextButtonProps {
  label: string;
  onPress: () => void;
  secondary?: boolean;
}

export function TextButton({ label, onPress, secondary }: TextButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: heights.textButton,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={[
          textStyles.labelTextButton,
          { color: secondary ? semantic.text.secondary : semantic.text.accent },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Eyebrow text (uppercase label)
 */
interface EyebrowProps {
  children: string;
  color?: string;
  style?: TextStyle;
}

export function Eyebrow({ children, color = semantic.text.accent, style }: EyebrowProps) {
  return (
    <Text
      style={[
        textStyles.eyebrow,
        { color, textTransform: 'uppercase' },
        style,
      ]}
    >
      {children.toLocaleUpperCase('tr-TR')}
    </Text>
  );
}

/**
 * Light token (circle with sparkle icon)
 */
interface LightTokenProps {
  size: number;
  withRing?: boolean;
}

export function LightToken({ size, withRing = true }: LightTokenProps) {
  const iconSize = Math.floor(size * 0.62);
  
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: semantic.surface.rewardSoft,
        borderWidth: withRing && size > 16 ? 1.5 : 0,
        borderColor: semantic.accent.gold,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sparkle
        size={iconSize}
        color={semantic.accent.goldDeep}
        weight="fill"
      />
    </View>
  );
}

/**
 * Light chip (shows light count)
 */
interface LightChipProps {
  count: number;
  variant?: 'day' | 'night';
}

export function LightChip({ count, variant = 'day' }: LightChipProps) {
  const isDark = variant === 'night';
  
  return (
    <View
      style={{
        height: heights.chip,
        borderRadius: radii.pill,
        backgroundColor: isDark ? semantic.surface.glassDark : 'rgba(255, 255, 255, 0.92)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 6,
        paddingRight: spacing.md,
        gap: 6,
      }}
    >
      <LightToken size={24} withRing />
      <Text
        style={[
          textStyles.smStrongValue,
          { color: isDark ? semantic.text.onDark : semantic.text.primary },
        ]}
      >
        {count} ışık
      </Text>
    </View>
  );
}

/**
 * Day chip (shows journey day)
 */
interface DayChipProps {
  day: number;
  variant?: 'day' | 'night';
}

export function DayChip({ day, variant = 'day' }: DayChipProps) {
  const isDark = variant === 'night';
  
  return (
    <View
      style={{
        height: heights.chip,
        borderRadius: radii.pill,
        backgroundColor: isDark ? semantic.surface.glassDark : 'rgba(255, 255, 255, 0.92)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        gap: 6,
      }}
    >
      <MapPin
        size={18}
        color={isDark ? semantic.text.onDark : semantic.text.accent}
        weight="regular"
      />
      <Text
        style={[
          textStyles.smStrongValue,
          { color: isDark ? semantic.text.onDark : semantic.text.primary },
        ]}
      >
        {day}. gün
      </Text>
    </View>
  );
}

/**
 * Progress ring (circular progress indicator)
 */
interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0-1
  current: number;
  total: number;
  variant?: 'gold' | 'teal';
  onDark?: boolean;
}

export function ProgressRing({
  size,
  strokeWidth,
  progress,
  current,
  total,
  variant = 'gold',
  onDark = false,
}: ProgressRingProps) {
  // This would use react-native-svg for actual circular progress
  // For now, a simplified version
  const trackColor = onDark ? semantic.border.glassDark : semantic.surface.sunken;
  
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Placeholder - would use SVG Circle for actual implementation */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: trackColor,
        }}
      />
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={[
            textStyles.smStrongValue,
            { color: onDark ? semantic.text.onDark : semantic.text.primary },
          ]}
        >
          {current}/{total}
        </Text>
      </View>
    </View>
  );
}
