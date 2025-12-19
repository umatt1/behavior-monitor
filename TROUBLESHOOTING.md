# Troubleshooting Guide

## Authentication Issues

### "Email link is invalid or has expired"

**Symptom**: After clicking the magic link in your email, you see an error page with "otp_expired" in the URL.

**Root Cause**: Supabase doesn't know where to redirect the authentication callback.

**Solution**:
1. Open your Supabase dashboard
2. Navigate to: **Authentication** → **URL Configuration**
3. Set the **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
4. Add to **Redirect URLs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
5. Click **Save**
6. Try the magic link authentication again

**Alternative**: Use the password-based login instead by toggling to "Password" mode in the login form.

### Magic Link Not Arriving in Email

**Check**:
1. Spam/junk folder
2. Email provider blocking (Gmail sometimes flags Supabase emails)
3. Supabase email quota (free tier has limits)

**Solutions**:
- Use a different email provider
- Configure custom SMTP in Supabase (Settings → Auth → SMTP Settings)
- Use password authentication instead

### Session Expires Immediately

**Symptom**: You log in but are immediately logged out.

**Possible Causes**:
1. Browser blocking cookies/localStorage
2. Incognito/private mode issues
3. Browser extensions interfering

**Solutions**:
- Allow cookies for localhost
- Disable privacy-focused extensions temporarily
- Try a different browser
- Check browser console for errors

## Database Issues

### "relation 'behavior_logs' does not exist"

**Symptom**: Errors about missing tables when trying to use the app.

**Solution**:
1. Go to Supabase dashboard: **SQL Editor**
2. Run the complete setup script: `supabase/SETUP_ALL.sql`
3. Or run these in order:
   - `supabase/schema.sql`
   - Each file in `supabase/migrations/` (in alphabetical order)

### RLS Policy Errors

**Symptom**: "new row violates row-level security policy"

**Solutions**:
1. Make sure you're logged in
2. Verify RLS policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'behavior_logs';
   ```
3. Re-run `supabase/schema.sql` if policies are missing

### Data Not Showing Up

**Check**:
1. Are you logged in with the same account that created the data?
2. Database connection successful? (check terminal for errors)
3. Browser console for fetch errors

## Development Issues

### "pnpm: command not found"

**Solution**:
```bash
npm install -g pnpm
```

### Port 3000 Already in Use

**Solutions**:
```bash
# Option 1: Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
pnpm dev -p 3001
```

### TypeScript Errors After Pulling Changes

**Solution**:
```bash
# Clear Next.js cache and rebuild
rm -rf .next
pnpm install
pnpm dev
```

### Environment Variables Not Loading

**Check**:
1. File is named `.env.local` (not `.env` or `env.local`)
2. File is in project root directory
3. Variables start with `NEXT_PUBLIC_` for client-side access
4. Restart dev server after changing .env files

**Common mistake**:
```env
# ❌ Wrong
SUPABASE_URL=https://...

# ✅ Correct
NEXT_PUBLIC_SUPABASE_URL=https://...
```

## Runtime Errors

### Hydration Errors

**Symptom**: Console warnings about React hydration mismatches.

**Common Causes**:
- Server-rendering date/time that differs from client
- Using `window` or `document` in components without checking
- Browser extensions modifying the DOM

**Solutions**:
- Wrap problematic code in `useEffect`
- Add `suppressHydrationWarning` to affected elements (sparingly)
- Use `'use client'` directive if component needs browser APIs

### Middleware Redirect Loop

**Symptom**: Page keeps redirecting endlessly.

**Check**: [middleware.ts](middleware.ts) configuration
- Ensure public paths are excluded
- Verify auth callback route is accessible

**Current config**:
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Privacy & Security

### Panic Exit Not Working

**Test**:
1. Make sure you're not in an input field
2. Try both `Ctrl+Shift+E` (Windows/Linux) and `Cmd+Shift+E` (Mac)
3. Check browser console for JavaScript errors

**Debug**:
```javascript
// Open browser console and test:
window.addEventListener('keydown', (e) => {
  console.log('Key:', e.key, 'Ctrl:', e.ctrlKey, 'Meta:', e.metaKey, 'Shift:', e.shiftKey);
});
```

### PIN Lock Not Persisting

**Symptom**: PIN lock state resets after refresh.

**Explanation**: This is intentional for security. The unlock state is stored in `sessionStorage`, which clears when:
- Browser/tab closes
- Manual logout
- Session expires

**To change**: Modify [app/components/auth/PinLock.tsx](app/components/auth/PinLock.tsx) to use `localStorage` instead (less secure but more persistent).

### Browser History Concerns

**Recommendations**:
1. Use incognito/private browsing mode
2. Clear browser history regularly:
   - Chrome: `Ctrl+Shift+Delete` / `Cmd+Shift+Delete`
   - Firefox: `Ctrl+Shift+Delete` / `Cmd+Shift+Delete`
3. Consider using panic exit frequently
4. Enable "Clear history on exit" in browser settings

## Deployment Issues

### Vercel Deployment Failing

**Common Issues**:
1. Missing environment variables
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard
2. Build errors
   - Run `pnpm build` locally first to catch issues
3. Node version mismatch
   - Ensure Vercel is using Node 18+

### Supabase Connection in Production

**Update URLs**:
1. In Supabase: Authentication → URL Configuration
2. Change Site URL to production domain
3. Add production callback URL: `https://yourdomain.com/auth/callback`
4. Update `NEXT_PUBLIC_SUPABASE_URL` environment variable in hosting platform

## Data Management

### Exporting Data

Currently manual:
1. Go to Supabase dashboard: **Table Editor**
2. Select `behavior_logs` table
3. Click **Export** → CSV

**Planned**: In-app encrypted export feature (see Future Enhancements)

### Deleting All Data

**Via App**:
1. Go to Settings
2. Click "Delete All My Data"
3. Confirm

**Via Database**:
```sql
-- Delete all data for current user
DELETE FROM behavior_logs WHERE user_id = auth.uid();
DELETE FROM profiles WHERE id = auth.uid();
DELETE FROM user_preferences WHERE user_id = auth.uid();
```

## Getting Help

### Check These First
1. Browser console (F12 → Console tab)
2. Terminal/command line output
3. Supabase dashboard logs (Logs & Analytics)
4. This troubleshooting guide

### Useful Commands

```bash
# Check dev server status
pnpm dev

# Clear cache and restart
rm -rf .next && pnpm dev

# Check package versions
pnpm list react next

# View environment variables (without values)
cat .env.local | cut -d'=' -f1
```

### Debug Mode

Add to `.env.local` for more verbose logging:
```env
NEXT_PUBLIC_DEBUG=true
```

## Known Limitations

1. **Email Rate Limiting**: Supabase free tier limits email sends
2. **Magic Link Expiry**: Links expire after 1 hour by default
3. **Browser Storage**: Data in `sessionStorage` and `localStorage` can be cleared by user or browser
4. **PIN Security**: PIN is not cryptographically strong - it's a UX convenience layer

## Still Having Issues?

1. Check the [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
3. Consult Supabase documentation: https://supabase.com/docs
4. Check Next.js documentation: https://nextjs.org/docs
