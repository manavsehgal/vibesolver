import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { RequirementsForm } from './RequirementsForm';
import { SolutionDisplay } from './SolutionDisplay';
import { ArchitectureVisualization } from './ArchitectureVisualization';
import { FlashcardViewer, FlashcardGenerator } from './FlashcardViewer';
import { WhatIfAnalysis, AnalysisResults } from './WhatIfAnalysis';
import { SolutionModification } from './SolutionModification';
import { SolutionExplanation } from './SolutionExplanation';
import { Card, CardContent, LoadingSpinner, Button } from './ui';
import { useGenerateFlashcards, useWhatIfAnalysis, useModifySolution, useExplainSolution } from '@/hooks/useAI';
import { useSolutionStore } from '@/stores/solutions';
import { useToast } from '@/hooks/useToast';
import { type AWSSolutionResponse, type FlashcardResponse, type WhatIfAnalysisResponse } from '@/types';
import { Save } from 'lucide-react';

interface VibeSolverProps {
  solutionId?: string | null;
  editMode?: boolean;
}

export function VibeSolver({ solutionId, editMode = false }: VibeSolverProps) {
  const [currentSolution, setCurrentSolution] = useState<AWSSolutionResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSolution, setIsLoadingSolution] = useState(false);
  const [loadedSolutionId, setLoadedSolutionId] = useState<string | null>(null);
  const { saveSolution, isSaving } = useSolutionStore();
  const { showToast } = useToast();
  
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

  // Load solution when solutionId changes
  useEffect(() => {
    const loadSolution = async () => {
      if (!solutionId || solutionId === loadedSolutionId) return;
      
      setIsLoadingSolution(true);
      try {
        const { solutionOperations } = await import('@/db');
        const solution = await solutionOperations.getById(solutionId);
        
        if (solution) {
          // Convert database solution to AWSSolutionResponse format
          const awsSolution: AWSSolutionResponse = {
            title: solution.title,
            description: solution.description,
            awsServices: solution.awsServices ? JSON.parse(solution.awsServices) : [],
            architecture: solution.architecture ? JSON.parse(solution.architecture) : null,
            costEstimate: solution.costEstimate || 0,
            recommendations: solution.recommendations ? JSON.parse(solution.recommendations) : []
          };
          
          setCurrentSolution(awsSolution);
          setLoadedSolutionId(solutionId);
          
          // Update last accessed time
          await solutionOperations.updateLastAccessed(solutionId);
          
          if (!editMode) {
            showToast({
              type: 'success',
              title: 'Solution Loaded',
              message: `${solution.title} has been loaded successfully.`
            });
          }
        } else {
          showToast({
            type: 'error',
            title: 'Solution Not Found',
            message: 'The requested solution could not be found.'
          });
        }
      } catch (error) {
        console.error('Failed to load solution:', error);
        showToast({
          type: 'error',
          title: 'Load Failed',
          message: 'Failed to load solution. Please try again.'
        });
      } finally {
        setIsLoadingSolution(false);
      }
    };

    loadSolution();
  }, [solutionId, loadedSolutionId, editMode, showToast]);

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

  const handleSaveSolution = async () => {
    if (!currentSolution) return;

    try {
      const { solutionOperations } = await import('@/db');
      
      if (loadedSolutionId) {
        // Update existing solution
        const updates = {
          title: currentSolution.title,
          description: currentSolution.description,
          awsServices: JSON.stringify(currentSolution.awsServices),
          architecture: JSON.stringify(currentSolution.architecture),
          costEstimate: currentSolution.costEstimate || null,
          recommendations: JSON.stringify(currentSolution.recommendations),
          updatedAt: new Date(),
        };
        
        await solutionOperations.update(loadedSolutionId, updates);
      } else {
        // Create new solution
        const solutionToSave = {
          id: `solution-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: currentSolution.title,
          description: currentSolution.description,
          awsServices: JSON.stringify(currentSolution.awsServices),
          architecture: JSON.stringify(currentSolution.architecture),
          requirements: 'Generated from VibeSolver',
          costEstimate: currentSolution.costEstimate || null,
          recommendations: JSON.stringify(currentSolution.recommendations),
          tags: JSON.stringify(['generated']),
          status: 'draft' as const,
          version: 1,
          parentId: null,
          isTemplate: false,
          isFavorite: false,
          lastAccessedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const savedSolution = await saveSolution(solutionToSave);
        setLoadedSolutionId(savedSolution.id);
      }
      showToast({
        type: 'success',
        title: 'Solution Saved',
        message: 'Your AWS solution has been saved to the library successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save solution. Please try again.',
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {isLoadingSolution ? (
          <Card>
            <CardContent className="py-12">
              <LoadingSpinner 
                size="lg" 
                text={editMode ? "Loading solution for editing..." : "Loading solution..."} 
              />
            </CardContent>
          </Card>
        ) : !currentSolution ? (
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
                {editMode && loadedSolutionId ? 'Editing AWS Solution' : 'Your AWS Solution'}
              </h2>
              <div className="flex gap-4">
                <Button
                  onClick={handleSaveSolution}
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : loadedSolutionId ? 'Update Solution' : 'Save Solution'}
                </Button>
                <button
                  onClick={() => window.location.href = '/library'}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  📚 Solution Library
                </button>
                <button
                  onClick={handleNewSolution}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Generate New Solution
                </button>
              </div>
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