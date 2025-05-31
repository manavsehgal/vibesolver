import { useState, type ReactNode } from 'react';
import { Card, CardContent, Input, Button } from './ui';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Keyboard, 
  Video, 
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  content: string[];
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using VibeSolver',
    icon: <Book className="w-5 h-5" />,
    content: [
      'Enter your business requirements in natural language',
      'VibeSolver will generate a comprehensive AWS solution',
      'View the architecture diagram and service recommendations',
      'Save solutions to your library for future reference',
      'Generate flashcards to learn about the AWS services used'
    ]
  },
  {
    id: 'features',
    title: 'Features Guide',
    description: 'Explore all VibeSolver capabilities',
    icon: <FileText className="w-5 h-5" />,
    content: [
      'Solution Generation: Create AWS architectures from requirements',
      'Architecture Visualization: Interactive diagrams with drag and pan',
      'Flashcard Learning: Generate study cards for AWS services',
      'What-If Analysis: Analyze solutions for cost, performance, security',
      'Solution Modification: Update existing solutions with AI assistance',
      'Solution Library: Save, organize, and manage your solutions',
      'Export Options: Export solutions as PDF, images, and code templates'
    ]
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Speed up your workflow with shortcuts',
    icon: <Keyboard className="w-5 h-5" />,
    content: [
      'Ctrl/Cmd + N: Create new solution',
      'Ctrl/Cmd + S: Save current solution',
      'Ctrl/Cmd + L: Open solution library',
      'Ctrl/Cmd + H: Open history',
      'Ctrl/Cmd + /: Open this help',
      'Space: Flip flashcard (when viewing flashcards)',
      'Escape: Close modal or dialog',
      'Arrow keys: Navigate architecture diagram'
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: <MessageCircle className="w-5 h-5" />,
    content: [
      'If solutions aren\'t generating, check your internet connection',
      'Clear browser cache if the app behaves unexpectedly',
      'Ensure JavaScript is enabled in your browser',
      'For architecture diagram issues, try the "Redraw" button',
      'Solutions not saving? Check if local storage is enabled',
      'If flashcards aren\'t working, try refreshing the page'
    ]
  }
];

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Documentation</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about using VibeSolver to create amazing AWS solutions
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Video className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600 mb-3">
              Watch step-by-step guides
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get help from our team
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="w-4 h-4 mr-1" />
              Contact Us
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">API Documentation</h3>
            <p className="text-sm text-gray-600 mb-3">
              Integration guides
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Sections */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No help topics found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse all topics below.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => setSelectedSection(
                    selectedSection === section.id ? null : section.id
                  )}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {section.title}
                        </h3>
                        <p className="text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        selectedSection === section.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </button>
                
                {selectedSection === section.id && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4 space-y-3">
                      {section.content.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Footer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Need More Help?
          </h3>
          <p className="text-blue-700 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              <ExternalLink className="w-4 h-4 mr-2" />
              Feature Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}