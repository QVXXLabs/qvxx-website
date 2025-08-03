#!/usr/bin/env python3
"""
Sync blog posts from Google Sheets to Jekyll using Google Sheets API
This version handles row-based format where each blog post's data is in rows
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
SHEET_NAME = "Content"  # Content tab
RANGE_NAME = f"{SHEET_NAME}!A:B"  # Read all of columns A and B from Content tab
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
        
    # Clean the date string
    date_str = date_str.strip()
    
    # Try multiple date formats
    formats = [
        "%m/%d/%Y",     # 8/3/2025
        "%d/%m/%Y",     # 3/8/2025
        "%Y-%m-%d",     # 2025-08-03
        "%B %d, %Y",    # August 3, 2025
        "%d %B %Y",     # 3 August 2025
        "%d %b %Y",     # 3 Aug 2025
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    
    # If no format matches, use today's date
    print(f"Warning: Could not parse date '{date_str}', using today's date")
    return datetime.now()

def create_blog_post(date, title, content):
    """Create a Jekyll blog post file"""
    # Parse the date
    post_date = parse_date(date)
    
    # Create filename
    date_str = post_date.strftime("%Y-%m-%d")
    filename_title = sanitize_filename(title)
    
    # Limit filename length
    if len(filename_title) > 80:
        filename_title = filename_title[:80]
    
    filename = f"{date_str}-{filename_title}.md"
    filepath = POSTS_DIR / filename
    
    # Check if post already exists
    if filepath.exists():
        print(f"Post already exists: {filename}")
        return False
    
    # Clean content - remove extra quotes if wrapped
    if content.startswith('"') and content.endswith('"'):
        content = content[1:-1]
    
    # Replace double quotes
    content = content.replace('""', '"')
    
    # Create front matter
    front_matter = {
        'layout': 'post',
        'title': title,
        'date': post_date.strftime("%Y-%m-%d %H:%M:%S +0000"),
        'category': 'Strategy',
        'description': content[:150].replace('\n', ' ').strip() + "..." if len(content) > 150 else content.replace('\n', ' ').strip()
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

def process_row_based_data(values):
    """Process sheet data in row-based format"""
    posts_created = 0
    current_post = {}
    
    # Debug: Look for blog data
    print(f"Looking for blog posts in {len(values)} rows...")
    for i, row in enumerate(values[:20]):
        print(f"Row {i}: {row[:2] if len(row) > 1 else row}")
    
    for row in values:
        if len(row) < 2:
            continue
            
        label = row[0].lower().strip()
        value = row[1] if len(row) > 1 else ""
        
        # Collect data for a blog post
        if 'date' in label:
            if current_post and all(k in current_post for k in ['date', 'title', 'body']):
                # Create the previous post before starting a new one
                if create_blog_post(current_post['date'], current_post['title'], current_post['body']):
                    posts_created += 1
            # Start new post
            current_post = {'date': value}
        elif 'title' in label:
            current_post['title'] = value
        elif ('body' in label or 'content' in label) and 'final' in label:
            current_post['body'] = value
    
    # Don't forget the last post
    if current_post and all(k in current_post for k in ['date', 'title', 'body']):
        if create_blog_post(current_post['date'], current_post['title'], current_post['body']):
            posts_created += 1
    
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
    posts_created = process_row_based_data(values)
    
    print(f"\nSync complete! Created {posts_created} new posts.")
    return 0

if __name__ == "__main__":
    exit(main())