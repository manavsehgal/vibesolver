#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MetricsSummary {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.reportsDir = path.join(projectRoot, 'reports');
  }

  displaySummary() {
    try {
      const reports = this.getReportFiles();
      
      if (reports.length === 0) {
        console.log('❌ No metrics reports found. Run `pnpm metrics` first.');
        return;
      }

      const latest = this.parseLatestReport(reports[0]);
      this.displayQuickSummary(latest);
      
      if (reports.length > 1) {
        console.log('\n📊 Available Reports:');
        reports.slice(0, 5).forEach((report, index) => {
          const date = this.extractDateFromFilename(report);
          console.log(`   ${index + 1}. ${report} (${date})`);
        });
        
        if (reports.length > 5) {
          console.log(`   ... and ${reports.length - 5} more reports`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error displaying summary:', error.message);
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

  parseLatestReport(filename) {
    const filePath = path.join(this.reportsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    return {
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
      organizationPattern: this.extractValue(content, /Organization Pattern \| (.+)/)
    };
  }

  extractValue(content, regex) {
    const match = content.match(regex);
    return match ? match[1].trim() : '0';
  }

  extractDateFromFilename(filename) {
    const match = filename.match(/project-metrics-(.+)\.md/);
    if (match) {
      return new Date(match[1].replace(/-/g, ':')).toLocaleString();
    }
    return 'Unknown';
  }

  displayQuickSummary(metrics) {
    console.log('🎯 VibeSolver Project Summary');
    console.log('=' .repeat(40));
    
    console.log(`📁 Project Structure:`);
    console.log(`   Files: ${metrics.totalFiles}`);
    console.log(`   Lines of Code: ${metrics.linesOfCode.toLocaleString()}`);
    console.log(`   Organization: ${metrics.organizationPattern}`);
    
    console.log(`\n📦 Dependencies:`);
    console.log(`   Total: ${metrics.totalDependencies}`);
    
    console.log(`\n🧪 Testing:`);
    console.log(`   Test Files: ${metrics.testFiles}`);
    console.log(`   Total Tests: ${metrics.totalTests}`);
    console.log(`   Coverage: ${this.getTestCoverageDescription(metrics)}`);
    
    console.log(`\n🏗️ Code Quality:`);
    console.log(`   Overall Score: ${metrics.qualityScore}/100 ${this.getScoreEmoji(metrics.qualityScore)}`);
    console.log(`   ESLint Errors: ${metrics.eslintErrors} ${metrics.eslintErrors === 0 ? '✅' : '❌'}`);
    console.log(`   ESLint Warnings: ${metrics.eslintWarnings} ${metrics.eslintWarnings === 0 ? '✅' : '⚠️'}`);
    
    console.log(`\n📅 Last Updated: ${metrics.timestamp}`);
    
    console.log('\n💡 Quick Actions:');
    console.log('   pnpm metrics        - Generate new report');
    console.log('   pnpm metrics:compare - Compare with previous');
    console.log('   pnpm test           - Run tests');
    console.log('   pnpm lint           - Check code quality');
  }

  getTestCoverageDescription(metrics) {
    const testRatio = metrics.testFiles / metrics.totalFiles;
    if (testRatio > 0.4) return 'Excellent';
    if (testRatio > 0.3) return 'Good';
    if (testRatio > 0.2) return 'Fair';
    return 'Needs Improvement';
  }

  getScoreEmoji(score) {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🥇';
    if (score >= 70) return '🥈';
    if (score >= 60) return '🥉';
    return '📚';
  }
}

// Main execution
const projectRoot = process.argv[2] || process.cwd();
const summary = new MetricsSummary(projectRoot);

summary.displaySummary();