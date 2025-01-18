# Behavior Monitor

A secure and private application for documenting and tracking behavioral patterns over time. This tool is designed to help individuals in challenging situations maintain a record of incidents and understand patterns.

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript

## Project Structure

```
behavior-monitor/
├── app/
│   ├── (auth)/
│   │   └── login/          # Authentication pages
│   ├── (dashboard)/
│   │   ├── dashboard/      # Main dashboard
│   │   └── incidents/      # Incident management
│   ├── components/
│   │   ├── auth/          # Auth-related components
│   │   ├── layout/        # Layout components
│   │   └── providers/     # Context providers
│   ├── utils/
│   │   ├── supabase/     # Supabase client utilities
│   │   └── dates.ts      # Date formatting utilities
│   └── types/            # TypeScript type definitions
├── supabase/
│   └── schema.sql        # Database schema
```

## Current Status

### Completed Features
- Basic project setup with Next.js and Supabase integration
- Authentication system with protected routes
- Database schema with Row Level Security
- Basic UI components:
  - Login page
  - Dashboard with incident listing
  - New incident form

### In Progress
- User registration flow
- Email verification
- Password reset functionality
- Incident analysis and trend visualization

### Planned Features
- Export functionality for incidents
- Enhanced security features
- Mobile-responsive design improvements
- Incident categorization and tagging
- Support for file attachments
- Emergency contact information

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Go to your Supabase project
   - Open the SQL Editor
   - Run the contents of `supabase/schema.sql`

5. Run the development server:
   ```bash
   pnpm dev
   ```

## Known Issues and Considerations

1. **Security**:
   - Need to implement rate limiting for login attempts
   - Should add 2FA support
   - Consider adding encryption for sensitive incident details

2. **Performance**:
   - Dashboard queries need optimization for larger datasets
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
