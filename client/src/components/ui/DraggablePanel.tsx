import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';

interface DraggablePanelProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
  minimizable?: boolean;
  closable?: boolean;
  className?: string;
}

export function DraggablePanel({
  title,
  children,
  initialPosition = { x: 20, y: 20 },
  width = 320,
  height,
  minimizable = true,
  closable = false,
  className = ''
}: DraggablePanelProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && 
        (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea'))) {
      return; // Don't start dragging if clicking on interactive elements
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - width, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragStart.y));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, width]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isVisible) return null;

  return (
    <div
      ref={panelRef}
      className={`fixed z-50 ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: width,
        height: isMinimized ? 'auto' : height,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <Card className="bg-gray-900/95 border-gray-700 backdrop-blur-sm shadow-xl">
        <CardHeader 
          className="flex flex-row items-center justify-between py-2 px-3 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <CardTitle className="text-sm font-medium text-white select-none">
            {title}
          </CardTitle>
          <div className="flex items-center gap-1">
            {minimizable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 hover:bg-gray-700"
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </Button>
            )}
            {closable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        {!isMinimized && (
          <CardContent className="p-3 max-h-[calc(100vh-120px)] overflow-y-auto">
            {children}
          </CardContent>
        )}
      </Card>
    </div>
  );
}