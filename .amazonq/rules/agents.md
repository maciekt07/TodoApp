# Smart Agents

## Core Agents

### Sync Agent
**Trigger**: Before any report generation
**Action**: Update all repositories to latest branches
**Rule**: Always executes first, cannot be skipped

### Analytics Agent
**Trigger**: Report commands
**Action**: 
1. Ask user for sprint dates
2. Calculate productivity metrics from git data
3. Generate insights and trends
4. Create MD and HTML output files

### Quality Agent
**Trigger**: Code quality and review requests
**Action**: Analyze code quality metrics, review patterns, and PR lifecycle

## Agent Workflow
1. **Sync Agent** → Update all repositories
2. **Analytics Agent** → Ask for sprint dates, calculate metrics
3. **Analytics Agent** → Generate MD and HTML reports
4. **Save** → Both files to `output/` folder with current date

## Output Rules
- Every report generates both `.md` and `.html`
- Files saved to `output/` folder
- Timestamp included in filename: `report-type-YYYY-MM-DD-HHMM.md`
- Current date and time in report header
- **RULE**: Never overwrite - each report gets unique timestamp
- HTML includes basic styling for readability