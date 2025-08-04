# GTM Configuration Guide for Modern Analytics

## Overview
This guide helps you configure Google Tag Manager to use the modern analytics tracking implemented on your site.

## Data Layer Variables to Create

### 1. User Variables
- **Variable Name**: `DLV - User Type`
  - Variable Type: Data Layer Variable
  - Data Layer Variable Name: `user.type`

- **Variable Name**: `DLV - User Engagement Level`
  - Variable Type: Data Layer Variable
  - Data Layer Variable Name: `user.engagementLevel`

### 2. Page Variables
- **Variable Name**: `DLV - Page Type`
  - Variable Type: Data Layer Variable
  - Data Layer Variable Name: `page.type`

- **Variable Name**: `DLV - Content Category`
  - Variable Type: Data Layer Variable
  - Data Layer Variable Name: `page.category`

- **Variable Name**: `DLV - Word Count`
  - Variable Type: Data Layer Variable
  - Data Layer Variable Name: `page.wordCount`

- **Variable Name**: `DLV - Read Time`
  - Variable Type: Data Layer Variable
  - Data Layer Variable Name: `page.readTime`

### 3. Content Variables
- **Variable Name**: `DLV - Content Group`
  - Variable Type: Data Layer Variable
  - Data Layer Variable Name: `content_group`

- **Variable Name**: `DLV - Content Type`
  - Variable Type: Data Layer Variable
  - Data Layer Variable Name: `content_type`

## Triggers to Create

### 1. Engagement Triggers
- **Trigger Name**: `Rage Click`
  - Trigger Type: Custom Event
  - Event Name: `rage_click`

- **Trigger Name**: `Form Start`
  - Trigger Type: Custom Event
  - Event Name: `form_start`

- **Trigger Name**: `Form Abandon`
  - Trigger Type: Custom Event
  - Event Name: `form_abandon`

- **Trigger Name**: `Dead Click`
  - Trigger Type: Custom Event
  - Event Name: `dead_click`

### 2. Performance Triggers
- **Trigger Name**: `Web Vitals`
  - Trigger Type: Custom Event
  - Event Name: `web_vitals`

- **Trigger Name**: `Performance Metrics`
  - Trigger Type: Custom Event
  - Event Name: `performance_metrics`

### 3. Content Triggers
- **Trigger Name**: `Content Section View`
  - Trigger Type: Custom Event
  - Event Name: `content_section_view`

- **Trigger Name**: `Content Section Engagement`
  - Trigger Type: Custom Event
  - Event Name: `content_section_engagement`

## Tags to Create

### 1. GA4 Event Tags

#### Rage Click Tag
```javascript
Tag Name: GA4 - Rage Click
Tag Type: GA4 Event
Event Name: rage_click
Event Parameters:
  - element_selector: {{DLV - element_selector}}
  - click_count: {{DLV - click_count}}
  - viewport_size: {{DLV - viewport_size}}
Trigger: Rage Click
```

#### Form Tracking Tags
```javascript
Tag Name: GA4 - Form Start
Tag Type: GA4 Event
Event Name: form_start
Event Parameters:
  - form_id: {{DLV - form_id}}
  - first_field: {{DLV - first_field}}
Trigger: Form Start

Tag Name: GA4 - Form Abandon
Tag Type: GA4 Event
Event Name: form_abandon
Event Parameters:
  - form_id: {{DLV - form_id}}
  - fields_completed: {{DLV - fields_completed}}
  - time_spent: {{DLV - time_spent}}
Trigger: Form Abandon
```

#### Web Vitals Tag
```javascript
Tag Name: GA4 - Web Vitals
Tag Type: GA4 Event
Event Name: web_vitals
Event Parameters:
  - metric_name: {{DLV - event_label}}
  - metric_value: {{DLV - value}}
  - metric_rating: {{DLV - metric_rating}}
Trigger: Web Vitals
```

### 2. Custom HTML Tags for Advanced Features

#### Scroll Depth Enhancement
```javascript
Tag Name: Custom - Enhanced Scroll Tracking
Tag Type: Custom HTML
HTML: 
<script>
(function() {
  // Track milestone-based scroll depth
  var milestones = [10, 25, 50, 75, 90, 100];
  var reached = [];
  
  window.addEventListener('scroll', function() {
    var scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    
    milestones.forEach(function(milestone) {
      if (scrollPercent >= milestone && reached.indexOf(milestone) === -1) {
        reached.push(milestone);
        dataLayer.push({
          'event': 'scroll_milestone',
          'scroll_depth': milestone,
          'page_height': document.documentElement.scrollHeight,
          'viewport_height': window.innerHeight
        });
      }
    });
  });
})();
</script>
Trigger: All Pages
```

## Advanced Configuration

### 1. Custom Dimensions in GA4
Set up these custom dimensions in GA4:
1. `user_type` (User-scoped)
2. `content_group` (Event-scoped)
3. `engagement_level` (User-scoped)
4. `page_type` (Event-scoped)
5. `content_interaction_score` (Session-scoped)

### 2. Audiences to Create
1. **Highly Engaged Users**
   - Conditions: engagement_level = 'high'
   - Include users who trigger 'content_section_engagement' > 5 times

2. **High-Intent Users**
   - Conditions: 
     - Triggered 'form_start' event
     - Scroll depth > 75%
     - Time on site > 120 seconds

3. **Technical Issues**
   - Conditions: Users who triggered 'javascript_error' or 'dead_click'

### 3. Conversion Events
Mark these as conversions in GA4:
- `book_consultation`
- `form_submit`
- `high_engagement_session` (custom)

## Testing Checklist

1. **Preview Mode Testing**
   - [ ] Enable GTM Preview mode
   - [ ] Test rage clicks (click same element 3+ times)
   - [ ] Test form interactions
   - [ ] Scroll through content
   - [ ] Check Web Vitals firing

2. **Debug Console Commands**
   ```javascript
   // Check dataLayer
   console.log(window.dataLayer);
   
   // Trigger test events
   dataLayer.push({'event': 'test_event'});
   
   // Check specific values
   dataLayer.filter(x => x.event === 'page_data');
   ```

3. **GA4 DebugView**
   - Enable debug mode in GA4
   - Verify all events appear correctly
   - Check parameter values

## Implementation Notes

1. **Performance Considerations**
   - All tracking is throttled/debounced
   - Uses Intersection Observer where available
   - Non-blocking script loading

2. **Privacy Compliance**
   - All tracking respects consent mode
   - No PII is collected
   - Uses cookieless tracking where possible

3. **Data Quality**
   - Implements data validation
   - Filters out bot traffic
   - Deduplicates events

## Maintenance

1. **Regular Reviews**
   - Monthly: Check for new dead clicks
   - Quarterly: Review rage click patterns
   - Annually: Audit custom dimensions usage

2. **Optimization Opportunities**
   - Use rage/dead click data for UX improvements
   - Analyze form abandonment for conversion optimization
   - Monitor Web Vitals for performance issues