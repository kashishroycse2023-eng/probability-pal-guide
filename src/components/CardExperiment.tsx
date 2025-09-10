import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Spade, Heart, Club, Diamond, RotateCcw, Eye } from 'lucide-react';

interface CardExperimentProps {
  onResult: (predicted: any, actual: any[], attempts: number, experimentType: string) => void;
  onProbabilityUpdate?: (currentProbs: any) => void;
}

type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
type PlayingCard = { suit: CardSuit; value: CardValue; isFace: boolean };

const CardExperiment: React.FC<CardExperimentProps> = ({ onResult, onProbabilityUpdate }) => {
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<PlayingCard[]>([]);
  const [numCardsToDraw, setNumCardsToDraw] = useState(2);
  const [prediction, setPrediction] = useState<{type: string, value?: any}>({type: 'none'});
  const [isDrawing, setIsDrawing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [experimentType, setExperimentType] = useState<'multi-draw' | 'sequence' | 'face-cards'>('multi-draw');

  // Initialize full deck
  useEffect(() => {
    const suits: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck: PlayingCard[] = [];
    
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({
          suit,
          value,
          isFace: ['J', 'Q', 'K'].includes(value)
        });
      });
    });
    
    setDeck(shuffleDeck([...newDeck]));
  }, []);

  const shuffleDeck = (cards: PlayingCard[]) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getSuitIcon = (suit: CardSuit) => {
    const props = { className: "w-5 h-5" };
    switch (suit) {
      case 'hearts': return <Heart {...props} className="w-5 h-5 text-red-500" />;
      case 'diamonds': return <Diamond {...props} className="w-5 h-5 text-red-500" />;
      case 'clubs': return <Club {...props} className="w-5 h-5 text-gray-800" />;
      case 'spades': return <Spade {...props} className="w-5 h-5 text-gray-800" />;
    }
  };

  const calculateCurrentProbabilities = () => {
    const remainingCards = deck.length - drawnCards.length;
    if (remainingCards === 0 || deck.length === 0) {
      return { 
        hearts: 0, 
        face: 0, 
        allHearts: 0, 
        atLeastOneFace: 0, 
        remaining: 0 
      };
    }
    
    const remainingHearts = deck.slice(drawnCards.length).filter(card => card.suit === 'hearts').length;
    const remainingFace = deck.slice(drawnCards.length).filter(card => card.isFace).length;
    
    return {
      hearts: (remainingHearts / remainingCards) * 100,
      face: (remainingFace / remainingCards) * 100,
      allHearts: Math.pow(remainingHearts / remainingCards, numCardsToDraw) * 100,
      atLeastOneFace: (1 - Math.pow((remainingCards - remainingFace) / remainingCards, numCardsToDraw)) * 100,
      remaining: remainingCards
    };
  };

  const drawCards = async () => {
    if (prediction.type === 'none') return;
    
    setIsDrawing(true);
    
    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newDrawnCards = [];
    for (let i = 0; i < numCardsToDraw; i++) {
      if (drawnCards.length + i < deck.length) {
        newDrawnCards.push(deck[drawnCards.length + i]);
      }
    }
    
    setDrawnCards(prev => [...prev, ...newDrawnCards]);
    setIsDrawing(false);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    onResult(prediction, newDrawnCards, newAttempts, experimentType);
    
    // Update probabilities for next draw
    setTimeout(() => {
      if (onProbabilityUpdate) {
        onProbabilityUpdate(calculateCurrentProbabilities());
      }
    }, 500);
  };

  const resetDeck = () => {
    const suits: CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck: PlayingCard[] = [];
    
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({
          suit,
          value,
          isFace: ['J', 'Q', 'K'].includes(value)
        });
      });
    });
    
    setDeck(shuffleDeck(newDeck));
    setDrawnCards([]);
    setAttempts(0);
    setPrediction({type: 'none'});
  };

  const currentProbs = calculateCurrentProbabilities();

  return (
    <Card className="slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Card Pulling Experiment</CardTitle>
        <p className="text-muted-foreground">Draw multiple cards and watch probabilities change!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Experiment Type Selection */}
        <div className="space-y-2">
          <h3 className="font-semibold">Choose Your Challenge:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              variant={experimentType === 'multi-draw' ? 'experiment' : 'outline'}
              onClick={() => setExperimentType('multi-draw')}
              className="text-sm"
            >
              Multi-Card Draw
            </Button>
            <Button
              variant={experimentType === 'face-cards' ? 'experiment' : 'outline'}
              onClick={() => setExperimentType('face-cards')}
              className="text-sm"
            >
              Face Card Hunt
            </Button>
            <Button
              variant={experimentType === 'sequence' ? 'experiment' : 'outline'}
              onClick={() => setExperimentType('sequence')}
              className="text-sm"
            >
              Sequence Guess
            </Button>
          </div>
        </div>

        {/* Number of Cards to Draw */}
        <div className="space-y-2">
          <h3 className="font-semibold">Cards to Draw:</h3>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map(num => (
              <Button
                key={num}
                variant={numCardsToDraw === num ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setNumCardsToDraw(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* Real-Time Probability Display */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Live Probability Updates
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span>Hearts in deck:</span>
                <span className="font-medium">{currentProbs.hearts.toFixed(1)}%</span>
              </div>
              <Progress value={currentProbs.hearts} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Face cards:</span>
                <span className="font-medium">{currentProbs.face.toFixed(1)}%</span>
              </div>
              <Progress value={currentProbs.face} className="h-2" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Cards remaining: {currentProbs.remaining} | Cards drawn: {drawnCards.length}
          </div>
        </div>

        {/* Prediction Interface */}
        <div className="space-y-4">
          <h3 className="font-semibold">What do you predict?</h3>
          
          {experimentType === 'multi-draw' && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={prediction.type === 'all-hearts' ? 'experiment' : 'outline'}
                onClick={() => setPrediction({type: 'all-hearts'})}
              >
                All Hearts ({currentProbs.allHearts.toFixed(1)}%)
              </Button>
              <Button
                variant={prediction.type === 'mixed-suits' ? 'experiment' : 'outline'}
                onClick={() => setPrediction({type: 'mixed-suits'})}
              >
                Mixed Suits ({(100 - currentProbs.allHearts).toFixed(1)}%)
              </Button>
            </div>
          )}

          {experimentType === 'face-cards' && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={prediction.type === 'at-least-one-face' ? 'experiment' : 'outline'}
                onClick={() => setPrediction({type: 'at-least-one-face'})}
              >
                ≥1 Face Card ({currentProbs.atLeastOneFace.toFixed(1)}%)
              </Button>
              <Button
                variant={prediction.type === 'no-face-cards' ? 'experiment' : 'outline'}
                onClick={() => setPrediction({type: 'no-face-cards'})}
              >
                No Face Cards ({(100 - currentProbs.atLeastOneFace).toFixed(1)}%)
              </Button>
            </div>
          )}

          {experimentType === 'sequence' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Predict the exact sequence of suits:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={prediction.type === 'ascending' ? 'experiment' : 'outline'}
                  onClick={() => setPrediction({type: 'ascending'})}
                  className="text-sm"
                >
                  Hearts→Diamonds→Clubs
                </Button>
                <Button
                  variant={prediction.type === 'alternating' ? 'experiment' : 'outline'}
                  onClick={() => setPrediction({type: 'alternating'})}
                  className="text-sm"
                >
                  Red→Black→Red
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Draw Button */}
        <div className="text-center">
          <Button
            variant="experiment"
            size="xl"
            onClick={drawCards}
            disabled={prediction.type === 'none' || isDrawing || currentProbs.remaining < numCardsToDraw}
            className="min-w-48"
          >
            {isDrawing ? "Drawing Cards..." : "Draw Cards!"}
          </Button>
        </div>

        {/* Drawn Cards Display */}
        {drawnCards.length > 0 && (
          <div className="space-y-4 bounce-in">
            <h3 className="font-semibold">Recent Draw:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {drawnCards.slice(-numCardsToDraw).map((card, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-lg border-2 text-center min-w-16">
                  <div className="flex items-center justify-center mb-1">
                    {getSuitIcon(card.suit)}
                  </div>
                  <div className="font-bold text-lg">{card.value}</div>
                  {card.isFace && <Badge variant="secondary" className="text-xs mt-1">Face</Badge>}
                </div>
              ))}
            </div>
            
            {/* Detailed Calculation Display */}
            <div className="bg-primary/5 p-4 rounded-lg space-y-3 border border-primary/20">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Complete Probability Calculation
              </h4>
              
              {experimentType === 'multi-draw' && prediction.type === 'all-hearts' && (
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Calculating "All Hearts" Probability:</div>
                  <div className="bg-white/50 p-3 rounded">
                    <div>• Cards before draw: {deck.length - (drawnCards.length - numCardsToDraw)} total</div>
                    <div>• Hearts before draw: {deck.slice(drawnCards.length - numCardsToDraw).filter(card => card.suit === 'hearts').length}</div>
                    <div>• Drawing {numCardsToDraw} cards</div>
                    <div className="mt-2 font-medium">
                      Calculation: {deck.slice(drawnCards.length - numCardsToDraw).filter(card => card.suit === 'hearts').length}/{deck.length - (drawnCards.length - numCardsToDraw)} × {Math.max(0, deck.slice(drawnCards.length - numCardsToDraw).filter(card => card.suit === 'hearts').length - 1)}/{Math.max(1, deck.length - (drawnCards.length - numCardsToDraw) - 1)} × ...
                    </div>
                    <div className="text-primary font-bold">
                      = {(Math.pow(deck.slice(drawnCards.length - numCardsToDraw).filter(card => card.suit === 'hearts').length / (deck.length - (drawnCards.length - numCardsToDraw)), numCardsToDraw) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              )}

              {experimentType === 'face-cards' && prediction.type === 'at-least-one-face' && (
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Calculating "At Least One Face Card" Probability:</div>
                  <div className="bg-white/50 p-3 rounded">
                    <div>• Face cards remaining: {deck.slice(drawnCards.length - numCardsToDraw).filter(card => card.isFace).length}</div>
                    <div>• Non-face cards: {deck.slice(drawnCards.length - numCardsToDraw).filter(card => !card.isFace).length}</div>
                    <div>• Using complement: 1 - P(no face cards)</div>
                    <div className="mt-2 font-medium">
                      Calculation: 1 - ({deck.slice(drawnCards.length - numCardsToDraw).filter(card => !card.isFace).length}/{deck.length - (drawnCards.length - numCardsToDraw)})^{numCardsToDraw}
                    </div>
                    <div className="text-primary font-bold">
                      = {((1 - Math.pow(deck.slice(drawnCards.length - numCardsToDraw).filter(card => !card.isFace).length / (deck.length - (drawnCards.length - numCardsToDraw)), numCardsToDraw)) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Updates After Draw */}
              <div className="border-t pt-3">
                <div className="font-medium text-sm mb-2">Updated Probabilities for Next Draw:</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/30 p-2 rounded">
                    <div className="font-medium">Hearts Remaining:</div>
                    <div>{deck.slice(drawnCards.length).filter(card => card.suit === 'hearts').length} out of {currentProbs.remaining}</div>
                    <div className="text-primary font-bold">{currentProbs.hearts.toFixed(1)}%</div>
                  </div>
                  <div className="bg-white/30 p-2 rounded">
                    <div className="font-medium">Face Cards:</div>
                    <div>{deck.slice(drawnCards.length).filter(card => card.isFace).length} out of {currentProbs.remaining}</div>
                    <div className="text-primary font-bold">{currentProbs.face.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
            
            {drawnCards.length >= numCardsToDraw && (
              <div className="text-center">
                <Badge variant="outline" className="text-sm p-2">
                  Draw #{attempts} Complete!
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Reset Button */}
        {drawnCards.length > 0 && (
          <div className="text-center">
            <Button variant="ghost" onClick={resetDeck} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Deck
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardExperiment;