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
  const [isApplying, setIsApplying] = useState(false);

  // Debounced equation validation only - no auto-apply
  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 200); // Faster validation

    return () => clearTimeout(timer);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <Card className="w-full max-w-5xl max-h-[95vh] bg-gray-900 border-gray-700 text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Advanced Equation Editor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-3 p-4">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800 h-8">
              <TabsTrigger value="editor" className="text-xs">Editor</TabsTrigger>
              <TabsTrigger value="variables" className="text-xs">Variables</TabsTrigger>
              <TabsTrigger value="functions" className="text-xs">Functions</TabsTrigger>
              <TabsTrigger value="help" className="text-xs">Help</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Template Selection */}
                <div className="space-y-2">
                  <Label className="text-xs">Templates</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 max-h-48">
                      {Object.keys(equationTemplates).map(template => (
                        <SelectItem key={template} value={template} className="text-xs">
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Control Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (!syntaxError && currentEquation.trim()) {
                        onEquationChange(currentEquation);
                      }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                    disabled={!!syntaxError || !currentEquation.trim()}
                  >
                    Apply Equation
                  </Button>
                  <Button
                    onClick={() => navigator.clipboard.writeText(currentEquation)}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 hover:bg-gray-600 h-8 text-xs"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {/* Equation Input */}
              <div className="space-y-2">
                <Label className="text-xs">Equation (x, z = position, t = time)</Label>
                <div className="relative">
                  <Textarea
                    id="equation-input"
                    value={currentEquation}
                    onChange={(e) => setCurrentEquation(e.target.value)}
                    placeholder="Enter mathematical equation..."
                    className="h-20 bg-gray-800 border-gray-600 font-mono text-xs resize-none"
                  />
                  {isApplying && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-xs text-white">Applying...</div>
                    </div>
                  )}
                </div>
                {syntaxError && (
                  <p className="text-red-400 text-xs">{syntaxError}</p>
                )}
                <p className="text-gray-400 text-xs">
                  Click "Apply Equation" to update the surface visualization
                </p>
              </div>
              
              {/* Quick Insert Buttons */}
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-1">
                {['π', 'e', 'φ', '√2'].map(constant => (
                  <Button
                    key={constant}
                    variant="outline"
                    size="sm"
                    onClick={() => insertConstant(constant === 'π' ? 'pi' : constant === 'φ' ? 'phi' : constant === '√2' ? 'sqrt2' : 'e')}
                    className="text-xs h-7 p-1"
                  >
                    {constant}
                  </Button>
                ))}
                {['sin', 'cos', 'exp', 'sqrt'].map(func => (
                  <Button
                    key={func}
                    variant="outline"
                    size="sm"
                    onClick={() => insertFunction(func)}
                    className="text-xs h-7 p-1"
                  >
                    {func}()
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="variables" className="space-y-3">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Variable Controls</h3>
                
                {/* Add New Variable */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Name"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    className="bg-gray-800 border-gray-600 h-8 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Value"
                    value={newVarValue}
                    onChange={(e) => setNewVarValue(parseFloat(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-600 h-8 text-xs"
                  />
                  <Button onClick={handleAddVariable} size="sm" className="h-8 px-2">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Variable List */}
                <ScrollArea className="h-60">
                  <div className="space-y-2">
                    {Object.entries(variables).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-2 p-2 bg-gray-800 rounded text-xs">
                        <Badge variant="outline" className="font-mono text-xs min-w-12">
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
                          value={value.toFixed(2)}
                          onChange={(e) => onVariableChange(name, parseFloat(e.target.value) || 0)}
                          className="w-16 bg-gray-700 border-gray-600 text-xs h-6"
                          step={0.1}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariable(name)}
                          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="functions" className="space-y-3">
              <div className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Functions</h4>
                    <div className="grid grid-cols-3 gap-1">
                      {mathFunctions.map(func => (
                        <Button
                          key={func}
                          variant="outline"
                          size="sm"
                          onClick={() => insertFunction(func)}
                          className="text-xs h-7 p-1"
                        >
                          {func}()
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Constants</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(mathConstants).map(([name, value]) => (
                        <Button
                          key={name}
                          variant="outline"
                          size="sm"
                          onClick={() => insertConstant(name)}
                          className="text-xs h-7 p-1"
                          title={`${name} = ${value.toFixed(6)}`}
                        >
                          {name}
                        </Button>
                      ))}
                    </div>
                  </div>
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
          <div className="flex justify-between pt-3 border-t border-gray-700">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} size="sm" className="h-8 text-xs">
                Cancel
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={!!syntaxError}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                Apply & Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}