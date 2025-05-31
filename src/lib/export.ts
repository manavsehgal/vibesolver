import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { 
  Solution, 
  ExportOptions, 
  ExportResult, 
  AWSService
} from '@/types';

export class ExportService {
  
  /**
   * Export solutions to PDF format
   */
  async exportToPDF(
    solutions: Solution[], 
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.pageSize || 'a4'
      });

      let yPosition = 20;
      
      for (let i = 0; i < solutions.length; i++) {
        const solution = solutions[i];
        
        if (i > 0) {
          pdf.addPage();
          yPosition = 20;
        }
        
        yPosition = await this.addSolutionToPDF(pdf, solution, options, yPosition);
      }

      const filename = `vibesolver-solutions-${new Date().toISOString().split('T')[0]}.pdf`;
      const pdfBlob = pdf.output('blob');
      
      // Trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        filename,
        data: pdfBlob
      };
    } catch (error) {
      console.error('PDF export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export architecture diagram to image
   */
  async exportArchitectureToImage(
    element: HTMLElement,
    format: 'png' | 'svg',
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      if (format === 'png') {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: options.quality === 'high' ? 2 : options.quality === 'medium' ? 1.5 : 1,
          useCORS: true,
          allowTaint: true
        });

        const filename = `vibesolver-architecture-${Date.now()}.png`;
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');

        return {
          success: true,
          filename
        };
      } else {
        // SVG export - clone the element and serialize
        const svgElement = this.convertToSVG(element);
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        
        const filename = `vibesolver-architecture-${Date.now()}.svg`;
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return {
          success: true,
          filename,
          data: blob
        };
      }
    } catch (error) {
      console.error('Image export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export solutions to JSON format
   */
  async exportToJSON(solutions: Solution[]): Promise<ExportResult> {
    try {
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0',
          count: solutions.length,
          generator: 'VibeSolver'
        },
        solutions: solutions.map(solution => ({
          ...solution,
          awsServices: solution.awsServices ? JSON.parse(solution.awsServices) : [],
          architecture: solution.architecture ? JSON.parse(solution.architecture) : null,
          recommendations: solution.recommendations ? JSON.parse(solution.recommendations) : [],
          tags: solution.tags ? JSON.parse(solution.tags) : []
        }))
      };

      const filename = `vibesolver-export-${Date.now()}.json`;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        filename,
        data: blob
      };
    } catch (error) {
      console.error('JSON export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export solutions to YAML format
   */
  async exportToYAML(solutions: Solution[]): Promise<ExportResult> {
    try {
      const yamlContent = solutions.map(solution => {
        const awsServices = solution.awsServices ? JSON.parse(solution.awsServices) : [];
        const recommendations = solution.recommendations ? JSON.parse(solution.recommendations) : [];
        const tags = solution.tags ? JSON.parse(solution.tags) : [];

        return `---
name: "${solution.title}"
description: "${solution.description}"
status: ${solution.status || 'draft'}
cost_estimate: ${solution.costEstimate || 0}
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
aws_services:
${awsServices.map((service: AWSService) => `  - name: "${service.name}"
    purpose: "${service.purpose}"
    configuration: "${service.configuration}"`).join('\n')}
recommendations:
${recommendations.map((rec: string) => `  - "${rec}"`).join('\n')}
created_at: "${solution.createdAt}"
updated_at: "${solution.updatedAt}"
`;
      }).join('\n');

      const filename = `vibesolver-export-${Date.now()}.yaml`;
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        filename,
        data: blob
      };
    } catch (error) {
      console.error('YAML export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export solutions to Terraform format
   */
  async exportToTerraform(solutions: Solution[]): Promise<ExportResult> {
    try {
      const terraformContent = solutions.map(solution => {
        const awsServices = solution.awsServices ? JSON.parse(solution.awsServices) : [];
        
        return `# ${solution.title}
# ${solution.description}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

# Resources for ${solution.title}
${awsServices.map((service: AWSService) => this.generateTerraformResource(service)).join('\n\n')}

# Outputs
output "solution_info" {
  value = {
    name = "${solution.title}"
    description = "${solution.description}"
    cost_estimate = ${solution.costEstimate || 0}
  }
}
`;
      }).join('\n\n');

      const filename = `vibesolver-terraform-${Date.now()}.tf`;
      const blob = new Blob([terraformContent], { type: 'text/plain' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        filename,
        data: blob
      };
    } catch (error) {
      console.error('Terraform export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Export solutions to Markdown format
   */
  async exportToMarkdown(solutions: Solution[]): Promise<ExportResult> {
    try {
      const markdownContent = solutions.map(solution => {
        const awsServices = solution.awsServices ? JSON.parse(solution.awsServices) : [];
        const recommendations = solution.recommendations ? JSON.parse(solution.recommendations) : [];
        const tags = solution.tags ? JSON.parse(solution.tags) : [];

        return `# ${solution.title}

${solution.description}

## Overview

- **Status**: ${solution.status || 'Draft'}
- **Cost Estimate**: $${solution.costEstimate || 'TBD'}/month
- **Created**: ${new Date(solution.createdAt).toLocaleDateString()}
- **Last Updated**: ${new Date(solution.updatedAt).toLocaleDateString()}
- **Tags**: ${tags.join(', ') || 'None'}

## AWS Services

${awsServices.map((service: AWSService) => `### ${service.name}

**Purpose**: ${service.purpose}

**Configuration**: ${service.configuration}
`).join('\n')}

## Recommendations

${recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

---
`;
      }).join('\n');

      const filename = `vibesolver-documentation-${Date.now()}.md`;
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        filename,
        data: blob
      };
    } catch (error) {
      console.error('Markdown export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async addSolutionToPDF(
    pdf: jsPDF, 
    solution: Solution, 
    options: ExportOptions, 
    yPosition: number
  ): Promise<number> {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(solution.title, margin, yPosition);
    yPosition += lineHeight * 2;
    
    // Description
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const descriptionLines = pdf.splitTextToSize(solution.description, pageWidth - margin * 2);
    pdf.text(descriptionLines, margin, yPosition);
    yPosition += descriptionLines.length * lineHeight + 10;
    
    // Details section
    if (options.includeDetails) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Solution Details', margin, yPosition);
      yPosition += lineHeight * 1.5;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Status: ${solution.status || 'Draft'}`, margin, yPosition);
      yPosition += lineHeight;
      
      pdf.text(`Cost Estimate: $${solution.costEstimate || 'TBD'}/month`, margin, yPosition);
      yPosition += lineHeight;
      
      pdf.text(`Created: ${new Date(solution.createdAt).toLocaleDateString()}`, margin, yPosition);
      yPosition += lineHeight + 5;
    }
    
    // AWS Services
    const awsServices = solution.awsServices ? JSON.parse(solution.awsServices) : [];
    if (awsServices.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AWS Services', margin, yPosition);
      yPosition += lineHeight * 1.5;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      awsServices.forEach((service: AWSService) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`• ${service.name}`, margin, yPosition);
        yPosition += lineHeight;
        
        pdf.setFont('helvetica', 'normal');
        const purposeLines = pdf.splitTextToSize(`  Purpose: ${service.purpose}`, pageWidth - margin * 2 - 10);
        pdf.text(purposeLines, margin + 5, yPosition);
        yPosition += purposeLines.length * lineHeight;
        
        const configLines = pdf.splitTextToSize(`  Configuration: ${service.configuration}`, pageWidth - margin * 2 - 10);
        pdf.text(configLines, margin + 5, yPosition);
        yPosition += configLines.length * lineHeight + 3;
      });
      
      yPosition += 5;
    }
    
    // Recommendations
    if (options.includeRecommendations) {
      const recommendations = solution.recommendations ? JSON.parse(solution.recommendations) : [];
      if (recommendations.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Recommendations', margin, yPosition);
        yPosition += lineHeight * 1.5;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        recommendations.forEach((rec: string, index: number) => {
          const recLines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - margin * 2);
          pdf.text(recLines, margin, yPosition);
          yPosition += recLines.length * lineHeight + 2;
        });
      }
    }
    
    return yPosition;
  }

  private convertToSVG(element: HTMLElement): SVGElement {
    // Create SVG wrapper
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rect = element.getBoundingClientRect();
    
    svg.setAttribute('width', rect.width.toString());
    svg.setAttribute('height', rect.height.toString());
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Convert HTML to foreignObject in SVG
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    
    const clonedElement = element.cloneNode(true) as HTMLElement;
    foreignObject.appendChild(clonedElement);
    svg.appendChild(foreignObject);
    
    return svg;
  }

  private generateTerraformResource(service: AWSService): string {
    const serviceName = service.name.toLowerCase().replace(/\s+/g, '_');
    
    // Basic resource mapping for common AWS services
    const resourceMappings: Record<string, string> = {
      'ec2': 'aws_instance',
      'rds': 'aws_db_instance',
      's3': 'aws_s3_bucket',
      'lambda': 'aws_lambda_function',
      'api_gateway': 'aws_api_gateway_rest_api',
      'cloudfront': 'aws_cloudfront_distribution',
      'elb': 'aws_lb',
      'vpc': 'aws_vpc',
      'iam': 'aws_iam_role'
    };
    
    const resourceType = resourceMappings[serviceName] || 'aws_resource';
    
    return `# ${service.name}
resource "${resourceType}" "${serviceName}" {
  # ${service.purpose}
  # Configuration: ${service.configuration}
  
  tags = {
    Name        = "\${var.environment}-${serviceName}"
    Environment = var.environment
    ManagedBy   = "VibeSolver"
  }
}`;
  }
}

// Export singleton instance
export const exportService = new ExportService();