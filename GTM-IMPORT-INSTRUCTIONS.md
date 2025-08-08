# GTM Import Instructions for Custom Events

## File: gtm-complete-events-workspace.json

This workspace configuration includes:
- GA4 Configuration tag (already exists)
- Generic event handler for ALL custom events
- Specific handlers for key events with custom parameters
- All required Data Layer Variables
- All required triggers

## How to Import:

1. **Open Google Tag Manager**
   - Go to https://tagmanager.google.com
   - Select your container (GTM-TT935KM3)

2. **Import the Configuration**
   - Click Admin → Import Container
   - Choose the file: `gtm-complete-events-workspace.json`
   - Select Workspace: "Default Workspace" or create new
   - Import Option: **"Merge"** (to keep existing tags)
   - Choose: **"Rename conflicting tags"** if prompted

3. **Preview Changes**
   - Review the import preview
   - You should see:
     - 6 new tags (GA4 event tags)
     - 6 new triggers 
     - 15 new variables

4. **Test in Preview Mode**
   - Click "Preview"
   - Navigate to your site
   - Perform actions (click buttons, scroll, etc.)
   - Check that events appear in GTM Preview

5. **Publish**
   - Once verified, click "Submit"
   - Add version name: "Custom Events Implementation"
   - Click "Publish"

## What Gets Tracked:

### Immediately Tracked Events:
- **rage_click** - Multiple clicks on same element
- **form_start/submit/abandon** - Form interactions
- **web_vitals** - Core Web Vitals metrics
- **content_section_view** - Section visibility
- **dead_click** - Clicks on non-interactive elements
- **javascript_error** - JS errors
- **engagement_score** - User engagement scoring
- **book_consultation** - Calendar link clicks

### Generic Handler:
The "GA4 - All Custom Events" tag will catch ANY dataLayer.push with an 'event' key, ensuring nothing is missed.

## Verification:

1. **GTM Preview Mode**
   - Events should appear in Data Layer tab
   - Tags should show as "Fired"

2. **GA4 DebugView**
   - Install GA Debugger extension
   - Enable it and visit your site
   - Go to GA4 → Configure → DebugView
   - Events should appear in real-time

3. **GA4 Real-time**
   - After 5-10 minutes
   - Check GA4 → Reports → Real-time
   - Custom events should appear

## Troubleshooting:

If events don't appear:
1. Check browser console for errors
2. Verify GTM container is published
3. Check that GA4 Configuration tag fires
4. Ensure no ad blockers are active
5. Wait 24-48 hours for full reports

## Next Steps:

Once working, you can:
1. Create custom dimensions in GA4 for event parameters
2. Build custom reports based on these events
3. Set up conversions for key events
4. Create audiences based on engagement scores