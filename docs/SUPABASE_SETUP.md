# Supabase Setup

This document describes how the app connects to Supabase for remote content manifests and user state sync.

## Overview

The app uses Supabase for:
- **Remote content manifests** (content_manifests table, beta/prod channels)
- **User state sync** (user_snapshots table, optional backup)

**No credentials = no problem:** The app works fully offline if Supabase env vars are not set. Remote features silently turn off.

---

## Environment Variables

The app reads two environment variables for Supabase access:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_key_here
```

### Key Format
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` uses Supabase's new **publishable key format** (`sb_publishable_...`)
- The client accepts this format natively (supabase-js v2)
- **Never commit real credentials** to the repo (not in `.env`, `.env.example`, `app.json`, `eas.json`, or code)

### Setting Environment Variables

#### Local Development
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Supabase project URL and anon key
3. `.env` is gitignored and never committed

#### EAS Builds (TestFlight/App Store)
Set environment variables in EAS using one of:

**Option 1: EAS CLI** (`eas env:set` is the current name of `eas env:create`)
```bash
eas env:set --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co" --environment preview --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_your_key_here" --environment preview --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co" --environment production --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_your_key_here" --environment production --visibility plaintext
```

**Option 2: Expo Dashboard**
1. Go to https://expo.dev/accounts/[account]/projects/[project]/secrets
2. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Secrets are injected into builds automatically

---

## Channel Selection

The app fetches content manifests from different channels:

- **`beta`**: Non-production builds (TestFlight, development)
- **`prod`**: App Store production builds

Channel is controlled by:
```bash
EXPO_PUBLIC_MANIFEST_CHANNEL=beta  # or "prod"
```

**Default:** `beta` if not set

**Fallback behavior:**
- If the requested channel has no manifest rows, the app falls back to the bundled **v11** manifest (all 8 chapters) without errors
- If Supabase env vars are missing, remote fetch is skipped entirely (bundled v11 manifest always used)

---

## Database Migrations

The Supabase project has the following migrations applied (in order):

| Timestamp | File | Description |
|-----------|------|-------------|
| `20261102160803` | `20261020000001_user_snapshots.sql` | Initial user_snapshots table |
| `20261102160815` | `20261102000001_user_snapshots_v2.sql` | user_snapshots v2 schema |
| `20261102160819` | `20261102000002_content_manifests.sql` | content_manifests table |
| `20261102160821` | `20261102000003_content_storage.sql` | content_storage table |

### Using Supabase CLI

If you're using the Supabase CLI locally and have different migration file names, you need to repair the migration history before running `supabase db push`:

```bash
# Repair migration timestamps to match remote
supabase migration repair 20261102160803 --status applied
supabase migration repair 20261102160815 --status applied
supabase migration repair 20261102160819 --status applied
supabase migration repair 20261102160821 --status applied

# Now you can push new migrations
supabase db push
```

**Note:** Migration files in this repo are **not renamed** to match the remote timestamps. This is intentional to avoid breaking existing local dev setups.

---

## Security

- **Anon key only:** The app uses the Supabase anon/publishable key for all operations
- **No service-role key:** Never use or commit the service-role key (server-side only)
- **Row Level Security (RLS):** All tables have RLS enabled
  - `user_snapshots`: Users can only read/write their own rows
  - `content_manifests`: Read-only for all users
  - `content_storage`: Read-only for all users

---

## Testing Without Supabase

The app works fully offline without Supabase credentials:

1. Don't set `EXPO_PUBLIC_SUPABASE_*` env vars (or leave `.env` empty)
2. The app will:
   - Use bundled manifest (no remote fetch)
   - Store state locally only (no cloud sync)
   - Function normally for all core flows

This is useful for:
- Local development without credentials
- TestFlight builds before Supabase is set up
- Users who prefer fully local/offline operation

---

## TestFlight için Umut'un yapacakları

Bu adımları **sen çalıştırırsın** (kendi mevcut Apple ve Expo hesaplarınla). Ajan `eas init`, `eas build` veya `eas submit` çalıştırmaz; ücretli bir işlem de başlatmaz.

Bundle id her iki platformda da `com.quit.addiction`. Sürüm `1.0.0`, iOS `buildNumber` `"1"`, Android `versionCode` `1`.

### 1. EAS CLI kur ve giriş yap

```bash
npm install -g eas-cli
eas login
```

### 2. Projeyi Expo hesabına bağla (bir kez)

Repo kökünde:

```bash
eas init
```

Bu komut `app.json` içindeki `extra.eas.projectId` yer tutucusunu senin Expo proje kimliğinle değiştirir.

### 3. Supabase ortam değişkenlerini ayarla

Güncel EAS CLI'da oluşturma komutu `eas env:set` (eski adı `eas env:create`). `preview` = TestFlight, `production` = App Store. Değerleri kendi Supabase projenle değiştir.

```bash
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co" --environment preview --visibility plaintext
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_YOUR_KEY" --environment preview --visibility plaintext
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_YOUR_KEY" --environment production --visibility plaintext
```

`eas env:create` yoksa aynı adımlar `eas env:set` ile:

```bash
eas env:set --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co" --environment preview --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_YOUR_KEY" --environment preview --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co" --environment production --visibility plaintext
eas env:set --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_YOUR_KEY" --environment production --visibility plaintext
```

Kontrol:

```bash
eas env:list --environment preview
eas env:list --environment production
```

Supabase henüz yoksa bu adımı atla; uygulama çevrimdışı bundled v11 manifesto ile çalışır.

### 4. İlk iOS production build

```bash
eas build --platform ios --profile production
```

Apple hesabınla giriş yapman ve sertifikaları onaylaman istenir.

### 5. TestFlight'a gönder

```bash
eas submit --platform ios
```

App Store Connect / TestFlight yine senin Apple hesabınla açılır.
