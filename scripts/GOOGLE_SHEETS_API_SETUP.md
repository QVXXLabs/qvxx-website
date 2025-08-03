# Google Sheets API Setup Guide

This guide will help you set up Google Sheets API access for private spreadsheets.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it something like "QVXX Blog Sync"
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your project dashboard, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - Service account name: `qvxx-blog-sync`
   - Service account ID: (auto-fills)
   - Description: "Service account for blog sync"
4. Click "Create and Continue"
5. Skip the optional steps (roles and users)
6. Click "Done"

## Step 4: Create and Download Key

1. Click on your new service account email
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create" - this downloads a JSON file
6. **Save this file securely!** You'll need it for the next steps

## Step 5: Share Your Google Sheet

1. Open your Google Sheet
2. Copy the service account email from the JSON file (look for `"client_email"`)
3. Click "Share" button in your sheet
4. Paste the service account email
5. Make sure it has "Viewer" permission
6. Click "Send"

## Step 6: Set Up for Local Development

1. Rename the downloaded JSON file to `credentials.json`
2. Place it in the root of your project
3. Add `credentials.json` to your `.gitignore` file:
   ```bash
   echo "credentials.json" >> .gitignore
   ```

## Step 7: Set Up for GitHub Actions

1. Open the `credentials.json` file
2. Copy the entire contents
3. Go to your GitHub repository
4. Go to Settings → Secrets and variables → Actions
5. Click "New repository secret"
6. Name: `GOOGLE_SHEETS_CREDENTIALS`
7. Value: Paste the entire JSON content
8. Click "Add secret"

## Step 8: Update the Script Configuration

Edit `scripts/sync_google_sheets_api.py`:
```python
SPREADSHEET_ID = "your-spreadsheet-id"  # From your sheet URL
SHEET_NAME = "Sheet1"  # Your actual sheet name (tab name)
```

## Testing Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Run the sync (make sure credentials.json is in place)
python scripts/sync_google_sheets_api.py
```

## Security Notes

- **Never commit `credentials.json` to git**
- The service account only has read access to sheets you explicitly share with it
- Rotate keys periodically for security
- Use GitHub Secrets for production deployments

## Troubleshooting

**"No credentials found" error**:
- Check that `credentials.json` exists in the project root
- Or ensure `GOOGLE_SHEETS_CREDENTIALS` is set as environment variable

**"Permission denied" or 403 error**:
- Make sure you shared the sheet with the service account email
- Check that the service account has at least "Viewer" permission

**"API not enabled" error**:
- Go back to Google Cloud Console
- Make sure Google Sheets API is enabled for your project

**Sheet not found**:
- Verify the SPREADSHEET_ID matches your sheet URL
- Check that SHEET_NAME matches the tab name in your spreadsheet