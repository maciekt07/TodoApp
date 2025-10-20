# Advanced Red Metrics Implementation
**Secondary Analysis Framework for Deep Insights**

## Overview
These are advanced metrics marked in red from the strategic framework. They complement the core four-dimension analysis with deeper, more specialized insights.

---

## 🔴 RED METRIC 1: PR/MR Complexity Analysis
**Command**: `"pr complexity analysis"`

### What It Analyzes
- **Per PR/MR in Sprint Period**: Complexity scoring for each pull request
- **Quality Assessment**: Code quality, test inclusion, documentation
- **Team Distribution**: Workload distribution across team members

### Complexity Scoring Algorithm
```yaml
complexity_factors:
  files_changed: 
    simple: "<5 files"
    moderate: "5-15 files" 
    complex: ">15 files"
    
  lines_modified:
    simple: "<100 lines"
    moderate: "100-500 lines"
    complex: ">500 lines"
    
  review_time:
    simple: "<2 days"
    moderate: "2-5 days"
    complex: ">5 days"
    
  review_comments:
    simple: "<5 comments"
    moderate: "5-15 comments"
    complex: ">15 comments"
```

### Output Metrics
- **Complexity Distribution**: % of simple/moderate/complex PRs per team member
- **Quality Score**: Test inclusion, documentation updates, breaking change flags
- **Team Balance**: Even distribution vs concentrated complexity

---

## 🔴 RED METRIC 2: Amazon Q Onboarding Acceleration
**Command**: `"onboarding acceleration"`

### Phase 2 Survey Analysis
- **New Globant Members**: Track recent hires (last 3-6 months)
- **Amazon Q Usage**: AI assistance adoption and effectiveness
- **Productivity Acceleration**: Time to meaningful contribution

### Key Indicators
```yaml
onboarding_success:
  time_to_first_pr: "Days from start to first merged PR"
  time_to_independent_work: "Days until working without constant guidance"
  amazonq_adoption_rate: "% of new hires actively using Amazon Q"
  
mentorship_effectiveness:
  senior_developer_pairing: "Hours spent with experienced team members"
  knowledge_transfer_quality: "Documentation contributions by new hires"
  code_review_participation: "Review comments given/received ratio"
```

### Survey Integration
- **Phase 2 Timing**: 30-60 days after onboarding completion
- **Amazon Q Impact**: Specific questions about AI assistance effectiveness
- **Acceleration Measurement**: Before/after productivity comparison

---

## 🔴 RED METRIC 3: CI/CD Deployment Impact Analysis
**Command**: `"deployment impact analysis"`

### Deployment Health Metrics
- **Total Deployments**: All deployment attempts in period
- **Failed Deployments**: Rollbacks, hotfixes, emergency fixes
- **Root Cause Analysis**: Why deployments fail

### Failure Classification
```yaml
failure_types:
  code_quality: "Bugs, logic errors, missing tests"
  infrastructure: "Environment issues, resource constraints"
  process: "Deployment pipeline failures, configuration errors"
  human_error: "Manual mistakes, incorrect procedures"
  
impact_severity:
  critical: "System down, data loss, security breach"
  high: "Major feature broken, significant user impact"
  medium: "Minor feature issues, limited user impact"
  low: "Cosmetic issues, no functional impact"
```

### CI/CD Health Indicators
- **Build Success Rate**: Successful builds / total build attempts
- **Deployment Frequency**: Deployments per sprint (velocity indicator)
- **Lead Time**: Code commit to production deployment time
- **Recovery Time**: Failure detection to resolution time

---

## 🔴 RED METRIC 4: Business Impact vs Technical Debt
**Command**: `"business impact vs technical debt"`

### Jira Integration Analysis
- **Ticket Classification**: Business value vs maintenance work
- **Impact Calculation**: Resource allocation analysis
- **Trend Analysis**: Debt accumulation vs business delivery

### Classification Framework
```yaml
business_value_work:
  - "New features"
  - "User experience enhancements" 
  - "Business requirement implementations"
  - "Customer-facing improvements"
  
technical_debt_work:
  - "Bug fixes"
  - "Code refactoring"
  - "Dependency updates"
  - "Infrastructure maintenance"
  - "Performance optimizations"
  - "Security patches"
```

### Analysis Output
- **Business Impact %**: Percentage of effort on business value
- **Technical Debt %**: Percentage of effort on maintenance
- **Optimal Balance**: Target 70% business / 30% technical debt
- **Trend Analysis**: Debt accumulation rate over time

---

## Implementation Guidelines

### When to Use Red Metrics
- **Quarterly Reviews**: Deep dive analysis for strategic planning
- **Team Performance Issues**: When core metrics show problems
- **Process Improvement**: Identifying bottlenecks and inefficiencies
- **Onboarding Evaluation**: Measuring new team member success

### Integration with Core Metrics
- **Complement, Don't Replace**: Red metrics enhance four-dimension analysis
- **Triggered Analysis**: Use specific commands for targeted insights
- **Strategic Focus**: Use for decision-making, not daily monitoring

### Data Requirements
```yaml
data_sources:
  git_repositories: "All project repositories (existing)"
  jira_integration: "Ticket classification and tracking"
  ci_cd_pipelines: "Deployment logs and build results"
  survey_data: "Phase 2 onboarding surveys"
  amazon_q_usage: "AI assistance adoption metrics"
```

---

## Command Implementation

### PR Complexity Analysis
```
User: "pr complexity analysis"
System: "What sprint period should I analyze? (e.g., Dec 9-22, 2024)"
User: "Dec 9 - Dec 22, 2024"
System: → Analyzes all PRs in period, scores complexity, generates distribution report
```

### Onboarding Acceleration
```
User: "onboarding acceleration"  
System: "Analyzing new Globant team members and Amazon Q adoption..."
System: → Reviews recent hires, productivity metrics, survey data
```

### Deployment Impact Analysis
```
User: "deployment impact analysis"
System: "What period should I analyze? (e.g., last quarter)"
User: "Q4 2024"
System: → Analyzes CI/CD data, failure rates, root causes
```

### Business Impact vs Technical Debt
```
User: "business impact vs technical debt"
System: "Connecting to Jira to analyze ticket distribution..."
System: → Compares Jira tickets vs git commits, calculates business value ratio
```

---

## Report Integration

### Enhanced Reports
- **Core Reports**: Include red metric summaries when relevant
- **Dedicated Reports**: Standalone analysis for each red metric
- **Executive Summaries**: High-level insights for strategic decisions

### Output Format
- **Same Standards**: MD + HTML files with timestamps
- **Visual Indicators**: Charts and graphs for complex data
- **Actionable Insights**: Specific recommendations based on findings

---

**Purpose**: Deep strategic analysis beyond core productivity metrics  
**Usage**: Quarterly reviews, process improvement, strategic planning  
**Integration**: Complements existing four-dimension framework