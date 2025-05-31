import { useState } from 'react';
import { Layout } from './Layout';
import { RequirementsForm } from './RequirementsForm';
import { SolutionDisplay } from './SolutionDisplay';
import { ArchitectureVisualization } from './ArchitectureVisualization';
import { FlashcardViewer, FlashcardGenerator } from './FlashcardViewer';
import { WhatIfAnalysis, AnalysisResults } from './WhatIfAnalysis';
import { SolutionModification } from './SolutionModification';
import { SolutionExplanation } from './SolutionExplanation';
import { Card, CardContent, LoadingSpinner } from './ui';
import { useGenerateFlashcards, useWhatIfAnalysis, useModifySolution, useExplainSolution } from '@/hooks/useAI';
import { type AWSSolutionResponse, type FlashcardResponse, type WhatIfAnalysisResponse } from '@/types';

export function VibeSolver() {
  const [currentSolution, setCurrentSolution] = useState<AWSSolutionResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI feature states
  const [showFlashcardGenerator, setShowFlashcardGenerator] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardResponse[] | null>(null);
  const [showWhatIfAnalysis, setShowWhatIfAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<WhatIfAnalysisResponse | null>(null);
  const [showModification, setShowModification] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [solutionExplanation, setSolutionExplanation] = useState<string>('');
  
  // AI hooks
  const generateFlashcards = useGenerateFlashcards();
  const performWhatIfAnalysis = useWhatIfAnalysis();
  const modifySolution = useModifySolution();
  const explainSolution = useExplainSolution();

  const handleSolutionGenerated = (solution: AWSSolutionResponse) => {
    setCurrentSolution(solution);
    setIsGenerating(false);
  };

  const handleNewSolution = () => {
    setCurrentSolution(null);
    // Reset all AI feature states
    setFlashcards(null);
    setAnalysisResults(null);
    setSolutionExplanation('');
    setShowFlashcardGenerator(false);
    setShowWhatIfAnalysis(false);
    setShowModification(false);
    setShowExplanation(false);
  };

  // AI feature handlers
  const handleGenerateFlashcards = async () => {
    if (!currentSolution) return;
    
    const solutionData = JSON.stringify({
      title: currentSolution.title,
      description: currentSolution.description,
      services: currentSolution.awsServices,
      recommendations: currentSolution.recommendations
    });

    try {
      const result = await generateFlashcards.mutateAsync({
        solutionData,
        count: 5
      });
      setFlashcards(result);
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
    }
  };

  const handleWhatIfAnalysis = async (criteria: string[]) => {
    if (!currentSolution) return;
    
    const solutionData = JSON.stringify(currentSolution);

    try {
      const result = await performWhatIfAnalysis.mutateAsync({
        solutionData,
        criteria
      });
      setAnalysisResults(result);
      setShowWhatIfAnalysis(false);
    } catch (error) {
      console.error('Failed to perform what-if analysis:', error);
    }
  };

  const handleModifySolution = async (modificationRequest: string) => {
    if (!currentSolution) return;
    
    const currentSolutionData = JSON.stringify(currentSolution);

    try {
      const result = await modifySolution.mutateAsync({
        currentSolution: currentSolutionData,
        modificationRequest
      });
      setCurrentSolution(result);
      setShowModification(false);
    } catch (error) {
      console.error('Failed to modify solution:', error);
    }
  };

  const handleExplainSolution = async () => {
    if (!currentSolution) return;
    
    const solutionData = JSON.stringify(currentSolution);

    try {
      const result = await explainSolution.mutateAsync(solutionData);
      setSolutionExplanation(result);
    } catch (error) {
      console.error('Failed to explain solution:', error);
    }
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
              onModify={() => setShowModification(true)}
              onExplain={() => setShowExplanation(true)}
              onGenerateFlashcards={() => setShowFlashcardGenerator(true)}
              onWhatIfAnalysis={() => setShowWhatIfAnalysis(true)}
            />
            
            {currentSolution.architecture && (
              <ArchitectureVisualization 
                architecture={currentSolution.architecture}
              />
            )}
          </div>
        )}
        
        {/* AI Feature Modals */}
        {showFlashcardGenerator && currentSolution && (
          <FlashcardGenerator
            onFlashcardsGenerated={() => {
              setShowFlashcardGenerator(false);
              handleGenerateFlashcards();
            }}
            onClose={() => setShowFlashcardGenerator(false)}
            isGenerating={generateFlashcards.isPending}
          />
        )}
        
        {flashcards && (
          <FlashcardViewer
            flashcards={flashcards}
            onClose={() => setFlashcards(null)}
            onRateCard={(index, difficulty) => {
              console.log(`Card ${index} rated as ${difficulty}`);
            }}
          />
        )}
        
        {showWhatIfAnalysis && currentSolution && (
          <WhatIfAnalysis
            onAnalysisComplete={handleWhatIfAnalysis}
            onClose={() => setShowWhatIfAnalysis(false)}
            isAnalyzing={performWhatIfAnalysis.isPending}
          />
        )}
        
        {analysisResults && (
          <AnalysisResults
            analysis={analysisResults}
            onClose={() => setAnalysisResults(null)}
            onExport={() => {
              console.log('Export analysis results');
            }}
          />
        )}
        
        {showModification && currentSolution && (
          <SolutionModification
            currentSolution={currentSolution}
            onModificationComplete={handleModifySolution}
            onClose={() => setShowModification(false)}
            isModifying={modifySolution.isPending}
          />
        )}
        
        {showExplanation && currentSolution && (
          <SolutionExplanation
            solution={currentSolution}
            explanation={solutionExplanation}
            onClose={() => setShowExplanation(false)}
            onGenerateExplanation={handleExplainSolution}
            isGenerating={explainSolution.isPending}
          />
        )}
      </div>
    </Layout>
  );
}