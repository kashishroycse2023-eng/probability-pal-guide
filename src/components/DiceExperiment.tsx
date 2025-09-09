import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw } from 'lucide-react';

interface DiceExperimentProps {
  onResult: (predicted: number, actual: number, attempts: number) => void;
}

const DiceExperiment: React.FC<DiceExperimentProps> = ({ onResult }) => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [results, setResults] = useState<number[]>([]);

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  
  const rollDice = async () => {
    if (prediction === null) return;
    
    setIsRolling(true);
    
    // Simulate rolling animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newResult = Math.floor(Math.random() * 6) + 1;
    setResult(newResult);
    setIsRolling(false);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setResults(prev => [...prev, newResult]);
    
    onResult(prediction, newResult, newAttempts);
  };

  const reset = () => {
    setPrediction(null);
    setResult(null);
    setAttempts(0);
    setResults([]);
  };

  const getCurrentDiceIcon = () => {
    if (isRolling) {
      return Dice1; // Could cycle through icons during animation
    }
    return result ? diceIcons[result - 1] : Dice1;
  };

  const CurrentDiceIcon = getCurrentDiceIcon();

  const getResultCounts = () => {
    const counts = Array(6).fill(0);
    results.forEach(result => counts[result - 1]++);
    return counts;
  };

  return (
    <Card className="slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Dice Rolling Experiment</CardTitle>
        <p className="text-muted-foreground">Predict the outcome and test your luck!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dice Display */}
        <div className="flex justify-center">
          <div className={`p-8 bg-gradient-primary rounded-2xl shadow-primary ${isRolling ? 'dice-roll' : ''}`}>
            <CurrentDiceIcon className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">What do you predict?</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <Button
                key={number}
                variant={prediction === number ? "experiment" : "outline"}
                size="lg"
                onClick={() => setPrediction(number)}
                disabled={isRolling}
                className="aspect-square"
              >
                {number}
              </Button>
            ))}
          </div>
        </div>

        {/* Roll Button */}
        <div className="text-center">
          <Button
            variant="experiment"
            size="xl"
            onClick={rollDice}
            disabled={prediction === null || isRolling}
            className="min-w-48"
          >
            {isRolling ? "Rolling..." : "Roll the Dice!"}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 bounce-in">
            <div className="text-center">
              <Badge variant={prediction === result ? "default" : "secondary"} className="text-lg p-2">
                {prediction === result ? "🎉 Correct Prediction!" : "Try again next time!"}
              </Badge>
            </div>
            
            {attempts > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Your Results (Total: {attempts})</h4>
                <div className="grid grid-cols-6 gap-2 text-sm">
                  {getResultCounts().map((count, index) => (
                    <div key={index} className="text-center">
                      <div className="font-medium">{index + 1}</div>
                      <div className="text-muted-foreground">{count}x</div>
                      <div className="text-xs text-muted-foreground">
                        {attempts > 0 ? ((count / attempts) * 100).toFixed(0) : 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reset Button */}
        {attempts > 0 && (
          <div className="text-center">
            <Button variant="ghost" onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiceExperiment;