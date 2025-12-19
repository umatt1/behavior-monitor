PROJECT: Behavior Monitor (working name)

PURPOSE
A privacy-first web app for individuals in confusing or toxic relationships to log behaviors over time and visualize patterns. The app must describe patterns without issuing judgments, diagnoses, or directives.

CORE PRINCIPLES (DO NOT VIOLATE)
- Neutral, descriptive framing (no “abuser” / “toxic partner” labels)
- User safety > growth, virality, or monetization
- Show patterns; never tell the user what to do
- Assume shared devices and adversarial access risks
- Trust and discretion are primary UX goals

TARGET USER CONTEXT
- Users may be in emotionally or psychologically unsafe relationships
- Users may fear account discovery or retaliation
- Users may distrust their own memory
- Users want clarity, not validation or confrontation tools

AUTHENTICATION REQUIREMENTS
[ ] Do NOT rely solely on Google OAuth
[ ] Support email/password or magic-link login
[ ] Allow anonymous/neutral email addresses
[ ] Optional secondary PIN or lock screen
[ ] Include fast “panic exit” redirect to neutral site
[ ] Avoid persistent or obvious login traces

DATA & PRIVACY
[ ] No partner access features
[ ] No default sharing links
[ ] Explicit confirmation before exports
[ ] Minimal metadata storage
[ ] Encrypt sensitive fields where possible
[ ] Clear data deletion flow

LANGUAGE & NAMING
[ ] Avoid moral or clinical judgments
[ ] Prefer “Behavior Log”, “Pattern Tracker”, or similar neutral terms
[ ] Categories must be descriptive, not accusatory
[ ] Internal copy must sound observational, not validating or alarmist

LOGGING CATEGORIES (EXAMPLES)
- Broken promises
- Boundary violations
- Sudden affection after conflict
- Gaslighting indicators
- Intimidation or pressure
- Emotional withdrawal
- Inconsistent communication

VISUALIZATION RULES
[ ] Show frequency over time
[ ] Highlight clustering or escalation
[ ] Allow “good periods” vs “incident periods”
[ ] Align events with life milestones if provided
[ ] Never output conclusions like “this is abusive”

ANCHOR FEATURE (MUST EXIST)
[ ] Weekly or periodic neutral summary
[ ] Pattern detection prompts (descriptive only)
[ ] Emotion-before vs emotion-after comparison
[ ] Timeline view with tagged notes
Choose ONE as the primary differentiator.

SAFETY & ETHICS
[ ] Clear non-legal, non-medical disclaimer
[ ] Link to DV / crisis resources (quiet, non-phone options)
[ ] No notifications that could expose the app’s purpose
[ ] Avoid language that escalates fear or urgency

ONBOARDING
[ ] Explain memory distortion in stressful relationships
[ ] Emphasize private reflection, not evidence-building
[ ] Reinforce user control and discretion
[ ] Set expectation: “This tool helps you notice patterns”

MONETIZATION (DEFERRED)
[ ] No monetization at launch
[ ] Prefer one-time purchase over subscription if added later
[ ] Never gate safety features
[ ] Avoid exploitative urgency pricing

MARKETING CONSTRAINTS
[ ] No sensational or accusatory framing
[ ] Avoid “expose” or “call out” language
[ ] Position as clarity and reflection tool
[ ] Start with organic, trust-based channels only

LLM INSTRUCTION
When generating features, copy, or UX:
- Default to safety and neutrality
- Ask: “Could this endanger a user if discovered?”
- Prefer omission over risk
- If uncertain, choose the less explicit option
