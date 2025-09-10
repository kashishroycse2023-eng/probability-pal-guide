import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, RotateCcw, Zap } from 'lucide-react';

interface SpinnerExperimentProps {
  onResult: (predicted: any, actual: any[], attempts: number, experimentType: string) => void;
}

const SpinnerExperiment: React.FC<SpinnerExperimentProps> = ({ onResult }) => {
  const [spinnerType, setSpinnerType] = useState<'equal' | 'weighted'>('equal');
  const [prediction, setPrediction] = useState<{type: string, value?: any}>({type: 'none'});
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string>('');
  const [attempts, setAttempts] = useState(0);

  const sections = {
    equal: {
      red: 25,
      blue: 25,
      green: 25,
      yellow: 25
    },
    weighted: {
      red: 40,
      blue: 30,
      green: 20,
      yellow: 10
    }
  };

  const spinWheel = async () => {
    if (prediction.type === 'none') return;
    
    setIsSpinning(true);
    
    // Simulate spinning animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const random = Math.random() * 100;
    let cumulative = 0;
    let landedColor = '';
    
    for (const [color, percentage] of Object.entries(sections[spinnerType])) {
      cumulative += percentage;
      if (random <= cumulative) {
        landedColor = color;
        break;
      }
    }
    
    setResult(landedColor);
    setIsSpinning(false);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    onResult(prediction, [landedColor], newAttempts, 'spinner');
  };

  const reset = () => {
    setResult('');
    setAttempts(0);
    setPrediction({type: 'none'});
  };

  const getColorEmoji = (color: string) => {
    const emojis: { [key: string]: string } = {
      red: '🔴',
      blue: '🔵',
      green: '🟢',
      yellow: '🟡'
    };
    return emojis[color] || '';
  };

  return (
    <Card className="slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Target className="w-6 h-6" />
          Color Spinner Challenge
        </CardTitle>
        <p className="text-muted-foreground">Predict where the spinner will land!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Spinner Type */}
        <div className="space-y-2">
          <h3 className="font-semibold">Choose Spinner Type:</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={spinnerType === 'equal' ? 'secondary' : 'outline'}
              onClick={() => setSpinnerType('equal')}
            >
              Equal Sections
            </Button>
            <Button
              variant={spinnerType === 'weighted' ? 'secondary' : 'outline'}
              onClick={() => setSpinnerType('weighted')}
            >
              Weighted Sections
            </Button>
          </div>
        </div>

        {/* Spinner Visualization */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Spinner Probabilities
          </h3>
          <div className="space-y-2">
            {Object.entries(sections[spinnerType]).map(([color, percentage]) => (
              <div key={color} className="flex items-center gap-3">
                <span className="text-lg">{getColorEmoji(color)}</span>
                <span className="capitalize font-medium w-16">{color}:</span>
                <Progress value={percentage} className="flex-1 h-3" />
                <span className="font-bold text-sm w-12">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Options */}
        <div className="space-y-4">
          <h3 className="font-semibold">What color will it land on?</h3>
          
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(sections[spinnerType]).map(([color, percentage]) => (
              <Button
                key={color}
                variant={prediction.value === color ? 'experiment' : 'outline'}
                onClick={() => setPrediction({type: 'color', value: color})}
                className="gap-2"
              >
                {getColorEmoji(color)} {color} ({percentage}%)
              </Button>
            ))}
          </div>
        </div>

        {/* Calculation Explanation */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-primary mb-2">How It Works:</h4>
          <div className="text-sm space-y-1">
            <div>• {spinnerType === 'equal' ? 'Each section has equal probability (25%)' : 'Sections have different sizes'}</div>
            <div>• Random number (0-100) determines landing spot</div>
            <div>• {spinnerType === 'weighted' ? 'Larger sections = higher chance' : 'All sections equally likely'}</div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center">
          <Button
            variant="experiment"
            size="xl"
            onClick={spinWheel}
            disabled={prediction.type === 'none' || isSpinning}
            className="min-w-48"
          >
            {isSpinning ? "Spinning..." : "Spin the Wheel!"}
          </Button>
        </div>

        {/* Results Display */}
        {result && (
          <div className="space-y-4 bounce-in">
            <h3 className="font-semibold">Result:</h3>
            <div className="text-center">
              <div className="bg-card p-6 rounded-lg shadow-lg border inline-block">
                <div className="text-4xl mb-2">{getColorEmoji(result)}</div>
                <div className="font-bold text-xl capitalize">{result}</div>
                <div className="text-sm text-muted-foreground">
                  Probability: {sections[spinnerType][result as keyof typeof sections.equal]}%
                </div>
              </div>
            </div>
            
            {/* Analysis */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Spin Analysis:</h4>
              <div className="text-sm space-y-1">
                <div>• Landed on: {result} ({sections[spinnerType][result as keyof typeof sections.equal]}% chance)</div>
                <div>• Your prediction: {prediction.value || 'None'}</div>
                <div className="font-medium">
                  {prediction.value === result ? '✅ Correct prediction!' : '❌ Try again next time!'}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="outline" className="text-sm p-2">
                Spin #{attempts} Complete!
              </Badge>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {result && (
          <div className="text-center">
            <Button variant="ghost" onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Spin
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpinnerExperiment;