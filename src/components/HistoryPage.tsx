import { useState, useEffect } from 'react';
import { Card, CardContent, Button, Input, LoadingSpinner } from './ui';
import { useSolutionStore } from '@/stores/solutions';
import { Search, Clock, Star, Eye, Edit, Download } from 'lucide-react';
import type { Solution } from '@/types';

export function HistoryPage() {
  const { solutions, loadSolutions, isLoading } = useSolutionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<Solution[]>([]);

  // Load solutions on component mount
  useEffect(() => {
    loadSolutions();
  }, [loadSolutions]);

  // Filter and sort history
  useEffect(() => {
    let filtered = solutions;

    // Apply text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(solution =>
        solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by last accessed date (most recent first)
    filtered.sort((a, b) => {
      const aDate = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
      const bDate = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
      return bDate - aDate;
    });

    setFilteredHistory(filtered);
  }, [solutions, searchQuery]);

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewSolution = (solutionId: string) => {
    // TODO: Implement solution viewing functionality
    window.location.href = `/?solution=${solutionId}`;
  };

  const handleEditSolution = (solutionId: string) => {
    // TODO: Implement solution editing functionality
    window.location.href = `/?edit=${solutionId}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading history..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
          <p className="text-gray-600 mt-1">
            View and manage your recent AWS solution activities
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          New Solution
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-4">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No activity history
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'No activities match your search.' : 'Start creating solutions to see your activity history.'}
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Create Your First Solution
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((solution) => (
            <Card key={solution.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {solution.title}
                          </h3>
                          {solution.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            solution.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : solution.status === 'archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {solution.status || 'draft'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {solution.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            Created: {formatDate(solution.createdAt)}
                          </span>
                          <span>
                            Last accessed: {formatDate(solution.lastAccessedAt)}
                          </span>
                          {solution.costEstimate && (
                            <span>
                              Est. cost: ${solution.costEstimate}/month
                            </span>
                          )}
                        </div>
                        
                        {solution.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {JSON.parse(solution.tags).map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSolution(solution.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSolution(solution.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement export functionality
                        console.log('Export solution', solution.id);
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}