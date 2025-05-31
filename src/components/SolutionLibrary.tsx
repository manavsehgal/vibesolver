import { useState, useEffect } from 'react';
import { useSolutionStore } from '@/stores/solutions';
import { Card, CardContent, Button, Input, LoadingSpinner } from '@/components/ui';
import { SolutionCard } from './SolutionCard';
import { SolutionFilters } from './SolutionFilters';
import { ExportModal } from './ExportModal';
import { 
  Search, 
  Grid, 
  List, 
  Plus, 
  Download, 
  Filter,
  Star,
  Trash2,
  FolderPlus
} from 'lucide-react';
import type { Solution } from '@/types';

export function SolutionLibrary() {
  const {
    solutions,
    libraryView,
    isLoading,
    loadSolutions,
    setLibraryView,
    setSelectedSolutions,
    clearSelection,
    bulkDelete,
    toggleFavorite,
  } = useSolutionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filteredSolutions, setFilteredSolutions] = useState<Solution[]>(solutions);

  // Load solutions on component mount
  useEffect(() => {
    loadSolutions();
  }, [loadSolutions]);

  // Filter and search solutions
  useEffect(() => {
    let filtered = solutions;

    // Apply text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(solution =>
        solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (solution.tags && JSON.parse(solution.tags).some((tag: string) => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Apply filters
    const { filter } = libraryView;
    
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(solution => {
        const solutionTags = solution.tags ? JSON.parse(solution.tags) : [];
        return filter.tags!.some(tag => solutionTags.includes(tag));
      });
    }

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(solution => 
        filter.status!.includes(solution.status || 'draft')
      );
    }

    if (filter.costRange) {
      filtered = filtered.filter(solution => {
        const cost = solution.costEstimate || 0;
        return cost >= filter.costRange!.min && cost <= filter.costRange!.max;
      });
    }

    // Apply sorting
    const { sort } = libraryView;
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sort.field) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'costEstimate':
          aVal = a.costEstimate || 0;
          bVal = b.costEstimate || 0;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aVal = new Date(a.updatedAt);
          bVal = new Date(b.updatedAt);
          break;
        case 'lastAccessedAt':
          aVal = a.lastAccessedAt ? new Date(a.lastAccessedAt) : new Date(0);
          bVal = b.lastAccessedAt ? new Date(b.lastAccessedAt) : new Date(0);
          break;
        default:
          aVal = a.updatedAt;
          bVal = b.updatedAt;
      }

      if (sort.direction === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    setFilteredSolutions(filtered);
  }, [solutions, searchQuery, libraryView]);

  const handleSelectSolution = (id: string, selected: boolean) => {
    const currentSelection = libraryView.selectedIds;
    if (selected) {
      setSelectedSolutions([...currentSelection, id]);
    } else {
      setSelectedSolutions(currentSelection.filter(selectedId => selectedId !== id));
    }
  };

  // const handleSelectAll = () => {
  //   if (libraryView.selectedIds.length === filteredSolutions.length) {
  //     clearSelection();
  //   } else {
  //     setSelectedSolutions(filteredSolutions.map(s => s.id));
  //   }
  // };

  const handleBulkAction = async (action: string) => {
    const selectedIds = libraryView.selectedIds;
    
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedIds.length} solutions?`)) {
          try {
            await bulkDelete(selectedIds);
          } catch (error) {
            console.error('Failed to delete solutions:', error);
          }
        }
        break;
      case 'export':
        setShowExportModal(true);
        break;
      case 'favorite':
        selectedIds.forEach(id => toggleFavorite(id));
        break;
    }
  };

  const selectedCount = libraryView.selectedIds.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading solutions..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solution Library</h1>
          <p className="text-gray-600 mt-1">
            {solutions.length} solutions • {filteredSolutions.length} shown
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Solution
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search solutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          
          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLibraryView({ mode: 'grid' })}
              className={`rounded-r-none ${libraryView.mode === 'grid' ? 'bg-blue-50' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLibraryView({ mode: 'list' })}
              className={`rounded-l-none ${libraryView.mode === 'list' ? 'bg-blue-50' : ''}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <SolutionFilters />
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedCount} solution{selectedCount > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('favorite')}
            >
              <Star className="w-4 h-4 mr-1" />
              Favorite
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('export')}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('delete')}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Solutions Grid/List */}
      {filteredSolutions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-4">
              <FolderPlus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No solutions found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search terms or filters.' : 'Get started by creating your first AWS solution.'}
            </p>
            <Button onClick={() => window.location.href = '/'}>
              <Plus className="w-4 h-4 mr-2" />
              Create Solution
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          libraryView.mode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredSolutions.map((solution) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
              mode={libraryView.mode}
              selected={libraryView.selectedIds.includes(solution.id)}
              onSelect={(selected) => handleSelectSolution(solution.id, selected)}
              onToggleFavorite={() => toggleFavorite(solution.id)}
            />
          ))}
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          solutionIds={libraryView.selectedIds}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}