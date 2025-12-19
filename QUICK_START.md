# Quick Start Guide

Get the Behavior Monitor app running in 5 minutes.

## Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Supabase account (free tier works)

## Setup Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Wait for database to provision (~2 minutes)

### 3. Set Up Database
1. In Supabase dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Paste and run
4. Copy contents of `supabase/migrations/add_pin_and_preferences.sql`
5. Paste and run

### 4. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
```

Get these from: Supabase Dashboard → Settings → API

### 5. Run Dev Server
```bash
pnpm dev
```

Visit http://localhost:3000

## First Test

### Create Account
1. Go to http://localhost:3000/login
2. Enter email address
3. Click "Send Sign-In Link" (default magic link)
4. Check email for link
5. Click link to sign in

### Or Use Password
1. Toggle to "Password" tab
2. You'll need to create account in Supabase first:
   - Dashboard → Authentication → Users
   - Add User manually
   - Or set up signup page

### Log First Entry
1. After login, click "Log new entry"
2. Fill out form:
   - Select category (e.g., "Broken promises")
   - Set intensity (1-5)
   - Describe what happened
   - Add emotions (optional)
3. Click "Save Entry"

### View Patterns
1. Return to dashboard
2. See your entry in the list
3. Add more entries (different dates help)
4. Pattern Summary appears with 1+ entries
5. Heatmap shows activity over time

## Quick Tests

### Test Panic Exit
- Press `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
- Should redirect to weather.com immediately

### Test Data Deletion
1. Click "Settings" in header
2. Scroll to "Privacy & Data"
3. Choose deletion type
4. Type "DELETE"
5. Confirm

### Test Onboarding
1. Open: http://localhost:3000/onboarding
2. Walk through 4 steps
3. Should explain privacy and usage

## Troubleshooting

### Can't sign in
- Check Supabase email settings
- Verify env variables are correct
- Try password mode if magic link fails

### Database errors
- Confirm both SQL files ran successfully
- Check table names in Supabase → Table Editor
- Should see: `behavior_logs`, `profiles`, `user_preferences`

### Heatmap not showing
- Ensure dates are valid ISO strings
- Check browser console for errors
- Verify `date-fns` is installed

### TypeScript errors
- Run: `pnpm install` again
- Restart dev server
- Check Node version (should be 18+)

## Next Steps

1. **Customize Categories**: Edit behavior categories in:
   - `supabase/schema.sql` (CHECK constraint)
   - `app/types/index.ts` (TypeScript type)
   - `app/(dashboard)/incidents/new/page.tsx` (dropdown options)

2. **Add PIN Setup UI**: Currently PIN can only be set via SQL
   - Create Settings page section for PIN
   - Use crypto.subtle.digest to hash
   - Store in user_preferences table

3. **Create Signup Page**: Currently requires manual user creation
   - Build signup form
   - Use Supabase signUp method
   - Redirect to onboarding

4. **Customize Branding**: 
   - Update `app/layout.tsx` metadata
   - Change panic exit URL in `PanicExit.tsx`
   - Customize color scheme in Tailwind config

## Common Customizations

### Change Panic Exit URL
Edit `app/components/layout/PanicExit.tsx`:
```typescript
const handlePanicExit = () => {
  window.location.replace('https://www.google.com') // Change this
}
```

### Change App Name
Edit `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Custom Name',
  description: 'Your custom description',
}
```

### Add More Categories
1. Update schema constraint
2. Update TypeScript type
3. Update form dropdown
4. Optionally migrate existing data

### Change Intensity Scale
Currently 1-5, to change:
1. Update CHECK constraint in schema
2. Update form input range
3. Update labels in form

## Development Tips

- Use `pnpm dev` for hot reload
- Check Supabase logs for database errors
- Use browser DevTools → Application → Storage to check session
- Test in incognito for fresh sessions
- Clear cookies if authentication seems stuck

## Production Checklist

Before deploying:
- [ ] Review all environment variables
- [ ] Test on mobile devices
- [ ] Check email templates in Supabase
- [ ] Set up custom domain
- [ ] Enable database backups
- [ ] Review RLS policies
- [ ] Test panic exit on production domain
- [ ] Check all forms validate properly

## Getting Help

- Check IMPLEMENTATION_SUMMARY.md for detailed changes
- See DEPLOYMENT.md for production setup
- Review COPILOT_KICKOFF.md for requirements
- Check Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs

## Key Files to Know

- `app/(dashboard)/dashboard/page.tsx` - Main dashboard
- `app/(dashboard)/incidents/new/page.tsx` - Entry form
- `app/components/dashboard/PatternSummary.tsx` - Pattern insights
- `supabase/schema.sql` - Database structure
- `middleware.ts` - Auth protection

Happy coding! Remember: user privacy and safety come first. 🔒
