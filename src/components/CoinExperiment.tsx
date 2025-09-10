import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, RotateCcw, TrendingUp } from 'lucide-react';

interface CoinExperimentProps {
  onResult: (predicted: any, actual: any[], attempts: number, experimentType: string) => void;
}

const CoinExperiment: React.FC<CoinExperimentProps> = ({ onResult }) => {
  const [numCoins, setNumCoins] = useState(3);
  const [prediction, setPrediction] = useState<{type: string, value?: any}>({type: 'none'});
  const [isFlipping, setIsFlipping] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);

  const flipCoins = async () => {
    if (prediction.type === 'none') return;
    
    setIsFlipping(true);
    
    // Simulate flipping animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newResults = [];
    for (let i = 0; i < numCoins; i++) {
      newResults.push(Math.random() < 0.5 ? 'heads' : 'tails');
    }
    
    setResults(newResults);
    setIsFlipping(false);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    onResult(prediction, newResults, newAttempts, 'coin-flip');
  };

  const reset = () => {
    setResults([]);
    setAttempts(0);
    setPrediction({type: 'none'});
  };

  const calculateProbability = (type: string) => {
    switch (type) {
      case 'all-heads':
        return Math.pow(0.5, numCoins) * 100;
      case 'all-tails':
        return Math.pow(0.5, numCoins) * 100;
      case 'mixed':
        return (1 - 2 * Math.pow(0.5, numCoins)) * 100;
      case 'alternating':
        return (2 / Math.pow(2, numCoins)) * 100;
      default:
        return 0;
    }
  };

  return (
    <Card className="slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Coins className="w-6 h-6" />
          Coin Flipping Challenge
        </CardTitle>
        <p className="text-muted-foreground">Predict the outcomes of multiple coin flips!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Number of Coins */}
        <div className="space-y-2">
          <h3 className="font-semibold">Number of Coins:</h3>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map(num => (
              <Button
                key={num}
                variant={numCoins === num ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setNumCoins(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* Prediction Options */}
        <div className="space-y-4">
          <h3 className="font-semibold">What do you predict?</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={prediction.type === 'all-heads' ? 'experiment' : 'outline'}
              onClick={() => setPrediction({type: 'all-heads'})}
            >
              All Heads ({calculateProbability('all-heads').toFixed(1)}%)
            </Button>
            <Button
              variant={prediction.type === 'all-tails' ? 'experiment' : 'outline'}
              onClick={() => setPrediction({type: 'all-tails'})}
            >
              All Tails ({calculateProbability('all-tails').toFixed(1)}%)
            </Button>
            <Button
              variant={prediction.type === 'mixed' ? 'experiment' : 'outline'}
              onClick={() => setPrediction({type: 'mixed'})}
            >
              Mixed Results ({calculateProbability('mixed').toFixed(1)}%)
            </Button>
            <Button
              variant={prediction.type === 'alternating' ? 'experiment' : 'outline'}
              onClick={() => setPrediction({type: 'alternating'})}
            >
              Alternating Pattern ({calculateProbability('alternating').toFixed(1)}%)
            </Button>
          </div>
        </div>

        {/* Probability Breakdown */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Probability Breakdown
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Each coin has 50% chance for heads/tails</span>
            </div>
            <div className="flex justify-between">
              <span>Total possible outcomes:</span>
              <span className="font-medium">{Math.pow(2, numCoins)}</span>
            </div>
            <div className="flex justify-between">
              <span>Calculation method:</span>
              <span className="font-medium">(1/2)^{numCoins} for specific patterns</span>
            </div>
          </div>
        </div>

        {/* Flip Button */}
        <div className="text-center">
          <Button
            variant="experiment"
            size="xl"
            onClick={flipCoins}
            disabled={prediction.type === 'none' || isFlipping}
            className="min-w-48"
          >
            {isFlipping ? "Flipping Coins..." : "Flip Coins!"}
          </Button>
        </div>

        {/* Results Display */}
        {results.length > 0 && (
          <div className="space-y-4 bounce-in">
            <h3 className="font-semibold">Results:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {results.map((result, index) => (
                <div key={index} className="bg-card p-4 rounded-lg shadow-lg border text-center min-w-16">
                  <div className="text-2xl mb-2">
                    {result === 'heads' ? '👑' : '⚫'}
                  </div>
                  <div className="font-bold capitalize">{result}</div>
                </div>
              ))}
            </div>
            
            {/* Detailed Analysis */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Analysis:</h4>
              <div className="text-sm space-y-1">
                <div>• Heads: {results.filter(r => r === 'heads').length}/{numCoins}</div>
                <div>• Tails: {results.filter(r => r === 'tails').length}/{numCoins}</div>
                <div>• Pattern: {results.join(' → ')}</div>
                <div className="font-medium text-primary mt-2">
                  Your prediction was: {prediction.type.replace('-', ' ')}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="outline" className="text-sm p-2">
                Flip #{attempts} Complete!
              </Badge>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {results.length > 0 && (
          <div className="text-center">
            <Button variant="ghost" onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Flip Set
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinExperiment;