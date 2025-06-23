import React, { useState, useRef, useCallback } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Minus, Maximize2 } from 'lucide-react';

interface EditableEquationProps {
  equation: string;
  title: string;
  category: string;
  concept: string;
  onEquationChange: (newEquation: string) => void;
}

export function EditableEquation({
  equation,
  title,
  category,
  concept,
  onEquationChange
}: EditableEquationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEquation, setEditedEquation] = useState(equation);
  const [position, setPosition] = useState({ x: typeof window !== 'undefined' ? window.innerWidth - 420 : 800, y: 20 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && 
        (e.target.closest('button') || e.target.closest('input'))) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragStart.y));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart]);

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

  const handleSave = () => {
    onEquationChange(editedEquation);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEquation(equation);
    setIsEditing(false);
  };

  return (
    <Card 
      ref={cardRef}
      className="absolute w-96 max-h-80 bg-black/95 border-white/20 text-white rounded-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <CardHeader 
        className="pb-2 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-blue-400">∑</span>
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs rounded-full">
              {category}
            </Badge>
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
          </div>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent className="space-y-3 overflow-y-auto max-h-60">
        {/* Equation Display/Editor */}
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editedEquation}
                onChange={(e) => setEditedEquation(e.target.value)}
                className="font-mono text-sm bg-gray-700 border-gray-500 rounded-xl text-green-300"
                placeholder="Enter mathematical equation..."
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Apply
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-mono text-green-300 leading-relaxed break-all">
                {equation}
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white rounded-xl"
              >
                Edit Equation
              </Button>
            </div>
          )}
        </div>
        
        {/* Mathematical Concept */}
        <div className="bg-gray-800/30 p-3 rounded-xl border border-gray-600">
          <p className="text-xs text-gray-200 leading-relaxed">
            <span className="font-semibold text-blue-300">Concept:</span> {concept}
          </p>
        </div>
        </CardContent>
      )}
    </Card>
  );
}