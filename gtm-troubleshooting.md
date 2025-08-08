# GTM & GA4 Custom Events Troubleshooting Guide

## Issue: Custom events are being pushed to dataLayer but not appearing in GA4

### 1. Verify GTM Container is Published
- **Check**: Are you viewing the published version or just preview?
- **Action**: In GTM, click "Submit" and publish your container changes

### 2. Check GTM Tags Configuration
You need to create GTM tags for each custom event. In GTM:

1. Go to Tags → New
2. Tag Configuration → Choose "Google Analytics: GA4 Event"
3. Configuration Tag: Select your GA4 Configuration tag
4. Event Name: Use the exact event name from dataLayer (e.g., `rage_click`)
5. Event Parameters: Add any custom parameters you want to track

### 3. Create Triggers for Each Event
For each custom event, create a trigger:

1. Go to Triggers → New
2. Trigger Configuration → Custom Event
3. Event name: Enter the exact event name (e.g., `rage_click`)
4. This trigger fires on: All Custom Events

### 4. Example Tag Setup for rage_click

**Tag Configuration:**
- Tag Type: Google Analytics: GA4 Event
- Configuration Tag: GA4 - Configuration
- Event Name: rage_click
- Event Parameters:
  - element_selector: {{Data Layer Variable - element_selector}}
  - click_count: {{Data Layer Variable - click_count}}
  - page_path: {{Data Layer Variable - page_path}}

**Trigger:**
- Trigger Type: Custom Event
- Event name: rage_click

### 5. Data Layer Variables
Create Data Layer Variables for each parameter:

1. Go to Variables → New → Data Layer Variable
2. Data Layer Variable Name: `element_selector` (exact match from dataLayer)
3. Data Layer Version: Version 2

### 6. Current Events to Configure

Based on your code, create tags for these events:

**From modern-analytics-gtm.html:**
- rage_click
- form_start
- form_submit
- form_abandon
- web_vitals
- content_section_view
- content_section_engagement
- dead_click
- javascript_error
- promise_rejection
- resource_error
- performance_metrics
- print_page
- content_copy
- video_play
- video_pause
- video_complete
- video_progress

**From advanced-features-gtm.html:**
- engagement_score
- funnel_step
- touchpoint
- conversion_with_attribution
- cohort_assignment

**From index.html:**
- book_consultation

### 7. Testing in GTM Preview Mode

1. Click "Preview" in GTM
2. Enter your website URL
3. Open browser developer console
4. Look for dataLayer pushes: `console.log(dataLayer)`
5. In GTM Preview, check:
   - Data Layer tab shows your events
   - Tags tab shows if tags fired
   - Errors tab for any issues

### 8. GA4 Debug View

1. Install Google Analytics Debugger Chrome extension
2. Enable it on your site
3. Go to GA4 → Configure → DebugView
4. Perform actions on your site
5. Events should appear in real-time

### 9. Common Issues & Solutions

**Issue**: Events show in GTM Preview but not GA4
- **Solution**: Check if GA4 Configuration tag is firing on all pages

**Issue**: "Message" events in GTM instead of named events
- **Solution**: Ensure all dataLayer.push includes 'event' key

**Issue**: Events appear in DebugView but not in reports
- **Solution**: Wait 24-48 hours for processing

**Issue**: No events in DebugView
- **Solution**: Check browser console for errors, verify GA4 measurement ID

### 10. Quick Test

Add this to browser console to test:
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'test_event',
  'test_parameter': 'test_value'
});
```

Then check GTM Preview to see if it appears.

### 11. Verification Checklist

- [ ] GTM container is published (not just in preview)
- [ ] GA4 Configuration tag exists and fires on all pages
- [ ] Each custom event has a corresponding GTM tag
- [ ] Each custom event has a trigger with exact event name
- [ ] Data Layer Variables are created for event parameters
- [ ] No JavaScript errors in browser console
- [ ] Events appear in GTM Preview Data Layer
- [ ] GA4 Measurement ID is correct in Configuration tag
- [ ] Debug mode is enabled when testing
- [ ] Internal traffic filter is not blocking your IP

### 12. Next Steps

1. Start with one simple event (e.g., book_consultation)
2. Create tag and trigger for it
3. Test in Preview mode
4. Verify in GA4 DebugView
5. Once working, replicate for other events