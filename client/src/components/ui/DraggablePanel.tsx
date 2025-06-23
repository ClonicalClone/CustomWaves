import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Button } from './button';
import { Minimize2, Maximize2, X, GripVertical } from 'lucide-react';

interface DraggablePanelProps {
  title: string;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  onClose?: () => void;
  defaultMinimized?: boolean;
  className?: string;
}

export function DraggablePanel({
  title,
  children,
  initialPosition = { x: 20, y: 20 },
  onClose,
  defaultMinimized = false,
  className = ''
}: DraggablePanelProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={panelRef}
      className={`fixed bg-gray-900/95 border border-gray-700 rounded-lg shadow-2xl z-40 backdrop-blur-sm ${className}`}
      style={{
        left: position.x,
        top: position.y,
        minWidth: '300px',
        maxWidth: '600px',
        maxHeight: '80vh'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-t-lg cursor-move border-b border-gray-700"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-6 h-6 p-0 hover:bg-gray-700"
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Minimize2 className="w-3 h-3" />
            )}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-6 h-6 p-0 hover:bg-gray-700"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}