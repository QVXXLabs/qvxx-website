# GA4 Events Not Showing - Debugging Guide

## Quick Checks

### 1. Check GTM is Publishing Events

1. **GTM Preview Mode**
   - Go to GTM → Click "Preview"
   - Navigate to your site
   - In Preview window, check:
     - "Tags" tab → Is "GA4 Configuration" firing on all pages?
     - "Data Layer" tab → Do you see your custom events?

2. **Check Container is Published**
   - In GTM, look at top right - does it say "Workspace Changes" in orange?
   - If yes, you need to click "Submit" → "Publish"

### 2. Check GA4 is Receiving Data

1. **GA4 Real-time Report**
   - Go to GA4 → Reports → Real-time
   - You should see at least:
     - Users in last 30 minutes
     - Page views
     - "page_view" event

2. **GA4 DebugView**
   - Install Google Analytics Debugger extension
   - Enable it (icon turns blue)
   - Go to GA4 → Admin → DebugView
   - Visit your site - you should see events flowing in real-time

### 3. Common Issues & Fixes

**Issue: No events at all (not even page_view)**

This means GA4 Configuration tag isn't working. Check:

1. In GTM Preview:
   - Click on any page load event
   - Check "Tags" tab
   - Is "GA4 Configuration" listed as "Fired"?
   - If not, check the trigger (should be "All Pages")

2. Check Measurement ID:
   - In GTM → Tags → GA4 Configuration
   - Measurement ID should be: G-6JWP8EQYNW
   - Make sure no extra spaces

**Issue: Basic events work but custom events don't**

1. In browser console on your site:
   ```javascript
   // Test a simple event
   window.dataLayer.push({
     'event': 'test_event',
     'test_param': 'test_value'
   });
   ```

2. Check GTM Preview:
   - Do you see "test_event" in Data Layer?
   - Did any GA4 Event tags fire?

**Issue: Events show in GTM but not GA4**

1. Check tag configuration:
   - Each GA4 Event tag needs measurement ID
   - Event name should match exactly

2. Check for blockers:
   - Ad blockers can block GA4
   - Browser privacy settings
   - Internal IP filters in GA4

### 4. Test with Debug Page

1. Open `/debug-ga4.html` in your browser
2. Click each button and check output
3. Look for any ❌ marks

### 5. Browser Console Commands

Run these in browser console on your site:

```javascript
// Check dataLayer
console.log('DataLayer exists:', !!window.dataLayer);
console.log('DataLayer length:', window.dataLayer?.length);

// Check GTM
console.log('GTM loaded:', !!window.google_tag_manager);

// Check for GA4
const hasGA4 = window.dataLayer?.some(item => 
  JSON.stringify(item).includes('G-6JWP8EQYNW')
);
console.log('GA4 configured:', hasGA4);

// Send test event
window.dataLayer.push({
  'event': 'console_test',
  'timestamp': new Date().toISOString()
});
console.log('Test event sent');
```

### 6. GTM Workspace Check

In GTM:
1. Click on "Workspace" dropdown (top of page)
2. Are there unpublished changes?
3. If yes, Submit → Publish

### 7. Next Steps

If basic page_view events aren't working:
1. Check GA4 property settings
2. Verify measurement ID matches
3. Check GTM container ID matches

If only custom events aren't working:
1. Make sure you imported and published the new configuration
2. Check that "GA4 - All Custom Events" tag exists and is active
3. Verify trigger is set to "All Custom Events"

Report back what you find!