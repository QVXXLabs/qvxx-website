#!/usr/bin/env python3
"""
Sync blog posts from Google Sheets to Jekyll using Google Sheets API
Fetches content from a private Google Sheet and creates Jekyll blog posts
"""

import os
import re
import json
from datetime import datetime
from pathlib import Path
import yaml
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configuration
SPREADSHEET_ID = "16CADq4P1SatT2NsEPy79cRZIOiPgrl9lxhuhMMMnd10"
SHEET_NAME = "Sheet1"  # Update this to your sheet name
RANGE_NAME = "A1:Z3"  # First 3 rows, columns A-Z
POSTS_DIR = Path("_posts")

# Google Sheets API scope
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

def get_credentials():
    """Get credentials from service account file or GitHub secret"""
    # Try to load from environment variable first (for GitHub Actions)
    creds_json = os.environ.get('GOOGLE_SHEETS_CREDENTIALS')
    
    if creds_json:
        # Parse JSON from environment variable
        creds_info = json.loads(creds_json)
        return service_account.Credentials.from_service_account_info(
            creds_info, scopes=SCOPES)
    
    # Try to load from file (for local development)
    creds_file = Path('credentials.json')
    if creds_file.exists():
        return service_account.Credentials.from_service_account_file(
            str(creds_file), scopes=SCOPES)
    
    raise ValueError("No credentials found. Set GOOGLE_SHEETS_CREDENTIALS env var or create credentials.json file")

def sanitize_filename(title):
    """Convert title to valid filename"""
    # Remove special characters and replace spaces with hyphens
    filename = re.sub(r'[^\w\s-]', '', title.lower())
    filename = re.sub(r'[-\s]+', '-', filename)
    return filename.strip('-')

def fetch_sheet_data():
    """Fetch data from Google Sheets using API"""
    try:
        # Build the service
        creds = get_credentials()
        service = build('sheets', 'v4', credentials=creds)
        
        # Call the Sheets API
        sheet = service.spreadsheets()
        result = sheet.values().get(
            spreadsheetId=SPREADSHEET_ID, 
            range=RANGE_NAME
        ).execute()
        
        values = result.get('values', [])
        
        if not values:
            print('No data found in sheet.')
            return None
            
        return values
        
    except HttpError as err:
        print(f'An error occurred: {err}')
        return None
    except Exception as e:
        print(f'Error fetching sheet: {e}')
        return None

def parse_date(date_str):
    """Parse date string to datetime object"""
    if not date_str:
        return datetime.now()
        
    # Try multiple date formats
    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%B %d, %Y",
        "%d %B %Y",
        "%d %b %Y",
        "%Y-%m-%d %H:%M:%S"
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt)
        except ValueError:
            continue
    
    # If no format matches, use today's date
    print(f"Warning: Could not parse date '{date_str}', using today's date")
    return datetime.now()

def create_blog_post(date, title, content):
    """Create a Jekyll blog post file"""
    # Validate inputs - skip if they look like headers or metadata
    skip_values = ['updated at', 'name', 'description', 'primary industry', 'size', 'type', 
                   'location', 'country', 'domain', 'job openings', 'linkedin', 'email', 
                   'github', 'funding', 'score', 'date', 'title', 'content']
    
    if any(skip in date.lower() for skip in skip_values):
        print(f"Skipping header/metadata row: {date}")
        return False
        
    # Parse the date
    post_date = parse_date(date)
    
    # Create filename
    date_str = post_date.strftime("%Y-%m-%d")
    filename_title = sanitize_filename(title)
    
    # Limit filename length
    if len(filename_title) > 50:
        filename_title = filename_title[:50]
    
    filename = f"{date_str}-{filename_title}.md"
    filepath = POSTS_DIR / filename
    
    # Check if post already exists
    if filepath.exists():
        print(f"Post already exists: {filename}")
        return False
    
    # Create front matter
    front_matter = {
        'layout': 'post',
        'title': title,
        'date': post_date.strftime("%Y-%m-%d %H:%M:%S +0000"),
        'category': 'Strategy',
        'description': content[:150].replace('\n', ' ') + "..." if len(content) > 150 else content.replace('\n', ' ')
    }
    
    # Create post content
    post_content = f"""---
{yaml.dump(front_matter, default_flow_style=False, allow_unicode=True)}---

{content}

---

*QVXX helps London SMBs make practical AI decisions. We focus on what actually works for your business.*"""
    
    # Write the file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(post_content)
    
    print(f"Created post: {filename}")
    return True

def process_sheets_data(values):
    """Process sheet data and create blog posts"""
    if len(values) < 3:
        print("Sheet must have at least 3 rows (date, title, content)")
        return 0
    
    posts_created = 0
    
    # Get the three rows
    dates_row = values[0] if len(values) > 0 else []
    titles_row = values[1] if len(values) > 1 else []
    content_row = values[2] if len(values) > 2 else []
    
    # Process each column starting from B (index 1)
    for col_index in range(1, max(len(dates_row), len(titles_row), len(content_row))):
        try:
            # Get data from each row for this column
            date = dates_row[col_index] if col_index < len(dates_row) else ""
            title = titles_row[col_index] if col_index < len(titles_row) else ""
            content = content_row[col_index] if col_index < len(content_row) else ""
            
            # Skip if any required field is empty
            if not date or not title or not content:
                continue
            
            # Create the blog post
            if create_blog_post(date, title, content):
                posts_created += 1
                
        except Exception as e:
            print(f"Error processing column {col_index}: {e}")
            continue
    
    return posts_created

def main():
    """Main function"""
    # Ensure posts directory exists
    POSTS_DIR.mkdir(exist_ok=True)
    
    print(f"Fetching data from Google Sheets (ID: {SPREADSHEET_ID})...")
    values = fetch_sheet_data()
    
    if values is None:
        print("Failed to fetch sheet data")
        return 1
    
    print(f"Found {len(values)} rows in sheet")
    print("Processing sheet data...")
    posts_created = process_sheets_data(values)
    
    print(f"\nSync complete! Created {posts_created} new posts.")
    return 0

if __name__ == "__main__":
    exit(main())