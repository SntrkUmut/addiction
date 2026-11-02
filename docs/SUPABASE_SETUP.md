# Supabase Setup Guide (Owner Only)

This document describes how the owner can connect the app to a live Supabase project **after PR #2 is merged**. The app works fully offline without any Supabase connection.

## Current State (PR #2)

- ✅ Migrations are tested locally (see "Testing Migrations" below)
- ✅ App works with no Supabase config (remote fetch and cloud sync are silently disabled)
- ✅ App uses bundled manifest v8 when offline
- ❌ No live Supabase project connected
- ❌ No env vars set
- ❌ No beta or prod content published yet

## Owner's Manual Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and publishable (anon) key from Settings → API

### 2. Apply Migrations

Run the migrations in order against your new project:

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Apply migrations (in order)
supabase db push
```

The migrations are in `supabase/migrations/`:
- `202611020001_user_snapshots_v2.sql` — Snapshot table with milestones support
- `202611020002_content_manifests.sql` — Content manifest table
- `202611020003_content_storage.sql` — Content storage bucket + RLS

All migrations are idempotent and have been tested locally.

### 3. Set Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

**Security Note:** The app only uses the publishable (anon) key for read-only operations. Write operations (content publishing, snapshot writes) are done manually by the owner via Supabase Dashboard or CLI.

### 4. Upload Beta Content (Optional)

To publish content to the beta channel:

1. Go to Supabase Dashboard → Table Editor → `content_manifests`
2. Insert a new row:
   - `channel`: `"beta"`
   - `version`: `8` (or higher)
   - `manifest`: Paste your manifest JSON
   - `notes`: "Initial beta release" (optional)

The app will fetch this manifest automatically (every 6 hours) for users with the beta build.

### 5. Publish Production Content

When content is approved for production:

1. Update the row in `content_manifests`:
   - Change `channel` from `"beta"` to `"prod"`
   - OR insert a new row with `channel: "prod"` and the same version

2. Verify all copy has `copyStatus: "approved"` in the manifest JSON

The production app filters out any content without `copyStatus: "approved"`.

## Testing Migrations Locally

### Option 1: Local Supabase (Recommended)

```bash
# Install Docker and Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push

# View local dashboard
supabase status  # Get URLs
```

This creates a local Postgres instance with all Supabase services. Clean up with `supabase stop`.

### Option 2: CI with Ephemeral Postgres

The migrations can be tested in CI using PGlite or a Postgres service container:

```yaml
# Example GitHub Actions step
- uses: ikalnytskyi/action-setup-postgres@v4
- run: |
    psql -f supabase/migrations/202611020001_user_snapshots_v2.sql
    psql -f supabase/migrations/202611020002_content_manifests.sql
    psql -f supabase/migrations/202611020003_content_storage.sql
```

## Graceful Degradation

The app behavior when Supabase is **not** configured:

- ✅ **Works fully offline** with bundled manifest v8
- ✅ **No errors or warnings** shown to users
- ✅ Check-ins, lights, chapters, milestones all work locally
- ❌ **Remote manifest fetch** silently disabled (uses bundled only)
- ❌ **Cloud sync** not available (Ben → Veri ve Eşitleme shows neutral "not connected" state)

## Content Manifest Schema

See `src/content/manifest.schema.json` for the full JSON Schema.

The manifest includes:
- `chapters` — Chapter definitions with pieces, themes, copy
- `milestones` — Day 1, 7, 14, 30, 60, 90 milestone screens
- `goalPool` — Weekly goal definitions
- `items` — Collection items (crystals, accessories)
- `seasons` — Seasonal events (future)
- `upcoming` — Next chapter teaser

Each element has an optional `copyStatus` field:
- `"approved"` — Shown in production
- `"pending"` — Shown only in dev/beta (awaiting owner approval)
- `"draft"` — Shown only in dev (early WIP)

## Support

For questions about the Supabase setup, contact the repository owner.
