# Screen Components (Rev 5.1)

This directory contains the full UI implementation for the rev 5.1 redesign.

## Screens

- **Onboarding/** - 6-step onboarding flow (steps 0-5, including pack price)
- **Yuva/** - Home screen with day chips, mascot, quests, craving button
- **Siginak/** - Chapters screen with path visualization and milestones
- **Milestones/** - Day 1/7/14/30/60/90 celebration screens with slip variants
- **Craving/** - Istek, Nefes, and 07 craving-end flow
- **Rotam/** - Journey history and progress tab
- **Ben/** - Profile, settings, cloud sync tab

## Design System

All screens use:
- Semantic color tokens from `src/theme/colors.ts`
- Typography from `src/theme/typography.ts`
- Shared components from `src/ui/components.tsx`
- Scene gradients (day/dusk/night) for background
- Haptics via `src/ui/haptics.ts` (respects user toggle)
- Theme switching (Sistem/Açık/Koyu) via `src/ui/theme.ts`

## Navigation

Tab navigation (Yuva, Sığınak, Rotam, Ben) is implemented in the main App.tsx.
Modal flows (onboarding, milestones, craving) are presented on top.
