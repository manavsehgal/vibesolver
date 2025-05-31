import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, LoadingSpinner, Textarea } from './ui';
import { type AWSSolutionResponse } from '@/types';

interface SolutionModificationProps {
  currentSolution: AWSSolutionResponse;
  onModificationComplete: (modificationRequest: string) => void;
  onClose: () => void;
  isModifying?: boolean;
}

export function SolutionModification({
  currentSolution,
  onModificationComplete,
  onClose,
  isModifying = false
}: SolutionModificationProps) {
  const [modificationRequest, setModificationRequest] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const suggestedModifications = [
    {
      text: 'Add a caching layer for better performance',
      description: 'Implement Redis or ElastiCache to reduce database load'
    },
    {
      text: 'Implement multi-region deployment for high availability',
      description: 'Deploy across multiple AWS regions for disaster recovery'
    },
    {
      text: 'Add monitoring and alerting capabilities',
      description: 'Integrate CloudWatch, SNS, and custom dashboards'
    },
    {
      text: 'Optimize for cost by using Spot instances',
      description: 'Replace some EC2 instances with cost-effective Spot instances'
    },
    {
      text: 'Enhance security with WAF and Shield',
      description: 'Add AWS WAF and Shield for DDoS protection'
    },
    {
      text: 'Implement CI/CD pipeline',
      description: 'Add CodePipeline, CodeBuild, and CodeDeploy for automation'
    }
  ];

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setModificationRequest(suggestion);
  }, []);

  const handlePreview = useCallback(() => {
    if (modificationRequest.trim()) {
      setShowPreview(true);
    }
  }, [modificationRequest]);

  const handleApplyModification = useCallback(() => {
    if (modificationRequest.trim()) {
      onModificationComplete(modificationRequest);
    }
  }, [modificationRequest, onModificationComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Modify Solution
              </h2>
              <p className="text-sm text-gray-600">
                {currentSolution.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isModifying}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Modification input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the changes you'd like to make
            </label>
            <Textarea
              value={modificationRequest}
              onChange={(e) => setModificationRequest(e.target.value)}
              placeholder="e.g., Add a caching layer using Redis, implement multi-region deployment, enhance security..."
              className="w-full h-32"
              disabled={isModifying}
            />
            <div className="text-xs text-gray-500 mt-1">
              Be specific about what you want to add, remove, or change in your architecture
            </div>
          </div>

          {/* Suggested modifications */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Common Modifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedModifications.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  disabled={isModifying}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-gray-600">
                    {suggestion.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current solution summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Solution Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700 mb-1">AWS Services</div>
                  <div className="text-gray-600">
                    {currentSolution.awsServices.length} services configured
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Monthly Cost</div>
                  <div className="text-gray-600">
                    ${currentSolution.costEstimate.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Components</div>
                  <div className="text-gray-600">
                    {currentSolution.architecture.components.length} architecture components
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Connections</div>
                  <div className="text-gray-600">
                    {currentSolution.architecture.connections.length} service connections
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isModifying && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Modifying solution..." />
              <p className="text-sm text-gray-600 mt-2">
                Analyzing changes and updating architecture
              </p>
            </div>
          )}

          {/* Preview section (placeholder) */}
          {showPreview && !isModifying && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-base text-blue-800">
                  📋 Modification Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Requested Change:</strong> {modificationRequest}
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    Click "Apply Modification" to generate the updated solution with these changes.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isModifying}
          >
            Cancel
          </Button>
          
          {!showPreview && modificationRequest.trim() && !isModifying && (
            <Button
              variant="outline"
              onClick={handlePreview}
            >
              Preview Changes
            </Button>
          )}
          
          <Button
            onClick={handleApplyModification}
            disabled={!modificationRequest.trim() || isModifying}
          >
            {isModifying ? 'Modifying...' : 'Apply Modification'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ModificationHistoryProps {
  modifications: ModificationHistoryItem[];
  onRevert?: (modificationId: string) => void;
  onClose: () => void;
}

interface ModificationHistoryItem {
  id: string;
  timestamp: Date;
  request: string;
  summary: string;
  costChange: number;
  servicesAdded: number;
  servicesRemoved: number;
}

export function ModificationHistory({ modifications, onRevert, onClose }: ModificationHistoryProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Modification History
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {modifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <p className="text-gray-600">No modifications have been made yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {modifications.map((modification) => (
                <Card key={modification.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-500">
                            {modification.timestamp.toLocaleDateString()} at{' '}
                            {modification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2">
                          {modification.request}
                        </h4>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {modification.summary}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                          <span className={`${
                            modification.costChange > 0 ? 'text-red-600' : 
                            modification.costChange < 0 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            Cost: {modification.costChange > 0 ? '+' : ''}${modification.costChange}
                          </span>
                          {modification.servicesAdded > 0 && (
                            <span className="text-green-600">
                              +{modification.servicesAdded} services
                            </span>
                          )}
                          {modification.servicesRemoved > 0 && (
                            <span className="text-red-600">
                              -{modification.servicesRemoved} services
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {onRevert && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRevert(modification.id)}
                        >
                          Revert
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}