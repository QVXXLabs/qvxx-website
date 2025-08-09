# Landing Page Generation Prompt Template

## Overview
This prompt template helps generate compelling, conversion-focused landing pages similar to the Jaja Finance example at `/lets-talk/fc-q4x9/`. The page uses a password-protected layout with streamlined content, visual data comparisons, and clear CTAs.

## Prompt Template

```
Create a password-protected landing page for [COMPANY NAME] in the [INDUSTRY] sector. The company's main challenge is [PRIMARY CHALLENGE] and they need help with [SPECIFIC NEED].

Page Structure Requirements:

1. **Hero Section**
   - Headline: Transform [CURRENT STATE] into [DESIRED OUTCOME]
   - Subheadline: One sentence explaining the opportunity window
   - Single primary CTA button

2. **Current Problems Section**
   - Title: "Your [TARGET AUDIENCE] deserve [POSITIVE OUTCOME]"
   - 4 pain points, each 3-4 words max with red ✗ symbols:
     * [PAIN 1]. [CONSEQUENCE].
     * [PAIN 2]. [CONSEQUENCE].
     * [PAIN 3]. [CONSEQUENCE].
     * [PAIN 4]. [CONSEQUENCE].
   - Opportunities section with green ✓ symbols:
     * Bold header: "These are the opportunities:"
     * 3 positive outcomes, action-oriented

3. **Competition Section**
   - Title: "Who's Moving Fast"
   - Add generous vertical spacing (32px margins) for breathing room
   - 3 competitor cards with:
     * Competitor names (bold)
     * Their key advantage (secondary text)
     * 24px padding inside each card
     * 20px gap between cards
   - Urgency banner with lightning emoji
     * Additional 24px top margin
     * Warmer gradient background
     * Clear warning about competitive pressure

4. **Solution Section**
   - Title: "Accelerate Your [SPECIFIC ROLE/INITIATIVE] with QVXX"
   - SVG line chart showing:
     * Red line: Progress without support (slower, plateaus)
     * Green line: Progress with QVXX (faster, higher impact)
     * X-axis: Time period (0-100 days typical)
     * Y-axis: Impact/Progress
     * Key milestones labeled on each line

5. **Final CTA Section**
   - Compelling headline about urgency
   - Brief company credibility statement
   - Two CTAs: Book call (primary) and Email team (secondary)

Design Requirements:
- Centered layout, max-width 900px
- Clean typography, no unnecessary images
- Muted color palette with strategic use of red/green
- Mobile responsive
- Subtle fade-in animations
- No background colors on problem/opportunity sections
- Large, readable text (1.25rem for key points)
- Generous spacing:
  * 32px margins between major sections
  * 24px padding in cards and containers
  * 20px gaps between related elements
  * Allow content to "breathe" with whitespace

Technical Setup:
- Use Jekyll layout: protected
- Password: Use standard format "[companyname]qvxx" (e.g., "moniteqvxx", "jajaqvxx")
- Password hash: Generate SHA-256 hash of password
- Include cookie consent banner
- Add favicon and company footer
- URL structure: /lets-talk/[client-code]/
- Update robots.txt to exclude directory
```

## Example Usage

### For a FinTech Credit Card Company:
```
Create a password-protected landing page for Jaja Finance in the UK fintech sector. The company's main challenge is customer friction in credit decisions and they need help with AI-powered underwriting.

Current pain points:
- Account closures. No warning.
- 72-hour lockouts. Lost trust.
- Credit denials. No explanation.
- Ombudsman cases. Rising fast.

Opportunities:
- Balance risk with experience
- 10x faster resolution
- Explainable AI decisions
```

### For a Healthcare SaaS:
```
Create a password-protected landing page for MedFlow in the healthcare SaaS sector. The company's main challenge is clinician burnout from documentation and they need help with AI-assisted clinical notes.

Current pain points:
- 3-hour documentation. Daily burden.
- Missed details. Compliance risk.
- Physician turnover. 40% annually.
- Patient time. Cut short.

Opportunities:
- 70% faster documentation
- Real-time compliance checks
- Focus on patient care
```

## Key Success Factors

1. **Specificity**: Use exact metrics and timeframes
2. **Urgency**: Show competitive pressure and closing windows
3. **Contrast**: Clear before/after visualization
4. **Simplicity**: Short, punchy copy that gets to the point
5. **Proof**: Concrete milestones and outcomes
6. **Factual Accuracy**: 
   - Only include claims that can be verified
   - Avoid specific performance metrics unless documented
   - Focus on capabilities rather than past results
   - Use aspirational language ("can achieve") not past tense claims

## Implementation Steps

1. Copy `/lets-talk/fc-q4x9/index.html` as template
2. Update all content placeholders
3. Generate password hash using standard format:
   - Password format: `[companyname]qvxx`
   - Generate hash: `echo -n "companynameqvxx" | shasum -a 256`
   - Example: `echo -n "moniteqvxx" | shasum -a 256`
4. Customize the line chart data and milestones
5. Update competitor information
6. Test on mobile devices
7. Verify robots.txt already excludes /lets-talk/ directory

## Visual Data Best Practices

The line chart should show:
- Realistic progression curves (not straight lines)
- Clear differentiation between paths
- Specific milestone achievements
- Time period relevant to the industry
- Labels that don't overlap or get cut off

## Copy Guidelines

- Headlines: 8-12 words, benefit-focused
- Pain points: 3-4 words + consequence
- Opportunities: Action verbs, measurable outcomes
- CTAs: Direct and urgent ("Book Strategy Call" not "Learn More")
- Avoid jargon, focus on business impact

## Factual Accuracy Requirements

**DO:**
- State QVXX's areas of expertise and focus
- Describe general industry trends and challenges
- Use conditional language for potential outcomes ("can help achieve")
- Focus on the client's known pain points from research

**DON'T:**
- Make specific claims about past client results without evidence
- Include percentage improvements unless documented
- State number of clients helped without verification
- Promise specific outcomes or guarantees

**Example Corrections:**
- ❌ "We've helped 50+ companies reduce costs by 80%"
- ✅ "We help companies optimize their AI implementation costs"

- ❌ "Our clients see 10x faster processing"  
- ✅ "AI automation can significantly accelerate processing times"

## Email Template

After creating the landing page, use this concise email template to reach out:

```
Subject: Extending [Company]'s [current strength] with AI

Hi [Name],

I've prepared a brief analysis of how [Company] could [specific AI opportunity]:

[landing page URL] (password: [password])

Brief conversation about [Company]'s AI roadmap?

[Your name]
[Company name]
[website]
[Contact method]
```

**Template Structure:**
- Subject line references their current success + AI opportunity
- Brief 4-line body with personalized analysis link
- Simple call-to-action question
- Professional signature with preferred contact method