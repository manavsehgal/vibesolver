import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from './ui';
import { type AWSSolutionResponse, type AWSService } from '@/types';

interface SolutionDisplayProps {
  solution: AWSSolutionResponse;
  onModify?: () => void;
  onExplain?: () => void;
  onGenerateFlashcards?: () => void;
  onWhatIfAnalysis?: () => void;
}

export function SolutionDisplay({ 
  solution, 
  onModify, 
  onExplain, 
  onGenerateFlashcards, 
  onWhatIfAnalysis 
}: SolutionDisplayProps) {
  return (
    <div className="space-y-6">
      <SolutionHeader 
        title={solution.title}
        description={solution.description}
        costEstimate={solution.costEstimate}
        onModify={onModify}
        onExplain={onExplain}
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <AWSServiceList services={solution.awsServices} />
        <RecommendationsList recommendations={solution.recommendations} />
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onGenerateFlashcards}>
          📚 Generate Flashcards
        </Button>
        <Button variant="outline" onClick={onWhatIfAnalysis}>
          🔍 What-If Analysis
        </Button>
      </div>
    </div>
  );
}

interface SolutionHeaderProps {
  title: string;
  description: string;
  costEstimate: number;
  onModify?: () => void;
  onExplain?: () => void;
}

function SolutionHeader({ 
  title, 
  description, 
  costEstimate, 
  onModify, 
  onExplain 
}: SolutionHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
          <div className="text-right ml-6">
            <div className="text-sm text-gray-500">Estimated Monthly Cost</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(costEstimate)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardFooter>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onModify}>
            ✏️ Modify Solution
          </Button>
          <Button variant="outline" onClick={onExplain}>
            💡 Explain Solution
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

interface AWSServiceListProps {
  services: AWSService[];
}

function AWSServiceList({ services }: AWSServiceListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AWS Services ({services.length})</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <AWSServiceCard key={index} service={service} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface AWSServiceCardProps {
  service: AWSService;
}

function AWSServiceCard({ service }: AWSServiceCardProps) {
  // AWS service icons mapping (simplified)
  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('ec2')) return '🖥️';
    if (name.includes('s3')) return '🪣';
    if (name.includes('rds')) return '🗄️';
    if (name.includes('lambda')) return '⚡';
    if (name.includes('api gateway')) return '🌐';
    if (name.includes('cloudfront')) return '🌍';
    if (name.includes('load balancer') || name.includes('elb') || name.includes('alb')) return '⚖️';
    if (name.includes('vpc')) return '🔒';
    if (name.includes('iam')) return '👤';
    if (name.includes('cloudwatch')) return '📊';
    if (name.includes('sns')) return '📢';
    if (name.includes('sqs')) return '📬';
    if (name.includes('dynamodb')) return '⚡';
    if (name.includes('elasticache')) return '💾';
    if (name.includes('route 53')) return '🌐';
    return '☁️';
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{getServiceIcon(service.name)}</span>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{service.purpose}</p>
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
            <strong>Configuration:</strong> {service.configuration}
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecommendationsListProps {
  recommendations: string[];
}

function RecommendationsList({ recommendations }: RecommendationsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Recommendations</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <span className="text-blue-600 font-bold text-sm">
                {index + 1}.
              </span>
              <p className="text-sm text-blue-800 leading-relaxed">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}