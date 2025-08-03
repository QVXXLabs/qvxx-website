# Google Sheets Blog Sync

This system automatically syncs blog posts from Google Sheets to your Jekyll site every hour using the Google Sheets API.

## Setup Instructions

### 1. Prepare Your Google Sheet

Your Google Sheet should be in the "Content" tab with the following row-based structure:
- **Column A**: Labels (Date, Title, Body - Final, etc.)
- **Column B**: Values for the blog post

Example:
| A | B |
|---|---|
| Date | 8/3/2025 |
| Title | Is Your London Competitor Already Using AI? |
| Body - Final | (full blog post content) |

Each blog post should have at least these three rows (Date, Title, and Body - Final)

### 2. Set Up Google Sheets API Access

Follow the detailed instructions in [GOOGLE_SHEETS_API_SETUP.md](GOOGLE_SHEETS_API_SETUP.md) to:
1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create service account credentials
4. Share your sheet with the service account
5. Set up credentials for local development and GitHub Actions

### 3. Update the Script Configuration

Edit `scripts/sync_google_sheets_api.py` and update these values:
```python
SPREADSHEET_ID = "your-spreadsheet-id"  # The ID from your sheet URL
SHEET_NAME = "Sheet1"  # The name of your sheet tab
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