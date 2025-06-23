import React, { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

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

  const handleSave = () => {
    onEquationChange(editedEquation);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEquation(equation);
    setIsEditing(false);
  };

  return (
    <Card className="absolute bottom-4 left-4 w-96 max-h-80 bg-black/95 border-white/20 text-white rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-blue-400">∑</span>
            {title}
          </CardTitle>
          <Badge variant="outline" className="text-xs rounded-full">
            {category}
          </Badge>
        </div>
      </CardHeader>
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
    </Card>
  );
}