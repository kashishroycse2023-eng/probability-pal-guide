import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, RotateCcw, Eye } from 'lucide-react';

interface MarbleExperimentProps {
  onResult: (predicted: any, actual: any[], attempts: number, experimentType: string) => void;
}

const MarbleExperiment: React.FC<MarbleExperimentProps> = ({ onResult }) => {
  const [bagContents, setBagContents] = useState({red: 5, blue: 3, green: 2});
  const [numDraws, setNumDraws] = useState(2);
  const [prediction, setPrediction] = useState<{type: string, value?: any}>({type: 'none'});
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnMarbles, setDrawnMarbles] = useState<string[]>([]);
  const [currentBag, setCurrentBag] = useState({red: 5, blue: 3, green: 2});
  const [attempts, setAttempts] = useState(0);

  const totalMarbles = currentBag.red + currentBag.blue + currentBag.green;

  const drawMarbles = async () => {
    if (prediction.type === 'none') return;
    
    setIsDrawing(true);
    
    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const newDrawn: string[] = [];
    let tempBag = {...currentBag};
    
    for (let i = 0; i < numDraws; i++) {
      const tempTotal = tempBag.red + tempBag.blue + tempBag.green;
      if (tempTotal === 0) break;
      
      const random = Math.random() * tempTotal;
      let cumulative = 0;
      
      for (const [color, count] of Object.entries(tempBag)) {
        cumulative += count;
        if (random <= cumulative && count > 0) {
          newDrawn.push(color);
          tempBag[color as keyof typeof tempBag]--;
          break;
        }
      }
    }
    
    setDrawnMarbles(newDrawn);
    setCurrentBag(tempBag);
    setIsDrawing(false);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    onResult(prediction, newDrawn, newAttempts, 'marble-bag');
  };

  const reset = () => {
    setDrawnMarbles([]);
    setCurrentBag({...bagContents});
    setAttempts(0);
    setPrediction({type: 'none'});
  };

  const calculateProbability = (type: string) => {
    const total = currentBag.red + currentBag.blue + currentBag.green;
    if (total === 0) return 0;
    
    switch (type) {
      case 'all-red':
        return numDraws === 1 
          ? (currentBag.red / total) * 100
          : (currentBag.red / total) * ((currentBag.red - 1) / (total - 1)) * 100;
      case 'all-blue':
        return numDraws === 1 
          ? (currentBag.blue / total) * 100
          : (currentBag.blue / total) * ((currentBag.blue - 1) / (total - 1)) * 100;
      case 'different-colors':
        if (numDraws === 1) return 0;
        const sameRed = (currentBag.red / total) * ((currentBag.red - 1) / (total - 1));
        const sameBlue = (currentBag.blue / total) * ((currentBag.blue - 1) / (total - 1));
        const sameGreen = (currentBag.green / total) * ((currentBag.green - 1) / (total - 1));
        return (1 - (sameRed + sameBlue + sameGreen)) * 100;
      default:
        return 0;
    }
  };

  const getMarbleEmoji = (color: string) => {
    const emojis: { [key: string]: string } = {
      red: '🔴',
      blue: '🔵',
      green: '🟢'
    };
    return emojis[color] || '';
  };

  return (
    <Card className="slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Package className="w-6 h-6" />
          Marble Bag Challenge
        </CardTitle>
        <p className="text-muted-foreground">Draw marbles without replacement!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Bag Setup */}
        <div className="space-y-2">
          <h3 className="font-semibold">Bag Contents:</h3>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              {Object.entries(currentBag).map(([color, count]) => (
                <div key={color} className="space-y-2">
                  <div className="text-2xl">{getMarbleEmoji(color)}</div>
                  <div className="font-bold capitalize">{color}</div>
                  <div className="text-lg font-mono">{count}</div>
                  <Progress value={(count / bagContents[color as keyof typeof bagContents]) * 100} className="h-2" />
                </div>
              ))}
            </div>
            <div className="text-center mt-3 text-sm text-muted-foreground">
              Total marbles remaining: {totalMarbles}
            </div>
          </div>
        </div>

        {/* Number of Draws */}
        <div className="space-y-2">
          <h3 className="font-semibold">Number of Draws:</h3>
          <div className="flex gap-2">
            {[1, 2, 3].map(num => (
              <Button
                key={num}
                variant={numDraws === num ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setNumDraws(num)}
                disabled={num > totalMarbles}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* Live Probability Display */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" />
            Current Probabilities
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {Object.entries(currentBag).map(([color, count]) => (
              <div key={color} className="flex justify-between">
                <span className="flex items-center gap-2">
                  {getMarbleEmoji(color)} Next {color}:
                </span>
                <span className="font-bold">{totalMarbles > 0 ? ((count / totalMarbles) * 100).toFixed(1) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Options */}
        <div className="space-y-4">
          <h3 className="font-semibold">What do you predict?</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant={prediction.type === 'all-red' ? 'experiment' : 'outline'}
              onClick={() => setPrediction({type: 'all-red'})}
              disabled={currentBag.red < numDraws}
            >
              All Red Marbles ({calculateProbability('all-red').toFixed(1)}%)
            </Button>
            <Button
              variant={prediction.type === 'all-blue' ? 'experiment' : 'outline'}
              onClick={() => setPrediction({type: 'all-blue'})}
              disabled={currentBag.blue < numDraws}
            >
              All Blue Marbles ({calculateProbability('all-blue').toFixed(1)}%)
            </Button>
            {numDraws > 1 && (
              <Button
                variant={prediction.type === 'different-colors' ? 'experiment' : 'outline'}
                onClick={() => setPrediction({type: 'different-colors'})}
              >
                Different Colors ({calculateProbability('different-colors').toFixed(1)}%)
              </Button>
            )}
          </div>
        </div>

        {/* Draw Button */}
        <div className="text-center">
          <Button
            variant="experiment"
            size="xl"
            onClick={drawMarbles}
            disabled={prediction.type === 'none' || isDrawing || totalMarbles < numDraws}
            className="min-w-48"
          >
            {isDrawing ? "Drawing Marbles..." : "Draw Marbles!"}
          </Button>
        </div>

        {/* Results Display */}
        {drawnMarbles.length > 0 && (
          <div className="space-y-4 bounce-in">
            <h3 className="font-semibold">Drawn Marbles:</h3>
            <div className="flex gap-3 justify-center">
              {drawnMarbles.map((marble, index) => (
                <div key={index} className="bg-card p-4 rounded-lg shadow-lg border text-center">
                  <div className="text-3xl mb-2">{getMarbleEmoji(marble)}</div>
                  <div className="font-bold capitalize">{marble}</div>
                  <div className="text-xs text-muted-foreground">Draw #{index + 1}</div>
                </div>
              ))}
            </div>
            
            {/* Detailed Analysis */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Drawing Analysis:</h4>
              <div className="text-sm space-y-1">
                <div>• Colors drawn: {drawnMarbles.join(' → ')}</div>
                <div>• Prediction: {prediction.type.replace('-', ' ')}</div>
                <div>• Marbles left: {Object.entries(currentBag).map(([color, count]) => `${color}: ${count}`).join(', ')}</div>
                <div className="font-medium text-primary mt-2">
                  Without replacement: Each draw changes the probabilities!
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="outline" className="text-sm p-2">
                Draw #{attempts} Complete!
              </Badge>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {drawnMarbles.length > 0 && (
          <div className="text-center">
            <Button variant="ghost" onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset Bag
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarbleExperiment;