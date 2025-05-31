import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, Button, LoadingSpinner } from './ui';
import { type FlashcardResponse } from '@/types';

interface FlashcardViewerProps {
  flashcards: FlashcardResponse[];
  onClose: () => void;
  onRateCard?: (index: number, difficulty: 'easy' | 'medium' | 'hard') => void;
}

export function FlashcardViewer({ flashcards, onClose, onRateCard }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, flashcards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleRate = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    onRateCard?.(currentIndex, difficulty);
    setCompletedCards(prev => new Set(prev).add(currentIndex));
    
    // Auto-advance if not on last card
    if (currentIndex < flashcards.length - 1) {
      setTimeout(handleNext, 500);
    }
  }, [currentIndex, onRateCard, handleNext, flashcards.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        handleFlip();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlePrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNext();
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [handleFlip, handleNext, handlePrevious, onClose]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentCard) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Flashcard Study Session
              </h2>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                {currentCard.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close flashcard viewer"
            >
              ✕
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Card {currentIndex + 1} of {flashcards.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="p-6">
          <div
            className="relative w-full h-80 cursor-pointer perspective-1000"
            onClick={handleFlip}
          >
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of card */}
              <Card className="absolute inset-0 w-full h-full backface-hidden border-2 border-blue-200">
                <CardContent className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-4">Question</div>
                    <p className="text-lg text-gray-900 leading-relaxed">
                      {currentCard.front}
                    </p>
                    <div className="mt-6 text-sm text-gray-400">
                      Click to reveal answer • Space/Enter to flip
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Back of card */}
              <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 border-2 border-green-200">
                <CardContent className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-4">Answer</div>
                    <p className="text-lg text-gray-900 leading-relaxed whitespace-pre-line">
                      {currentCard.back}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Rating buttons (only show when flipped) */}
          {isFlipped && onRateCard && (
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => handleRate('easy')}
                className={`border-green-300 text-green-700 hover:bg-green-50 ${
                  completedCards.has(currentIndex) ? 'opacity-50' : ''
                }`}
                disabled={completedCards.has(currentIndex)}
              >
                😊 Easy
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRate('medium')}
                className={`border-yellow-300 text-yellow-700 hover:bg-yellow-50 ${
                  completedCards.has(currentIndex) ? 'opacity-50' : ''
                }`}
                disabled={completedCards.has(currentIndex)}
              >
                🤔 Medium
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRate('hard')}
                className={`border-red-300 text-red-700 hover:bg-red-50 ${
                  completedCards.has(currentIndex) ? 'opacity-50' : ''
                }`}
                disabled={completedCards.has(currentIndex)}
              >
                😓 Hard
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Use arrow keys to navigate • Space to flip
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FlashcardGeneratorProps {
  onFlashcardsGenerated: (flashcards: FlashcardResponse[]) => void;
  onClose: () => void;
  isGenerating?: boolean;
}

export function FlashcardGenerator({
  onFlashcardsGenerated,
  onClose,
  isGenerating = false
}: FlashcardGeneratorProps) {
  const [cardCount, setCardCount] = useState(5);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'services',
    'security',
    'best-practices'
  ]);

  const topics = [
    { id: 'services', label: 'AWS Services', description: 'Service purposes and configurations' },
    { id: 'security', label: 'Security', description: 'Security best practices and considerations' },
    { id: 'cost', label: 'Cost Optimization', description: 'Cost-effective solutions and optimization' },
    { id: 'best-practices', label: 'Best Practices', description: 'AWS Well-Architected principles' },
    { id: 'troubleshooting', label: 'Troubleshooting', description: 'Common issues and solutions' }
  ];

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleGenerate = () => {
    if (selectedTopics.length > 0) {
      onFlashcardsGenerated([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Generate Flashcards
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isGenerating}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Card count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Flashcards
            </label>
            <select
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            >
              <option value={3}>3 cards</option>
              <option value={5}>5 cards</option>
              <option value={10}>10 cards</option>
              <option value={15}>15 cards</option>
            </select>
          </div>

          {/* Topic selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Topics to Include
            </label>
            <div className="space-y-2">
              {topics.map(topic => (
                <label
                  key={topic.id}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic.id)}
                    onChange={() => handleTopicToggle(topic.id)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isGenerating}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {topic.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      {topic.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {isGenerating && (
            <div className="text-center py-4">
              <LoadingSpinner size="md" text="Generating flashcards..." />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={selectedTopics.length === 0 || isGenerating}
          >
            Generate Flashcards
          </Button>
        </div>
      </div>
    </div>
  );
}