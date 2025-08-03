#!/usr/bin/env python3
"""
Sync blog posts from Google Sheets to Jekyll
Fetches content from a public Google Sheet and creates Jekyll blog posts
"""

import os
import re
import csv
import requests
from datetime import datetime
from pathlib import Path
import yaml

# Configuration
SHEET_ID = "16CADq4P1SatT2NsEPy79cRZIOiPgrl9lxhuhMMMnd10"
GID = "1521470548"
CSV_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}"
POSTS_DIR = Path("_posts")

def sanitize_filename(title):
    """Convert title to valid filename"""
    # Remove special characters and replace spaces with hyphens
    filename = re.sub(r'[^\w\s-]', '', title.lower())
    filename = re.sub(r'[-\s]+', '-', filename)
    return filename.strip('-')

def fetch_sheet_data():
    """Fetch CSV data from Google Sheets"""
    try:
        response = requests.get(CSV_URL)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching sheet: {e}")
        return None

def parse_date(date_str):
    """Parse date string to datetime object"""
    # Try multiple date formats
    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%B %d, %Y",
        "%d %B %Y"
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
    # Parse the date
    post_date = parse_date(date)
    
    # Create filename
    date_str = post_date.strftime("%Y-%m-%d")
    filename_title = sanitize_filename(title)
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
        'description': content[:150] + "..." if len(content) > 150 else content
    }
    
    # Create post content
    post_content = f"""---
{yaml.dump(front_matter, default_flow_style=False)}---

{content}

---

*QVXX helps London SMBs make practical AI decisions. We focus on what actually works for your business.*"""
    
    # Write the file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(post_content)
    
    print(f"Created post: {filename}")
    return True

def process_sheets_data(csv_data):
    """Process CSV data and create blog posts"""
    reader = csv.reader(csv_data.strip().split('\n'))
    
    # Skip header row if it exists
    header = next(reader, None)
    
    posts_created = 0
    
    # Process each column (B, C, D, etc.)
    for row in reader:
        # Skip empty rows
        if not row or len(row) < 2:
            continue
            
        # Process columns starting from B (index 1)
        for col_index in range(1, len(row)):
            # Skip empty columns
            if not row[col_index]:
                continue
                
            # For each column, we expect:
            # Row 1: Date
            # Row 2: Title  
            # Row 3: Content
            # But since we're reading row by row, we need to collect data differently
            
            # This approach assumes the sheet structure has dates in row 1,
            # titles in row 2, and content in row 3
            break  # We'll need to restructure this based on actual sheet format
    
    # Alternative approach: Read all rows first, then process by column
    csv_data_lines = csv_data.strip().split('\n')
    reader = csv.reader(csv_data_lines)
    all_rows = list(reader)
    
    if len(all_rows) < 3:
        print("Not enough rows in spreadsheet")
        return 0
    
    # Process each column starting from B (index 1)
    for col_index in range(1, len(all_rows[0])):
        try:
            # Get data from the three rows for this column
            date = all_rows[0][col_index] if len(all_rows[0]) > col_index else ""
            title = all_rows[1][col_index] if len(all_rows[1]) > col_index else ""
            content = all_rows[2][col_index] if len(all_rows[2]) > col_index else ""
            
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
    
    print(f"Fetching data from Google Sheets...")
    csv_data = fetch_sheet_data()
    
    if not csv_data:
        print("Failed to fetch sheet data")
        return 1
    
    print("Processing sheet data...")
    posts_created = process_sheets_data(csv_data)
    
    print(f"\nSync complete! Created {posts_created} new posts.")
    return 0

if __name__ == "__main__":
    exit(main())