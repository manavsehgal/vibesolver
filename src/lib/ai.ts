import { createAnthropic } from '@ai-sdk/anthropic';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

// Check if we're in production mode (using local server on port 3000)
// Note: Vite dev server runs on 5173, production proxy runs on 3000
const isProduction = window.location.port === '3000';

// For production, we'll use the local API proxy
// For development, fall back to direct API calls if needed
const apiKey = isProduction ? 'proxy' : (import.meta as any).env?.VITE_ANTHROPIC_API_KEY;

if (!apiKey && !isProduction) {
  console.warn('No API key configured, AI features will use mock data');
}

// Create anthropic provider
const anthropic = apiKey ? createAnthropic({
  apiKey: apiKey,
  baseURL: isProduction ? `${window.location.origin}/api` : undefined,
}) : null;

// Anthropic model configuration
const model = anthropic ? anthropic('claude-sonnet-4-20250514') : null;

// Schemas for structured AI responses
export const awsSolutionSchema = z.object({
  title: z.string(),
  description: z.string(),
  awsServices: z.array(
    z.object({
      name: z.string(),
      purpose: z.string(),
      configuration: z.string(),
    })
  ),
  architecture: z.object({
    components: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        position: z.object({ x: z.number(), y: z.number() }),
      })
    ),
    connections: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        label: z.string(),
      })
    ),
  }),
  costEstimate: z.number(),
  recommendations: z.array(z.string()),
});

export const flashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  category: z.string(),
});

export const whatIfAnalysisSchema = z.object({
  criteria: z.array(z.string()),
  results: z.array(
    z.object({
      criterion: z.string(),
      impact: z.string(),
      recommendation: z.string(),
      confidence: z.number(),
    })
  ),
  summary: z.string(),
});

// AI Service Functions
export async function generateAWSSolution(requirements: string) {
  if (!model) {
    throw new Error('AI model not configured');
  }
  
  try {
    const result = await generateObject({
      model,
      schema: awsSolutionSchema,
      prompt: `As an AWS Solutions Architect, analyze the following business requirements and generate a comprehensive AWS solution that follows the Well-Architected Framework:

Requirements: ${requirements}

Please provide:
1. A clear title and description of the solution
2. List of AWS services with their purposes and basic configuration
3. Architecture components with positions for visualization
4. Estimated monthly cost in USD
5. Key recommendations for optimization

Focus on scalability, security, cost-effectiveness, and operational excellence.`,
    });

    return result.object;
  } catch (error) {
    console.error('Error generating AWS solution:', error);
    throw new Error('Failed to generate AWS solution');
  }
}

export async function generateFlashcards(
  solutionData: string,
  count: number = 5
) {
  if (!model) {
    throw new Error('AI model not configured');
  }
  
  try {
    const result = await generateObject({
      model,
      schema: z.object({
        flashcards: z.array(flashcardSchema)
      }),
      prompt: `Create ${count} educational flashcards based on this AWS solution:

${solutionData}

Generate flashcards covering:
- Key AWS services and their purposes
- Architecture best practices
- Security considerations
- Cost optimization tips
- Operational excellence principles

Each flashcard should have a clear, concise front (question/term) and comprehensive back (answer/explanation).`,
    });

    return result.object.flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards');
  }
}

export async function performWhatIfAnalysis(
  solutionData: string,
  criteria: string[]
) {
  if (!model) {
    throw new Error('AI model not configured');
  }
  
  try {
    const result = await generateObject({
      model,
      schema: whatIfAnalysisSchema,
      prompt: `Perform a what-if analysis on this AWS solution based on the specified criteria:

Solution: ${solutionData}

Analysis Criteria: ${criteria.join(', ')}

For each criterion, analyze:
1. Potential impact on the solution
2. Specific recommendations for optimization
3. Confidence level (0-100) in the assessment

Provide a comprehensive summary of the overall analysis.`,
    });

    return result.object;
  } catch (error) {
    console.error('Error performing what-if analysis:', error);
    throw new Error('Failed to perform what-if analysis');
  }
}

export async function modifySolution(
  currentSolution: string,
  modificationRequest: string
) {
  if (!model) {
    throw new Error('AI model not configured');
  }
  
  try {
    const result = await generateObject({
      model,
      schema: awsSolutionSchema,
      prompt: `Modify the following AWS solution based on the user's request:

Current Solution: ${currentSolution}

Modification Request: ${modificationRequest}

Update the solution while maintaining AWS Well-Architected Framework principles. Ensure all components are properly integrated and the architecture remains coherent.`,
    });

    return result.object;
  } catch (error) {
    console.error('Error modifying solution:', error);
    throw new Error('Failed to modify solution');
  }
}

export async function explainSolution(solutionData: string) {
  if (!model) {
    throw new Error('AI model not configured');
  }
  
  try {
    const result = await generateText({
      model,
      prompt: `Provide a clear, detailed explanation of this AWS solution for someone who wants to understand how it works:

${solutionData}

Include:
1. High-level overview of the solution
2. How each AWS service contributes to the overall functionality
3. Data flow and interactions between components
4. Key benefits and design decisions
5. Security and compliance considerations

Write in a conversational, educational tone.`,
    });

    return result.text;
  } catch (error) {
    console.error('Error explaining solution:', error);
    throw new Error('Failed to explain solution');
  }
}
