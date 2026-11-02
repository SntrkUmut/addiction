# MVP privacy data inventory

**Status:** engineering inventory, not a published privacy notice. Confirm hosting region, retention, legal basis, age coverage, and final copy with the product owner before store submission.

## Data collected in the MVP

| Data | Why the app uses it | Device | Supabase when account sync is enabled | Shared outside app |
|---|---|---:|---:|---:|
| Display name (optional) | Personalize the quit plan | Yes | Included in the user's JSON snapshot | Only if user exports |
| Cigarettes per day | Estimate avoided cigarettes | Yes | Included in snapshot | Only if user exports |
| Pack price, pack size, currency | Estimate money saved | Yes | Included in snapshot | Only if user exports |
| Quit date | Calculate elapsed time and progress | Yes | Included in snapshot | Only if user exports |
| Personal reason for quitting (optional) | Show the user's own motivation | Yes | Included in snapshot | Only if user exports |
| Check-in mood, coping-tool id/duration, urge result, slip event and timestamps | Show the user's progress history | Yes | Included in snapshot | Only if user exports |
| Email and authentication identifiers | Create and manage an optional account | Supabase Auth session is stored on device; native session is encrypted | Supabase Auth | Supabase processes account/auth data |
| Reminder preference (enabled state, local time, scheduled notification identifier) | Schedule or cancel an optional daily check-in reminder | Yes | No | No; notification content is generic and contains no plan or health details |

The app does not request contacts, location, camera, microphone, or health platform APIs. Notification permission is requested only after the user chooses a reminder time and turns the reminder on; reminders are scheduled locally and can be cancelled in Settings. `@react-native-community/netinfo` reads connection status on device to retry a pending backup; the app does not send that status to an analytics service. No analytics or crash-reporting SDK is configured.

## Storage and transfer

- Local plan and history are stored using Expo SQLite-backed local storage. The plan data itself is not encrypted at rest by this app; the operating system's device security applies.
- Native Supabase auth session data is AES-GCM encrypted in AsyncStorage, with its encryption key in SecureStore/Keychain/Keystore. Browser preview auth uses browser `localStorage`.
- Cloud backup is optional. When configured and signed in, the app sends the complete snapshot to Supabase `public.user_snapshots` as JSONB. RLS limits a row to its owner. Account deletion removes the Auth user; the snapshot foreign key cascades on delete.
- A failed cloud write creates a small local retry marker containing only the Supabase user id. Retry uses the latest local snapshot and only runs when the same account is active. Clearing device data also clears this marker.
- Data export creates a versioned JSON file in the device cache and hands its file URL to the operating system share sheet; the web preview downloads a JSON file through the browser. The user chooses whether and where to share it. The native temporary file remains in cache and may be cleared by the operating system.

## User controls and lifecycle

- **Export:** Settings → Export my data. Verify the exact fields and clear wording on iOS and Android before release.
- **Clear device copy:** Settings → Clear data on this device. This removes the local plan, history, and pending sync marker; it intentionally leaves a remote backup intact.
- **Delete account:** Settings → Delete account calls the authenticated `delete-account` Edge Function, which deletes the Supabase Auth user and cascaded snapshot, then clears local data. Verify this behavior against staging before launch.
- **Sign out:** removes the session but leaves the local plan and history available on the device.
- Clearing local data or deleting the account also cancels this app's scheduled daily reminder. The operating-system permission itself remains under the user's device Settings.

## Release checks still required

- Confirm Supabase project region, backup/log retention, email provider, and data-processing terms; disclose the actual configuration in the published privacy notice.
- Verify export, local clear, sign-out, account deletion, cascade behavior, RLS isolation, and email confirmation using a non-production staging account.
- Inspect platform privacy manifests and store privacy/data-safety declarations against the final dependency graph and Supabase configuration.
- Decide minimum age and launch regions; obtain the appropriate privacy/legal review.
- Re-run dependency vulnerability review before release. After adding the SDK 58 file export modules, `npm audit --omit=dev` reports 29 findings (21 high, 8 moderate), including transitive Expo/Metro/Xcode build tooling. The suggested forced fix downgrades Expo to SDK 44 and is not safe to apply; review patched SDK-compatible versions before release.
