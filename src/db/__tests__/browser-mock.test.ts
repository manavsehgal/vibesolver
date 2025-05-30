import { describe, it, expect, beforeEach } from 'vitest';
import { mockDb } from '../browser-mock';
import type { AWSSolutionResponse } from '@/types';

describe('Browser Mock Database', () => {
  beforeEach(async () => {
    // Clear mock data before each test by calling findMany then deleting all
    const existingSolutions = await mockDb.solutions.findMany();
    for (const solution of existingSolutions) {
      await mockDb.solutions.delete({ id: solution.id });
    }
  });

  describe('solutions.insert', () => {
    it('should insert a new solution and return it with id and createdAt', async () => {
      const solutionData: AWSSolutionResponse = {
        title: 'Test AWS Solution',
        description: 'A test solution',
        awsServices: [],
        architecture: { components: [], connections: [] },
        costEstimate: 100,
        recommendations: [],
      };

      const data = {
        id: crypto.randomUUID(),
        title: 'Test Solution',
        description: 'Test description',
        requirements: 'Test requirements',
        awsServices: JSON.stringify(solutionData.awsServices),
        architecture: solutionData.architecture ? JSON.stringify(solutionData.architecture) : null,
        costEstimate: solutionData.costEstimate,
        recommendations: solutionData.recommendations ? JSON.stringify(solutionData.recommendations) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await mockDb.solutions.insert(data);

      expect(result).toMatchObject({
        title: 'Test Solution',
        description: 'Test description',
        requirements: 'Test requirements',
        awsServices: JSON.stringify(solutionData.awsServices),
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('solutions.findMany', () => {
    it('should return empty array when no solutions exist', async () => {
      const solutions = await mockDb.solutions.findMany();
      expect(solutions).toEqual([]);
    });

    it('should return all solutions', async () => {
      const solutionData: AWSSolutionResponse = {
        title: 'Test AWS Solution',
        description: 'A test solution',
        awsServices: [],
        architecture: { components: [], connections: [] },
        costEstimate: 100,
        recommendations: [],
      };

      await mockDb.solutions.insert({
        id: crypto.randomUUID(),
        title: 'Solution 1',
        description: 'Description 1',
        requirements: 'Requirements 1',
        awsServices: JSON.stringify(solutionData.awsServices),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await mockDb.solutions.insert({
        id: crypto.randomUUID(),
        title: 'Solution 2',
        description: 'Description 2',
        requirements: 'Requirements 2',
        awsServices: JSON.stringify(solutionData.awsServices),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const solutions = await mockDb.solutions.findMany();
      expect(solutions).toHaveLength(2);
    });
  });

  describe('solutions.findFirst', () => {
    it('should return null when solution not found', async () => {
      const solution = await mockDb.solutions.findFirst({ id: 'non-existent' });
      expect(solution).toBeNull();
    });

    it('should return solution when found', async () => {
      const solutionData: AWSSolutionResponse = {
        title: 'Test AWS Solution',
        description: 'A test solution',
        awsServices: [],
        architecture: { components: [], connections: [] },
        costEstimate: 100,
        recommendations: [],
      };

      const inserted = await mockDb.solutions.insert({
        id: crypto.randomUUID(),
        title: 'Test Solution',
        description: 'Test description',
        requirements: 'Test requirements',
        awsServices: JSON.stringify(solutionData.awsServices),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const found = await mockDb.solutions.findFirst({ id: inserted.id });
      expect(found).toEqual(inserted);
    });
  });

  describe('solutions.delete', () => {
    it('should return null when solution not found', async () => {
      const result = await mockDb.solutions.delete({ id: 'non-existent' });
      expect(result).toBeNull();
    });

    it('should delete and return solution when found', async () => {
      const solutionData: AWSSolutionResponse = {
        title: 'Test AWS Solution',
        description: 'A test solution',
        awsServices: [],
        architecture: { components: [], connections: [] },
        costEstimate: 100,
        recommendations: [],
      };

      const inserted = await mockDb.solutions.insert({
        id: crypto.randomUUID(),
        title: 'Test Solution',
        description: 'Test description',
        requirements: 'Test requirements',
        awsServices: JSON.stringify(solutionData.awsServices),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const deleted = await mockDb.solutions.delete({ id: inserted.id });
      expect(deleted).toEqual(inserted);

      // Verify it's actually deleted
      const found = await mockDb.solutions.findFirst({ id: inserted.id });
      expect(found).toBeNull();
    });
  });
});