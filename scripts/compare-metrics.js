#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MetricsComparator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.reportsDir = path.join(projectRoot, 'reports');
  }

  async compareLatestReports() {
    try {
      const reports = this.getReportFiles();
      
      if (reports.length < 2) {
        console.log('❌ Need at least 2 reports to compare. Run metrics collection first.');
        return;
      }

      const latest = this.parseReport(reports[0]);
      const previous = this.parseReport(reports[1]);

      this.generateComparisonReport(latest, previous);
      console.log('✅ Metrics comparison completed!');
    } catch (error) {
      console.error('❌ Error comparing metrics:', error.message);
      process.exit(1);
    }
  }

  getReportFiles() {
    if (!fs.existsSync(this.reportsDir)) {
      return [];
    }

    return fs.readdirSync(this.reportsDir)
      .filter(file => file.startsWith('project-metrics-') && file.endsWith('.md'))
      .sort()
      .reverse(); // Latest first
  }

  parseReport(filename) {
    const filePath = path.join(this.reportsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract key metrics from markdown
    const metrics = {
      filename,
      timestamp: this.extractValue(content, /\*\*Generated:\*\* (.+)/),
      totalFiles: parseInt(this.extractValue(content, /Total Files \| (\d+)/)),
      linesOfCode: parseInt(this.extractValue(content, /Lines of Code \| ([\d,]+)/).replace(/,/g, '')),
      totalDependencies: parseInt(this.extractValue(content, /Total Dependencies \| (\d+)/)),
      testFiles: parseInt(this.extractValue(content, /Test Files \| (\d+)/)),
      totalTests: parseInt(this.extractValue(content, /Total Tests \| (\d+)/)),
      qualityScore: parseInt(this.extractValue(content, /Code Quality Score \| (\d+)\/100/)),
      eslintErrors: parseInt(this.extractValue(content, /Errors \| (\d+)/)),
      eslintWarnings: parseInt(this.extractValue(content, /Warnings \| (\d+)/)),
      tsErrors: parseInt(this.extractValue(content, /Compilation Errors \| (\d+)/))
    };

    return metrics;
  }

  extractValue(content, regex) {
    const match = content.match(regex);
    return match ? match[1].trim() : '0';
  }

  generateComparisonReport(latest, previous) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const reportPath = path.join(this.reportsDir, `metrics-comparison-${timestamp}.md`);
    
    const report = `# Metrics Comparison Report

**Generated:** ${new Date().toLocaleString()}  
**Latest Report:** ${latest.filename}  
**Previous Report:** ${previous.filename}

## 📊 Key Changes

| Metric | Previous | Latest | Change | Trend |
|--------|----------|--------|--------|-------|
| Total Files | ${previous.totalFiles} | ${latest.totalFiles} | ${this.getChange(previous.totalFiles, latest.totalFiles)} | ${this.getTrend(previous.totalFiles, latest.totalFiles)} |
| Lines of Code | ${previous.linesOfCode.toLocaleString()} | ${latest.linesOfCode.toLocaleString()} | ${this.getChange(previous.linesOfCode, latest.linesOfCode)} | ${this.getTrend(previous.linesOfCode, latest.linesOfCode)} |
| Dependencies | ${previous.totalDependencies} | ${latest.totalDependencies} | ${this.getChange(previous.totalDependencies, latest.totalDependencies)} | ${this.getTrend(previous.totalDependencies, latest.totalDependencies)} |
| Test Files | ${previous.testFiles} | ${latest.testFiles} | ${this.getChange(previous.testFiles, latest.testFiles)} | ${this.getTrend(previous.testFiles, latest.testFiles)} |
| Total Tests | ${previous.totalTests} | ${latest.totalTests} | ${this.getChange(previous.totalTests, latest.totalTests)} | ${this.getTrend(previous.totalTests, latest.totalTests)} |
| Quality Score | ${previous.qualityScore}/100 | ${latest.qualityScore}/100 | ${this.getChange(previous.qualityScore, latest.qualityScore)} | ${this.getTrend(previous.qualityScore, latest.qualityScore)} |

## 🏗️ Code Quality Changes

| Metric | Previous | Latest | Change | Trend |
|--------|----------|--------|--------|-------|
| ESLint Errors | ${previous.eslintErrors} | ${latest.eslintErrors} | ${this.getChange(previous.eslintErrors, latest.eslintErrors)} | ${this.getInverseTrend(previous.eslintErrors, latest.eslintErrors)} |
| ESLint Warnings | ${previous.eslintWarnings} | ${latest.eslintWarnings} | ${this.getChange(previous.eslintWarnings, latest.eslintWarnings)} | ${this.getInverseTrend(previous.eslintWarnings, latest.eslintWarnings)} |
| TypeScript Errors | ${previous.tsErrors} | ${latest.tsErrors} | ${this.getChange(previous.tsErrors, latest.tsErrors)} | ${this.getInverseTrend(previous.tsErrors, latest.tsErrors)} |

## 📈 Analysis

### Positive Changes
${this.getPositiveChanges(previous, latest)}

### Areas of Concern
${this.getConcerns(previous, latest)}

### Recommendations
${this.getRecommendations(previous, latest)}

---

*Report generated by VibeSolver Metrics Comparator*
`;

    fs.writeFileSync(reportPath, report);
    console.log(`📊 Comparison report generated: ${reportPath}`);
  }

  getChange(oldVal, newVal) {
    const diff = newVal - oldVal;
    if (diff === 0) return '0';
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toLocaleString()}`;
  }

  getTrend(oldVal, newVal) {
    if (newVal > oldVal) return '📈';
    if (newVal < oldVal) return '📉';
    return '➡️';
  }

  getInverseTrend(oldVal, newVal) {
    // For errors/warnings, decrease is good (📈), increase is bad (📉)
    if (newVal < oldVal) return '📈';
    if (newVal > oldVal) return '📉';
    return '➡️';
  }

  getPositiveChanges(previous, latest) {
    const changes = [];
    
    if (latest.totalTests > previous.totalTests) {
      changes.push(`- Added ${latest.totalTests - previous.totalTests} new tests`);
    }
    
    if (latest.qualityScore > previous.qualityScore) {
      changes.push(`- Quality score improved by ${latest.qualityScore - previous.qualityScore} points`);
    }
    
    if (latest.eslintErrors < previous.eslintErrors) {
      changes.push(`- Fixed ${previous.eslintErrors - latest.eslintErrors} ESLint errors`);
    }
    
    if (latest.eslintWarnings < previous.eslintWarnings) {
      changes.push(`- Resolved ${previous.eslintWarnings - latest.eslintWarnings} ESLint warnings`);
    }
    
    if (latest.tsErrors < previous.tsErrors) {
      changes.push(`- Fixed ${previous.tsErrors - latest.tsErrors} TypeScript errors`);
    }

    return changes.length > 0 ? changes.join('\n') : '- No significant positive changes detected';
  }

  getConcerns(previous, latest) {
    const concerns = [];
    
    if (latest.qualityScore < previous.qualityScore) {
      concerns.push(`- Quality score decreased by ${previous.qualityScore - latest.qualityScore} points`);
    }
    
    if (latest.eslintErrors > previous.eslintErrors) {
      concerns.push(`- ${latest.eslintErrors - previous.eslintErrors} new ESLint errors introduced`);
    }
    
    if (latest.eslintWarnings > previous.eslintWarnings) {
      concerns.push(`- ${latest.eslintWarnings - previous.eslintWarnings} new ESLint warnings`);
    }
    
    if (latest.tsErrors > previous.tsErrors) {
      concerns.push(`- ${latest.tsErrors - previous.tsErrors} new TypeScript errors`);
    }
    
    const locGrowth = (latest.linesOfCode - previous.linesOfCode) / previous.linesOfCode;
    const testGrowth = latest.totalTests > 0 ? (latest.totalTests - previous.totalTests) / previous.totalTests : 0;
    
    if (locGrowth > 0.2 && testGrowth < locGrowth * 0.5) {
      concerns.push('- Code growth outpacing test coverage growth');
    }

    return concerns.length > 0 ? concerns.join('\n') : '- No significant concerns detected';
  }

  getRecommendations(previous, latest) {
    const recommendations = [];
    
    if (latest.totalFiles > previous.totalFiles && latest.testFiles === previous.testFiles) {
      recommendations.push('- Consider adding tests for new components/modules');
    }
    
    if (latest.linesOfCode > previous.linesOfCode * 1.1) {
      recommendations.push('- Review large files for potential refactoring opportunities');
    }
    
    if (latest.totalDependencies > previous.totalDependencies) {
      recommendations.push('- Audit new dependencies for security and bundle size impact');
    }
    
    if (latest.qualityScore < 85) {
      recommendations.push('- Focus on improving code quality metrics');
    }

    return recommendations.length > 0 ? recommendations.join('\n') : '- Continue maintaining current quality standards';
  }
}

// Main execution
const projectRoot = process.argv[2] || process.cwd();
const comparator = new MetricsComparator(projectRoot);

comparator.compareLatestReports().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});