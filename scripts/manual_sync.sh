#!/bin/bash
# Manual sync script for testing Google Sheets integration

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Running sync script..."
python scripts/sync_google_sheets_api.py

echo "Checking for new posts..."
git status _posts/

echo "Done! If there are new posts, you can commit and push them."