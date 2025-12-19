# Deployment Guide

## Pre-Deployment Checklist

### Supabase Configuration
- [ ] Create production Supabase project
- [ ] Run all SQL migrations in order:
  1. `schema.sql` - Base tables and RLS
  2. `add_pin_and_preferences.sql` - PIN lock and preferences
- [ ] Configure email provider settings
- [ ] Customize email templates (keep neutral/discrete)
- [ ] Enable rate limiting in Supabase dashboard
- [ ] Set up database backups
- [ ] Review RLS policies

### Environment Variables
Create production `.env.local` or configure in hosting platform:
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### Privacy & Security Review
- [ ] Verify page titles are neutral ("Personal Journal")
- [ ] Test panic exit on production domain
- [ ] Confirm no analytics/tracking enabled
- [ ] Review all user-facing copy for neutral language
- [ ] Ensure email templates don't reveal app purpose
- [ ] Test magic link authentication flow
- [ ] Verify data deletion works completely
- [ ] Test PIN lock functionality

### Domain & Hosting
- [ ] Choose neutral domain name (consider generic name)
- [ ] Configure SSL/HTTPS
- [ ] Set up DNS records
- [ ] Configure hosting platform (Vercel recommended)
- [ ] Set custom error pages (404, 500)
- [ ] Configure redirects if needed

### Performance
- [ ] Test with realistic data volumes (100+ logs)
- [ ] Verify heatmap loads efficiently
- [ ] Check mobile responsiveness
- [ ] Test on slow connections
- [ ] Optimize images and assets

## Deployment Steps (Vercel)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub/GitLab
   git push origin main
   ```

2. **Import to Vercel**
   - Go to vercel.com
   - Import your repository
   - Configure project settings

3. **Add Environment Variables**
   - In Vercel project settings
   - Add both NEXT_PUBLIC_* variables
   - Deploy

4. **Post-Deployment Testing**
   - Test signup flow
   - Test magic link emails
   - Test behavior log creation
   - Verify panic exit works
   - Check pattern summaries display
   - Test data deletion

5. **Configure Custom Domain** (Optional)
   - Add domain in Vercel
   - Update DNS records
   - Wait for SSL provisioning

## Post-Deployment Monitoring

### What to Monitor
- Authentication success rates
- Email delivery rates (magic links)
- Error rates in logs
- Database query performance
- Storage usage

### Maintenance Tasks
- Regular database backups
- Review Supabase logs monthly
- Update dependencies quarterly
- Monitor for security advisories

## User Communication

### For Beta/Early Users
```
Welcome to [App Name]

This is a private reflection tool. A few things to know:

- Your data is encrypted and private
- Use Ctrl+Shift+E for quick exit
- Access Settings to delete data anytime
- We never share your information
- This tool provides patterns, not diagnoses

If you have questions, [contact method]
```

### Privacy Policy (Minimal)
Key points to communicate:
- What data is collected (minimal - just email and user entries)
- How it's stored (encrypted, Supabase)
- Who can access it (only the user)
- How to delete it (Settings page)
- No third-party sharing
- No analytics or tracking

## Troubleshooting

### Common Issues

**Magic links not working**
- Check Supabase email settings
- Verify redirect URL is correct
- Check spam folder
- Ensure SMTP is configured

**Database errors**
- Verify RLS policies are active
- Check table names match (behavior_logs not incidents)
- Confirm migrations ran successfully

**Authentication loops**
- Clear cookies and try again
- Check middleware configuration
- Verify environment variables

**Heatmap not displaying**
- Check date-fns is installed
- Verify data has valid dates
- Check for console errors

## Security Incident Response

If a security issue is discovered:

1. **Assess Impact**
   - What data might be affected?
   - How many users?
   - Is it currently exploitable?

2. **Immediate Actions**
   - Deploy fix if available
   - Notify affected users
   - Document incident

3. **Post-Incident**
   - Review security practices
   - Update documentation
   - Consider security audit

## Scaling Considerations

Current architecture handles:
- Small to medium user base (100-1000 users)
- Moderate data per user (1000+ logs)

For larger scale:
- Add database indices for common queries
- Implement pagination for log lists
- Consider caching for pattern summaries
- Monitor Supabase usage quotas
- Upgrade Supabase plan as needed

## Backup & Disaster Recovery

### Daily Backups (Automated in Supabase)
- Enabled by default in paid plans
- Review backup settings

### Manual Backup
```sql
-- Export structure
pg_dump -s your_database_url > schema_backup.sql

-- Export data
pg_dump -a your_database_url > data_backup.sql
```

### Recovery Plan
1. Identify issue
2. Restore from Supabase backup
3. Verify data integrity
4. Notify users if necessary

## Compliance Notes

This app handles potentially sensitive data. Consider:

- **GDPR** (if EU users): Right to deletion, data portability
- **CCPA** (if CA users): Privacy notice, opt-out rights
- **General best practices**: Minimize data collection, encryption, user control

Current implementation supports:
- ✅ Right to deletion (Settings page)
- ✅ Data minimization (no unnecessary fields)
- ✅ User consent (onboarding explains data use)
- ⚠️ Data export (consider adding)

## Support & Maintenance

### User Support
Keep support minimal and discrete:
- Email only (no phone)
- Generic support address
- Response time: 24-48 hours
- Privacy-conscious communication

### Maintenance Schedule
- Security updates: As needed (critical)
- Dependency updates: Monthly
- Feature updates: Quarterly
- Database cleanup: As needed

## Success Metrics (Privacy-Conscious)

Track only essential metrics:
- ✅ Signup rate
- ✅ Error rates
- ✅ System uptime
- ❌ User behavior tracking
- ❌ Personal data analytics
- ❌ Third-party analytics

Keep the user's privacy and safety as the top priority in all decisions.
