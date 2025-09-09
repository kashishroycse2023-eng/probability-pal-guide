import React, { useState, useEffect } from 'react';
import AiCoach from '@/components/AiCoach';
import DiceExperiment from '@/components/DiceExperiment';
import GameProgress from '@/components/GameProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [gameState, setGameState] = useState<'welcome' | 'experiment' | 'feedback'>('welcome');
  const [experimentsCompleted, setExperimentsCompleted] = useState(0);
  const [correctPredictions, setCorrectPredictions] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [currentCoachMessage, setCurrentCoachMessage] = useState('');
  const [currentCoachType, setCurrentCoachType] = useState<'welcome' | 'encourage' | 'feedback' | 'hint' | 'success' | 'challenge' | 'reflection'>('welcome');
  const [lastResult, setLastResult] = useState<{predicted: number, actual: number, attempts: number} | null>(null);

  // AI Coach Messages based on the 10 types provided
  const coachMessages = {
    welcome: [
      "Hi there! Ready to play with chances and surprises? Don't worry—I'll help you learn as you go!",
      "Let's roll, spin, and draw! Every experiment is a step toward becoming a probability pro!"
    ],
    encourage: [
      "Before you roll the dice, what do you think will happen? Trust your gut or give it a thought!",
      "You're about to roll the dice—what's the chance it lands on your number? Let's see if your guess is right!"
    ],
    feedback: {
      correct: [
        "You got it! That's the correct guess—way to go!",
        "Perfect prediction! You're getting sharper every time."
      ],
      incorrect: [
        "Whoa! That's unexpected—but that's the fun of probability! Let's learn why.",
        "You guessed close! Sometimes probability surprises us, but it's always about learning.",
        "Oops! That didn't go as expected—but every trial helps you learn more!"
      ]
    },
    hint: [
      "Let's break it down: each dice has 6 faces, so each number has a 1 in 6 chance!",
      "Need help? Try thinking about how many dice faces there are and what that means for your chances!"
    ],
    challenge: [
      "Feeling confident? Try predicting your next 3 rolls and see how many you can get right!",
      "Let's level up! Can you guess which number will come up most often in your next 5 rolls?"
    ],
    reflection: [
      "What surprised you the most about this experiment?",
      "Do you think the results would change if we tried it more times? Let's explore!"
    ]
  };

  useEffect(() => {
    // Set initial welcome message
    const welcomeMessages = coachMessages.welcome;
    setCurrentCoachMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
    setCurrentCoachType('welcome');
  }, []);

  const handleExperimentStart = () => {
    setGameState('experiment');
    const encourageMessages = coachMessages.encourage;
    setCurrentCoachMessage(encourageMessages[Math.floor(Math.random() * encourageMessages.length)]);
    setCurrentCoachType('encourage');
  };

  const handleExperimentResult = (predicted: number, actual: number, attempts: number) => {
    setLastResult({ predicted, actual, attempts });
    const isCorrect = predicted === actual;
    const newExperiments = experimentsCompleted + 1;
    const newCorrect = isCorrect ? correctPredictions + 1 : correctPredictions;
    
    setExperimentsCompleted(newExperiments);
    setCorrectPredictions(newCorrect);

    // Award badges
    const newBadges = [...badges];
    if (newExperiments === 1 && !badges.includes('First Roll')) {
      newBadges.push('First Roll');
    }
    if (isCorrect && !badges.includes('Lucky Guess')) {
      newBadges.push('Lucky Guess');
    }
    if (newCorrect >= 3 && !badges.includes('Probability Pro')) {
      newBadges.push('Probability Pro');
    }
    setBadges(newBadges);

    // Set feedback message
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
      // Challenge or reflection
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
      // Back to experiment
      const encourageMessages = coachMessages.encourage;
      setCurrentCoachMessage(encourageMessages[Math.floor(Math.random() * encourageMessages.length)]);
      setCurrentCoachType('encourage');
    }
    setGameState('experiment');
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

        {/* AI Coach */}
        <AiCoach 
          message={currentCoachMessage}
          type={currentCoachType}
          onNext={gameState === 'welcome' ? handleExperimentStart : 
                  gameState === 'feedback' ? handleContinue : undefined}
          actionText={gameState === 'welcome' ? "Let's Start!" : "Continue Adventure"}
        />

        {/* Experiment */}
        {gameState === 'experiment' && (
          <DiceExperiment onResult={handleExperimentResult} />
        )}

        {/* Comparison Results */}
        {gameState === 'feedback' && lastResult && (
          <Card className="slide-up">
            <CardHeader>
              <CardTitle className="text-xl text-center">Theoretical vs Your Result</CardTitle>
            </CardHeader>
            <CardContent>
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
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't worry if it's not exact—more trials will help us understand better! 
                  The more you experiment, the closer your results get to the theoretical probability.
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
