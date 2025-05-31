import React, { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { ExportModal } from './ExportModal';
import { useToast } from '@/hooks/useToast';
import { 
  Star, 
  Clock, 
  DollarSign, 
  Tag as TagIcon, 
  Eye,
  Download,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import type { Solution } from '@/types';

interface SolutionCardProps {
  solution: Solution;
  mode: 'grid' | 'list';
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onToggleFavorite: () => void;
}

export function SolutionCard({ 
  solution, 
  mode, 
  selected, 
  onSelect, 
  onToggleFavorite 
}: SolutionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const { showToast } = useToast();
  
  const tags = solution.tags ? JSON.parse(solution.tags) : [];
  const awsServices = solution.awsServices ? JSON.parse(solution.awsServices) : [];
  const serviceCount = Array.isArray(awsServices) ? awsServices.length : 0;

  const formatDate = (date: Date | string | number) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cost);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) {
      return;
    }
    
    // Navigate to solution view with URL parameter
    window.location.href = `/?solution=${solution.id}`;
  };


  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/?solution=${solution.id}`;
      const shareData = {
        title: solution.title,
        text: solution.description,
        url: shareUrl
      };

      // Try native Web Share API first
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        showToast({
          type: 'success',
          title: 'Shared Successfully',
          message: 'Solution shared successfully'
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        showToast({
          type: 'success',
          title: 'Link Copied',
          message: 'Solution link copied to clipboard'
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        showToast({
          type: 'error',
          title: 'Share Failed',
          message: 'Failed to share solution. Please try again.'
        });
      }
    }
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'edit':
        window.location.href = `/?edit=${solution.id}`;
        break;
      case 'duplicate':
        // TODO: Implement duplicate
        break;
      case 'export':
        setShowExportModal(true);
        break;
      case 'share':
        handleShare();
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this solution?')) {
          // TODO: Implement delete
        }
        break;
    }
  };

  if (mode === 'list') {
    return (
      <Card className={`transition-all ${selected ? 'ring-2 ring-blue-500' : ''} hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            
            <div 
              className="flex-1 cursor-pointer" 
              onClick={handleCardClick}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {solution.title}
                    </h3>
                    {solution.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                      solution.status === 'active' ? 'bg-green-100 text-green-800' :
                      solution.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {solution.status || 'draft'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {solution.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(solution.updatedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {solution.costEstimate ? formatCost(solution.costEstimate) : 'TBD'}
                    </span>
                    <span>{serviceCount} services</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                  >
                    <Star className={`w-4 h-4 ${solution.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </Button>
                  
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    
                    {showMenu && (
                      <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleMenuAction('edit')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleMenuAction('duplicate')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleMenuAction('export')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                          <button
                            onClick={() => handleMenuAction('share')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => handleMenuAction('delete')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="flex items-center gap-2 mt-3 ml-8">
              <TagIcon className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Export Modal */}
        {showExportModal && (
          <ExportModal
            solutionIds={[solution.id]}
            onClose={() => setShowExportModal(false)}
          />
        )}
      </Card>
    );
  }

  // Grid mode
  return (
    <Card className={`transition-all ${selected ? 'ring-2 ring-blue-500' : ''} hover:shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
            >
              <Star className={`w-4 h-4 ${solution.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleMenuAction('edit')}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleMenuAction('duplicate')}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleMenuAction('export')}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={() => handleMenuAction('share')}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => handleMenuAction('delete')}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div 
          className="cursor-pointer" 
          onClick={handleCardClick}
        >
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {solution.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
              solution.status === 'active' ? 'bg-green-100 text-green-800' :
              solution.status === 'archived' ? 'bg-gray-100 text-gray-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {solution.status || 'draft'}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {solution.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(solution.updatedAt)}
              </span>
              <span>{serviceCount} services</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-500">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-gray-900">
                  {solution.costEstimate ? formatCost(solution.costEstimate) : 'TBD'}
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(e);
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          solutionIds={[solution.id]}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </Card>
  );
}