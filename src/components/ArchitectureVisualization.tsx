import React, { useState, useRef } from 'react';
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
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.25, scale + delta), 3);
    setScale(newScale);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };
  
  const zoomIn = () => setScale(Math.min(scale * 1.2, 3));
  const zoomOut = () => setScale(Math.max(scale / 1.2, 0.25));
  
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
            <Button variant="outline" size="sm" onClick={resetView}>Reset</Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={canvasRef}
          className="relative w-full h-96 bg-gray-50 overflow-hidden cursor-grab active:cursor-grabbing"
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
                const fromComponent = architecture.components.find(c => c.id === connection.from);
                const toComponent = architecture.components.find(c => c.id === connection.to);
                
                if (!fromComponent || !toComponent) return null;
                
                return (
                  <ConnectionLine
                    key={index}
                    from={{ x: fromComponent.position.x + 60, y: fromComponent.position.y + 30 }}
                    to={{ x: toComponent.position.x + 60, y: toComponent.position.y + 30 }}
                    label={connection.label}
                  />
                );
              })}
            </svg>
            
            {/* Components */}
            {architecture.components.map((component) => (
              <ArchitectureComponentNode
                key={component.id}
                component={component}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ArchitectureComponentNodeProps {
  component: ArchitectureComponent;
}

function ArchitectureComponentNode({ component }: ArchitectureComponentNodeProps) {
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
  
  return (
    <div
      className={`
        absolute w-32 h-16 rounded-lg border-2 flex items-center justify-center
        shadow-sm hover:shadow-md transition-shadow cursor-pointer
        ${getComponentColor(component.type)}
      `}
      style={{
        left: component.position.x,
        top: component.position.y
      }}
    >
      <div className="text-center">
        <div className="text-lg mb-1">{getComponentIcon(component.type)}</div>
        <div className="text-xs font-medium leading-tight px-1">
          {component.name}
        </div>
      </div>
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