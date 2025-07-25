# Test Context Template - FlowAccount A/B Test Metadata

**🎯 PURPOSE**: Use this template to define standardized context metadata for each A/B test. This ensures consistent test categorization and proper targeting.

**📋 INSTRUCTIONS FOR AI INSTANCES**:
1. **Copy this template** when creating test documentation
2. **Select ONE option** from each dropdown-style field below
3. **Include with test hypothesis** - either embedded or as separate context file
4. **Update Growth Book** with these targeting parameters
5. **Use for test analysis** - group results by these dimensions

---

# Test Context - [Test Name]

**Test ID**: AB-2025-XXX  
**Date Created**: [YYYY-MM-DD]  
**Status**: [Draft / Ready / Live / Complete]

---

## 🔍 Observation
**What is the user currently experiencing?**

**🤖 AI Instructions**: 
- Describe the current user experience pain point or friction
- Include specific user behavior data (bounce rates, time on page, etc.)
- Reference current conversion funnel metrics from context files
- Use actual user quotes or feedback if available

**Current Experience Description:**
[Detailed description of the current user experience, including specific pain points and where users are dropping off in the funnel]

**Supporting Data:**
- Current conversion rate: [X%]
- Drop-off point: [Specific step or page]
- User feedback: [Quotes or survey data]
- Analytics insights: [Bounce rate, time on page, etc.]

---

## ⚠️ Impact on User
**How does this impact FlowAccount/Users achievement of their goals?**

**🤖 AI Instructions**: 
- Connect user experience issues to business metrics
- Explain how this affects user success and satisfaction
- Reference business goals from project context documentation

**User Impact:**
- Goal achievement blocked: [How this prevents users from accomplishing their goals]
- Frustration points: [Specific user pain points]
- Alternative behaviors: [What users do instead / workarounds]

---

## 💡 Hypothesis
**IF [this is changed] THEN [impact on metric(s)] BECAUSE [conversion theories]**

**🤖 AI Instructions**: 
- Follow the exact IF/THEN/BECAUSE format
- Be specific about the change being tested
- Include quantified expected impact (% improvement)
- Reference established UX/conversion principles
- **Remember**: All metrics should efficiently answer whether this hypothesis is true

**Hypothesis Statement:**
IF [specific UX change or new feature implementation]
THEN [specific metric will improve by X%]
BECAUSE [psychological/UX principle or user behavior theory]

**Expected Results:**
- Goal metric: [Metric name] will improve from [current %] to [target %]
- Secondary metrics: [List 2-3 supporting metrics and expected changes]
- Timeline: Results expected within [X weeks/months]

**Supporting Theory:**
[Explanation of why this change should work based on UX principles, psychology, or industry best practices]

---

## 🛠️ Solution
** Concisely describe the new UX experience we wish to test?**

**🤖 AI Instructions**: 
- Provide detailed description of the new user experience
- Include specific UI/UX changes being tested

---

## 📱 Device Targeting
**Select target device(s) for this test:**

- [ ] **Desktop** - Desktop/laptop users only
- [ ] **Mobile** - Mobile device users only
- [ ] **All Devices** - Both desktop and mobile (responsive test)

**Selected**: [Device selection]

---

## 🎯 Conversion Phase
**Select the primary conversion phase this test targets:**

- [ ] **Signups** - Initial user acquisition and account creation
- [ ] **Value** - User activation and first value realization
- [ ] **Upgrade** - Free-to-paid conversion initiatives  
- [ ] **Purchase** - Paid plan selection and checkout
- [ ] **Renewal** - Subscription retention and renewals

**Selected**: [Conversion phase]

---

## 📊 Conversion Metrics
**Select ALL metrics this test is designed to impact:**

> 📖 **See Metrics Guide**: For detailed guidance on choosing metrics, refer to `/dev_files/test-hypotheses/METRICS_GUIDE.md`

### Goal Metrics (select 1-2):
> 📊 **Choose from the 12 core conversion metrics (see Metrics Guide). Listed by distance from revenue:**

- [ ] **Complete Checkout** (#1) - Finalizes checkout with payment
- [ ] **Start Checkout** (#2) - Initiates checkout process
- [ ] **View Checkout Page** (#3) - Lands on checkout page
- [ ] **Select Package** (#4) - Chooses a package option
- [ ] **View Package Page** (#5) - Views package selection
- [ ] **Upgrade Button Click** (#6) - Clicks upgrade in app
- [ ] **Engage Key Features** (#7) - Uses conversion-correlated features
- [ ] **Complete Onboarding** (#8) - Finishes onboarding flow
- [ ] **Complete Email Verification** (#9) - Verifies email
- [ ] **Complete First Sign Up Step** (#10) - Starts signup
- [ ] **Land on Sign Up Page** (#11) - Reaches signup page
- [ ] **Click Sign Up CTA** (#12) - Clicks signup on landing

### Secondary Metrics (select additional as relevant):
> ⚠️ **Only choose metrics that clearly indicate progress toward conversion. Avoid ambiguous metrics like "total clicks" or "time in app"**

- [ ] **Time to value** - Speed of first meaningful interaction
- [ ] **Feature adoption** - Usage of key product features  
- [ ] **Form error rate** - Friction indicators in conversion flow
- [ ] **Path efficiency** - Steps taken to reach conversion
- [ ] **Support tickets** - Customer service interaction reduction

### Guardrail Metrics (monitor for protection):
> 💡 **Metrics to ensure no negative impacts. Not trying to improve these, just monitoring.**

- [ ] **Page load time** - Ensure performance doesn't degrade
- [ ] **Error rates** - Technical stability maintained
- [ ] **Existing user metrics** - Current users not negatively impacted
- [ ] **Complete checkout** (if testing early funnel) - Ultimate conversion protected

### Activation Metric (if needed):
> 🎯 **Users must complete this action to be included in the test analysis**

- [ ] **Viewed test variation** - Saw the changed element
- [ ] **Reached test page** - Arrived at the page being tested
- [ ] **Completed prior step** - Finished preceding funnel step
- [ ] **Qualified segment action** - Performed qualifying behavior

**Goal Metrics Selected**: [List goal metrics]  
**Secondary Metrics Selected**: [List secondary metrics]
**Guardrail Metrics Selected**: [List guardrail metrics]
**Activation Metric Selected**: [If applicable]

---

## 🔧 Test or Fix
**Select the type of optimization:**

- [ ] **Test** - Experimental improvement to validate hypothesis
- [ ] **Fix** - Addressing known user experience problems

**Selected**: [Test or Fix]

---

## ⚡ Priority Level
**Select priority based on business impact and urgency:**

- [ ] **S1 - Critical** - Blocking major conversions, immediate attention required
- [ ] **S2 - High** - Significant conversion impact, prioritize in sprint
- [ ] **S3 - Medium** - Moderate improvement opportunity, standard queue
- [ ] **S4 - Low** - Minor optimization, implement when capacity allows

**Selected**: [Priority level]

**Priority Justification**: [Brief explanation of why this priority was assigned]

---

## 👥 Customer Segments
**Select ALL customer segments this test will target:**

### Acquisition Segments:
- [ ] **Prospects** - Users not yet signed up

### Free User Segments:
- [ ] **Free | In Trial (Pro Package)** - Users in Pro trial period
- [ ] **Free | Forever Free Package** - Users on permanent free plan
- [ ] **Free | Any Free Package** - All free users regardless of type

### Paid User Segments:
- [ ] **Paid | Standard Package** - Standard plan subscribers
- [ ] **Paid | Pro Package** - Pro plan subscribers  
- [ ] **Paid | Pro Business Package** - Business plan subscribers
- [ ] **Paid | Any Paid Package** - All paid users regardless of plan

### Billing Segments:
- [ ] **Monthly Subscribers** - Users on monthly billing
- [ ] **Yearly Subscribers** - Users on annual billing

### Universal:
- [ ] **All** - All users regardless of status

**Selected Segments**: [List all selected segments]

**Segment Rationale**: [Explain why these specific segments were chosen for this test]

---

## 🎯 Growth Book Configuration

### Targeting Rules
Based on selections above, configure Growth Book with:

**Device Targeting**: [Desktop/Mobile/All]  
**User Segments**: [List segments for Growth Book rules]  
**Conversion Events**: [List events to track]  
**Priority Queue**: [S1/S2/S3/S4]

### Sample Size Estimation
- **Expected traffic**: [% of total users matching targeting]
- **Minimum detectable effect**: [% improvement needed]
- **Statistical power**: 80% (standard)
- **Significance level**: 95% (standard)

---

## 📈 Success Framework

### Business Impact Tiers
Based on priority and metrics selected:

**If S1/S2 Priority**: 
- Minimum success threshold: [X% improvement]
- Target success goal: [Y% improvement]
- Exceptional success: [Z% improvement]

**If S3/S4 Priority**:
- Minimum success threshold: [X% improvement]
- Target success goal: [Y% improvement]

### Measurement Timeline
- **Early indicators** (Week 1): [Leading metrics to watch]
- **Goal metric results** (Week 2-4): [Main conversion metrics]
- **Long-term impact** (Month 1-3): [Retention and LTV effects]

---

## 🔗 Related Context

**Conversion Funnel Reference**: 
- Related fallout from: [Reference specific section of conversion-funnel-fallouts.md]

**Previous Tests**:
- Related test results: [Link to previous tests in same phase/segment]

**Business Goal Alignment**:
- Strategic initiative: [How this supports broader business goals]
- OKR connection: [Relevant company/team objectives]

---

## ✅ Review Checklist

Before launching test, confirm:

- [ ] **Targeting validated**: Segments and device targeting configured correctly
- [ ] **Metrics instrumented**: All conversion events properly tracked  
- [ ] **Sample size sufficient**: Enough traffic to reach statistical significance
- [ ] **Priority justified**: Business impact supports priority assignment
- [ ] **Success criteria clear**: Team aligned on what constitutes success
- [ ] **Rollback plan ready**: Clear process if test performs negatively
- [ ] **Metric story clear**: Can explain hypothesis → result → why in 3 sentences
- [ ] **No vanity metrics**: All metrics directly relate to proving/disproving hypothesis

---

**💡 Usage Note**: This context template should accompany every test hypothesis to ensure consistent categorization and proper Growth Book configuration. 