# Personal Reflection Journal

A privacy-first, secure application for individuals to document behavioral patterns and gain clarity in confusing or difficult relationship situations. This tool emphasizes neutral observation over judgment, providing a safe space for personal reflection.

## Core Principles

- **Privacy First**: No partner access, no sharing features, encrypted storage
- **Neutral Language**: Descriptive, non-judgmental observations
- **User Safety**: Quick exit features, discrete branding, data deletion controls
- **Personal Clarity**: Pattern recognition without prescriptive conclusions

## Tech Stack

- **Frontend**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (Email/Password + Magic Link)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Language**: TypeScript
- **Visualizations**: react-calendar-heatmap, date-fns

## Key Features Implemented

### Authentication & Security
- ✅ Magic link (passwordless) authentication
- ✅ Traditional email/password authentication
- ✅ Optional PIN lock for additional privacy
- ✅ Quick panic exit (Ctrl+Shift+E) to neutral site
- ✅ Row Level Security on all database tables
- ✅ Clear data deletion options

### Privacy & Safety
- ✅ Neutral, non-judgmental language throughout
- ✅ No partner access or sharing features
- ✅ Discrete page titles ("Personal Journal")
- ✅ Privacy-focused onboarding flow
- ✅ Disclaimers and crisis resource links

### Core Functionality
- ✅ Behavior logging with neutral categories:
  - Broken promises
  - Boundary violations
  - Sudden affection after conflict
  - Gaslighting indicators
  - Intimidation or pressure
  - Emotional withdrawal
  - Inconsistent communication
  - Pattern interruption
- ✅ Emotion tracking (before/after)
- ✅ Pattern visualization with heatmap
- ✅ Weekly pattern summaries (anchor feature)
- ✅ Intensity tracking (1-5 scale)

### User Experience
- ✅ 4-step privacy-focused onboarding
- ✅ Dashboard with pattern insights
- ✅ Visual heatmap showing activity clusters
- ✅ Settings page with data management
- ✅ Responsive design

## Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd behavior-monitor
   pnpm install
   ```

2. **Configure Supabase**
   - Create a new Supabase project at https://supabase.com
   - Get your project URL and anon key from Project Settings > API

3. **Set Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set Up Database**
   - In Supabase dashboard, go to SQL Editor
   - Run `supabase/schema.sql` to create tables and policies
   - Optionally run migration scripts in `supabase/migrations/`

5. **Configure Email Authentication**
   - In Supabase dashboard: Authentication > Providers
   - Enable Email provider
   - Configure email templates to be neutral/discrete
   - **IMPORTANT**: Go to Authentication > URL Configuration
     - Set Site URL to `http://localhost:3000` (dev) or your production URL
     - Add `http://localhost:3000/auth/callback` to Redirect URLs
     - This fixes "Email link is invalid or has expired" errors

6. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Navigate to http://localhost:3000

### Database Migration (If Upgrading)
If you have an existing incidents table, run the migration:
```sql
-- See supabase/migrations/migrate_incidents_to_behavior_logs.sql
```

## Important Configuration Notes

### Email Templates
Customize Supabase email templates to be discrete:
- Use neutral subject lines like "Your sign-in link"
- Avoid revealing the app's purpose in emails
- Keep sender name generic

### Privacy Considerations
- Page title is set to "Personal Journal" for discretion
- No analytics or tracking by default
- Consider hosting on a generic domain
- Regular data exports should be encrypted

## Usage Guide

### For End Users

#### First Time Setup
1. Create account using email (no personal details required)
2. Complete the 4-step onboarding to understand the tool
3. Optionally set up a PIN for extra privacy

#### Logging Entries
1. Click "Log new entry" from dashboard
2. Select the category that best describes what happened
3. Rate the intensity (1-5)
4. Describe what happened
5. Record how you felt before and after (optional but recommended)

#### Understanding Patterns
- View the heatmap to see clustering over time
- Check the Pattern Observations card for descriptive summaries
- Look for frequency increases or decreases
- Compare emotional states before/after events

#### Safety Features
- Use Ctrl+Shift+E (or Cmd+Shift+E on Mac) for quick exit
- Clear browser history regularly if device security is a concern
- Use Settings to delete data or account anytime

## Architecture Notes

### Database Schema
- `behavior_logs`: Main table for entries (replaces old "incidents")
- `profiles`: User profile information
- `user_preferences`: PIN and privacy settings
- All tables have Row Level Security enforcing user isolation

### Key Components
- `/app/components/auth/`: Authentication flows
- `/app/components/dashboard/`: Dashboard visualizations and summaries
- `/app/components/onboarding/`: Privacy-focused onboarding
- `/app/(dashboard)/`: Protected pages requiring authentication

### Security Layers
1. Supabase RLS policies (database level)
2. Middleware authentication checks (application level)
3. Optional PIN lock (user preference level)
4. Client-side session storage for PIN unlock state

## Deployment Considerations

### Production Checklist
- [ ] Configure custom domain (consider neutral naming)
- [ ] Set up SSL/HTTPS
- [ ] Configure Supabase production environment
- [ ] Customize email templates for discretion
- [ ] Set rate limiting on auth endpoints
- [ ] Enable Supabase database backups
- [ ] Consider adding Cloudflare for DDoS protection
- [ ] Review and minimize logging/analytics
- [ ] Test panic exit on production domain

### Recommended Hosting
- Vercel (Next.js optimized)
- Netlify (alternative)
- Self-hosted for maximum privacy

## Future Enhancements

Potential improvements while maintaining core principles:
- Encrypted data export
- Offline PWA support
- Multi-device sync with E2E encryption
- Advanced pattern detection algorithms
- Customizable categories
- Journal entries alongside behavior logs
- Milestone tracking (life events correlation)
   - Consider implementing pagination for incident listing

3. **UX Improvements Needed**:
   - Add better error messages
   - Implement loading states
   - Add confirmation dialogs for critical actions

## Contributing

This project is in active development. When contributing:
1. Create feature branches from `main`
2. Follow the existing code style
3. Add appropriate tests
4. Update documentation as needed

## Testing

Test user credentials for development:
- Email: test@example.com
- Password: password123

## License

[Add your chosen license]
