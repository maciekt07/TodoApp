# Productivity Analytics Framework
**Simple productivity reports from git contributions**

## 🚀 Quick Start

### Step 1: Configure
```
Type: "productivity report"
```
**What happens**: System detects placeholders and asks for configuration.

### Step 2: Test
After configuration, try again:
```
Type: "productivity report"
```
**What happens**: System syncs repositories, asks for sprint dates, generates report.

### Step 3: Check Results
Look in the `output/` folder for:
- `productivity-report-YYYY-MM-DD.md` (technical review)
- `productivity-report-YYYY-MM-DD.html` (open in browser)

## 📊 Available Commands

### Main Reports
- **"productivity report"** → Complete team performance analysis
- **"partner footprint"** → Partner company impact across repositories
- **"partner team metrics"** → Four-dimension analysis: Speed, Effectiveness, Quality, Impact
- **"sprint summary"** → Current sprint performance
- **"team performance"** → Squad-level breakdown

### Quality & Process
- **"quality report"** → Code quality and review metrics
- **"review velocity"** → PR review and merge time analysis

### Advanced Analytics
- **"pr complexity analysis"** → PR complexity scoring and team distribution
- **"onboarding acceleration"** → AI assistant impact on new team members
- **"deployment impact analysis"** → CI/CD health and failure analysis
- **"business impact vs technical debt"** → Business value vs maintenance ratio

### Utilities
- **"sync repos"** → Update all project data
- **"repo status"** → Check if data is current

## ⚙️ Configuration

### Required Setup
1. **Project Structure**: All repositories at same folder level as `.amazonq/`
2. **Team Information**: Squad names, member names, repository assignments
3. **Repository Info**: Branch names, repository types

### What You'll Configure
- Project name and client name
- Team structure (squads and members)
- Repository assignments and branches
- Quality thresholds (optional)

## 📁 Output
- **Dual Format**: MD + HTML files always generated
- **Timestamped**: Never overwrites previous reports
- **Professional**: Ready for presentations and technical review

---

**Focus**: Real productivity metrics from git contributions  
**Output**: Professional reports in minutes