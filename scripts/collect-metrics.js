#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProjectMetricsCollector {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.metrics = {
      timestamp: new Date().toISOString(),
      project: {},
      code: {},
      dependencies: {},
      tests: {},
      quality: {},
      structure: {}
    };
  }

  async collectAllMetrics() {
    console.log('🔍 Collecting project metrics...');
    
    try {
      this.collectProjectInfo();
      this.collectCodeMetrics();
      this.collectDependencyMetrics();
      this.collectTestMetrics();
      this.collectQualityMetrics();
      this.collectStructureMetrics();
      
      await this.generateReport();
      console.log('✅ Metrics collection completed!');
    } catch (error) {
      console.error('❌ Error collecting metrics:', error.message);
      process.exit(1);
    }
  }

  collectProjectInfo() {
    const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
    
    this.metrics.project = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description || 'No description provided',
      author: packageJson.author || 'Not specified',
      license: packageJson.license || 'Not specified',
      scripts: Object.keys(packageJson.scripts || {}).length
    };
  }

  collectCodeMetrics() {
    const srcDir = path.join(this.projectRoot, 'src');
    const fileStats = this.analyzeDirectory(srcDir);
    
    this.metrics.code = {
      totalFiles: fileStats.totalFiles,
      totalLines: fileStats.totalLines,
      codeLines: fileStats.codeLines,
      commentLines: fileStats.commentLines,
      blankLines: fileStats.blankLines,
      codeToCommentRatio: fileStats.codeLines / Math.max(fileStats.commentLines, 1),
      averageFileSize: Math.round(fileStats.totalLines / fileStats.totalFiles),
      filesByType: fileStats.filesByType,
      moduleBreakdown: fileStats.moduleBreakdown,
      largestFiles: fileStats.largestFiles,
      smallestFiles: fileStats.smallestFiles
    };
  }

  analyzeDirectory(dir, relativePath = '') {
    const stats = {
      totalFiles: 0,
      totalLines: 0,
      codeLines: 0,
      commentLines: 0,
      blankLines: 0,
      filesByType: {},
      moduleBreakdown: {},
      largestFiles: [],
      smallestFiles: [],
      allFiles: []
    };

    if (!fs.existsSync(dir)) return stats;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const relativeItemPath = path.join(relativePath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Skip node_modules, dist, .git etc
        if (['node_modules', 'dist', 'build', '.git', '.next'].includes(item)) {
          continue;
        }

        const subStats = this.analyzeDirectory(itemPath, relativeItemPath);
        this.mergeStats(stats, subStats);
        
        // Module breakdown
        const moduleName = relativeItemPath.replace(/\\/g, '/');
        stats.moduleBreakdown[moduleName] = {
          files: subStats.totalFiles,
          lines: subStats.totalLines,
          codeLines: subStats.codeLines
        };
      } else {
        const ext = path.extname(item);
        const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];
        
        if (codeExtensions.includes(ext)) {
          const fileAnalysis = this.analyzeFile(itemPath);
          stats.totalFiles++;
          stats.totalLines += fileAnalysis.totalLines;
          stats.codeLines += fileAnalysis.codeLines;
          stats.commentLines += fileAnalysis.commentLines;
          stats.blankLines += fileAnalysis.blankLines;

          // File type tracking
          stats.filesByType[ext] = (stats.filesByType[ext] || 0) + 1;

          // Track file sizes
          stats.allFiles.push({
            path: relativeItemPath.replace(/\\/g, '/'),
            lines: fileAnalysis.totalLines,
            codeLines: fileAnalysis.codeLines,
            size: stat.size
          });
        }
      }
    }

    // Sort files by size for largest/smallest
    stats.allFiles.sort((a, b) => b.lines - a.lines);
    stats.largestFiles = stats.allFiles.slice(0, 5);
    stats.smallestFiles = stats.allFiles.slice(-5).reverse();

    return stats;
  }

  analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;
    let inBlockComment = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed === '') {
        blankLines++;
      } else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) {
        commentLines++;
      } else if (trimmed.startsWith('/*')) {
        commentLines++;
        inBlockComment = true;
      } else if (trimmed.endsWith('*/')) {
        commentLines++;
        inBlockComment = false;
      } else if (inBlockComment) {
        commentLines++;
      } else {
        codeLines++;
      }
    }

    return {
      totalLines: lines.length,
      codeLines,
      commentLines,
      blankLines
    };
  }

  mergeStats(target, source) {
    target.totalFiles += source.totalFiles;
    target.totalLines += source.totalLines;
    target.codeLines += source.codeLines;
    target.commentLines += source.commentLines;
    target.blankLines += source.blankLines;

    Object.keys(source.filesByType).forEach(ext => {
      target.filesByType[ext] = (target.filesByType[ext] || 0) + source.filesByType[ext];
    });

    target.allFiles.push(...source.allFiles);
  }

  collectDependencyMetrics() {
    const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
    
    const prodDeps = packageJson.dependencies || {};
    const devDeps = packageJson.devDependencies || {};
    
    this.metrics.dependencies = {
      production: {
        count: Object.keys(prodDeps).length,
        list: Object.entries(prodDeps).map(([name, version]) => ({ name, version }))
      },
      development: {
        count: Object.keys(devDeps).length,
        list: Object.entries(devDeps).map(([name, version]) => ({ name, version }))
      },
      total: Object.keys(prodDeps).length + Object.keys(devDeps).length
    };

    // Try to get package sizes from node_modules
    try {
      const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        this.metrics.dependencies.nodeModulesSize = this.getDirectorySize(nodeModulesPath);
      }
    } catch (error) {
      console.warn('Could not calculate node_modules size:', error.message);
    }
  }

  collectTestMetrics() {
    const testDir = path.join(this.projectRoot, 'src');
    const testFiles = this.findTestFiles(testDir);
    
    this.metrics.tests = {
      testFiles: testFiles.length,
      totalTests: 0,
      testsByType: {
        unit: 0,
        integration: 0,
        component: 0,
        e2e: 0
      },
      testFileBreakdown: testFiles.map(file => ({
        path: file.replace(this.projectRoot, '').replace(/\\/g, '/'),
        tests: this.countTestsInFile(path.join(this.projectRoot, file)),
        type: this.categorizeTestFile(file)
      }))
    };

    // Count total tests and categorize
    this.metrics.tests.testFileBreakdown.forEach(file => {
      this.metrics.tests.totalTests += file.tests;
      this.metrics.tests.testsByType[file.type] += file.tests;
    });

    // Try to run tests and get coverage
    try {
      console.log('Running tests to collect coverage...');
      const testOutput = execSync('npm run test -- --reporter=json --run', { 
        cwd: this.projectRoot,
        timeout: 60000,
        encoding: 'utf8'
      });
      
      // Parse test results if possible
      try {
        const results = JSON.parse(testOutput);
        if (results.testResults) {
          this.metrics.tests.lastRunResults = {
            passed: results.numPassedTests || 0,
            failed: results.numFailedTests || 0,
            total: results.numTotalTests || 0,
            duration: results.testResults.reduce((sum, r) => sum + (r.perfStats?.runtime || 0), 0)
          };
        }
      } catch (parseError) {
        console.warn('Could not parse test results JSON');
      }
    } catch (error) {
      console.warn('Could not run tests for metrics:', error.message);
      this.metrics.tests.lastRunResults = {
        error: 'Could not execute tests',
        message: error.message
      };
    }
  }

  findTestFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        this.findTestFiles(itemPath, files);
      } else if (item.includes('.test.') || item.includes('.spec.') || itemPath.includes('__tests__')) {
        files.push(itemPath.replace(this.projectRoot, '').substring(1));
      }
    }

    return files;
  }

  countTestsInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const testMatches = content.match(/\b(it|test|describe)\s*\(/g);
      return testMatches ? testMatches.length : 0;
    } catch {
      return 0;
    }
  }

  categorizeTestFile(filePath) {
    const content = fs.readFileSync(path.join(this.projectRoot, filePath), 'utf8').toLowerCase();
    
    if (content.includes('render') || content.includes('screen.get')) return 'component';
    if (content.includes('integration') || content.includes('request')) return 'integration';
    if (content.includes('e2e') || content.includes('playwright') || content.includes('cypress')) return 'e2e';
    return 'unit';
  }

  collectQualityMetrics() {
    this.metrics.quality = {
      eslint: { errors: 0, warnings: 0, fixable: 0 },
      typescript: { errors: 0, strict: false },
      codeComplexity: 'Not calculated'
    };

    // ESLint analysis
    try {
      const eslintOutput = execSync('npx eslint . --ext ts,tsx --format=json', { 
        cwd: this.projectRoot,
        encoding: 'utf8'
      });
      
      const results = JSON.parse(eslintOutput);
      this.metrics.quality.eslint = results.reduce((acc, file) => ({
        errors: acc.errors + file.errorCount,
        warnings: acc.warnings + file.warningCount,
        fixable: acc.fixable + file.fixableErrorCount + file.fixableWarningCount
      }), { errors: 0, warnings: 0, fixable: 0 });
    } catch (error) {
      // ESLint might have found issues or failed to run
      if (error.stdout) {
        try {
          const results = JSON.parse(error.stdout);
          this.metrics.quality.eslint = results.reduce((acc, file) => ({
            errors: acc.errors + file.errorCount,
            warnings: acc.warnings + file.warningCount,
            fixable: acc.fixable + file.fixableErrorCount + file.fixableWarningCount
          }), { errors: 0, warnings: 0, fixable: 0 });
        } catch (parseError) {
          console.warn('Could not parse ESLint output:', parseError.message);
        }
      } else {
        console.warn('Could not run ESLint analysis:', error.message);
      }
    }

    // TypeScript analysis
    try {
      execSync('pnpm tsc --noEmit', { cwd: this.projectRoot });
      this.metrics.quality.typescript.errors = 0;
    } catch (error) {
      const stdout = error.stdout || error.message || '';
      const errorCount = stdout.toString().split('\n').filter(line => 
        line.includes('error TS')
      ).length;
      this.metrics.quality.typescript.errors = errorCount;
    }

    // Check TypeScript config
    try {
      const tsConfig = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'tsconfig.json'), 'utf8'));
      this.metrics.quality.typescript.strict = !!(tsConfig.compilerOptions?.strict);
    } catch {
      // TypeScript config not found or invalid
    }
  }

  collectStructureMetrics() {
    const srcStructure = this.analyzeDirectoryStructure(path.join(this.projectRoot, 'src'));
    
    this.metrics.structure = {
      directories: srcStructure.directories,
      maxDepth: srcStructure.maxDepth,
      filesPerDirectory: srcStructure.filesPerDirectory,
      organizationPattern: this.detectOrganizationPattern(srcStructure)
    };
  }

  analyzeDirectoryStructure(dir, depth = 0) {
    const structure = {
      directories: 0,
      maxDepth: depth,
      filesPerDirectory: {}
    };

    if (!fs.existsSync(dir)) return structure;

    const items = fs.readdirSync(dir);
    let filesInThisDir = 0;

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        structure.directories++;
        const subStructure = this.analyzeDirectoryStructure(itemPath, depth + 1);
        structure.directories += subStructure.directories;
        structure.maxDepth = Math.max(structure.maxDepth, subStructure.maxDepth);
        Object.assign(structure.filesPerDirectory, subStructure.filesPerDirectory);
      } else {
        filesInThisDir++;
      }
    }

    const relativePath = dir.replace(this.projectRoot, '').replace(/\\/g, '/');
    structure.filesPerDirectory[relativePath || '/'] = filesInThisDir;

    return structure;
  }

  detectOrganizationPattern(structure) {
    const dirs = Object.keys(structure.filesPerDirectory);
    
    if (dirs.some(d => d.includes('/components'))) return 'Component-based';
    if (dirs.some(d => d.includes('/features'))) return 'Feature-based';
    if (dirs.some(d => d.includes('/modules'))) return 'Module-based';
    if (structure.maxDepth <= 2) return 'Flat structure';
    return 'Mixed/Custom';
  }

  getDirectorySize(dirPath) {
    let size = 0;
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          size += this.getDirectorySize(itemPath);
        } else {
          size += stat.size;
        }
      }
    } catch (error) {
      // Directory not accessible
    }
    
    return size;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async generateReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const reportPath = path.join(this.projectRoot, 'reports', `project-metrics-${timestamp}.md`);
    
    const report = this.generateMarkdownReport();
    
    fs.writeFileSync(reportPath, report);
    console.log(`📊 Report generated: ${reportPath}`);
  }

  generateMarkdownReport() {
    const m = this.metrics;
    
    return `# Project Metrics Report

**Generated:** ${new Date(m.timestamp).toLocaleString()}  
**Project:** ${m.project.name} v${m.project.version}

## 📋 Executive Summary

| Metric | Value |
|--------|-------|
| Total Files | ${m.code.totalFiles} |
| Lines of Code | ${m.code.codeLines.toLocaleString()} |
| Total Dependencies | ${m.dependencies.total} |
| Test Files | ${m.tests.testFiles} |
| Total Tests | ${m.tests.totalTests} |
| Code Quality Score | ${this.calculateQualityScore()}/100 |

## 📊 Code Metrics

### Overview
| Metric | Count | Percentage |
|--------|-------|------------|
| Total Lines | ${m.code.totalLines.toLocaleString()} | 100% |
| Code Lines | ${m.code.codeLines.toLocaleString()} | ${((m.code.codeLines/m.code.totalLines)*100).toFixed(1)}% |
| Comment Lines | ${m.code.commentLines.toLocaleString()} | ${((m.code.commentLines/m.code.totalLines)*100).toFixed(1)}% |
| Blank Lines | ${m.code.blankLines.toLocaleString()} | ${((m.code.blankLines/m.code.totalLines)*100).toFixed(1)}% |

### File Distribution
| File Type | Count | Percentage |
|-----------|-------|------------|
${Object.entries(m.code.filesByType).map(([ext, count]) => 
  `| ${ext} | ${count} | ${((count/m.code.totalFiles)*100).toFixed(1)}% |`
).join('\n')}

### Module Breakdown
| Module | Files | Lines | Code Lines |
|--------|-------|-------|------------|
${Object.entries(m.code.moduleBreakdown).map(([module, stats]) =>
  `| ${module} | ${stats.files} | ${stats.lines} | ${stats.codeLines} |`
).join('\n')}

### Largest Files
| File | Lines | Code Lines |
|------|-------|------------|
${m.code.largestFiles.map(file => 
  `| ${file.path} | ${file.lines} | ${file.codeLines} |`
).join('\n')}

## 📦 Dependencies

### Summary
| Type | Count |
|------|-------|
| Production | ${m.dependencies.production.count} |
| Development | ${m.dependencies.development.count} |
| **Total** | **${m.dependencies.total}** |
${m.dependencies.nodeModulesSize ? `| Node Modules Size | ${this.formatBytes(m.dependencies.nodeModulesSize)} |` : ''}

### Production Dependencies
| Package | Version |
|---------|---------|
${m.dependencies.production.list.slice(0, 10).map(dep => 
  `| ${dep.name} | ${dep.version} |`
).join('\n')}
${m.dependencies.production.count > 10 ? `| ... and ${m.dependencies.production.count - 10} more | |` : ''}

### Development Dependencies
| Package | Version |
|---------|---------|
${m.dependencies.development.list.slice(0, 10).map(dep => 
  `| ${dep.name} | ${dep.version} |`
).join('\n')}
${m.dependencies.development.count > 10 ? `| ... and ${m.dependencies.development.count - 10} more | |` : ''}

## 🧪 Testing Metrics

### Test Overview
| Metric | Value |
|--------|-------|
| Test Files | ${m.tests.testFiles} |
| Total Tests | ${m.tests.totalTests} |
| Avg Tests per File | ${m.tests.testFiles > 0 ? Math.round(m.tests.totalTests / m.tests.testFiles) : 0} |

### Tests by Type
| Type | Count | Percentage |
|------|-------|------------|
${Object.entries(m.tests.testsByType).map(([type, count]) =>
  `| ${type.charAt(0).toUpperCase() + type.slice(1)} | ${count} | ${m.tests.totalTests > 0 ? ((count/m.tests.totalTests)*100).toFixed(1) : 0}% |`
).join('\n')}

### Test File Breakdown
| File | Tests | Type |
|------|-------|------|
${m.tests.testFileBreakdown.map(file =>
  `| ${file.path} | ${file.tests} | ${file.type} |`
).join('\n')}

${m.tests.lastRunResults && !m.tests.lastRunResults.error ? `
### Last Test Run
| Metric | Value |
|--------|-------|
| Passed | ${m.tests.lastRunResults.passed} |
| Failed | ${m.tests.lastRunResults.failed} |
| Total | ${m.tests.lastRunResults.total} |
| Duration | ${(m.tests.lastRunResults.duration/1000).toFixed(2)}s |
` : ''}

## 🏗️ Code Quality

### ESLint Analysis
| Metric | Count |
|--------|-------|
| Errors | ${m.quality.eslint.errors} |
| Warnings | ${m.quality.eslint.warnings} |
| Fixable Issues | ${m.quality.eslint.fixable} |

### TypeScript Analysis
| Metric | Value |
|--------|-------|
| Compilation Errors | ${m.quality.typescript.errors} |
| Strict Mode | ${m.quality.typescript.strict ? '✅ Enabled' : '❌ Disabled'} |

## 🏛️ Project Structure

### Directory Analysis
| Metric | Value |
|--------|-------|
| Total Directories | ${m.structure.directories} |
| Max Depth | ${m.structure.maxDepth} |
| Organization Pattern | ${m.structure.organizationPattern} |

### Files per Directory
| Directory | Files |
|-----------|-------|
${Object.entries(m.structure.filesPerDirectory).map(([dir, count]) =>
  `| ${dir} | ${count} |`
).join('\n')}

## 📈 Trends & Recommendations

### Code Quality Score: ${this.calculateQualityScore()}/100

**Scoring Breakdown:**
- Code Organization: ${this.getOrganizationScore()}/25
- Test Coverage: ${this.getTestScore()}/25  
- Code Quality: ${this.getQualityScore()}/25
- Documentation: ${this.getDocumentationScore()}/25

### Recommendations
${this.generateRecommendations().map(rec => `- ${rec}`).join('\n')}

---

*Report generated by VibeSolver Project Metrics Collector*  
*Timestamp: ${m.timestamp}*
`;
  }

  calculateQualityScore() {
    return this.getOrganizationScore() + this.getTestScore() + this.getQualityScore() + this.getDocumentationScore();
  }

  getOrganizationScore() {
    const m = this.metrics;
    let score = 0;
    
    // Structure score
    if (m.structure.organizationPattern !== 'Mixed/Custom') score += 10;
    if (m.structure.maxDepth <= 4) score += 5;
    if (m.code.averageFileSize < 200) score += 10;
    
    return Math.min(score, 25);
  }

  getTestScore() {
    const m = this.metrics;
    let score = 0;
    
    // Test coverage score
    if (m.tests.testFiles > 0) score += 10;
    if (m.tests.totalTests > 20) score += 10;
    if (m.tests.testFiles / m.code.totalFiles > 0.3) score += 5;
    
    return Math.min(score, 25);
  }

  getQualityScore() {
    const m = this.metrics;
    let score = 25;
    
    // Deduct for issues
    score -= Math.min(m.quality.eslint.errors * 2, 10);
    score -= Math.min(m.quality.eslint.warnings * 1, 5);
    score -= Math.min(m.quality.typescript.errors * 2, 10);
    
    return Math.max(score, 0);
  }

  getDocumentationScore() {
    const m = this.metrics;
    let score = 0;
    
    // Comment ratio
    if (m.code.codeToCommentRatio < 10 && m.code.codeToCommentRatio > 3) score += 15;
    else if (m.code.commentLines > 0) score += 10;
    
    // README and docs
    if (fs.existsSync(path.join(this.projectRoot, 'README.md'))) score += 10;
    
    return Math.min(score, 25);
  }

  generateRecommendations() {
    const recommendations = [];
    const m = this.metrics;
    
    if (m.quality.eslint.errors > 0) {
      recommendations.push(`Fix ${m.quality.eslint.errors} ESLint errors to improve code quality`);
    }
    
    if (m.quality.typescript.errors > 0) {
      recommendations.push(`Resolve ${m.quality.typescript.errors} TypeScript compilation errors`);
    }
    
    if (m.tests.totalTests === 0) {
      recommendations.push('Add test coverage - no tests found');
    } else if (m.tests.testFiles / m.code.totalFiles < 0.3) {
      recommendations.push('Increase test coverage - consider adding more test files');
    }
    
    if (m.code.codeToCommentRatio > 15) {
      recommendations.push('Add more code comments to improve maintainability');
    }
    
    if (m.code.averageFileSize > 300) {
      recommendations.push('Consider breaking down large files for better maintainability');
    }
    
    if (m.structure.maxDepth > 5) {
      recommendations.push('Simplify directory structure - consider flattening deep hierarchies');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Great job! No immediate recommendations - maintain current quality standards');
    }
    
    return recommendations;
  }
}

// Main execution
const projectRoot = process.argv[2] || process.cwd();
const collector = new ProjectMetricsCollector(projectRoot);

collector.collectAllMetrics().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});