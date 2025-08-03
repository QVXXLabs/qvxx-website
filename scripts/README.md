# Google Sheets Blog Sync

This system automatically syncs blog posts from Google Sheets to your Jekyll site every hour.

## Setup Instructions

### 1. Prepare Your Google Sheet

Your Google Sheet should have the following structure:
- **Row 1**: Publication dates (e.g., "2025-08-04", "August 4, 2025")
- **Row 2**: Post titles
- **Row 3**: Post content (full blog post text)
- **Column A**: Can be used for labels/notes (ignored by script)
- **Columns B, C, D, etc.**: Each column represents one blog post

### 2. Make Your Sheet Public

1. Open your Google Sheet
2. Click the "Share" button (top right)
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Done"

### 3. Update the Script Configuration

Edit `scripts/sync_google_sheets.py` and update these values:
```python
SHEET_ID = "your-sheet-id-here"  # The ID from your sheet URL
GID = "your-gid-here"  # The GID from your sheet URL (after #gid=)
```

### 4. Test Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Run the sync
python scripts/sync_google_sheets.py

# Or use the convenience script
./scripts/manual_sync.sh
```

### 5. Automatic Syncing

The GitHub Action will run automatically every hour. You can also trigger it manually:
1. Go to Actions tab in your GitHub repository
2. Select "Sync Blog Posts from Google Sheets"
3. Click "Run workflow"

## How It Works

1. Every hour, GitHub Actions runs the sync script
2. The script fetches your Google Sheet as CSV
3. For each column with complete data (date, title, content):
   - Creates a Jekyll blog post file
   - Uses the date for the filename and post date
   - Adds appropriate front matter
   - Skips posts that already exist
4. If new posts are created, they're automatically committed and pushed

## Troubleshooting

- **401 Unauthorized Error**: Your sheet isn't public. Follow step 2 above.
- **No posts created**: Check that your sheet follows the expected format (3 rows)
- **Date parsing issues**: The script supports multiple date formats, but use YYYY-MM-DD for best results

## Date Formats Supported

- YYYY-MM-DD (recommended)
- DD/MM/YYYY
- MM/DD/YYYY  
- Month DD, YYYY
- DD Month YYYY