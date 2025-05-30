import React, { useState, useRef } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea } from './ui';
import { useGenerateAWSSolution } from '@/hooks/useAI';
import { useSaveSolution } from '@/hooks/useSolutions';
import { useToast } from '@/hooks/useToast';

const EXAMPLE_PROMPTS = [
  "Build a scalable e-commerce platform that can handle 100,000 concurrent users with real-time inventory management",
  "Create a secure file sharing application with encryption, version control, and audit logging for enterprise clients",
  "Design a real-time analytics dashboard for IoT sensors that processes 1M events per minute with sub-second latency",
  "Develop a multi-tenant SaaS application with automated backups, disaster recovery, and 99.9% uptime SLA",
  "Build a serverless microservices architecture for a mobile banking app with PCI DSS compliance"
];

interface RequirementsFormProps {
  onSolutionGenerated?: (solution: any) => void;
}

export function RequirementsForm({ onSolutionGenerated }: RequirementsFormProps) {
  const [requirements, setRequirements] = useState('');
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const generateSolution = useGenerateAWSSolution();
  const saveSolution = useSaveSolution();
  const toast = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requirements.trim()) {
      toast.error('Please enter your business requirements');
      return;
    }
    
    if (requirements.trim().length < 20) {
      toast.error('Please provide more detailed requirements (at least 20 characters)');
      return;
    }
    
    try {
      toast.info('Generating AWS solution...');
      const solution = await generateSolution.mutateAsync(requirements.trim());
      
      // Save solution to database
      await saveSolution.mutateAsync({
        solution,
        requirements: requirements.trim()
      });
      
      if (onSolutionGenerated) {
        onSolutionGenerated(solution);
      }
      
      toast.success('AWS solution generated and saved successfully!');
    } catch (error) {
      toast.error('Failed to generate solution. Please try again.');
    }
  };
  
  const handleExampleClick = (example: string, index: number) => {
    setRequirements(example);
    setSelectedExample(index);
    textareaRef.current?.focus();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  
  const isValid = requirements.trim().length >= 20;
  const charCount = requirements.length;
  const maxLength = 2000;
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Describe Your Business Requirements</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            ref={textareaRef}
            label="Business & Technical Requirements"
            placeholder="Describe your business needs, expected scale, performance requirements, compliance needs, and any specific AWS services you'd like to include..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={6}
            maxLength={maxLength}
            showCharCount
            helperText="Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to quickly submit"
            error={requirements.trim().length > 0 && requirements.trim().length < 20 ? 'Please provide more detailed requirements' : undefined}
          />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {charCount < 20 && charCount > 0 && (
                <span className="text-amber-600">
                  {20 - charCount} more characters needed
                </span>
              )}
              {charCount >= 20 && (
                <span className="text-green-600">
                  ✓ Ready to generate solution
                </span>
              )}
            </span>
            
            <Button 
              type="submit" 
              isLoading={generateSolution.isPending || saveSolution.isPending}
              disabled={!isValid}
            >
              {(generateSolution.isPending || saveSolution.isPending) ? 'Generating Solution...' : 'Generate AWS Solution'}
            </Button>
          </div>
        </form>
        
        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Example Requirements (click to use):
          </h4>
          <div className="grid gap-3 md:grid-cols-1">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example, index)}
                className={`
                  text-left p-3 rounded-lg border transition-all duration-200
                  hover:border-blue-300 hover:bg-blue-50 
                  ${selectedExample === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                `}
              >
                <p className="text-sm text-gray-700 leading-relaxed">
                  {example}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            💡 Tips for Better Results:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Include expected user load and performance requirements</li>
            <li>• Mention compliance needs (HIPAA, PCI DSS, SOC 2, etc.)</li>
            <li>• Specify budget constraints or cost optimization priorities</li>
            <li>• Describe integration requirements with existing systems</li>
            <li>• Include geographic distribution needs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}