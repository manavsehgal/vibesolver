import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui';
import { type Architecture, type ArchitectureComponent } from '@/types';

interface ArchitectureVisualizationProps {
  architecture: Architecture;
  className?: string;
}

export function ArchitectureVisualization({ 
  architecture, 
  className = '' 
}: ArchitectureVisualizationProps) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [components, setComponents] = useState<ArchitectureComponent[]>(architecture.components);
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Update components when architecture changes
  useEffect(() => {
    setComponents(architecture.components);
  }, [architecture.components]);
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.1, scale + delta), 5);
    setScale(newScale);
  }, [scale]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setSelectedComponents(new Set());
    }
  }, [pan]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const resetView = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);
  
  const zoomIn = useCallback(() => setScale(prev => Math.min(prev * 1.2, 5)), []);
  const zoomOut = useCallback(() => setScale(prev => Math.max(prev / 1.2, 0.1)), []);
  
  const fitToScreen = useCallback(() => {
    if (components.length === 0) return;
    
    const minX = Math.min(...components.map(c => c.position.x));
    const maxX = Math.max(...components.map(c => c.position.x + 128));
    const minY = Math.min(...components.map(c => c.position.y));
    const maxY = Math.max(...components.map(c => c.position.y + 64));
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const scaleX = (canvasRect.width - 100) / contentWidth;
      const scaleY = (canvasRect.height - 100) / contentHeight;
      const newScale = Math.min(scaleX, scaleY, 5);
      
      setScale(newScale);
      setPan({
        x: (canvasRect.width - contentWidth * newScale) / 2 - minX * newScale,
        y: (canvasRect.height - contentHeight * newScale) / 2 - minY * newScale
      });
    }
  }, [components]);

  const redrawLayout = useCallback(() => {
    if (components.length === 0) return;
    
    // Simple grid layout algorithm
    const gridSize = Math.ceil(Math.sqrt(components.length));
    const spacing = 180;
    
    const newComponents = components.map((component, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      return {
        ...component,
        position: {
          x: col * spacing + 50,
          y: row * spacing + 50
        }
      };
    });
    
    setComponents(newComponents);
    
    // Auto-fit after redraw
    setTimeout(() => {
      fitToScreen();
    }, 100);
  }, [components, fitToScreen]);
  
  const handleComponentDrag = useCallback((componentId: string, newPosition: { x: number; y: number }) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId ? { ...comp, position: newPosition } : comp
    ));
  }, []);
  
  const handleComponentSelect = useCallback((componentId: string, multiSelect: boolean = false) => {
    setSelectedComponents(prev => {
      const newSet = new Set(prev);
      if (multiSelect) {
        if (newSet.has(componentId)) {
          newSet.delete(componentId);
        } else {
          newSet.add(componentId);
        }
      } else {
        newSet.clear();
        newSet.add(componentId);
      }
      return newSet;
    });
  }, []);
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Architecture Diagram</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={zoomOut}>−</Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={zoomIn}>+</Button>
            <Button variant="outline" size="sm" onClick={fitToScreen}>Fit</Button>
            <Button variant="outline" size="sm" onClick={redrawLayout}>Redraw</Button>
            <Button variant="outline" size="sm" onClick={resetView}>Reset</Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={canvasRef}
          className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="absolute inset-0 transition-transform"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
            }}
          >
            {/* Grid background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Connections */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              {architecture.connections.map((connection, index) => {
                const fromComponent = components.find(c => c.id === connection.from);
                const toComponent = components.find(c => c.id === connection.to);
                
                if (!fromComponent || !toComponent) return null;
                
                return (
                  <ConnectionLine
                    key={index}
                    from={{ x: fromComponent.position.x + 64, y: fromComponent.position.y + 32 }}
                    to={{ x: toComponent.position.x + 64, y: toComponent.position.y + 32 }}
                    label={connection.label}
                  />
                );
              })}
            </svg>
            
            {/* Components */}
            {components.map((component) => (
              <DraggableArchitectureComponent
                key={component.id}
                component={component}
                isSelected={selectedComponents.has(component.id)}
                onDrag={handleComponentDrag}
                onSelect={handleComponentSelect}
                scale={scale}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DraggableArchitectureComponentProps {
  component: ArchitectureComponent;
  isSelected: boolean;
  onDrag: (componentId: string, newPosition: { x: number; y: number }) => void;
  onSelect: (componentId: string, multiSelect: boolean) => void;
  scale: number;
}

function DraggableArchitectureComponent({ 
  component, 
  isSelected, 
  onDrag, 
  onSelect, 
  scale 
}: DraggableArchitectureComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const getComponentIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('database') || t.includes('rds')) return '🗄️';
    if (t.includes('storage') || t.includes('s3')) return '🪣';
    if (t.includes('compute') || t.includes('ec2')) return '🖥️';
    if (t.includes('function') || t.includes('lambda')) return '⚡';
    if (t.includes('gateway') || t.includes('api')) return '🌐';
    if (t.includes('cache')) return '💾';
    if (t.includes('queue')) return '📬';
    if (t.includes('notification')) return '📢';
    if (t.includes('cdn') || t.includes('cloudfront')) return '🌍';
    if (t.includes('load balancer')) return '⚖️';
    return '☁️';
  };
  
  const getComponentColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('database')) return 'bg-orange-100 border-orange-300 text-orange-800';
    if (t.includes('storage')) return 'bg-green-100 border-green-300 text-green-800';
    if (t.includes('compute')) return 'bg-blue-100 border-blue-300 text-blue-800';
    if (t.includes('function')) return 'bg-purple-100 border-purple-300 text-purple-800';
    if (t.includes('gateway')) return 'bg-indigo-100 border-indigo-300 text-indigo-800';
    if (t.includes('cache')) return 'bg-red-100 border-red-300 text-red-800';
    return 'bg-gray-100 border-gray-300 text-gray-800';
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    onSelect(component.id, e.ctrlKey || e.metaKey);
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;
    
    const newPosition = {
      x: Math.max(0, component.position.x + deltaX),
      y: Math.max(0, component.position.y + deltaY)
    };
    
    onDrag(component.id, newPosition);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, scale, component.position, component.id, onDrag]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  return (
    <div
      className={`
        absolute w-32 h-16 rounded-lg border-2 flex items-center justify-center
        shadow-sm hover:shadow-md transition-all cursor-pointer select-none
        ${getComponentColor(component.type)}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
        ${isDragging ? 'shadow-lg scale-105 z-50' : 'z-10'}
      `}
      style={{
        left: component.position.x,
        top: component.position.y
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="text-center pointer-events-none">
        <div className="text-lg mb-1">{getComponentIcon(component.type)}</div>
        <div className="text-xs font-medium leading-tight px-1">
          {component.name}
        </div>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -inset-1 border-2 border-blue-500 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}

interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
}

function ConnectionLine({ from, to, label }: ConnectionLineProps) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="#6B7280"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
        className="drop-shadow-sm"
      />
      
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#6B7280"
          />
        </marker>
      </defs>
      
      {/* Label */}
      <rect
        x={midX - 20}
        y={midY - 8}
        width="40"
        height="16"
        rx="8"
        fill="white"
        stroke="#E5E7EB"
      />
      <text
        x={midX}
        y={midY + 1}
        textAnchor="middle"
        className="text-xs fill-gray-600 font-medium"
      >
        {label.length > 8 ? label.slice(0, 8) + '...' : label}
      </text>
    </g>
  );
}