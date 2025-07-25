# Test Context - Trial Banner Sales Contact Options

**Test ID**: AB-2025-001  
**Date Created**: 2025-01-25  
**Status**: Draft  
**Originated By**: Tong (Warodom Kasiolarn) - Operations Manager  
**Test Hypothesis By**: CRO Team

---

## 🔍 Observation
**What is the user currently experiencing?**

**Current Experience Description:**
Free trial users currently see a countdown banner at the top of the dashboard showing days remaining in their trial with a single "Upgrade" button. As users progress through their trial (especially after 10-30 days), they may have questions about features, pricing, or need help evaluating if FlowAccount is right for their business. Currently, there's no easy pathway to connect with sales support directly from this high-visibility banner, forcing users to either figure things out alone or search for contact options elsewhere on the site.

**Supporting Data:**
- Current trial-to-paid conversion rate: ~21% (industry average: 30-40%)¹
- Drop-off point: 50% of users don't engage with core features after onboarding¹
- User feedback: [To be collected - need actual user quotes]
- Analytics insights: [To be measured - sales contact correlation data needed]

---

## ⚠️ Impact on User
**How does this impact FlowAccount/Users achievement of their goals?**

**User Impact:**
- Goal achievement blocked: Users who need sales assistance to evaluate FlowAccount properly can't easily reach out during critical decision moments
- Frustration points: Having to search for contact information when they're ready to discuss upgrading creates friction
- Alternative behaviors: Users either abandon the trial without getting questions answered, or waste time searching for contact options in footer/help sections

---

## 💡 Hypothesis
**IF [this is changed] THEN [impact on metric(s)] BECAUSE [conversion theories]**

**Hypothesis Statement:**
IF we add "Call Sales" and "Request Callback" options to the trial countdown banner for users who are 10-30 days into their trial
THEN upgrade initiations will increase by 15% and checkout completions will increase by 10%
BECAUSE providing easy access to human assistance during the evaluation phase reduces uncertainty and helps users make confident purchase decisions (following the principle of reducing friction at decision points)

**Expected Results:**
- Goal metric: Trial-to-paid conversion will improve from 21% to 24.2% (+15% relative improvement)¹
- Secondary metrics: 
  - Feature engagement rate will increase as sales can guide users to relevant features
  - Sales contact rate for trial users (baseline to be established)
  - Time from trial start to upgrade decision (baseline to be established)
- Timeline: Results expected within 4 weeks

**Supporting Theory:**
This change leverages the "assistance at the moment of need" principle. Research shows that B2B software buyers often need human interaction to validate their decision, especially for business-critical tools like accounting software. By surfacing sales contact options at the exact moment users are evaluating (10-30 days in), we reduce the effort required to get help and increase the likelihood of conversion.

---

## 🛠️ Solution
**Concisely describe the new UX experience we wish to test?**

The trial countdown banner will be enhanced with two new CTAs alongside the existing "Upgrade" button:

1. **"Call Sales" button** - Opens a modal with:
   - Sales phone number with click-to-call on mobile
   - Office hours clearly displayed
   - Option to schedule a call for later

2. **"Request Callback" button** - Opens a streamlined form with:
   - Name (pre-filled)
   - Phone number
   - Best time to call (dropdown)
   - Optional: Specific question/topic
   - Promise of callback within 2 business hours

These options only appear for users who are:
- In a free trial (not forever free)
- Between days 10-30 of their trial
- Have not already contacted sales

The buttons use secondary styling to not overshadow the primary "Upgrade" CTA but are clearly visible.

---

## 📱 Device Targeting
**Select target device(s) for this test:**

- [ ] **Desktop** - Desktop/laptop users only
- [ ] **Mobile** - Mobile device users only
- [X] **All Devices** - Both desktop and mobile (responsive test)

**Selected**: All Devices

---

## 🎯 Conversion Phase
**Select the primary conversion phase this test targets:**

- [ ] **Signups** - Initial user acquisition and account creation
- [ ] **Value** - User activation and first value realization
- [X] **Upgrade** - Free-to-paid conversion initiatives  
- [ ] **Purchase** - Paid plan selection and checkout
- [ ] **Renewal** - Subscription retention and renewals

**Selected**: Upgrade

---

## 📊 Conversion Metrics
**Select ALL metrics this test is designed to impact:**

### Goal Metrics (select 1-2):
- [X] **Complete Checkout** (#1) - Finalizes checkout with payment
- [ ] **Start Checkout** (#2) - Initiates checkout process
- [ ] **View Checkout Page** (#3) - Lands on checkout page
- [ ] **Select Package** (#4) - Chooses a package option
- [ ] **View Package Page** (#5) - Views package selection
- [X] **Upgrade Button Click** (#6) - Clicks upgrade in app
- [ ] **Engage Key Features** (#7) - Uses conversion-correlated features
- [ ] **Complete Onboarding** (#8) - Finishes onboarding flow
- [ ] **Complete Email Verification** (#9) - Verifies email
- [ ] **Complete First Sign Up Step** (#10) - Starts signup
- [ ] **Land on Sign Up Page** (#11) - Reaches signup page
- [ ] **Click Sign Up CTA** (#12) - Clicks signup on landing

### Secondary Metrics (select additional as relevant):
- [X] **Sales contact click rate** - Users who clicked sales contact CTAs
- [X] **Callback request rate** - Users who requested callbacks
- [ ] **Feature adoption** - Usage of key product features
- [ ] **Time to conversion** - Speed from trial start to upgrade
- [ ] **Support tickets** - Customer service interaction reduction

### Guardrail Metrics (monitor for protection):
- [ ] **Trial engagement** - Ensure banner doesn't reduce trial activity
- [X] **Upgrade Button Click** (#6) - Clicks upgrade in app
- [ ] **Page load time** - Ensure performance not degraded by banner
- [ ] **Error rates** - Technical stability maintained

### Activation Metric (if needed):
- [X] **Viewed trial banner** - User saw the enhanced banner (days 10-30 only)

**Goal Metrics Selected**: Complete Checkout (#1), Upgrade Button Click (#6)
**Secondary Metrics Selected**: Sales contact click rate, Callback request rate
**Guardrail Metrics Selected**: Trial engagement, Page load time
**Activation Metric Selected**: Viewed trial banner

---

## 🔧 Test or Fix
**Select the type of optimization:**

- [X] **Test** - Experimental improvement to validate hypothesis
- [ ] **Fix** - Addressing known user experience problems

**Selected**: Test

---

## ⚡ Priority Level
**Select priority based on business impact and urgency:**

- [ ] **S1 - Critical** - Blocking major conversions, immediate attention required
- [X] **S2 - High** - Significant conversion impact, prioritize in sprint
- [ ] **S3 - Medium** - Moderate improvement opportunity, standard queue
- [ ] **S4 - Low** - Minor optimization, implement when capacity allows

**Selected**: S2 - High

**Priority Justification**: Trial-to-paid conversion at 21% is significantly below industry standards of 30-40%. With 50% of users not engaging with core features after onboarding¹, providing sales assistance could help guide users to value realization and improve conversion.

---

## 👥 Customer Segments
**Select ALL customer segments this test will target:**

### Acquisition Segments:
- [ ] **Prospects** - Users not yet signed up

### Free User Segments:
- [X] **Free | In Trial (Pro Package)** - Users in Pro trial period
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

**Selected Segments**: Free | In Trial (Pro Package)

**Segment Rationale**: Targeting only trial users (not forever free) who are in the evaluation phase and most likely to benefit from sales assistance. These users have shown intent by starting a trial but need help to complete their evaluation.

---

## 🎯 Growth Book Configuration

### Targeting Rules
Based on selections above, configure Growth Book with:

**Device Targeting**: All Devices  
**User Segments**: Free trial users (Pro Package), days 10-30 in trial  
**Conversion Events**: 
- complete_checkout (#1 goal metric)
- upgrade_button_click (#6 goal metric)
- sales_contact_clicked (secondary)
- callback_requested (secondary)
- viewed_trial_banner (activation)
**Priority Queue**: S2 - High Priority

### Sample Size Estimation
- **Expected traffic**: Based on ~2,500 monthly signups¹, estimate ~1,500 trial users in day 10-30 window
- **Minimum detectable effect**: 15% improvement
- **Statistical power**: 80% (standard)
- **Significance level**: 95% (standard)

---

## 📈 Success Framework

### Business Impact Tiers
Based on priority and metrics selected:

**S2 Priority**: 
- Minimum success threshold: 10% improvement in Complete Checkout rate
- Target success goal: 15% improvement in Complete Checkout rate  
- Exceptional success: 20%+ improvement in Complete Checkout rate

### Measurement Timeline
- **Early indicators** (Week 1): Sales contact clicks, callback request submissions
- **Goal metric results** (Week 2-4): Complete Checkout rate, Upgrade Button Click rate
- **Long-term impact** (Month 1-3): Customer LTV of sales-assisted vs self-serve conversions

---

## 🔗 Related Context

- Strategic initiative: Improve trial-to-paid conversion from 21% to industry standards (30-40%)¹
- Business Goals: Increase free to paid upgrades, increase feature adoption rates¹

---

## ✅ Review Checklist

### 🏗️ Stage Gate 1: Developable
- [ ] **Developer approval**: Development team confirms feature is technically feasible
- [ ] **Technical scope defined**: Clear understanding of implementation requirements
- [ ] **Resource estimation**: Development effort and timeline confirmed
- **Developer Approved By**: _________________ **Date**: _________
- **CRO Lead Approved By**: _________________ **Date**: _________

### 📐 Stage Gate 2: Wireframe Approved  
- [ ] **Design clarity**: Wireframe shows exact user experience and interactions
- [ ] **Team alignment**: All stakeholders understand and approve the design approach
- [ ] **User flow validated**: Complete user journey documented and approved
- **Designer Approved By**: _________________ **Date**: _________
- **CRO Lead Approved By**: _________________ **Date**: _________

### 📊 Stage Gate 3: Test Metrics OK
- [ ] **Events trackable**: All required conversion events can be measured
- [ ] **Analytics setup**: Tracking infrastructure in place for all metrics
- [ ] **Growth Book config**: Test targeting and metrics properly configured
- **Analytics Lead Approved By**: _________________ **Date**: _________
- **CRO Lead Approved By**: _________________ **Date**: _________

### 🎨 Stage Gate 4: Final Design Approved
- [ ] **Visual design final**: All stakeholders approve final UI/UX design
- [ ] **Brand consistency**: Design aligns with brand guidelines and style system
- [ ] **Responsive verified**: Design works across all target devices
- **Design Lead Approved By**: _________________ **Date**: _________
- **CRO Lead Approved By**: _________________ **Date**: _________

### 🚀 Stage Gate 5: Ready to Launch
- [ ] **Growth Book tested**: Test variations work correctly in testing environment
- [ ] **Edge cases covered**: Unusual scenarios and error states handled properly
- [ ] **QA complete**: No crashes, technical issues, or broken functionality
- [ ] **Rollback verified**: Can safely disable test if issues arise
- **QA Lead Approved By**: _________________ **Date**: _________
- **CRO Lead Approved By**: _________________ **Date**: _________

### 📋 Standard Checklist
- [ ] **Targeting validated**: Trial users day 10-30 targeting configured
- [ ] **Metrics instrumented**: All conversion events properly tracked (checkout, upgrade clicks, sales contacts)
- [ ] **Sample size sufficient**: ~1,500 trial users per month in target segment
- [ ] **Priority justified**: High revenue impact potential confirmed
- [ ] **Success criteria clear**: 10% minimum improvement threshold set for Complete Checkout
- [ ] **Metric story clear**: Can explain hypothesis → result → why in 3 sentences
- [ ] **No vanity metrics**: All metrics directly relate to proving sales assistance improves conversion

---

**💡 Usage Note**: This test focuses on reducing friction at a critical decision point in the trial journey by providing human assistance options.

---

## 📚 Data Sources Appendix

¹ **Conversion Funnel Data**: All statistics marked with ¹ are sourced from:
- File: `/dev_files/context/context-conversion-funnel-fallouts.md`
- Key metrics used:
  - Current trial conversion: ~21% (line 164)
  - Industry average: 30-40% (line 164)
  - Monthly signups: ~2,500 (line 163)
  - Feature engagement: 50% don't engage with core features (line 79)
  - Business goals and priorities (lines 172-177)

**Note on Missing Data**:
- User feedback quotes: Need to collect actual user testimonials
- Sales contact correlation: Need baseline measurement of current sales contact rates and their conversion impact
- Time to upgrade decision: Need to establish current baseline metrics

**Assumptions Made**:
- 10-30 day window chosen based on typical B2B SaaS trial evaluation periods
- Expected improvements (15% for goal metric) are conservative estimates based on industry benchmarks for adding human assistance to self-serve trials
- Trial user volume estimation assumes 60% of monthly signups are in the 10-30 day window at any given time