import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, LoadingSpinner } from './ui';
import { type AWSSolutionResponse, type ArchitectureComponent } from '@/types';

interface SolutionExplanationProps {
  solution: AWSSolutionResponse;
  explanation?: string;
  onClose: () => void;
  onGenerateExplanation?: () => void;
  isGenerating?: boolean;
}

export function SolutionExplanation({
  solution,
  explanation,
  onClose,
  onGenerateExplanation,
  isGenerating = false
}: SolutionExplanationProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [explanationDepth, setExplanationDepth] = useState<'overview' | 'detailed' | 'technical'>('detailed');

  const handleComponentSelect = useCallback((componentId: string) => {
    setSelectedComponent(componentId);
  }, []);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Solution Explanation
              </h2>
              <p className="text-sm text-gray-600">
                {solution.title}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={explanationDepth}
                onChange={(e) => setExplanationDepth(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
                disabled={isGenerating}
              >
                <option value="overview">Overview</option>
                <option value="detailed">Detailed</option>
                <option value="technical">Technical</option>
              </select>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isGenerating}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* Left panel - Component list */}
          <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Architecture Components
              </h3>
              <div className="space-y-2">
                {solution.architecture.components.map((component) => (
                  <button
                    key={component.id}
                    onClick={() => handleComponentSelect(component.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedComponent === component.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      {component.name}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {component.type}
                    </div>
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-3 mt-6">
                AWS Services
              </h3>
              <div className="space-y-2">
                {solution.awsServices.map((service, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="font-medium text-gray-900 text-sm mb-1">
                      {service.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {service.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel - Explanation content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {isGenerating ? (
                <div className="text-center py-16">
                  <LoadingSpinner size="lg" text="Generating detailed explanation..." />
                  <p className="text-sm text-gray-600 mt-2">
                    Analyzing architecture and creating comprehensive explanation
                  </p>
                </div>
              ) : explanation ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>💡</span>
                        <span>Solution Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {explanation}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedComponent && (
                    <ComponentDetailExplanation
                      component={solution.architecture.components.find(c => c.id === selectedComponent)!}
                      service={solution.awsServices.find(s => 
                        s.name.toLowerCase().includes(
                          solution.architecture.components.find(c => c.id === selectedComponent)?.type.toLowerCase() || ''
                        )
                      )}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">💡</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Generate Detailed Explanation
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Get a comprehensive explanation of your AWS solution including architecture decisions, 
                    data flow, and best practices.
                  </p>
                  {onGenerateExplanation && (
                    <Button onClick={onGenerateExplanation}>
                      Generate Explanation
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              💡 Click on components to see detailed explanations
            </span>
          </div>
          <div className="flex space-x-3">
            {explanation && (
              <Button variant="outline">
                📤 Export Explanation
              </Button>
            )}
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ComponentDetailExplanationProps {
  component: ArchitectureComponent;
  service?: {
    name: string;
    purpose: string;
    configuration: string;
  };
}

function ComponentDetailExplanation({ component, service }: ComponentDetailExplanationProps) {
  const getServiceExplanation = (serviceName: string) => {
    const name = serviceName?.toLowerCase() || '';
    
    const explanations: Record<string, { description: string; benefits: string[]; considerations: string[] }> = {
      'ec2': {
        description: 'Amazon EC2 provides secure, resizable compute capacity in the cloud, allowing you to scale computing resources up or down as needed.',
        benefits: ['Pay only for compute time used', 'Wide selection of instance types', 'Complete control over computing resources'],
        considerations: ['Requires ongoing management', 'Instance sizing affects performance and cost', 'Availability zone placement impacts resilience']
      },
      's3': {
        description: 'Amazon S3 offers industry-leading scalability, data availability, security, and performance for object storage.',
        benefits: ['99.999999999% (11 9s) durability', 'Unlimited storage capacity', 'Multiple storage classes for cost optimization'],
        considerations: ['Access patterns affect costs', 'Cross-region data transfer charges', 'Lifecycle policies for cost management']
      },
      'rds': {
        description: 'Amazon RDS simplifies database administration tasks while providing cost-efficient and resizable capacity.',
        benefits: ['Automated backups and updates', 'Multi-AZ deployments for high availability', 'Read replicas for performance'],
        considerations: ['Instance size affects performance', 'Backup retention affects costs', 'Engine choice impacts features']
      },
      'lambda': {
        description: 'AWS Lambda executes code in response to events and automatically manages the underlying compute resources.',
        benefits: ['No server management required', 'Automatic scaling', 'Pay only for execution time'],
        considerations: ['Execution time limits', 'Memory allocation affects performance', 'Cold start latency']
      }
    };

    for (const [key, explanation] of Object.entries(explanations)) {
      if (name.includes(key)) {
        return explanation;
      }
    }
    
    return {
      description: 'This AWS service provides specific functionality within your solution architecture.',
      benefits: ['Scalable and managed service', 'Integration with other AWS services', 'Built-in security features'],
      considerations: ['Configuration affects performance', 'Usage patterns impact costs', 'Regional availability']
    };
  };

  const serviceInfo = service ? getServiceExplanation(service.name) : null;

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🔍</span>
          <span>{component.name} - Detailed View</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Component Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium capitalize">{component.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Position:</span>
              <span className="ml-2 font-medium">
                ({component.position.x}, {component.position.y})
              </span>
            </div>
          </div>
        </div>

        {service && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Service Information</h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Purpose:</span>
                <p className="text-sm text-gray-600 mt-1">{service.purpose}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Configuration:</span>
                <p className="text-sm text-gray-600 mt-1">{service.configuration}</p>
              </div>
            </div>
          </div>
        )}

        {serviceInfo && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Overview</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {serviceInfo.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-green-700 mb-2">Key Benefits</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {serviceInfo.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-orange-700 mb-2">Considerations</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {serviceInfo.considerations.map((consideration, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-0.5">⚠</span>
                      <span>{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}