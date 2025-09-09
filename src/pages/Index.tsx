import React, { useState, useEffect } from 'react';
import AiCoach from '@/components/AiCoach';
import DiceExperiment from '@/components/DiceExperiment';
import CardExperiment from '@/components/CardExperiment';
import GameProgress from '@/components/GameProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dice6, Spade, BarChart3 } from 'lucide-react';

const Index = () => {
  const [gameState, setGameState] = useState<'welcome' | 'experiment' | 'feedback'>('welcome');
  const [currentExperiment, setCurrentExperiment] = useState<'dice' | 'cards'>('dice');
  const [experimentsCompleted, setExperimentsCompleted] = useState(0);
  const [correctPredictions, setCorrectPredictions] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [currentCoachMessage, setCurrentCoachMessage] = useState('');
  const [currentCoachType, setCurrentCoachType] = useState<'welcome' | 'encourage' | 'feedback' | 'hint' | 'success' | 'challenge' | 'reflection'>('welcome');
  const [lastResult, setLastResult] = useState<any>(null);
  const [cardProbabilities, setCardProbabilities] = useState<any>({});

  // Enhanced AI Coach Messages for both dice and cards
  const coachMessages = {
    welcome: [
      "Hi there! Ready to play with chances and surprises? Don't worry—I'll help you learn as you go!",
      "Let's roll, spin, and draw! Every experiment is a step toward becoming a probability pro!"
    ],
    encourage: {
      dice: [
        "Before you roll the dice, what do you think will happen? Trust your gut or give it a thought!",
        "You're about to roll the dice—what's the chance it lands on your number? Let's see if your guess is right!"
      ],
      cards: [
        "Now you're pulling more than one card! Think about how each draw changes the odds—exciting, right?",
        "You're about to pull multiple cards. What's the chance they'll all be hearts? Take a guess before you draw!",
        "Will you get at least one face card? Trust your intuition or calculate the probability first!"
      ]
    },
    feedback: {
      correct: [
        "You got it! That's the correct guess—way to go!",
        "Perfect prediction! You're getting sharper every time.",
        "Wow! All your cards matched your prediction! That's rare but totally possible—keep experimenting!"
      ],
      incorrect: [
        "Whoa! That's unexpected—but that's the fun of probability! Let's learn why.",
        "You guessed close! Sometimes probability surprises us, but it's always about learning.",
        "Sometimes the deck surprises us, but that's how probability keeps us on our toes!",
        "Don't worry if you didn't guess it right this time. Every attempt helps you understand better!"
      ]
    },
    hint: {
      dice: [
        "Let's break it down: each dice has 6 faces, so each number has a 1 in 6 chance!",
        "Need help? Try thinking about how many dice faces there are and what that means for your chances!"
      ],
      cards: [
        "Let's figure it out together! First, how many hearts are in the deck… then what happens after you pull one?",
        "Here's how we calculate chances when each draw depends on the last—try following these steps!",
        "With each pull, the odds shift! Watch how your chances change with every card you draw."
      ]
    },
    challenge: [
      "Feeling confident? Try predicting your next 3 rolls and see how many you can get right!",
      "Ready for a challenge? Draw 4 cards and see if you can predict at least two face cards!",
      "Let's test your skills with sequences. Can you guess which order the cards will appear in?"
    ],
    reflection: [
      "What surprised you the most about this experiment?",
      "Do you think the results would change if we tried it more times? Let's explore!",
      "What did you learn from drawing multiple cards? How did the probabilities change after each pull?"
    ],
    cardSpecific: {
      introduction: [
        "Now you're pulling more than one card! Think about how each draw changes the odds—exciting, right?",
        "Let's try drawing 2 or 3 cards at once. Can you guess how the chances stack up?"
      ],
      stepByStep: [
        "Let's figure it out together! First, how many hearts are in the deck… then what happens after you pull one?",
        "Here's how we calculate chances when each draw depends on the last—try following these steps!"
      ],
      dynamic: [
        "First card: heart! That means one less heart for the next draw. See how that changes the odds?",
        "You pulled a king! Now fewer kings remain. Probability is always updating as you play!"
      ],
      multiLevel: [
        "Ready for a challenge? Draw 4 cards and see if you can predict at least two face cards!",
        "Let's test your skills with sequences. Can you guess which order the cards will appear in?"
      ],
      funFacts: [
        "Did you know that the chances of pulling 4 aces in a row are extremely rare but still possible?",
        "Playing cards have been used for probability experiments for centuries—let's see why!"
      ],
      realTime: [
        "With each pull, the odds shift! Watch how your chances change with every card you draw.",
        "Probability isn't static—it evolves! Let's see how it updates in real-time."
      ]
    }
  };

  useEffect(() => {
    // Set initial welcome message
    const welcomeMessages = coachMessages.welcome;
    setCurrentCoachMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
    setCurrentCoachType('welcome');
  }, []);

  const handleExperimentStart = () => {
    setGameState('experiment');
    const encourageMessages = currentExperiment === 'dice' ? 
      coachMessages.encourage.dice : 
      coachMessages.encourage.cards;
    setCurrentCoachMessage(encourageMessages[Math.floor(Math.random() * encourageMessages.length)]);
    setCurrentCoachType('encourage');
  };

  const handleExperimentResult = (predicted: any, actual: any, attempts: number, experimentType?: string) => {
    let isCorrect = false;
    
    if (currentExperiment === 'dice') {
      isCorrect = predicted === actual;
      setLastResult({ predicted, actual, attempts, type: 'dice' });
    } else {
      // Card experiment logic
      if (experimentType === 'multi-draw') {
        if (predicted.type === 'all-hearts') {
          isCorrect = actual.every((card: any) => card.suit === 'hearts');
        } else if (predicted.type === 'mixed-suits') {
          isCorrect = !actual.every((card: any) => card.suit === 'hearts');
        }
      } else if (experimentType === 'face-cards') {
        if (predicted.type === 'at-least-one-face') {
          isCorrect = actual.some((card: any) => card.isFace);
        } else if (predicted.type === 'no-face-cards') {
          isCorrect = !actual.some((card: any) => card.isFace);
        }
      }
      setLastResult({ predicted, actual, attempts, type: 'cards', experimentType });
    }
    
    const newExperiments = experimentsCompleted + 1;
    const newCorrect = isCorrect ? correctPredictions + 1 : correctPredictions;
    
    setExperimentsCompleted(newExperiments);
    setCorrectPredictions(newCorrect);

    // Award badges
    const newBadges = [...badges];
    if (newExperiments === 1 && !badges.includes('First Try')) {
      newBadges.push('First Try');
    }
    if (isCorrect && !badges.includes('Lucky Guess')) {
      newBadges.push('Lucky Guess');
    }
    if (newCorrect >= 3 && !badges.includes('Probability Pro')) {
      newBadges.push('Probability Pro');
    }
    if (currentExperiment === 'cards' && !badges.includes('Card Master')) {
      newBadges.push('Card Master');
    }
    if (currentExperiment === 'cards' && experimentType === 'sequence' && isCorrect && !badges.includes('Sequence Sage')) {
      newBadges.push('Sequence Sage');
    }
    setBadges(newBadges);

    // Set feedback message with enhanced card-specific responses
    if (isCorrect) {
      const correctMessages = coachMessages.feedback.correct;
      setCurrentCoachMessage(correctMessages[Math.floor(Math.random() * correctMessages.length)]);
      setCurrentCoachType('success');
    } else {
      const incorrectMessages = coachMessages.feedback.incorrect;
      setCurrentCoachMessage(incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)]);
      setCurrentCoachType('feedback');
    }
    
    setGameState('feedback');
  };

  const handleContinue = () => {
    if (experimentsCompleted >= 3 && Math.random() > 0.5) {
      // Enhanced challenges and reflections for cards
      if (Math.random() > 0.5) {
        const challengeMessages = coachMessages.challenge;
        setCurrentCoachMessage(challengeMessages[Math.floor(Math.random() * challengeMessages.length)]);
        setCurrentCoachType('challenge');
      } else {
        const reflectionMessages = coachMessages.reflection;
        setCurrentCoachMessage(reflectionMessages[Math.floor(Math.random() * reflectionMessages.length)]);
        setCurrentCoachType('reflection');
      }
    } else {
      // Back to experiment with context-specific messages
      if (currentExperiment === 'cards' && Math.random() > 0.6) {
        // Use card-specific coaching messages
        const cardMessages = [
          ...coachMessages.cardSpecific.dynamic,
          ...coachMessages.cardSpecific.realTime,
          ...coachMessages.cardSpecific.stepByStep
        ];
        setCurrentCoachMessage(cardMessages[Math.floor(Math.random() * cardMessages.length)]);
        setCurrentCoachType('hint');
      } else {
        const encourageMessages = currentExperiment === 'dice' ? 
          coachMessages.encourage.dice : 
          coachMessages.encourage.cards;
        setCurrentCoachMessage(encourageMessages[Math.floor(Math.random() * encourageMessages.length)]);
        setCurrentCoachType('encourage');
      }
    }
    setGameState('experiment');
  };

  const handleProbabilityUpdate = (probs: any) => {
    setCardProbabilities(probs);
    
    // Trigger dynamic coaching based on probability changes
    if (probs.remaining < 20 && Math.random() > 0.7) {
      const dynamicMessages = coachMessages.cardSpecific.dynamic;
      setCurrentCoachMessage(dynamicMessages[Math.floor(Math.random() * dynamicMessages.length)]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold text-primary mb-2 bounce-in">
            Probability Adventure 🎲
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn probability through fun experiments with your AI coach!
          </p>
        </div>

        {/* Progress Card */}
        <GameProgress 
          experimentsCompleted={experimentsCompleted}
          correctPredictions={correctPredictions}
          badges={badges}
        />

        {/* Experiment Type Selector */}
        <Card className="slide-up bg-gradient-to-r from-card to-card/90">
          <CardContent className="p-4">
            <div className="flex justify-center gap-4">
              <Button
                variant={currentExperiment === 'dice' ? 'experiment' : 'outline'}
                size="lg"
                onClick={() => setCurrentExperiment('dice')}
                className="flex items-center gap-2 min-w-32"
              >
                <Dice6 className="w-5 h-5" />
                Dice Rolling
              </Button>
              <Button
                variant={currentExperiment === 'cards' ? 'experiment' : 'outline'}
                size="lg"
                onClick={() => setCurrentExperiment('cards')}
                className="flex items-center gap-2 min-w-32"
              >
                <Spade className="w-5 h-5" />
                Card Drawing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Coach */}
        <AiCoach 
          message={currentCoachMessage}
          type={currentCoachType}
          onNext={gameState === 'welcome' ? handleExperimentStart : 
                  gameState === 'feedback' ? handleContinue : undefined}
          actionText={gameState === 'welcome' ? "Let's Start!" : "Continue Adventure"}
        />

        {/* Experiment */}
        {gameState === 'experiment' && currentExperiment === 'dice' && (
          <DiceExperiment onResult={handleExperimentResult} />
        )}
        
        {gameState === 'experiment' && currentExperiment === 'cards' && (
          <CardExperiment 
            onResult={handleExperimentResult} 
            onProbabilityUpdate={handleProbabilityUpdate}
          />
        )}

        {/* Enhanced Comparison Results */}
        {gameState === 'feedback' && lastResult && (
          <Card className="slide-up">
            <CardHeader>
              <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Theoretical vs Your Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lastResult.type === 'dice' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2 text-primary">Theoretical Probability</h3>
                    <div className="text-3xl font-bold mb-2">16.67%</div>
                    <p className="text-sm text-muted-foreground">
                      Each number has a 1 in 6 chance (16.67%) of appearing on any single roll
                    </p>
                  </div>
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2 text-secondary">Your Results</h3>
                    <div className="text-3xl font-bold mb-2">
                      {experimentsCompleted > 0 ? ((correctPredictions / experimentsCompleted) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You've been correct {correctPredictions} out of {experimentsCompleted} times
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-2 text-primary">What You Drew</h3>
                      <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {lastResult.actual.map((card: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {card.value} of {card.suit}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lastResult.experimentType === 'multi-draw' && 
                          (lastResult.actual.every((c: any) => c.suit === 'hearts') ? 'All Hearts!' : 'Mixed Suits')}
                        {lastResult.experimentType === 'face-cards' && 
                          (lastResult.actual.some((c: any) => c.isFace) ? 'Contains Face Cards' : 'No Face Cards')}
                      </p>
                    </div>
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-2 text-secondary">Probability Analysis</h3>
                      <div className="text-3xl font-bold mb-2">
                        {((correctPredictions / experimentsCompleted) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accuracy across {experimentsCompleted} card experiments
                      </p>
                    </div>
                  </div>
                  
                  {/* Real-time probability display */}
                  {cardProbabilities.remaining && (
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-primary">Live Probability Update</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Cards remaining:</span>
                          <span className="font-medium ml-2">{cardProbabilities.remaining}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hearts chance:</span>
                          <span className="font-medium ml-2">{cardProbabilities.hearts?.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {lastResult.type === 'cards' ? 
                    "See how the deck shrinks with each draw—watch how your choices impact the next probability!" :
                    "Don't worry if it's not exact—more trials will help us understand better!"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
