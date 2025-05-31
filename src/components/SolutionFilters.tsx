import { useState } from 'react';
import { useSolutionStore } from '@/stores/solutions';
import { Button, Input } from '@/components/ui';
import { X, Calendar, DollarSign, Tag as TagIcon, Settings } from 'lucide-react';

export function SolutionFilters() {
  const {
    libraryView,
    solutions,
    setFilter,
    setSort,
  } = useSolutionStore();

  const [localFilter, setLocalFilter] = useState(libraryView.filter);

  // Get all unique tags from solutions
  const allTags = Array.from(new Set(
    solutions.flatMap(solution => 
      solution.tags ? JSON.parse(solution.tags) : []
    )
  ));

  // Get all unique AWS services
  const allServices = Array.from(new Set(
    solutions.flatMap(solution => {
      const services = solution.awsServices ? JSON.parse(solution.awsServices) : [];
      return Array.isArray(services) ? services.map(s => s.name || s) : [];
    })
  ));

  const applyFilters = () => {
    setFilter(localFilter);
  };

  const clearFilters = () => {
    const emptyFilter = {};
    setLocalFilter(emptyFilter);
    setFilter(emptyFilter);
  };

  const updateLocalFilter = (key: string, value: any) => {
    setLocalFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayFilter = (key: 'tags' | 'status' | 'awsServices', value: string) => {
    const currentArray = localFilter[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateLocalFilter(key, newArray.length > 0 ? newArray : undefined);
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-blue-100 text-blue-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' },
  ];

  const sortOptions = [
    { value: 'updatedAt-desc', label: 'Recently Updated' },
    { value: 'createdAt-desc', label: 'Recently Created' },
    { value: 'title-asc', label: 'Name (A-Z)' },
    { value: 'title-desc', label: 'Name (Z-A)' },
    { value: 'costEstimate-asc', label: 'Cost (Low to High)' },
    { value: 'costEstimate-desc', label: 'Cost (High to Low)' },
    { value: 'lastAccessedAt-desc', label: 'Recently Accessed' },
  ];

  const activeFilterCount = Object.keys(localFilter).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <div className="flex gap-2">
          <Button
            onClick={applyFilters}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters
          </Button>
          {activeFilterCount > 0 && (
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
            >
              Clear All ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Settings className="w-4 h-4 inline mr-1" />
            Sort By
          </label>
          <select
            value={`${libraryView.sort.field}-${libraryView.sort.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSort({ 
                field: field as any, 
                direction: direction as 'asc' | 'desc' 
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="space-y-2">
            {statusOptions.map(status => (
              <label key={status.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(localFilter.status || []).includes(status.value)}
                  onChange={() => toggleArrayFilter('status', status.value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cost Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Monthly Cost Range
          </label>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min cost"
              value={localFilter.costRange?.min || ''}
              onChange={(e) => updateLocalFilter('costRange', {
                ...localFilter.costRange,
                min: e.target.value ? parseInt(e.target.value) : undefined
              })}
            />
            <Input
              type="number"
              placeholder="Max cost"
              value={localFilter.costRange?.max || ''}
              onChange={(e) => updateLocalFilter('costRange', {
                ...localFilter.costRange,
                max: e.target.value ? parseInt(e.target.value) : undefined
              })}
            />
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TagIcon className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {allTags.map(tag => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(localFilter.tags || []).includes(tag)}
                    onChange={() => toggleArrayFilter('tags', tag)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* AWS Services */}
        {allServices.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AWS Services
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {allServices.slice(0, 10).map(service => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(localFilter.awsServices || []).includes(service)}
                    onChange={() => toggleArrayFilter('awsServices', service)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
              {allServices.length > 10 && (
                <p className="text-xs text-gray-500">
                  +{allServices.length - 10} more services
                </p>
              )}
            </div>
          </div>
        )}

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date Range
          </label>
          <div className="space-y-2">
            <Input
              type="date"
              value={localFilter.dateRange?.start ? localFilter.dateRange.start.toISOString().split('T')[0] : ''}
              onChange={(e) => updateLocalFilter('dateRange', {
                ...localFilter.dateRange,
                start: e.target.value ? new Date(e.target.value) : undefined
              })}
            />
            <Input
              type="date"
              value={localFilter.dateRange?.end ? localFilter.dateRange.end.toISOString().split('T')[0] : ''}
              onChange={(e) => updateLocalFilter('dateRange', {
                ...localFilter.dateRange,
                end: e.target.value ? new Date(e.target.value) : undefined
              })}
            />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {localFilter.status?.map(status => (
              <span
                key={`status-${status}`}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                Status: {status}
                <button
                  onClick={() => toggleArrayFilter('status', status)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {localFilter.tags?.map(tag => (
              <span
                key={`tag-${tag}`}
                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {tag}
                <button
                  onClick={() => toggleArrayFilter('tags', tag)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {localFilter.costRange && (
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Cost: ${localFilter.costRange.min || 0} - ${localFilter.costRange.max || '∞'}
                <button
                  onClick={() => updateLocalFilter('costRange', undefined)}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}