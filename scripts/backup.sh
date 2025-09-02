#!/bin/bash

# Backup script for Barnevelds Dagblad
# This script creates backups of the database and uploads

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
DATABASE_BACKUP_FILE="db_backup_${DATE}.sql"
UPLOADS_BACKUP_FILE="uploads_backup_${DATE}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup process..."

# Database backup
echo "Creating database backup..."
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

# Extract database connection details from DATABASE_URL
# Format: postgres://user:password@host:port/database
DB_URL_REGEX='postgres://([^:]+):([^@]+)@([^:]+):([0-9]+)/([^?]+)'

if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
    
    PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --verbose --clean --no-owner --no-privileges > "$BACKUP_DIR/$DATABASE_BACKUP_FILE"
    echo "Database backup completed: $BACKUP_DIR/$DATABASE_BACKUP_FILE"
else
    echo "ERROR: Could not parse DATABASE_URL"
    exit 1
fi

# Uploads backup
echo "Creating uploads backup..."
if [ -d "public/uploads" ]; then
    tar -czf "$BACKUP_DIR/$UPLOADS_BACKUP_FILE" public/uploads/
    echo "Uploads backup completed: $BACKUP_DIR/$UPLOADS_BACKUP_FILE"
else
    echo "No uploads directory found, skipping uploads backup"
fi

# Cleanup old backups (keep last 7 days)
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup process completed successfully!"
echo "Files created:"
echo "  - $BACKUP_DIR/$DATABASE_BACKUP_FILE"
if [ -d "public/uploads" ]; then
    echo "  - $BACKUP_DIR/$UPLOADS_BACKUP_FILE"
fi