# Simple Commands

## Configuration Check
**BEFORE FIRST USE**: System will check for placeholder values and prompt for configuration if needed.

## Repository Management
- **"sync repos"** → Update all repositories
- **"repo status"** → Check repository sync status

## Productivity Reports
- **"productivity report"** → Comprehensive team productivity analysis
- **"sprint summary"** → Current sprint performance metrics
- **"partner footprint"** → Partner company's impact across all repositories with code quality assessment
- **"team performance"** → Squad-level performance breakdown
- **"partner team metrics"** → Four-dimension analysis: Speed, Effectiveness, Quality, Impact

## Code Quality & Process
- **"quality report"** → Code quality and review metrics
- **"review velocity"** → PR review and merge time analysis

## Advanced Analytics (Red Metrics)
- **"pr complexity analysis"** → Analyze PR/MR complexity, quality scoring, and team distribution
- **"onboarding acceleration"** → AI assistant as accelerator for new partner members
- **"deployment impact analysis"** → CI/CD deployment analysis, failure rates, and root cause metrics
- **"business impact vs technical debt"** → Jira ticket analysis comparing business value vs maintenance work

## Command Behavior
- Always check configuration first
- Always sync repositories before analysis
- Always ask for sprint dates
- Always generate MD + HTML files
- Always save to `output/` folder with timestamp
- **File naming**: `report-type-YYYY-MM-DD-HHMM.md/html`
- **Never overwrites**: Each report gets unique timestamp