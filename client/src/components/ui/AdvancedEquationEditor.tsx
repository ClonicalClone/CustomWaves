import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Slider } from './slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { Separator } from './separator';
import { ScrollArea } from './scroll-area';
import { X, Plus, Trash2, Copy, Save, RefreshCw, BookOpen, Calculator } from 'lucide-react';

interface AdvancedEquationEditorProps {
  equation: string;
  variables: Record<string, number>;
  onEquationChange: (equation: string) => void;
  onVariableChange: (name: string, value: number) => void;
  onClose: () => void;
}

// Predefined equation templates
const equationTemplates = {
  'Basic Wave': 'A * sin(f * x + s * t) + A * cos(f * z + s * t)',
  'Interference': 'A * cos(f * sqrt((x-2)^2 + z^2) - s * t) + A * cos(f * sqrt((x+2)^2 + z^2) - s * t)',
  'Spiral': 'A * sin(f * sqrt(x^2 + z^2) + atan(z/x) * phi + s * t)',
  'Mandelbrot': 'A * (x^2 - z^2 + c1) + A * (2*x*z + c2)',
  'Gaussian': 'A * exp(-(x^2 + z^2)/(2*sigma^2)) * cos(f*t)',
  'Hyperbolic': 'A * sinh(x/w) * cosh(z/w) * sin(f*t)',
  'Polynomial': 'A * (a3*x^3 + a2*x^2 + a1*x + a0) * sin(f*z + s*t)',
  'Bessel-like': 'A * cos(f * sqrt(x^2 + z^2) - s*t) / (1 + 0.1*sqrt(x^2 + z^2))',
  'Quantum Well': 'A * sin(pi*n*(x+L/2)/L) * cos(E*t) * (abs(x) < L/2 ? 1 : 0)',
  'Soliton': 'A / (cosh(k*(x - v*t)))^2',
  'Lorenz-inspired': 'A * sin(sigma*(z-x)*0.01 + s*t) * cos(x*(rho-x)*0.01 + s*t)',
  'Custom': ''
};

// Mathematical constants and functions
const mathConstants = {
  pi: Math.PI,
  e: Math.E,
  phi: 1.618033988749,
  sqrt2: Math.sqrt(2),
  sqrt3: Math.sqrt(3),
  sqrt5: Math.sqrt(5)
};

const mathFunctions = [
  'sin', 'cos', 'tan', 'atan', 'atan2',
  'sinh', 'cosh', 'tanh',
  'exp', 'log', 'log10', 'log2',
  'sqrt', 'pow', 'abs',
  'floor', 'ceil', 'round',
  'min', 'max'
];

export function AdvancedEquationEditor({
  equation,
  variables,
  onEquationChange,
  onVariableChange,
  onClose
}: AdvancedEquationEditorProps) {
  const [currentEquation, setCurrentEquation] = useState(equation);
  const [selectedTemplate, setSelectedTemplate] = useState('Custom');
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState(1);
  const [syntaxError, setSyntaxError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Validate equation syntax
  useEffect(() => {
    if (currentEquation.trim()) {
      try {
        // Simple validation - check for balanced parentheses and basic syntax
        const balanced = checkBalancedParentheses(currentEquation);
        if (!balanced) {
          setSyntaxError('Unbalanced parentheses');
        } else {
          setSyntaxError('');
        }
      } catch (e) {
        setSyntaxError('Invalid syntax');
      }
    } else {
      setSyntaxError('');
    }
  }, [currentEquation]);

  const checkBalancedParentheses = (str: string): boolean => {
    let count = 0;
    for (const char of str) {
      if (char === '(') count++;
      if (char === ')') count--;
      if (count < 0) return false;
    }
    return count === 0;
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    if (template !== 'Custom' && equationTemplates[template as keyof typeof equationTemplates]) {
      setCurrentEquation(equationTemplates[template as keyof typeof equationTemplates]);
    }
  };

  const handleAddVariable = () => {
    if (newVarName && !variables[newVarName]) {
      onVariableChange(newVarName, newVarValue);
      setNewVarName('');
      setNewVarValue(1);
    }
  };

  const handleRemoveVariable = (varName: string) => {
    const newVars = { ...variables };
    delete newVars[varName];
    // Note: In a real implementation, you'd want to update the store to remove the variable
  };

  const insertFunction = (func: string) => {
    const textarea = document.getElementById('equation-input') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newEquation = 
        currentEquation.substring(0, start) + 
        func + '(' + 
        currentEquation.substring(start, end) + 
        ')' + 
        currentEquation.substring(end);
      setCurrentEquation(newEquation);
      
      // Set cursor position after the function
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + func.length + 1, start + func.length + 1 + (end - start));
      }, 0);
    }
  };

  const insertConstant = (constant: string) => {
    const textarea = document.getElementById('equation-input') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newEquation = 
        currentEquation.substring(0, start) + 
        constant + 
        currentEquation.substring(end);
      setCurrentEquation(newEquation);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + constant.length, start + constant.length);
      }, 0);
    }
  };

  const handleSave = () => {
    onEquationChange(currentEquation);
    onClose();
  };

  const handlePreview = () => {
    onEquationChange(currentEquation);
    setPreviewMode(!previewMode);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Advanced Equation Editor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="functions">Functions</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="space-y-4">
              {/* Template Selection */}
              <div className="space-y-2">
                <Label>Equation Templates</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {Object.keys(equationTemplates).map(template => (
                      <SelectItem key={template} value={template}>
                        {template}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Equation Input */}
              <div className="space-y-2">
                <Label>Equation (use variables: x, z, t for position and time)</Label>
                <Textarea
                  id="equation-input"
                  value={currentEquation}
                  onChange={(e) => setCurrentEquation(e.target.value)}
                  placeholder="Enter your mathematical equation..."
                  className="min-h-24 bg-gray-800 border-gray-600 font-mono text-sm"
                />
                {syntaxError && (
                  <p className="text-red-400 text-sm">{syntaxError}</p>
                )}
              </div>
              
              {/* Quick Insert Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertConstant('pi')}
                  className="text-xs"
                >
                  π
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertConstant('e')}
                  className="text-xs"
                >
                  e
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertConstant('phi')}
                  className="text-xs"
                >
                  φ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertFunction('sin')}
                  className="text-xs"
                >
                  sin()
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertFunction('cos')}
                  className="text-xs"
                >
                  cos()
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertFunction('exp')}
                  className="text-xs"
                >
                  exp()
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertFunction('sqrt')}
                  className="text-xs"
                >
                  sqrt()
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="variables" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Variable Controls</h3>
                
                {/* Add New Variable */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Variable name"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    className="bg-gray-800 border-gray-600"
                  />
                  <Input
                    type="number"
                    placeholder="Value"
                    value={newVarValue}
                    onChange={(e) => setNewVarValue(parseFloat(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-600"
                  />
                  <Button onClick={handleAddVariable} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <Separator className="bg-gray-700" />
                
                {/* Variable List */}
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {Object.entries(variables).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                        <Badge variant="outline" className="font-mono">
                          {name}
                        </Badge>
                        <div className="flex-1">
                          <Slider
                            value={[value]}
                            onValueChange={(vals) => onVariableChange(name, vals[0])}
                            min={-10}
                            max={10}
                            step={0.1}
                            className="flex-1"
                          />
                        </div>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => onVariableChange(name, parseFloat(e.target.value) || 0)}
                          className="w-20 bg-gray-700 border-gray-600 text-xs"
                          step={0.1}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariable(name)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="functions" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mathematical Functions</h3>
                
                <div className="grid grid-cols-3 gap-2">
                  {mathFunctions.map(func => (
                    <Button
                      key={func}
                      variant="outline"
                      size="sm"
                      onClick={() => insertFunction(func)}
                      className="text-xs justify-start"
                    >
                      {func}()
                    </Button>
                  ))}
                </div>
                
                <Separator className="bg-gray-700" />
                
                <h4 className="font-semibold">Constants</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(mathConstants).map(([name, value]) => (
                    <Button
                      key={name}
                      variant="outline"
                      size="sm"
                      onClick={() => insertConstant(name)}
                      className="text-xs justify-start"
                      title={`${name} = ${value.toFixed(6)}`}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="help" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Equation Editor Help
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-400">Available Variables:</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><code>x, z</code> - Spatial coordinates</li>
                      <li><code>t</code> - Time variable</li>
                      <li><code>A, f, s, c</code> - Default amplitude, frequency, speed, complexity</li>
                      <li>Custom variables you define</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-400">Operators:</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><code>+, -, *, /</code> - Basic arithmetic</li>
                      <li><code>^</code> or <code>**</code> - Exponentiation</li>
                      <li><code>()</code> - Grouping</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-400">Example Equations:</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1 font-mono text-xs">
                      <li><code>A * sin(f * x + s * t)</code></li>
                      <li><code>A * exp(-(x^2 + z^2)/sigma^2) * cos(f*t)</code></li>
                      <li><code>A / cosh(k*(x - v*t))^2</code></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-yellow-400">Tips:</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Use parentheses to control order of operations</li>
                      <li>Variables are case-sensitive</li>
                      <li>Preview your changes in real-time</li>
                      <li>Save frequently used equations as templates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(currentEquation)}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!!syntaxError}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}