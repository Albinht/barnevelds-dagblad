# Database Setup Instructions

## Prerequisites

You need PostgreSQL installed on your system. Choose one of the following options:

### Option 1: Local PostgreSQL
- Install PostgreSQL locally: https://www.postgresql.org/download/
- Create a database named `barnevelds_dagblad`

### Option 2: Docker PostgreSQL
```bash
docker run --name barnevelds-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=barnevelds_dagblad \
  -p 5432:5432 \
  -d postgres:16
```

### Option 3: Cloud PostgreSQL
- Use a service like Supabase, Neon, or Railway
- Create a new PostgreSQL database
- Copy the connection string

## Setup Steps

### 1. Configure Database Connection

Update the `DATABASE_URL` in your `.env.local` file:

```env
# For local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/barnevelds_dagblad?schema=public"

# For Docker
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/barnevelds_dagblad?schema=public"

# For cloud services (example)
DATABASE_URL="postgresql://user:password@host.region.provider.com:5432/database?schema=public"
```

### 2. Run Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR run migrations (for production)
npm run db:migrate
```

### 3. Seed the Database

```bash
# Seed with sample data
npm run db:seed
```

This will create:
- Admin user (username: `editor`, password: `admin123`)
- Editor user (username: `redacteur`, password: `editor123`)
- Sample articles from existing data
- Sample bedrijven (businesses)
- Sample comments
- Newsletter subscriptions
- Advertisement slots

### 4. View Database (Optional)

```bash
# Open Prisma Studio to view/edit data
npm run db:studio
```

## Available Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes (development)
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio GUI

## Troubleshooting

### Connection Refused Error
- Ensure PostgreSQL is running
- Check if the port 5432 is available
- Verify credentials in DATABASE_URL

### Migration Errors
- Drop and recreate the database if schema conflicts occur
- Run `npx prisma migrate reset` to reset everything

### Authentication Issues
- The app will work with or without database
- Falls back to hardcoded credentials if database is unavailable
- Default login: `editor` / `admin123`

## Production Deployment

For production deployment:

1. Use a production PostgreSQL database (e.g., Supabase, Neon, Railway)
2. Update DATABASE_URL in your production environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Optionally seed initial data

## Next Steps

After setting up the database:

1. The existing authentication will now check the database first
2. You can create new users through the database
3. Articles and bedrijven can be managed through the admin API
4. All data will persist in the database instead of static files