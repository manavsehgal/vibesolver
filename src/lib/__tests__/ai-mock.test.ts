import { describe, it, expect, vi } from 'vitest';
import {
  generateAWSSolution,
  generateFlashcards,
  performWhatIfAnalysis,
  modifySolution,
  explainSolution,
} from '../ai-mock';

// Mock the delay function to speed up tests
// Speed up tests by mocking delay
vi.mock('../ai-mock', async () => {
  const actual = await vi.importActual('../ai-mock');
  return {
    ...actual as any,
  };
});

describe('AI Mock Service', () => {
  describe('generateAWSSolution', () => {
    it('should generate e-commerce solution for e-commerce requirements', async () => {
      const requirements = 'I need an e-commerce platform for selling products online';
      const solution = await generateAWSSolution(requirements);

      expect(solution.title).toContain('E-commerce');
      expect(solution.awsServices).toBeDefined();
      expect(solution.architecture).toBeDefined();
      expect(solution.costEstimate).toBeGreaterThan(0);
      expect(solution.recommendations).toBeInstanceOf(Array);
    });

    it('should generate file sharing solution for file sharing requirements', async () => {
      const requirements = 'I need a secure file sharing platform for documents';
      const solution = await generateAWSSolution(requirements);

      expect(solution.title).toContain('File Sharing');
      expect(solution.awsServices.some(service => service.name === 'Amazon S3')).toBe(true);
      expect(solution.architecture.components).toBeDefined();
    });

    it('should generate default solution for general requirements', async () => {
      const requirements = 'I need a web application';
      const solution = await generateAWSSolution(requirements);

      expect(solution.title).toBe('AWS Solution Architecture');
      expect(solution.awsServices.length).toBeGreaterThan(0);
      expect(solution.architecture.components.length).toBeGreaterThan(0);
    });
  });

  describe('generateFlashcards', () => {
    it('should generate flashcards array', async () => {
      const flashcards = await generateFlashcards('test solution data', 5);

      expect(Array.isArray(flashcards)).toBe(true);
      expect(flashcards.length).toBeGreaterThan(0);
      expect(flashcards[0]).toHaveProperty('front');
      expect(flashcards[0]).toHaveProperty('back');
      expect(flashcards[0]).toHaveProperty('category');
    });
  });

  describe('performWhatIfAnalysis', () => {
    it('should return analysis with criteria and results', async () => {
      const criteria = ['cost', 'performance'];
      const analysis = await performWhatIfAnalysis('test solution', criteria);

      expect(analysis.criteria).toEqual(criteria);
      expect(analysis.results).toBeInstanceOf(Array);
      expect(analysis.summary).toBeDefined();
      expect(analysis.results[0]).toHaveProperty('criterion');
      expect(analysis.results[0]).toHaveProperty('impact');
      expect(analysis.results[0]).toHaveProperty('recommendation');
      expect(analysis.results[0]).toHaveProperty('confidence');
    });
  });

  describe('modifySolution', () => {
    it('should return modified solution based on request', async () => {
      const currentSolution = 'current solution data';
      const modificationRequest = 'add more security';
      
      const modifiedSolution = await modifySolution(currentSolution, modificationRequest);

      expect(modifiedSolution).toBeDefined();
      expect(modifiedSolution.title).toBeDefined();
      expect(modifiedSolution.awsServices).toBeDefined();
    });
  });

  describe('explainSolution', () => {
    it('should return explanation string', async () => {
      const explanation = await explainSolution('test solution data');

      expect(typeof explanation).toBe('string');
      expect(explanation.length).toBeGreaterThan(0);
    });
  });
});