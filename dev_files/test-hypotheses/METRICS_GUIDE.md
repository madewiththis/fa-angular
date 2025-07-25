# Metrics Guide - Choosing the Right Metrics for A/B Tests

This guide explains the different types of goals and metrics available in Growth Book, and provides guidance on how to select the right metrics for your test hypotheses.

## 📊 Goal Types

### 1. Activation Metrics
**Purpose**: Users must convert on this metric before being included in the test analysis.

**When to use**:
- To ensure you're only measuring users who have reached a certain point in the journey
- To filter out noise from users who haven't engaged enough to be affected by your change
- To create more precise test populations

**Examples**:
- "Viewed pricing page" - for tests about pricing presentation
- "Completed onboarding" - for tests about in-app features
- "Started free trial" - for tests about trial experience

### 2. Goal Metrics
**Purpose**: The primary metrics you are trying to improve with this experiment.

**When to use**:
- These are your hypothesis metrics - what you expect to change
- Typically 1-2 metrics maximum to maintain statistical power
- Should directly relate to your IF/THEN statement

**Examples**:
- "Trial-to-paid conversion rate"
- "Signup completion rate"
- "Feature adoption rate"

### 3. Secondary (Behavioral) Metrics
**Purpose**: Indicators that help understand user engagement and where friction might occur. They provide clues about behavior but should NEVER replace conversion goals.

**When to use**:
- To understand HOW users are moving toward (or away from) conversion
- To diagnose WHY a test succeeded or failed
- To provide context for the conversion story

**What to track**:
- Actions that directly precede conversions (form starts → form submissions)
- Clear friction indicators (error rates, abandonment points)
- Path efficiency metrics (steps to conversion)

**What NOT to track**:
- Vanity interactions (video play/pause, hover events)
- Ambiguous behaviors (menu clicks - could mean easier OR harder to find items)
- Micro-interactions that don't connect to conversion

### 4. Guardrail Metrics
**Purpose**: Metrics you want to monitor to ensure no negative impacts, but are NOT trying to improve.

**When to use**:
- To protect against unintended consequences
- To ensure changes don't harm other parts of the business
- To maintain quality standards

**Examples**:
- "Page load time" - ensure performance doesn't degrade
- "Error rate" - ensure functionality remains stable
- "Existing user engagement" - ensure new user focus doesn't harm current users

## 📈 Metric Types

### 1. Binomial Metrics
**Definition**: Percent of users who do something (binary yes/no)

**Formula**: (Users who did action) / (Total users) × 100%

**Use cases**:
- Click rates: "Clicked upgrade button"
- View rates: "Viewed checkout page"
- Completion rates: "Completed signup"
- Bounce rates: "Left within 10 seconds"

**Best for**: Conversion funnels, engagement tracking, feature adoption

### 2. Count Metrics
**Definition**: Number of actions per user (can be 0, 1, 2, 3...)

**Formula**: (Total actions) / (Total users)

**Use cases**:
- "Number of features used per session"
- "Support tickets created per user"
- "Invoices created in first week"
- "Page views per visit"

**Best for**: Engagement depth, feature usage intensity, productivity metrics

### 3. Duration Metrics
**Definition**: How long something takes (measured in time units)

**Formula**: Average or median time measurement

**Use cases**:
- "Time to complete signup"
- "Session duration"
- "Time to first invoice"
- "Page load speed"

**Best for**: Performance optimization, user efficiency, engagement quality

### 4. Revenue Metrics
**Definition**: How much money a user generates (measured in currency)

**Formula**: Total revenue / Number of users

**Use cases**:
- "Revenue per visitor"
- "Average order value"
- "Customer lifetime value"
- "Monthly recurring revenue per user"

**Best for**: Monetization tests, pricing experiments, upsell optimization

## 🎯 Choosing the Right Metrics

### Core Principle: Hypothesis-First Metric Selection

**Your metrics should efficiently answer ONE question: "Is the hypothesis proven true or not?"**

Every metric you choose should either:
1. **Directly measure** the hypothesis outcome (Goal metrics)
2. **Explain the mechanism** of success/failure (Secondary metrics)
3. **Protect against harm** (Guardrail metrics)

If a metric is just "interesting" but doesn't help prove/disprove your hypothesis, DON'T TRACK IT.

### The Menu Interaction Paradox
**Example of ambiguous metrics:**
- More menu clicks could mean:
  - ❌ Users are lost and struggling (bad)
  - ✅ Users are exploring more products (good)
  - 🤷 Users are browsing differently (neutral)

**Instead, measure what matters:**
- ✅ Add to cart rate (clear success signal)
- ✅ Products viewed → purchased (efficiency metric)
- ✅ Time to purchase (speed metric)

### Revenue Impact Focus
**Always ensure goal metrics reflect actions that most directly move users closer to your revenue goal.** The closer to "Complete Checkout" your metric is, the more direct its business impact.

### Step 1: Start with Your Hypothesis
Your IF/THEN statement should guide your goal metrics:
- IF we add sales contact → THEN conversion rate increases (Binomial)
- IF we simplify checkout → THEN time to complete decreases (Duration)
- IF we add recommendations → THEN items per order increases (Count)

### Step 2: Match Metric Type to User Behavior

| User Behavior | Best Metric Type | Example |
|--------------|------------------|---------|
| Did they do it? | Binomial | Clicked CTA, Completed signup |
| How many times? | Count | Features used, Items purchased |
| How long did it take? | Duration | Time to value, Session length |
| How much did they pay? | Revenue | Subscription value, Total spend |

### Step 3: Consider Your Statistical Needs

**Binomial Metrics**:
- ✅ Easiest to reach statistical significance
- ✅ Clear interpretation (X% vs Y%)
- ⚠️ May miss nuance in user behavior

**Count Metrics**:
- ✅ Capture intensity of engagement
- ⚠️ Can be skewed by power users
- ⚠️ Need larger sample sizes

**Duration Metrics**:
- ✅ Great for efficiency improvements
- ⚠️ Often have high variance
- ⚠️ May need log transformation

**Revenue Metrics**:
- ✅ Direct business impact
- ⚠️ High variance, need large samples
- ⚠️ Can be affected by outliers

## 📋 Metric Selection Template

When defining metrics for your test, fill out:

### Goal Metrics (1-2 max)
1. **Metric Name**: [Specific metric]
   - **Type**: [Binomial/Count/Duration/Revenue]
   - **Definition**: [Exact calculation]
   - **Current Baseline**: [Current performance]
   - **Target Improvement**: [Expected change]

### Secondary Metrics (3-5)
1. **Metric Name**: [Specific metric]
   - **Type**: [Binomial/Count/Duration/Revenue]
   - **Why Track**: [Reason for including]

### Guardrail Metrics (2-3)
1. **Metric Name**: [Specific metric]
   - **Type**: [Binomial/Count/Duration/Revenue]
   - **Threshold**: [Acceptable range]

### Activation Metric (if needed)
- **Metric Name**: [Qualification criteria]
- **Why**: [Reason for filtering]

## 📊 Secondary (Behavioral) Metrics Reference

These indicators help you understand user engagement and identify friction points. They should support—not replace—your conversion goals.

### Key Principle
**Always ensure behavioral metrics give you a clue about whether users are getting closer to or further from your conversion goal.**

### Behavioral Metric Categories

#### Page Value Metrics
| Metric | What It Tells You | When to Use |
|--------|-------------------|-------------|
| Bounce rates | Immediate rejection of value prop | Landing page tests |
| Time on page | Engagement depth (but ambiguous) | Content tests |
| Scroll depth | Content consumption | Long-form page tests |

#### Form Metrics (Critical)
| Metric | What It Tells You | When to Use |
|--------|-------------------|-------------|
| Form Starts | Intent to convert | All form optimizations |
| Form Submissions | Successful conversion | Primary success metric |
| Form Errors | Friction points | Diagnose failures |

#### UI Element Interactions
| Element | Useful Metrics | Avoid Tracking |
|---------|----------------|----------------|
| Panels | Open/Close rates for key info | Every panel interaction |
| Buttons | CTAs leading to conversion | Non-conversion buttons |
| Videos | Completion of educational content | Play/pause/scrub events |
| Guides | Step completion rates | Time on each step |

### The "So What?" Test
Before adding any behavioral metric, ask:
1. **If this metric goes up, does it clearly mean users are closer to converting?**
2. **If this metric goes down, does it clearly indicate a problem?**
3. **Can I take action based on this metric's movement?**

If you answer "maybe" or "it depends" to any of these, the metric is likely too ambiguous.

### Good vs Bad Secondary Metrics

**✅ GOOD: Clear Directional Indicators**
- Checkout form start rate (clear purchase intent)
- Package selection page → checkout rate (conversion momentum)
- Error message encounters (clear friction)
- Feature activation within trial (proven correlation to upgrade)

**❌ BAD: Ambiguous Interactions**
- Total menu clicks (could be good or bad)
- Video play events (doesn't indicate value received)
- Hover events (no clear intent)
- Time in app (could mean engaged or confused)
- Number of pages visited (exploration or lost?)

## 📝 Form Tracking Best Practices

For critical forms in the user experience flow, track only these essential events to avoid data overwhelm:

### Three Essential Form Events

1. **Form Starts** (Binomial)
   - **Definition**: User begins interacting with the form (first field focus)
   - **Why Track**: Measures intent and form discoverability
   - **Example Metrics**: "Started checkout form", "Started signup form"

2. **Form Submissions** (Binomial)
   - **Definition**: User successfully submits the form
   - **Why Track**: Measures completion and success rate
   - **Example Metrics**: "Submitted payment form", "Completed registration"

3. **Form Errors** (Count or Binomial)
   - **Definition**: Validation errors or submission failures
   - **Why Track**: Identifies friction points and technical issues
   - **Example Metrics**: "Encountered form error", "Payment validation failed"

### Form Conversion Rate Calculation
```
Form Conversion Rate = (Form Submissions / Form Starts) × 100%
Form Error Rate = (Users with Errors / Form Starts) × 100%
```

### Critical Forms to Track

**Must Track**:
- Signup/Registration forms
- Login forms
- Checkout/Payment forms
- Package selection forms
- Contact/Callback request forms

**Consider Tracking**:
- Profile completion forms
- Feature setup forms
- Support request forms

### Implementation Guidelines

1. **Keep It Simple**: Only track starts, submissions, and errors
2. **Consistent Naming**: Use pattern: `{form_name}_started`, `{form_name}_submitted`, `{form_name}_error`
3. **Error Details**: Include error type in event properties, not as separate events
4. **Avoid Over-Tracking**: Don't track individual field interactions unless solving specific problems

### Example Form Metrics in Tests

**For Signup Flow Test**:
- Goal: `signup_form_submitted` (Binomial)
- Secondary: `signup_form_error` rate (Binomial)
- Guardrail: `signup_form_started` (ensure visibility isn't reduced)

**For Checkout Test**:
- Goal: `checkout_form_submitted` (Binomial)
- Secondary: `checkout_form_error` types (Count)
- Activation: `checkout_form_started` (only analyze users who started)

## 🎯 FlowAccount Goal (Conversion) Metrics

These are the core conversion metrics that directly contribute to revenue. They form the backbone of the conversion funnel and should be prioritized when selecting test metrics. The ultimate conversion metric is 'Complete Checkout'.

### Conversion Funnel Metrics (Ordered by Distance from Revenue)

| Priority | Page/Section | Goal Metric | Description | Metric Type |
|----------|--------------|-------------|-------------|-------------|
| 1 | Checkout Page | Complete Checkout | Finalizes the checkout process with payment | Binomial |
| 2 | Checkout Page | Start Checkout | Initiates the checkout process by entering details | Binomial |
| 3 | Checkout Page | View Checkout Page | User lands on checkout page and reviews order | Binomial |
| 4 | Package Selection | Select Package | User selects a package from available options | Binomial |
| 5 | Package Selection | View Package Page | User views the package selection page | Binomial |
| 6 | App | Upgrade Button Click | User clicks upgrade button in topbar | Binomial |
| 7 | App | Engage Key Features | User interacts with features correlated to upgrades | Binomial |
| 8 | Sign Up Flow | Complete Onboarding | Completes onboarding and lands in dashboard | Binomial |
| 9 | Sign Up Flow | Complete Email Verification | Finishes the email verification step | Binomial |
| 10 | Sign Up Flow | Complete First Sign Up Step | Enters email, name, phone to initiate signup | Binomial |
| 11 | Sign Up Flow | Land on Sign Up Page | User navigates to the sign up page | Binomial |
| 12 | Landing Pages | Click Sign Up CTA | Clicks signup call-to-action on landing pages | Binomial |

### Using Goal Metrics in Tests

**Goal Metric Selection**:
- Choose metrics closest to revenue for maximum business impact
- For checkout tests: Use metrics 1-3
- For pricing tests: Use metrics 4-5
- For in-app tests: Use metrics 6-7
- For onboarding tests: Use metrics 8-10
- For landing page tests: Use metrics 11-12

**Micro vs Macro Conversions**:
- **Macro**: Complete Checkout (metric #1) - ultimate goal
- **Micro**: All others - steps leading to the macro conversion

**Best Practices**:
1. Always track the immediate next step in the funnel as goal metric
2. Track 2-3 steps downstream as secondary metrics
3. Use "Complete Checkout" as a guardrail for tests far from checkout

## 🚀 FlowAccount-Specific Metric Examples

### For Landing Page Tests
**Goal**: 
- Signup initiation rate (Binomial)
- Signup completion rate (Binomial)

**Secondary**:
- Time on page (Duration)
- Scroll depth (Binomial - scrolled 75%+)
- Video engagement (Binomial - watched 50%+)

**Guardrails**:
- Page load time (Duration - under 3s)
- Error rate (Binomial - under 0.1%)

### For Trial Experience Tests
**Goal**:
- Trial-to-paid conversion (Binomial)
- Feature adoption rate (Binomial)

**Secondary**:
- Features used count (Count)
- Time to first value (Duration)
- Support tickets (Count)

**Guardrails**:
- Trial abandonment rate (Binomial)
- Daily active usage (Binomial)

**Activation**:
- Completed onboarding (Binomial)

### For Checkout Tests
**Goal**:
- Checkout completion rate (Binomial)
- Revenue per visitor (Revenue)

**Secondary**:
- Time to complete checkout (Duration)
- Form abandonment points (Binomial)

**Guardrails**:
- Payment error rate (Binomial)
- Cart abandonment (Binomial)

## ⚡ Quick Decision Framework

1. **What are you trying to prove?**
   → This becomes your Goal metric

2. **What else might change?**
   → These become Secondary metrics

3. **What must not get worse?**
   → These become Guardrail metrics

4. **Who should be included?**
   → This becomes your Activation metric

5. **Is it yes/no, how many, how long, or how much?**
   → This determines your metric type

## 📖 The Metric Story Framework

When presenting test results, you should be able to tell a clear story:

### The 3-Sentence Test Result Story
1. **"We hypothesized that [change] would increase [goal metric]."**
2. **"The results showed [goal metric movement] with [statistical significance]."**
3. **"This was because [secondary metrics explain the mechanism]."**

### Example Stories

**Good Story (Clear and Actionable):**
> "We hypothesized that adding sales contact options would increase trial-to-paid conversion. The results showed a 15% increase in upgrades with 95% confidence. This was because 12% of users clicked the sales contact option and those who did converted at 3x the rate."

**Bad Story (Unclear and Distracting):**
> "We added sales contact options and saw 47 different interaction metrics change. Menu clicks went up 23%, video plays decreased 5%, hover events on buttons increased 340%, time on page went down but pages per session went up. Oh, and conversions increased 15% but we're not sure why."

### Story Clarity Checklist
- [ ] Can you explain the result in 3 sentences?
- [ ] Does each metric clearly support the narrative?
- [ ] Would a stakeholder immediately understand success/failure?
- [ ] Can you make a clear decision based on these metrics?

## 📝 Common Mistakes to Avoid

1. **Too many goal metrics**: Dilutes statistical power
2. **Wrong metric type**: Using Count when Binomial is clearer
3. **Missing guardrails**: Not protecting against negative impacts
4. **Vague definitions**: "Engagement" vs "Clicked any feature button"
5. **No activation metric**: Including users who never saw the change
6. **Ignoring variance**: Choosing high-variance metrics for small tests
7. **Over-tracking forms**: Tracking every field interaction instead of just starts, submissions, and errors
8. **Too many events**: Creating noise with excessive granular tracking instead of focusing on critical conversions
9. **"Interesting" metrics**: Tracking vanity metrics that don't answer the hypothesis (video plays, hovers, etc.)
10. **Ambiguous behaviors**: Tracking metrics that could mean multiple things (menu clicks, time in app)
11. **Losing the story**: Having so many metrics you can't clearly explain if the test succeeded

---

**Remember**: The best metric is one that:
- Directly measures your hypothesis
- Has enough data to reach significance
- Is clearly defined and measurable
- Aligns with business objectives