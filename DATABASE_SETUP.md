# Database Setup - Prisma Postgres

## Quick Start with Prisma Postgres

This project uses Prisma Postgres for database management. Follow these steps to set up your database:

## 1. Generate a Starter Project (Optional)

If you're starting fresh, you can scaffold a new project with Prisma pre-configured:

```bash
$ npx try-prisma@latest \
    --template databases/prisma-postgres \
    --name hello-prisma \
    --install npm
```

## 2. Configure Your Database Access

Add the following environment variables to your project's `.env` file (create one at the root if it doesn't exist):

```env
# Prisma Postgres Database URL
# Get this from your Prisma Cloud dashboard
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# For Prisma Accelerate (recommended for production):
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
```

### Getting Your Database Credentials:

1. Go to [Prisma Cloud](https://console.prisma.io/)
2. Create a new project or select existing
3. Click "Generate database credentials"
4. Copy the DATABASE_URL and add to your `.env` file

## 3. Run Your First Migration

Change into your project folder and create your initial database schema:

```bash
$ cd barnevelds-dagblad
$ npx prisma migrate dev --name init
```

## 4. Query Your Database

Test your database connection by running sample queries:

```bash
$ npm run queries
```

Or use Prisma Studio for a visual interface:

```bash
$ npm run db:studio
```

## 5. Seed the Database

Add initial data to your database:

```bash
# Seed with sample data
$ npm run db:seed
```

This will create:
- Admin users with proper authentication
- Sample articles (if needed)
- Business listings
- Initial configuration

## 6. Connect with 3rd Party Database Editors

You can connect to your Prisma Postgres instance using third-party database editors like:
- pgAdmin
- TablePlus
- Postico
- DBeaver

Use the `@prisma/ppg-tunnel` package for secure connections:

```bash
$ npm install -D @prisma/ppg-tunnel
$ npx ppg-tunnel --url $DATABASE_URL
```

Check [Prisma docs](https://www.prisma.io/docs/orm/tools/ppg-tunnel) for more information.

## Environment Variables for Production (Vercel)

Set these environment variables in your Vercel dashboard:

```env
# Required
DATABASE_URL=your_prisma_postgres_url_here
NEXTAUTH_URL=https://www.barneveldsdagblad.nl
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional but recommended
DATABASE_POOL_SIZE=10
DATABASE_CONNECTION_TIMEOUT=30000
```

## Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Create migrations
npm run db:migrate

# Push schema changes (development)
npm run db:push

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Current Database Schema

The database includes these models:
- **User** - Admin and editor accounts
- **Article** - News articles with full content
- **Bedrijf** - Business listings
- **Comment** - Article comments
- **Media** - Image and file attachments
- **NewsletterSubscriber** - Email subscriptions
- **Category** - Article categories
- **Tag** - Article tags
- **Advertisement** - Ad placements

## Troubleshooting

### Connection Issues
- Ensure DATABASE_URL is correctly set in `.env`
- Check if your IP is whitelisted in Prisma Cloud
- Verify the database is active in Prisma Cloud dashboard

### Migration Issues
- Run `npx prisma generate` after schema changes
- Use `npx prisma db push` for development
- Use `npx prisma migrate deploy` for production

### Performance
- Enable connection pooling for production
- Use Prisma Accelerate for edge caching
- Monitor query performance in Prisma Studio

## Important Notes

### Article Fallback Behavior
- The system now prioritizes database content
- JSON files are ONLY used if database connection fails
- Deleted articles will stay deleted (no JSON fallback for empty DB)
- This ensures data consistency

### Authentication
- Uses NextAuth with Google OAuth
- Whitelisted emails only can access admin
- Database stores user sessions

## Support

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Discord](https://discord.gg/prisma)
- [GitHub Issues](https://github.com/prisma/prisma/issues)
- [Vercel Deployment Guide](https://vercel.com/docs/storage/vercel-postgres)