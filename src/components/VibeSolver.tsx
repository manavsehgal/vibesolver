import { useState } from 'react';
import { Layout } from './Layout';
import { RequirementsForm } from './RequirementsForm';
import { SolutionDisplay } from './SolutionDisplay';
import { ArchitectureVisualization } from './ArchitectureVisualization';
import { Card, CardContent, LoadingSpinner } from './ui';
import { type AWSSolutionResponse } from '@/types';

export function VibeSolver() {
  const [currentSolution, setCurrentSolution] = useState<AWSSolutionResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSolutionGenerated = (solution: AWSSolutionResponse) => {
    setCurrentSolution(solution);
    setIsGenerating(false);
  };

  const handleNewSolution = () => {
    setCurrentSolution(null);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {!currentSolution ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Transform Your Ideas into AWS Solutions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Describe your business requirements in natural language and get a comprehensive 
                AWS architecture designed to scale, secure, and optimize your workloads.
              </p>
            </div>
            
            <RequirementsForm onSolutionGenerated={handleSolutionGenerated} />
            
            {isGenerating && (
              <Card>
                <CardContent className="py-12">
                  <LoadingSpinner 
                    size="lg" 
                    text="Analyzing requirements and generating AWS solution..." 
                  />
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Your AWS Solution
              </h2>
              <button
                onClick={handleNewSolution}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Generate New Solution
              </button>
            </div>
            
            <SolutionDisplay 
              solution={currentSolution}
              onModify={() => {
                // TODO: Implement solution modification
                console.log('Modify solution');
              }}
              onExplain={() => {
                // TODO: Implement solution explanation
                console.log('Explain solution');
              }}
              onGenerateFlashcards={() => {
                // TODO: Implement flashcard generation
                console.log('Generate flashcards');
              }}
              onWhatIfAnalysis={() => {
                // TODO: Implement what-if analysis
                console.log('What-if analysis');
              }}
            />
            
            {currentSolution.architecture && (
              <ArchitectureVisualization 
                architecture={currentSolution.architecture}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}