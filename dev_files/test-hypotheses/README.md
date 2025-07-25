# Test Hypotheses - Growth Book A/B Testing

This folder contains all test hypotheses for A/B testing via Growth Book. Each hypothesis follows a standardized format to ensure consistent test design and implementation.

**📊 Test Status Tracking**: See `_test_index.md` for current status of all test hypotheses across the pipeline.

## 🚀 Quick Start for AI Instances

When a user says **"build a test hypothesis"** or **"create a test hypothesis"**, follow these steps:

1. **Copy the template** from `/dev_files/deliverables/output-document-templates/_TEST_CONTEXT_TEMPLATE.md`
2. **Create a new file** in this folder named `{test-name}.md` (e.g., `hero-section-cta-optimization.md`)
3. **Fill out all sections** of the template with specific details
4. **Save the file** and inform the user it's ready for review

## 📋 Test Hypothesis Structure

Each test hypothesis must include:

### 1. Observation (Current State)
- Description of current user experience
- Specific pain points or friction
- Supporting data (conversion rates, drop-off points)
- User feedback/quotes if available

### 2. Impact on User
- How this affects user goals
- Business metric implications
- Alternative behaviors/workarounds

### 3. Hypothesis Statement
**Must follow IF/THEN/BECAUSE format:**
- **IF** we implement [specific change]
- **THEN** [metric] will improve by [X%]
- **BECAUSE** [UX principle or behavioral theory]

### 4. Solution Description
- Detailed new UX experience
- Specific UI changes
- Technical implementation notes

### 5. Test Configuration
- Device targeting (Desktop/Mobile/All)
- Conversion phase (Signups/Value/Upgrade/Purchase/Renewal)
- Primary and secondary metrics
- Priority level (S1-S4)
- Customer segments
- Success thresholds

## 📁 File Naming Convention

Use descriptive names that indicate the test area and change:
- `hero-section-cta-optimization.md`
- `pricing-table-simplification.md`
- `onboarding-flow-streamline.md`
- `dashboard-navigation-redesign.md`

## 🎯 Common Test Areas

Based on conversion funnel analysis, common test areas include:

1. **Landing Page Tests**
   - Hero section messaging and CTAs
   - Feature presentation and benefits
   - Pricing table clarity
   - Social proof placement

2. **Signup Flow Tests**
   - Form field reduction
   - Progressive disclosure
   - Social login options
   - Error messaging improvements

3. **Onboarding Tests**
   - First-time user experience
   - Feature discovery
   - Value realization speed
   - Tutorial effectiveness

4. **Dashboard Tests**
   - Navigation structure
   - Feature accessibility
   - Information hierarchy
   - Quick action placement

## 📊 Priority Guidelines

- **S1 (Critical)**: Blocking major conversions, >20% potential improvement
- **S2 (High)**: Significant impact, 10-20% potential improvement
- **S3 (Medium)**: Moderate opportunity, 5-10% potential improvement
- **S4 (Low)**: Minor optimization, <5% potential improvement

## 🔄 Test Lifecycle

1. **Draft**: Initial hypothesis creation
2. **Ready**: Approved for implementation
3. **Live**: Currently running in Growth Book
4. **Complete**: Test concluded with results documented

## 💡 Tips for Strong Hypotheses

1. **Be Specific**: Vague changes lead to inconclusive results
2. **Quantify Impact**: Always include expected % improvements
3. **Reference Data**: Use actual user behavior data from analytics
4. **Think Mobile**: Consider mobile experience separately if needed
5. **Segment Wisely**: Don't over-segment; ensure statistical significance

## 📈 Success Metrics Reference

Common metrics to track:
- Signup initiation rate
- Signup completion rate
- Time to first value
- Feature adoption rate
- Free-to-paid conversion rate
- User activation rate
- Session engagement metrics
- Support ticket reduction

## 🔗 Related Documentation

- Test template: `/dev_files/deliverables/output-document-templates/_TEST_CONTEXT_TEMPLATE.md`
- Metrics guide: `./METRICS_GUIDE.md` - How to choose the right metrics for your tests
- Conversion data: `/dev_files/context/context-conversion-funnel-fallouts.md`
- Project purpose: `/dev_files/context/context-project-purpose-and-deliverables.md`

---

**Remember**: Every test hypothesis should directly address a conversion funnel fallout point or user experience friction identified in the prototype. The goal is to provide the FlowAccount team with data-driven UX improvements ready for A/B testing.