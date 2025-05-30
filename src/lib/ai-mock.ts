// Mock AI service for evaluation without API key
import type { AWSSolutionResponse } from '@/types';

// Simulate AI processing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock AWS solution templates based on common patterns
const generateMockSolution = (requirements: string): AWSSolutionResponse => {
  const isEcommerce = requirements.toLowerCase().includes('e-commerce') || requirements.toLowerCase().includes('ecommerce');
  const isFileSharing = requirements.toLowerCase().includes('file sharing') || requirements.toLowerCase().includes('document');
  // Check for additional patterns that could be used for future solution templates
  // const isAnalytics = requirements.toLowerCase().includes('analytics') || requirements.toLowerCase().includes('dashboard');
  // const isCompliance = requirements.toLowerCase().includes('hipaa') || requirements.toLowerCase().includes('pci') || requirements.toLowerCase().includes('compliance');
  // const isRealTime = requirements.toLowerCase().includes('real-time') || requirements.toLowerCase().includes('realtime');
  // const isHighScale = requirements.toLowerCase().includes('100,000') || requirements.toLowerCase().includes('million') || requirements.toLowerCase().includes('scale');

  if (isEcommerce) {
    return {
      title: "Scalable E-commerce Platform Architecture",
      description: "A comprehensive AWS solution for high-traffic e-commerce with auto-scaling capabilities, global content delivery, and robust inventory management. Designed to handle peak loads while maintaining cost efficiency.",
      awsServices: [
        {
          name: "Amazon EC2 Auto Scaling",
          purpose: "Automatically scales web application servers based on traffic demand",
          configuration: "t3.medium instances with target tracking scaling policy, min 2, max 20 instances"
        },
        {
          name: "Amazon RDS for MySQL",
          purpose: "Managed relational database for product catalogs, orders, and user data",
          configuration: "Multi-AZ deployment, db.r5.large, automated backups, read replicas"
        },
        {
          name: "Amazon S3",
          purpose: "Object storage for product images, static assets, and file uploads",
          configuration: "Standard storage class with lifecycle policies, versioning enabled"
        },
        {
          name: "Amazon CloudFront",
          purpose: "Global content delivery network for fast asset loading worldwide",
          configuration: "Global edge locations, origin shield, compression enabled"
        },
        {
          name: "Application Load Balancer",
          purpose: "Distributes incoming traffic across multiple EC2 instances",
          configuration: "Internet-facing, health checks, SSL termination"
        },
        {
          name: "Amazon ElastiCache",
          purpose: "In-memory caching for session data and frequently accessed content",
          configuration: "Redis cluster mode, t3.micro nodes, automatic failover"
        },
        {
          name: "Amazon SQS",
          purpose: "Message queuing for order processing and inventory updates",
          configuration: "Standard queue with dead letter queue, message retention 14 days"
        },
        {
          name: "AWS WAF",
          purpose: "Web application firewall protection against common attacks",
          configuration: "Rate limiting, SQL injection protection, XSS filtering"
        }
      ],
      architecture: {
        components: [
          { id: "cf", name: "CloudFront", type: "CDN", position: { x: 50, y: 50 } },
          { id: "alb", name: "Load Balancer", type: "Load Balancer", position: { x: 200, y: 120 } },
          { id: "ec2", name: "EC2 Auto Scaling", type: "Compute", position: { x: 350, y: 120 } },
          { id: "rds", name: "RDS MySQL", type: "Database", position: { x: 200, y: 250 } },
          { id: "s3", name: "S3 Storage", type: "Storage", position: { x: 50, y: 200 } },
          { id: "cache", name: "ElastiCache", type: "Cache", position: { x: 350, y: 200 } },
          { id: "sqs", name: "SQS Queue", type: "Queue", position: { x: 500, y: 120 } }
        ],
        connections: [
          { from: "cf", to: "alb", label: "HTTP/HTTPS" },
          { from: "alb", to: "ec2", label: "Traffic" },
          { from: "ec2", to: "rds", label: "SQL" },
          { from: "ec2", to: "cache", label: "Cache" },
          { from: "ec2", to: "s3", label: "Assets" },
          { from: "ec2", to: "sqs", label: "Messages" }
        ]
      },
      costEstimate: 2847,
      recommendations: [
        "Implement Redis for session management to enable horizontal scaling",
        "Use S3 Transfer Acceleration for faster image uploads from global users",
        "Configure CloudWatch alarms for proactive monitoring and cost optimization",
        "Consider Reserved Instances for predictable baseline capacity to reduce costs",
        "Implement database connection pooling to optimize RDS performance",
        "Set up automated database snapshots before major deployments"
      ]
    };
  }

  if (isFileSharing) {
    return {
      title: "Secure Enterprise File Sharing Platform",
      description: "A HIPAA-compliant file sharing solution with end-to-end encryption, version control, and comprehensive audit logging. Built for enterprise security requirements.",
      awsServices: [
        {
          name: "Amazon S3",
          purpose: "Encrypted object storage for files with versioning and lifecycle management",
          configuration: "S3 Standard with server-side encryption (SSE-S3), versioning enabled"
        },
        {
          name: "AWS Lambda",
          purpose: "Serverless functions for file processing, thumbnails, and access control",
          configuration: "Node.js 18.x runtime, 1GB memory, 15 minute timeout"
        },
        {
          name: "Amazon API Gateway",
          purpose: "RESTful API for secure file operations with authentication",
          configuration: "REST API with API keys, throttling, and CORS configuration"
        },
        {
          name: "Amazon Cognito",
          purpose: "User authentication and authorization with MFA support",
          configuration: "User pool with MFA, custom attributes, and password policies"
        },
        {
          name: "Amazon DynamoDB",
          purpose: "NoSQL database for file metadata, permissions, and audit logs",
          configuration: "On-demand billing, global secondary indexes, encryption at rest"
        },
        {
          name: "AWS CloudTrail",
          purpose: "Comprehensive audit logging for all file access and operations",
          configuration: "Multi-region trail with S3 delivery, log file validation"
        }
      ],
      architecture: {
        components: [
          { id: "cognito", name: "Cognito Auth", type: "Authentication", position: { x: 50, y: 100 } },
          { id: "api", name: "API Gateway", type: "Gateway", position: { x: 200, y: 100 } },
          { id: "lambda", name: "Lambda Functions", type: "Function", position: { x: 350, y: 100 } },
          { id: "s3", name: "S3 Encrypted", type: "Storage", position: { x: 200, y: 220 } },
          { id: "dynamo", name: "DynamoDB", type: "Database", position: { x: 350, y: 220 } },
          { id: "trail", name: "CloudTrail", type: "Logging", position: { x: 500, y: 160 } }
        ],
        connections: [
          { from: "cognito", to: "api", label: "Auth" },
          { from: "api", to: "lambda", label: "Invoke" },
          { from: "lambda", to: "s3", label: "File Ops" },
          { from: "lambda", to: "dynamo", label: "Metadata" },
          { from: "lambda", to: "trail", label: "Audit" }
        ]
      },
      costEstimate: 890,
      recommendations: [
        "Enable S3 MFA Delete for additional protection of sensitive files",
        "Implement client-side encryption for maximum data protection",
        "Use S3 Intelligent Tiering to optimize storage costs automatically",
        "Set up CloudWatch dashboards for monitoring file access patterns",
        "Configure VPC endpoints to keep traffic within AWS network",
        "Implement data loss prevention (DLP) scanning for uploaded content"
      ]
    };
  }

  // Default general solution
  return {
    title: "AWS Solution Architecture",
    description: "A scalable and secure cloud architecture designed to meet your specific business requirements with AWS best practices and cost optimization in mind.",
    awsServices: [
      {
        name: "Amazon EC2",
        purpose: "Compute instances for application hosting and processing workloads",
        configuration: "t3.medium instances in Auto Scaling group across multiple AZs"
      },
      {
        name: "Amazon RDS",
        purpose: "Managed relational database service for structured data storage",
        configuration: "PostgreSQL 14, Multi-AZ deployment, automated backups enabled"
      },
      {
        name: "Amazon S3",
        purpose: "Object storage for static assets, backups, and file storage",
        configuration: "Standard storage with lifecycle policies and versioning"
      },
      {
        name: "Application Load Balancer",
        purpose: "Load distribution and high availability for web applications",
        configuration: "Internet-facing ALB with SSL termination and health checks"
      }
    ],
    architecture: {
      components: [
        { id: "alb", name: "Load Balancer", type: "Load Balancer", position: { x: 150, y: 80 } },
        { id: "ec2", name: "EC2 Instances", type: "Compute", position: { x: 300, y: 80 } },
        { id: "rds", name: "RDS Database", type: "Database", position: { x: 150, y: 180 } },
        { id: "s3", name: "S3 Storage", type: "Storage", position: { x: 300, y: 180 } }
      ],
      connections: [
        { from: "alb", to: "ec2", label: "HTTP" },
        { from: "ec2", to: "rds", label: "SQL" },
        { from: "ec2", to: "s3", label: "Files" }
      ]
    },
    costEstimate: 1250,
    recommendations: [
      "Consider using Reserved Instances for predictable workloads to reduce costs",
      "Implement CloudWatch monitoring for proactive performance optimization",
      "Set up automated backups and disaster recovery procedures",
      "Use AWS Config for compliance monitoring and configuration management"
    ]
  };
};

// Mock AI service functions
export async function generateAWSSolution(requirements: string): Promise<AWSSolutionResponse> {
  console.log('🤖 Mock AI: Generating AWS solution for:', requirements.substring(0, 50) + '...');
  
  // Simulate AI processing time
  await delay(2000 + Math.random() * 2000);
  
  const solution = generateMockSolution(requirements);
  console.log('✅ Mock AI: Generated solution:', solution.title);
  
  return solution;
}

export async function generateFlashcards(_solutionData: string, _count: number = 5) {
  await delay(1500);
  return [
    {
      front: "What is Amazon EC2 Auto Scaling?",
      back: "A service that automatically adjusts the number of EC2 instances based on demand, ensuring optimal performance and cost efficiency.",
      category: "Compute"
    },
    {
      front: "What is the purpose of CloudFront CDN?",
      back: "CloudFront is a content delivery network that delivers content to users with low latency by caching content at edge locations globally.",
      category: "Networking"
    }
  ];
}

export async function performWhatIfAnalysis(_solutionData: string, criteria: string[]) {
  await delay(2000);
  return {
    criteria,
    results: [
      {
        criterion: "Cost Optimization",
        impact: "High potential for savings through Reserved Instances and right-sizing",
        recommendation: "Implement cost monitoring and automated rightsizing recommendations",
        confidence: 85
      }
    ],
    summary: "Analysis complete with actionable optimization opportunities identified."
  };
}

export async function modifySolution(_currentSolution: string, modificationRequest: string) {
  await delay(1500);
  return generateMockSolution(modificationRequest);
}

export async function explainSolution(_solutionData: string) {
  await delay(1000);
  return "This AWS architecture provides a scalable, secure, and cost-effective solution for your business requirements...";
}