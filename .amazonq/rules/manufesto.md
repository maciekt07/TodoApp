# Productivity Analytics Framework

## Project Foundation
**Project**: TodoApp React PWA  
**Client**: Internal Development  
**Focus**: Productivity Metrics & Code Contributions  
**Output**: Always generate MD + HTML reports in `output/` folder

## Team Structure
```yaml
# REPLACE WITH YOUR TEAMS
team_1:
  name: "Gandu team"
  members: ["ariel.ganduglia@globant.com"]
  repos: ["https://github.com/ariel-ganduglia-glb/TodoApp"]
  
#team_2:
#  name: "[TEAM_2_NAME]"
#  members: ["[MEMBER_3]", "[MEMBER_4]"]
#  repos: ["[REPO_3]", "[REPO_4]"]
```

## Repository Configuration
```yaml
# REPLACE WITH YOUR REPOSITORIES
repositories:
  https://github.com/ariel-ganduglia-glb/TodoApp: { branch: "main", type: "frontend" }
# [REPO_2]: { branch: "[BRANCH_2]", type: "[TYPE_2]" }
#  [REPO_3]: { branch: "[BRANCH_3]", type: "[TYPE_3]" }
#  [REPO_4]: { branch: "[BRANCH_4]", type: "[TYPE_4]" }
```

## Core Rules

### MANDATORY: Configuration Check
**RULE**: Before ANY command execution, check for placeholder values
- If placeholders detected, prompt user for configuration
- Require: Project name, client name, team structure, repositories

### MANDATORY: Repository Sync First
**RULE**: Always sync repositories before ANY analysis or report generation

**Repository sync commands**:
```bash
# REPLACE WITH YOUR REPOS AND BRANCHES
cd TodoApp && git pull origin main && cd ..
```

### MANDATORY: Dual Output Format
- Generate `.md` file in `output/` folder
- Generate `.html` file in `output/` folder
- Use timestamp in filename: `productivity-report-YYYY-MM-DD-HHMM.md`
- Use current date in report header: `**Generated**: [Current Date and Time]`
- **RULE**: Never overwrite existing reports - always use unique timestamps

### Sprint Configuration
```yaml
sprint_settings:
  duration_days: 14              # Standard 2-week sprints
  assignment_rule: "merge_date"  # PRs counted by merge date
```

### Sprint Date Rules
**RULE**: Always ask user for current sprint dates when generating reports
- **Prompt**: "What are the current sprint dates? (e.g., Dec 9 - Dec 22, 2024)"
- **Calculate**: Sprint boundaries from start and end dates

## Productivity Focus Areas

### 1. Productivity Metrics
- PRs created/merged per sprint
- Cycle time (creation to merge)
- Lines of code contributed
- Review participation

### 2. Partner Company Footprint Analysis
- Contribution percentage by partner team
- Impact across repositories
- Code Quality Assessment
- Quality metrics comparison vs external contributors
- Velocity trends and growth
- Technical debt introduction/reduction

### 3. Code Quality Standards
```yaml
quality_thresholds:
  test_coverage:
    minimum: 80          # Minimum test coverage %
    target: 90           # Target coverage %
    
  code_review:
    min_reviewers: 2     # Minimum reviewers per PR
    max_cycle_time: 5    # Max days from creation to merge
    
  security:
    critical_issues: 0   # Zero critical security issues allowed
    high_issues: 2       # Max high-severity issues
    
  performance:
    build_time_max: 300  # Max build time in seconds
    test_time_max: 180   # Max test execution time
    
  maintainability:
    complexity_max: 10   # Max cyclomatic complexity
    duplication_max: 3   # Max code duplication %
```

## Partner Company Team Metrics Framework
**Four-Dimension Performance Analysis**: Speed, Effectiveness, Quality, Impact

### 1. Speed: Diffs per engineer
- **What**: Team-level throughput of code changes per engineer
- **How**: Merged PRs/MRs ÷ active engineers (no individual ranking)
- **Target**: 10-15 PRs per engineer per sprint

### 2. Effectiveness: Developer Experience Index (DXI)
- **What**: Composite score of developer experience across key engineering drivers
- **How**: Standardized DX surveys aggregated into index (optional telemetry)
- **Target**: DXI score >70

### 3. Quality: Change failure rate
- **What**: Percentage of releases that cause failure requiring remediation
- **How**: Failed deployments (rollback/hotfix/incident) ÷ total deployments
- **Target**: <5% industry standard

### 4. Impact: % of time on new capabilities
- **What**: Share of effort devoted to new capabilities vs maintenance/bugs/debt
- **How**: Effort tagged as "new capability" ÷ total engineering effort
- **Target**: >60% on new capabilities

## Advanced Red Metrics Framework
**Secondary Metrics for Deep Analysis**

### 1. PR/MR Complexity Analysis
```yaml
complexity_metrics:
  pr_scoring:
    complexity_factors: ["files_changed", "lines_modified", "review_comments", "approval_time"]
    quality_indicators: ["test_inclusion", "documentation_updates", "breaking_changes"]
    team_distribution: "PRs per engineer divided by total team PRs"
```

### 2. AI Assistant Onboarding Acceleration
```yaml
onboarding_metrics:
  new_partner_members:
    survey_phase_2: "Post-onboarding effectiveness survey"
    ai_assistant_usage: "AI assistance adoption rate"
    time_to_productivity: "Days from start to first meaningful contribution"
    mentorship_effectiveness: "Senior developer guidance impact"
```

### 3. CI/CD Deployment Impact Analysis
```yaml
deployment_metrics:
  total_deployments: "All deployment attempts in period"
  failed_deployments: "Rollbacks, hotfixes, incidents"
  failure_analysis:
    root_causes: ["code_quality", "infrastructure", "process", "human_error"]
    impact_severity: ["critical", "high", "medium", "low"]
```

### 4. Business Impact vs Technical Debt Analysis
```yaml
jira_integration:
  ticket_classification:
    business_value: ["feature", "enhancement", "user_story"]
    technical_debt: ["bug", "refactor", "maintenance", "dependency_update"]
  
  impact_calculation:
    business_impact_percentage: "Business value tickets / total tickets"
    technical_debt_percentage: "Technical debt tickets / total tickets"
```