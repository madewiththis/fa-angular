# Universal Test Results Email Template

**Purpose**: Standard template for communicating A/B test results to all stakeholders

---

## 📧 Email Recipients (Copy-Paste)

### Complete Recipient List
```
neill@flowaccount.com; benjamapon_f@flowaccount.com; teeraphan_s@flowaccount.com; natthida_l@flowaccount.com;  kridsada@flowaccount.com; danai@flowaccount.com; kan@flowaccount.com; tanaphorn_l@flowaccount.com; thanakorn_b@flowaccount.com; naphat_m@flowaccount.com
```

### Primary Recipients (To:)
```
neill@flowaccount.com; benjamapon_f@flowaccount.com; teeraphan_s@flowaccount.com; natthida_l@flowaccount.com; 
```

### Executive Team (CC:)
```
kridsada@flowaccount.com; danai@flowaccount.com; kan@flowaccount.com; tanaphorn_l@flowaccount.com; thanakorn_b@flowaccount.com; naphat_m@flowaccount.com
```

---

## 📝 Email Template

**Subject**: [Test ID] – [Test Name] Results

Hi Team,

### Key Details

**Test Name**: [Test ID] – [Test Name]  
**Result**: [✅ WON / ❌ LOST / ⚠️ INCONCLUSIVE]  
**Next Step**: [IMPLEMENT / ITERATE / ABANDON]  
**Financial Impact in Test**: [+/- ฿amount or %]  
**Theoretical Projected Financial Impact**: [+/- ฿amount THB/year]  
**OKR**: [Relevant OKR category → Specific metric]  
**Days Run**: [Number of days]  
**Primary Metric**: [✅/❌ Metric name]  

**Metrics of Interest**:
- [Secondary metric 1]
- [Secondary metric 2]  
- [Secondary metric 3]

### Short Summary
[2-3 sentences describing what was tested, which variation won, and the key quantitative result with % lift]

### Key Learnings
- **[Learning theme 1]**: [Insight about user behavior or business principle]
- **[Learning theme 2]**: [Technical or design insight]  
- **[Learning theme 3]**: [Strategic or process insight]

### Next Steps
- [ ] [Immediate action with owner and deadline]
- [ ] [Follow-up test or iteration needed]
- [ ] [Business process changes required]

**Report Link**: [Link to detailed analysis]

---

Best regards,  
Neill Myers  
CRO Lead Strategist

---

## 📋 Template Usage Instructions

### Result Status Options
- **✅ WON**: Test variation significantly outperformed control
- **❌ LOST**: Test variation significantly underperformed control  
- **⚠️ INCONCLUSIVE**: No statistical significance or mixed results

### Next Step Options
- **IMPLEMENT**: Roll out winning variation to 100% of users
- **ITERATE**: Run follow-up test based on learnings
- **ABANDON**: Stop testing this hypothesis

### Financial Impact Format
- **In Test**: Actual revenue impact during test period (e.g., "+฿110,000")
- **Projected**: Annualized impact if implemented (e.g., "+฿2,721,075 THB/year")

### OKR Format
Use: `[Category] → [Specific Metric]`
Examples:
- `Activations → Free Trial to Paid Conversion`
- `Signups → Landing Page Conversion Rate`
- `Revenue → Average Order Value`

### Key Learnings Structure
Focus on **why** the result happened and **what** it means for future tests:
- **User behavior insights**: How users actually behave vs. assumptions
- **Design/UX principles**: What interface patterns work or don't work
- **Business strategy**: Broader implications for product or marketing

### Metrics Status
- Use ✅ for metrics that improved significantly
- Use ❌ for metrics that declined significantly  
- Use ⚠️ for metrics with mixed/unclear results

---

## 🎯 Communication Best Practices

1. **Lead with impact**: Financial results first, then details
2. **Be decisive**: Clear next steps, not just "interesting results"
3. **Focus on learnings**: What we learned that applies to future tests
4. **Include everyone**: All stakeholders get the same information
5. **Link to details**: Provide access to full analysis for those who want it

---

**Template Location**: Save completed emails as `[test-name]-results-email.md` in the test's `outputs/` folder