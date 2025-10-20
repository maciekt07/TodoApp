# Report Templates

## Available Reports

### Productivity Reports
- **Productivity Report** → Team performance, velocity, contributions
- **Sprint Summary** → Sprint-specific metrics and completion
- **Globant Footprint** → Globant team impact, contribution analysis, and **code quality assessment**
- **Team Performance** → Squad-level breakdown and comparison
- **Globant Team Metrics** → Four-dimension analysis: Speed, Effectiveness, Quality, Impact

### Process & Quality Reports
- **Quality Report** → Code quality metrics, test coverage, security
- **Review Velocity** → PR lifecycle analysis: creation → review → merge time

### Advanced Red Metrics Reports
- **PR Complexity Analysis** → Complexity scoring, quality assessment, team distribution
- **Onboarding Acceleration** → Amazon Q impact on new Globant member productivity
- **Deployment Impact Analysis** → CI/CD health, failure analysis, root cause metrics
- **Business Impact vs Technical Debt** → Jira integration, business value vs maintenance ratio

## Report Structure
All reports include:
- Executive summary with key metrics
- Data tables with trend indicators (↑/↓/→)
- Squad/individual breakdowns
- **Code quality assessment** (for Globant footprint reports)
- Actionable recommendations

## Enhanced Globant Footprint Reports
Special sections for Globant analysis:
- **Quality Score by Squad Member** (🟢🟡🟠🔴)
- **Globant vs External Quality Comparison**
- **Technical Debt Impact Analysis**
- **Best Practice Adoption Metrics**
- **Code Review Quality Assessment**
- **Knowledge Sharing Evidence**

## Globant Team Metrics Reports
Four-dimension performance analysis:
- **Speed**: Diffs per engineer (team-level throughput)
- **Effectiveness**: Developer Experience Index (DXI from surveys)
- **Quality**: Change failure rate (deployment failures)
- **Impact**: % time on new capabilities vs maintenance
- **Squad benchmarking**: Performance vs industry standards
- **Trend tracking**: Sprint-over-sprint improvements

## File Output
- **Markdown (.md)**: Technical review and version control
- **HTML (.html)**: Presentations and stakeholder sharing
- **Naming**: `report-type-YYYY-MM-DD-HHMM.md/html`
- **Location**: `.amazonq/rules/output/`
- **No Overwrites**: Each report gets unique timestamp

## Review Velocity Report Details
Tracks PR lifecycle timing:
- **Creation Time** → When PR was opened
- **First Review Time** → Time to first review comment
- **Approval Time** → Time to final approval
- **Merge Time** → Time from approval to merge
- **Total Cycle Time** → Creation to merge duration