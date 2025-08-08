# Analytics Tracking Guide

## Overview
This document describes all analytics events tracked on qvxx.ai using Google Analytics 4 (GA4) via Google Tag Manager (GTM).

## Setup
- **GA4 Property ID**: G-6JWP8EQYNW
- **GTM Container**: GTM-TT935KM3
- **Implementation**: All events use `dataLayer.push()` and are automatically sent to GA4

## Standard Events

### Page Views
- **Event**: `page_view`
- **Fires**: Automatically on every page load
- **Data**: Page title, page path, referrer

### User Engagement
- **Event**: `user_engagement`
- **Fires**: After 15 seconds on page (indicates non-bounce)
- **Purpose**: More accurate bounce rate calculation

### Scroll Tracking
- **Event**: `scroll`
- **Fires**: At 25%, 50%, 75%, 90%, 100% scroll depth
- **Parameters**:
  - `percent_scrolled`: Milestone reached (25, 50, 75, 90, 100)

## Custom Events

### 🎯 User Actions

#### Book Consultation
- **Event**: `book_consultation`
- **Fires**: Click on calendar booking links
- **Parameters**:
  - `event_label`: Button text clicked
  - `page_path`: Which page they clicked from
- **Purpose**: Track conversion intent

#### Theme Toggle
- **Event**: `theme_toggle`
- **Fires**: Dark/light mode switch
- **Parameters**:
  - `theme_from`: Previous theme (light/dark)
  - `theme_to`: New theme (light/dark)
- **Purpose**: Understand UI preferences

#### File Download
- **Event**: `file_download`
- **Fires**: Clicks on downloadable files
- **Supported**: PDF, DOC(X), XLS(X), PPT(X), ZIP, RAR, CSV, TXT, MP3, MP4, MOV, AVI
- **Parameters**:
  - `file_name`: Name of file
  - `file_extension`: Type of file
  - `link_url`: Full download URL
- **Purpose**: Track resource popularity

#### External Link Click
- **Event**: `external_link_click`
- **Fires**: Clicks to external websites
- **Parameters**:
  - `link_domain`: Destination domain
  - `link_url`: Full URL
  - `link_text`: Anchor text
  - `click_location`: Page section (header/footer/article/etc)
- **Purpose**: Understand outbound traffic

### 📊 Engagement Metrics

#### Engagement Score
- **Event**: `engagement_score`
- **Fires**: Every 30 seconds and on page exit
- **Parameters**:
  - `engagement_score`: 0-100 composite score
  - `engagement_category`: highly_engaged/engaged/somewhat_engaged/low_engagement
  - `score_breakdown`: JSON with factor details
- **Calculation**:
  - Scroll Depth (25%): How far they scrolled
  - Time Engaged (30%): Active time on page
  - Content Interactions (20%): Clicks and actions
  - Sections Viewed (15%): Content consumption
  - Returning Visit (10%): Loyalty bonus

#### Content Section View
- **Event**: `content_section_view`
- **Fires**: When user views a content section (H2/H3)
- **Parameters**:
  - `section_id`: Section identifier
  - `section_type`: H2/H3/etc
  - `scroll_percent`: Page position

### 🔧 Technical Events

#### Web Vitals
- **Event**: `web_vitals`
- **Fires**: For each Core Web Vital metric
- **Parameters**:
  - `metric_name`: CLS, FID, FCP, LCP, TTFB, INP
  - `metric_value`: Numeric value
  - `metric_rating`: good/needs-improvement/poor
- **Purpose**: Monitor site performance and SEO rankings

**Metric Definitions**:

1. **LCP (Largest Contentful Paint)** ⏱️
   - Measures: Loading performance
   - What: Time until the largest content element is visible
   - Good: < 2.5 seconds
   - Poor: > 4.0 seconds
   - Impact: Major Google ranking factor

2. **FID (First Input Delay)** 👆
   - Measures: Interactivity
   - What: Time from first user interaction to browser response
   - Good: < 100 milliseconds
   - Poor: > 300 milliseconds
   - Note: Being replaced by INP

3. **CLS (Cumulative Layout Shift)** 📏
   - Measures: Visual stability
   - What: How much content moves around during load
   - Good: < 0.1
   - Poor: > 0.25
   - Impact: Major Google ranking factor

4. **INP (Interaction to Next Paint)** 🎯
   - Measures: Overall responsiveness
   - What: Delay for ALL interactions throughout the session
   - Good: < 200 milliseconds
   - Poor: > 500 milliseconds
   - Impact: Replaced FID as Core Web Vital in March 2024

5. **TTFB (Time to First Byte)** 🚀
   - Measures: Server response time
   - What: Time from request to first byte of response
   - Good: < 800 milliseconds
   - Poor: > 1800 milliseconds
   - Factors: Server performance, CDN, database queries

6. **FCP (First Contentful Paint)** 🎨
   - Measures: Perceived load speed
   - What: Time until first text or image appears
   - Good: < 1.8 seconds
   - Poor: > 3.0 seconds
   - User Impact: When visitors see "something is happening"

#### JavaScript Error
- **Event**: `javascript_error`
- **Fires**: On JS errors
- **Parameters**:
  - `error_message`: Error description
  - `error_source`: File and line number

#### Performance Metrics
- **Event**: `performance_metrics`
- **Fires**: After page load
- **Parameters**:
  - `dns_time`: DNS lookup time
  - `ttfb`: Time to first byte
  - `total_time`: Full page load time

### 🎭 User Experience

#### Rage Click
- **Event**: `rage_click`
- **Fires**: 3+ clicks on same element within 2 seconds
- **Parameters**:
  - `element_selector`: What was clicked
  - `click_count`: Number of rapid clicks
- **Purpose**: Identify UX frustrations

#### Dead Click
- **Event**: `dead_click`
- **Fires**: Clicks on non-interactive elements that look clickable
- **Parameters**:
  - `element`: Element selector
  - `text`: Element text
- **Purpose**: Find UX issues

### 📝 Form Tracking

#### Form Start
- **Event**: `form_start`
- **Fires**: First interaction with a form
- **Parameters**:
  - `form_id`: Form identifier
  - `first_field`: First field interacted with

#### Form Submit
- **Event**: `form_submit`
- **Fires**: Successful form submission
- **Parameters**:
  - `form_id`: Form identifier
  - `fields_completed`: Number of fields
  - `time_spent`: Seconds to complete

#### Form Abandon
- **Event**: `form_abandon`
- **Fires**: User leaves without submitting
- **Parameters**:
  - `form_id`: Form identifier
  - `fields_completed`: How many filled
  - `time_spent`: Time before abandoning
  - `last_field`: Last field touched

### 🎯 Conversion Funnel

#### Funnel Step
- **Event**: `funnel_step`
- **Fires**: Progress through conversion funnel
- **Parameters**:
  - `funnel_name`: Which funnel (main_conversion/content_consumption)
  - `funnel_step`: Step name
  - `funnel_step_number`: Numeric position
- **Main Funnel Steps**:
  1. page_view
  2. content_engagement
  3. cta_view
  4. cta_click
  5. calendar_click

### 👥 User Segmentation

#### Behavioral Cohort Assignment
- **Event**: `cohort_assignment`
- **Fires**: When user matches behavioral patterns
- **Parameters**:
  - `user_cohorts`: Assigned segments
  - `primary_cohort`: Main classification
- **Cohorts**:
  - `content_bingers`: High page views and time
  - `quick_scanners`: Fast scrolling, low time
  - `researchers`: Copy content, click external links
  - `high_intent`: Multiple CTA views, form interactions

#### Attribution Touchpoint
- **Event**: `touchpoint`
- **Fires**: Each visit to track attribution
- **Parameters**:
  - `touchpoint_source`: Traffic source
  - `touchpoint_medium`: Traffic medium
  - `touchpoint_number`: Visit count

## Data Layer Variables

All events can access these standard parameters:
- `event_category`: Event grouping
- `event_label`: Specific detail
- `page_path`: Current URL path
- `value`: Numeric value (if applicable)

## Implementation Notes

### Adding New Events

To track a new event, simply push to dataLayer:

```javascript
window.dataLayer.push({
    'event': 'your_event_name',
    'event_category': 'Category',
    'your_parameter': 'value'
});
```

The "GA4 - All Custom Events" tag in GTM will automatically send it to GA4.

### Testing Events

1. **Browser Console**: 
   ```javascript
   window.dataLayer.push({'event': 'test_event'});
   ```

2. **GTM Preview Mode**: Shows all events and which tags fire

3. **GA4 DebugView**: Real-time event stream

4. **GA4 Realtime**: Production event monitoring

## Privacy & Compliance

- All tracking respects cookie consent choices
- Default state is "denied" for GDPR compliance
- Users can granularly control analytics vs marketing cookies
- No PII (Personally Identifiable Information) is collected

## Maintenance

- Review engagement score thresholds quarterly
- Check for new file extensions to track
- Monitor rage/dead clicks for UX improvements
- Update funnel steps as site evolves