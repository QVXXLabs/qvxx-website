# Google Sheets Blog Post Template

Your Google Sheet should be structured exactly like this:

## Required Format

|   | A | B | C | D | E |
|---|---|---|---|---|---|
| 1 | (ignored) | 2025-08-04 | 2025-08-05 | 2025-08-06 | 2025-08-07 |
| 2 | (ignored) | My First Blog Post | AI Tools for SMBs | RPA Best Practices | Future of Work |
| 3 | (ignored) | This is the full content of my first blog post. It can be as long as needed and include multiple paragraphs... | Here's my second post about AI tools. The content goes here with all the details... | RPA content here... | Future content here... |

## Important Notes:

1. **Column A** is ignored (you can put labels there)
2. **Row 1**: Dates in format YYYY-MM-DD (or other supported formats)
3. **Row 2**: Blog post titles
4. **Row 3**: Full blog post content
5. Each column from B onwards represents one blog post

## Example for Column B:
- **B1**: `2025-08-04` (publication date)
- **B2**: `My First Blog Post` (title)
- **B3**: `This is the full content...` (the actual blog post)

## Supported Date Formats:
- 2025-08-04 (recommended)
- 04/08/2025
- August 4, 2025
- 4 Aug 2025

The sync script will create a file named `2025-08-04-my-first-blog-post.md` with proper Jekyll front matter.