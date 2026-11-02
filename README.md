# Smoking cessation MVP (working title)

Expo + React Native implementation of the smoking cessation MVP. Product and mascot names remain provisional. The selected character direction is the fox from the supplied reference; the current cropped pose and generated fox mark are development artwork, not the final commissioned brand assets.

## Run locally

```sh
npm ci
npm run web
```

The project uses Expo Router and requires a development client for native modules. For the App Store preview, use the single maintained simulator **iPhone 18 Pro Max (iOS 27.0)**:

```sh
npm run ios:preview
```

`ios:preview` builds, installs, launches, and starts the development server for UDID `81F4432B-4E45-44D2-B8AF-089516A8779B`. For other devices, use `npx expo run:ios --device <device name or UDID>` or `npx expo run:android`. Keep Expo-native packages aligned using `npx expo install`.

## Local-first mode

The app works without a Supabase project. The quit plan and event history are stored in SQLite-backed local storage on the device. “Verilerimi dışa aktar” creates a versioned JSON file and opens the system share sheet; the web preview downloads the JSON file in the browser. No analytics SDK is configured. On iOS and Android, Supabase session data is encrypted with AES-GCM using Expo Crypto; its key is stored with Expo SecureStore, backed by Keychain/Keystore. Existing AES-CTR sessions migrate on first read. The browser preview uses browser `localStorage`.

Optional daily check-in reminders start disabled, request operating-system permission only after the user chooses a time and enables them, and stay on that device. The reminder uses generic copy, is suppressed while the app is in the foreground, and is cancelled when local data or the account is deleted. Reminder preferences are not uploaded to Supabase.

## Optional Supabase account and backup

1. Create a Supabase project and copy `.env.example` to `.env`.
2. Set `EXPO_PUBLIC_SUPABASE_URL` and the project's **publishable** key. Never put a `service_role` key in the app.
3. After a development/staging Supabase project exists, apply `supabase/migrations/202610200001_user_snapshots.sql` with the Supabase CLI or SQL Editor. The migration is prepared in the repository and has not been applied to a project.
4. In Supabase Auth → URL Configuration, add `quit-companion://auth/callback` to the allowed redirect URLs. Enable Email signups and configure the production mail sender before release. The signup flow returns to this app route and exchanges the one-time PKCE code for a session.
5. Deploy the account deletion Edge Function: `supabase functions deploy delete-account`. Set its server-only `SUPABASE_SERVICE_ROLE_KEY` secret in Supabase Functions; never put this key in `.env` or the mobile app.
6. Restart Expo after changing `.env` (`npx expo start --clear`).
7. Use Settings → account form to create an account or sign in. Open the confirmation link on the device where the app is installed. Existing cloud data is never silently overwritten: the user is asked whether to download the cloud snapshot or upload this device's snapshot.

The cloud table stores the complete app snapshot as JSONB, protected by per-user RLS. The device copy remains available when offline or after sign-out. Failed cloud writes are kept in a local pending-sync queue bound to the account that created them and retried when connectivity returns or the app becomes active. The account deletion Edge Function includes JWT verification and CORS preflight handling. This initial backup model is for MVP validation; before public launch, validate account deletion, backup retention, conflict resolution, schema validation/size limits, and the final privacy notice against a real Supabase staging project.

## Product notes

- The current engineering privacy inventory and release checks are tracked in `PRIVACY_DATA_INVENTORY.md`; it is not a substitute for the published privacy notice or legal review.

- “Sığınak” is an in-app feature label, not the selected product name.
- The selected mascot species is a fox. `assets/mascot/fox-resting.png` is cropped from the supplied four-pose reference and retains its dark background; replace it with production-ready source artwork before store submission.
- The app icon and Android adaptive icon are warm-toned fox/shelter marks for development preview. Replace or approve them after the product name and final mascot artwork are selected.
- Savings and avoided-cigarette numbers are estimates based on user-entered values. They are not medical outcomes.
- The app is a self-management companion and does not provide diagnosis or treatment.
- Health timeline percentages from the original HTML prototype are intentionally not included.

## Current release readiness

The app is a reviewable local-first MVP preview, not a store submission candidate. The remaining owner-dependent gates are listed in the repository `sprint.md` and `STORE_SUBMISSION_DRAFT.md`: product/mascot naming and approval, Supabase project and staging verification, user research, final artwork, public privacy/support pages and publisher details, legal/editorial review, developer accounts, and real-device accessibility/release checks. The project deliberately contains no production credentials.

## App identifiers

`app.json` currently contains development-only `com.example.*` identifiers and a provisional display name. Replace them after the public app name and developer accounts are finalized, before creating a store build.
