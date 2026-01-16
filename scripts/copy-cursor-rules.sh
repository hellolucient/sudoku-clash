#!/bin/bash

# Script to copy cursor rules files into the project
# Usage: ./scripts/copy-cursor-rules.sh /path/to/.cursor\ 4

SOURCE_DIR="$1"
DEST_DIR=".cursor"

if [ -z "$SOURCE_DIR" ]; then
    echo "Usage: $0 /path/to/.cursor\ 4"
    echo "Example: $0 ~/Downloads/.cursor\ 4"
    exit 1
fi

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory '$SOURCE_DIR' does not exist"
    exit 1
fi

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Copy all .md files
echo "Copying cursor rules files..."
cp "$SOURCE_DIR"/*.md "$DEST_DIR/" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Successfully copied cursor rules files to $DEST_DIR/"
    echo "Files copied:"
    ls -1 "$DEST_DIR"/*.md
else
    echo "Error: Failed to copy files"
    exit 1
fi
