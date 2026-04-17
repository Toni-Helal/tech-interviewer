# Tech Interviewer Plugin

An HR tech lead interviewer for conducting, preparing, and evaluating technical interviews for web developer roles.

## Features

### Skills

1. **Conduct Interview** — Full technical interview with Q&A and live coding challenges
   - Structured 3-part interview: introduction, Q&A, coding challenge
   - Covers frontend, backend/full-stack, and system design
   - Professional interviewer guidance
   - Records answers and code submissions

2. **Prepare Interview Plan** — Generate interview plans for candidates
   - Generic reusable interview templates
   - Candidate-specific customized plans
   - Timed agendas and question banks
   - Adjusted difficulty based on role level

3. **Evaluate Candidate** — Comprehensive candidate assessment
   - Technical knowledge scoring
   - Problem-solving evaluation
   - Code quality assessment
   - Communication and soft skills evaluation
   - Hiring recommendation (STRONG YES / YES / MAYBE / NO / STRONG NO)

4. **Analyze Code Challenge** — Deep code review and feedback
   - Correctness, efficiency, and code quality analysis
   - Comparison to reference solutions
   - Optimization suggestions
   - Detailed feedback report

### Agents

**Interview Analysis Agent** — Autonomous interview evaluation
- Automatic analysis after interview completion
- On-demand analysis mode
- Generates structured evaluation reports
- Scoring and hiring recommendations

### External Integrations

**LinkedIn & Indeed Integration** — Candidate sourcing
- Fetch candidate profiles from LinkedIn
- Retrieve job descriptions from Indeed
- Support for OAuth and API key authentication
- Pre-populate interview data with candidate background

## Installation

1. Install this plugin in Claude Cowork
2. Set up LinkedIn/Indeed credentials:
   - Option A: OAuth login (recommended)
   - Option B: API keys in environment variables

```bash
export LINKEDIN_ACCESS_TOKEN="your_token_here"
export INDEED_API_KEY="your_key_here"
```

## Usage

### Start an Interview
```
start interview with [candidate name]
```
Claude guides you through a structured interview as an HR tech lead.

### Prepare an Interview Plan
```
prepare interview plan for [role] [experience level]
```
Get both generic templates and candidate-specific plans.

### Evaluate Interview Performance
```
evaluate [candidate name]'s interview
```
Generate a comprehensive evaluation report with scoring and recommendation.

### Analyze Code Solution
```
analyze this code [paste code here]
```
Get detailed feedback on code quality, efficiency, and approach.

### Auto-Analyze Interview
```
analyze interview for [candidate name]
```
The agent automatically processes interview data and generates evaluation.

## Interview Topics

The plugin covers technical knowledge across:
- **Frontend**: React, Vue, JavaScript, CSS, responsive design
- **Backend/Full-stack**: Node.js, databases, APIs, microservices
- **System Design**: Architecture, scalability, trade-offs

## Evaluation Framework

Candidates are scored on five dimensions (0-100 each):
1. **Technical Knowledge** — Depth across frontend/backend/system design
2. **Problem-Solving** — Approach to unfamiliar problems
3. **Code Quality** — Clean, efficient, maintainable code
4. **Communication** — Clear explanations and collaboration
5. **Soft Skills & Culture Fit** — Learning attitude, curiosity, team alignment

## Hiring Recommendations

- **STRONG YES** (85+) — Exceptional candidate, hire immediately
- **YES** (70-84) — Strong candidate, move to next stage
- **MAYBE** (55-69) — Solid basics but gaps remain
- **NO** (40-54) — Significant gaps, revisit in 12+ months
- **STRONG NO** (0-39) — Major concerns, not recommended

## Prerequisites

- LinkedIn or Indeed accounts (for candidate data integration)
- Access tokens or API keys for external integrations
- Basic understanding of web development roles

## Support

For issues or feature requests related to the plugin, refer to your hiring team or technical support.

## Version

Current version: 0.1.0

## License

MIT License
