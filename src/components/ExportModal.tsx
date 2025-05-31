import { useState } from 'react';
import { Modal, Button, Card, CardContent } from '@/components/ui';
import { Download, FileText, Image, Code, File, Settings } from 'lucide-react';
import { useSolutionStore } from '@/stores/solutions';
import { exportService } from '@/lib/export';
import type { ExportFormat, ExportOptions } from '@/types';

interface ExportModalProps {
  solutionIds: string[];
  onClose: () => void;
}

export function ExportModal({ solutionIds, onClose }: ExportModalProps) {
  const { solutions } = useSolutionStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeArchitecture: true,
    includeDetails: true,
    includeRecommendations: true,
    includeCostAnalysis: true,
    quality: 'high',
    pageSize: 'A4',
    orientation: 'portrait',
  });
  const [isExporting, setIsExporting] = useState(false);
  
  // Get selected solutions
  const selectedSolutions = solutions.filter(s => solutionIds.includes(s.id));

  const exportFormats = [
    {
      id: 'pdf' as ExportFormat,
      name: 'PDF Report',
      description: 'Professional documentation with all solution details',
      icon: FileText,
      color: 'text-red-600 bg-red-50',
    },
    {
      id: 'png' as ExportFormat,
      name: 'PNG Image',
      description: 'High-quality architecture diagram image',
      icon: Image,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'svg' as ExportFormat,
      name: 'SVG Diagram',
      description: 'Scalable vector architecture diagram',
      icon: Image,
      color: 'text-green-600 bg-green-50',
    },
    {
      id: 'json' as ExportFormat,
      name: 'JSON Data',
      description: 'Complete solution data for API integration',
      icon: Code,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'yaml' as ExportFormat,
      name: 'YAML Config',
      description: 'Configuration format for infrastructure tools',
      icon: File,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      id: 'terraform' as ExportFormat,
      name: 'Terraform',
      description: 'Infrastructure as Code templates',
      icon: Code,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let result;
      
      switch (selectedFormat) {
        case 'pdf':
          result = await exportService.exportToPDF(selectedSolutions, options);
          break;
        case 'json':
          result = await exportService.exportToJSON(selectedSolutions);
          break;
        case 'yaml':
          result = await exportService.exportToYAML(selectedSolutions);
          break;
        case 'terraform':
          result = await exportService.exportToTerraform(selectedSolutions);
          break;
        case 'markdown':
          result = await exportService.exportToMarkdown(selectedSolutions);
          break;
        case 'png':
        case 'svg': {
          // For image exports, we need the architecture element
          const architectureElement = document.querySelector('[data-architecture-canvas]') as HTMLElement;
          if (architectureElement) {
            result = await exportService.exportArchitectureToImage(architectureElement, selectedFormat, options);
          } else {
            throw new Error('Architecture diagram not found');
          }
          break;
        }
        default:
          throw new Error(`Unsupported export format: ${selectedFormat}`);
      }
      
      if (result.success) {
        console.log(`Successfully exported ${solutionIds.length} solutions as ${selectedFormat}:`, result.filename);
        onClose();
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Download className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Export Solutions
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Export {solutionIds.length} solution{solutionIds.length > 1 ? 's' : ''} in your preferred format.
        </p>

        {/* Format Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Export Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <div
                  key={format.id}
                  className={`cursor-pointer transition-all border rounded-lg ${
                    selectedFormat === format.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedFormat(format.id);
                    updateOption('format', format.id);
                  }}
                >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${format.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {format.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {format.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Options */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Export Options
          </h3>
          
          <div className="space-y-4">
            {/* Content Options */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Include Content</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeArchitecture}
                    onChange={(e) => updateOption('includeArchitecture', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Architecture Diagram</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeDetails}
                    onChange={(e) => updateOption('includeDetails', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Solution Details</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeRecommendations}
                    onChange={(e) => updateOption('includeRecommendations', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Recommendations</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeCostAnalysis}
                    onChange={(e) => updateOption('includeCostAnalysis', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Cost Analysis</span>
                </label>
              </div>
            </div>

            {/* Format-specific Options */}
            {(selectedFormat === 'pdf') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Size
                  </label>
                  <select
                    value={options.pageSize}
                    onChange={(e) => updateOption('pageSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orientation
                  </label>
                  <select
                    value={options.orientation}
                    onChange={(e) => updateOption('orientation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            )}

            {(selectedFormat === 'png' || selectedFormat === 'svg') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality
                </label>
                <select
                  value={options.quality}
                  onChange={(e) => updateOption('quality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low (Faster)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Slower)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}