# VibeSolver Metrics Collection Scripts

This directory contains comprehensive code metrics collection and analysis tools for the VibeSolver project.

## 📊 Available Scripts

### `collect-metrics.js`
**Command:** `pnpm metrics`

Generates a comprehensive project metrics report including:

- **Code Metrics**: Lines of code, file counts, module breakdown
- **Dependencies**: Production/dev dependency analysis, sizes
- **Testing**: Test file counts, test types, coverage analysis
- **Quality**: ESLint/TypeScript error analysis, code organization
- **Structure**: Directory organization, file distribution

**Output:** Timestamped markdown report in `reports/` folder

### `metrics-summary.js`
**Command:** `pnpm metrics:summary`

Displays a quick console summary of the latest metrics including:
- Project overview
- Quality scores with emojis
- Quick action recommendations
- Available historical reports

**Output:** Console display

### `compare-metrics.js`
**Command:** `pnpm metrics:compare`

Compares the two most recent metrics reports to show:
- Changes in key metrics over time
- Trend analysis (📈📉➡️)
- Positive changes and areas of concern
- Actionable recommendations

**Output:** Comparison report in `reports/` folder

## 🚀 Quick Start

```bash
# Generate initial metrics report
pnpm metrics

# View quick summary
pnpm metrics:summary

# Make some code changes, then generate new report
pnpm metrics

# Compare changes over time
pnpm metrics:compare
```

## 📈 Metrics Tracked

### Code Quality Score (0-100)
- **Code Organization** (25 points): Structure, file sizes, organization pattern
- **Test Coverage** (25 points): Test file ratio, total tests, coverage
- **Code Quality** (25 points): ESLint/TypeScript errors and warnings
- **Documentation** (25 points): Comment ratio, README presence

### Key Metrics
- Total files and lines of code
- Code vs comment vs blank line distribution
- File type breakdown (.tsx, .ts, etc.)
- Module organization analysis
- Dependency counts and sizes
- Test file counts and types
- ESLint/TypeScript error tracking

## 📁 Report Structure

### Main Report (`project-metrics-YYYY-MM-DDTHH-mm-ss.md`)
```markdown
# Project Metrics Report
## 📋 Executive Summary
## 📊 Code Metrics
## 📦 Dependencies  
## 🧪 Testing Metrics
## 🏗️ Code Quality
## 🏛️ Project Structure
## 📈 Trends & Recommendations
```

### Comparison Report (`metrics-comparison-YYYY-MM-DDTHH-mm-ss.md`)
```markdown
# Metrics Comparison Report
## 📊 Key Changes
## 🏗️ Code Quality Changes
## 📈 Analysis
```

## 🎯 Best Practices

### Regular Collection
```bash
# Weekly metrics collection
pnpm metrics

# Before major releases
pnpm metrics && pnpm metrics:compare
```

### Quality Monitoring
- Target quality score: 80+ (Good), 90+ (Excellent)
- Zero ESLint errors and minimal warnings
- Test coverage ratio > 30% (test files to total files)
- Comment ratio between 3-10 (code lines per comment line)

### Trend Analysis
- Monitor code growth vs test growth
- Track dependency bloat
- Watch for quality score degradation
- Review large file growth

## 🔧 Customization

The scripts can be customized by modifying:

### File Extensions
```javascript
const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];
```

### Quality Scoring
```javascript
// Adjust scoring weights in calculate*Score() methods
getOrganizationScore() // Structure and organization
getTestScore()        // Test coverage
getQualityScore()     // Code quality
getDocumentationScore() // Comments and docs
```

### Excluded Directories
```javascript
// Skip these directories during analysis
if (['node_modules', 'dist', 'build', '.git', '.next'].includes(item)) {
  continue;
}
```

## 🐛 Troubleshooting

### Test Execution Issues
If tests can't be executed during metrics collection:
- Ensure `vitest` is properly installed
- Check test command in package.json
- Tests will be counted but not executed

### ESLint JSON Parsing
If ESLint analysis fails:
- Ensure ESLint is configured properly
- Check that JSON output format is supported
- Falls back to basic analysis if parsing fails

### Large Projects
For very large projects:
- Consider excluding additional directories
- Increase timeout values for test execution
- Monitor memory usage during analysis

## 📊 Example Output

```
🎯 VibeSolver Project Summary
========================================
📁 Project Structure:
   Files: 37
   Lines of Code: 2,506
   Organization: Component-based

📦 Dependencies:
   Total: 38

🧪 Testing:
   Test Files: 9
   Total Tests: 72
   Coverage: Fair

🏗️ Code Quality:
   Overall Score: 90/100 🏆
   ESLint Errors: 0 ✅
   ESLint Warnings: 0 ✅
```

## 🤝 Contributing

To improve the metrics collection:

1. **Add New Metrics**: Extend the collector classes with new analysis methods
2. **Improve Accuracy**: Enhance parsing logic for better metric extraction  
3. **Add Visualizations**: Consider adding chart generation capabilities
4. **Performance**: Optimize for larger codebases

## 📝 Notes

- Reports are timestamped and never overwritten
- All scripts support project root path as argument
- Metrics collection is non-destructive and read-only
- Historical data enables trend analysis over time