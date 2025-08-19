#!/bin/bash

# Update all calendar links from old to new
OLD_LINK="https://calendar.app.google/FEpevxQTJxqaTzTPA"
NEW_LINK="https://calendar.app.google/F1CUZCKJCNZGN6oh8"

# Find all HTML and MD files and update the links
find . -type f \( -name "*.html" -o -name "*.md" \) -exec sed -i '' "s|$OLD_LINK|$NEW_LINK|g" {} \;

echo "Updated calendar links in the following files:"
find . -type f \( -name "*.html" -o -name "*.md" \) -exec grep -l "$NEW_LINK" {} \;