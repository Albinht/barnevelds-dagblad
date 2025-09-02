#!/bin/bash

# Restore script for Barnevelds Dagblad
# This script restores database and uploads from backup files

set -e

# Check if backup file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <database_backup_file> [uploads_backup_file]"
    echo "Example: $0 backups/db_backup_20241201_120000.sql backups/uploads_backup_20241201_120000.tar.gz"
    exit 1
fi

DATABASE_BACKUP_FILE="$1"
UPLOADS_BACKUP_FILE="$2"

# Validate database backup file exists
if [ ! -f "$DATABASE_BACKUP_FILE" ]; then
    echo "ERROR: Database backup file '$DATABASE_BACKUP_FILE' not found"
    exit 1
fi

echo "Starting restore process..."

# Database restore
echo "Restoring database from $DATABASE_BACKUP_FILE..."
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

# Extract database connection details from DATABASE_URL
DB_URL_REGEX='postgres://([^:]+):([^@]+)@([^:]+):([0-9]+)/([^?]+)'

if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
    
    echo "WARNING: This will replace all existing data in the database!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Restore cancelled"
        exit 1
    fi
    
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$DATABASE_BACKUP_FILE"
    echo "Database restore completed successfully!"
else
    echo "ERROR: Could not parse DATABASE_URL"
    exit 1
fi

# Uploads restore
if [ -n "$UPLOADS_BACKUP_FILE" ] && [ -f "$UPLOADS_BACKUP_FILE" ]; then
    echo "Restoring uploads from $UPLOADS_BACKUP_FILE..."
    
    echo "WARNING: This will replace all existing uploads!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove existing uploads
        rm -rf public/uploads/
        
        # Extract backup
        tar -xzf "$UPLOADS_BACKUP_FILE"
        echo "Uploads restore completed successfully!"
    else
        echo "Uploads restore cancelled"
    fi
elif [ -n "$UPLOADS_BACKUP_FILE" ]; then
    echo "WARNING: Uploads backup file '$UPLOADS_BACKUP_FILE' not found, skipping uploads restore"
fi

echo "Restore process completed!"