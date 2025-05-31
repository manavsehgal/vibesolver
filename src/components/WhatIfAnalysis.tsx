import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, LoadingSpinner } from './ui';
import { type WhatIfAnalysisResponse, type AnalysisResult } from '@/types';

interface WhatIfAnalysisProps {
  onAnalysisComplete: (criteria: string[]) => void;
  onClose: () => void;
  isAnalyzing?: boolean;
}

export function WhatIfAnalysis({
  onAnalysisComplete,
  onClose,
  isAnalyzing = false
}: WhatIfAnalysisProps) {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(['cost', 'scalability']);
  const [customCriteria, setCustomCriteria] = useState('');

  const availableCriteria = [
    {
      id: 'cost',
      label: 'Cost Optimization',
      description: 'Analyze cost implications and optimization opportunities',
      icon: '💰'
    },
    {
      id: 'scalability',
      label: 'Scalability',
      description: 'Evaluate horizontal and vertical scaling capabilities',
      icon: '📈'
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Assess security posture and compliance requirements',
      icon: '🔒'
    },
    {
      id: 'availability',
      label: 'High Availability',
      description: 'Analyze fault tolerance and disaster recovery',
      icon: '⚡'
    },
    {
      id: 'performance',
      label: 'Performance',
      description: 'Evaluate latency, throughput, and response times',
      icon: '🚀'
    },
    {
      id: 'compliance',
      label: 'Compliance',
      description: 'Review regulatory and industry compliance requirements',
      icon: '📋'
    }
  ];

  const handleCriteriaToggle = useCallback((criteriaId: string) => {
    setSelectedCriteria(prev =>
      prev.includes(criteriaId)
        ? prev.filter(id => id !== criteriaId)
        : [...prev, criteriaId]
    );
  }, []);

  const handleAnalyze = useCallback(() => {
    const criteria = [...selectedCriteria];
    if (customCriteria.trim()) {
      criteria.push(customCriteria.trim());
    }
    
    if (criteria.length > 0) {
      // This will trigger the actual AI analysis
      onAnalysisComplete(criteria);
    }
  }, [selectedCriteria, customCriteria, onAnalysisComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              What-If Analysis
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isAnalyzing}
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Select criteria to analyze how your AWS solution performs under different scenarios
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Criteria selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Analysis Criteria
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableCriteria.map(criteria => (
                <label
                  key={criteria.id}
                  className={`relative flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCriteria.includes(criteria.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCriteria.includes(criteria.id)}
                    onChange={() => handleCriteriaToggle(criteria.id)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isAnalyzing}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{criteria.icon}</span>
                      <div className="text-sm font-medium text-gray-900">
                        {criteria.label}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {criteria.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom criteria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Analysis Criteria (Optional)
            </label>
            <textarea
              value={customCriteria}
              onChange={(e) => setCustomCriteria(e.target.value)}
              placeholder="e.g., Multi-region deployment impact, Edge computing optimization..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              disabled={isAnalyzing}
            />
          </div>

          {isAnalyzing && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Analyzing solution..." />
              <p className="text-sm text-gray-600 mt-2">
                This may take up to 30 seconds
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isAnalyzing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={selectedCriteria.length === 0 || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AnalysisResultsProps {
  analysis: WhatIfAnalysisResponse;
  onClose: () => void;
  onExport?: () => void;
}

export function AnalysisResults({ analysis, onClose, onExport }: AnalysisResultsProps) {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Analysis Results
              </h2>
              <p className="text-sm text-gray-600">
                {analysis.criteria.length} criteria analyzed
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {onExport && (
                <Button variant="outline" onClick={onExport}>
                  📊 Export Report
                </Button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Executive Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>

          {/* Detailed results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Detailed Analysis
            </h3>
            
            {analysis.results.map((result, index) => (
              <AnalysisResultCard key={index} result={result} />
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={onClose}>
            Close Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AnalysisResultCardProps {
  result: AnalysisResult;
}

function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 capitalize">
            {result.criterion}
          </h4>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(result.confidence)}`}
            >
              {getConfidenceLabel(result.confidence)} Confidence
            </span>
            <span className="text-sm text-gray-500">
              {result.confidence}%
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Impact Analysis</h5>
            <p className="text-gray-600 leading-relaxed">
              {result.impact}
            </p>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h5>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}