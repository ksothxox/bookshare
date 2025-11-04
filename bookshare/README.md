# BookShare

Cross‑platform (Android/iOS) home‑library app built with **Expo (React Native)** and **Supabase**.
Features:
- Scan ISBN codes to add books (Open Library / Google Books).
- Full‑colour covers (upload from phone or fetch by ISBN).
- Single‑shelf per book; mark shelves **Private** to hide from friends.
- **Friends‑only** sharing: search by username, send/accept requests.
- Borrow requests between friends; owners approve/decline/mark returned.

## Quick Start

```bash
npm install
cp .env.example .env  # fill SUPABASE_URL + SUPABASE_ANON_KEY
npm run start
```

### Supabase
1. Create project on supabase.com.
2. Storage → bucket `covers` (Public).
3. SQL Editor → run `supabase/schema.sql` then `supabase/policies.sql`.
4. Edge Functions → deploy `borrow_request` (see `supabase/functions/borrow_request/index.ts`).

### Build apps (EAS)
```bash
npx eas build:configure
npx eas build -p android
# npx eas build -p ios   # requires Apple dev account
```

### Optional: Public site
Deploy `public-site` to Vercel; or skip (friends-only mode works without it).
