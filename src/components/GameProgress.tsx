import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap, Star } from 'lucide-react';

interface GameProgressProps {
  experimentsCompleted: number;
  correctPredictions: number;
  badges: string[];
}

const GameProgress: React.FC<GameProgressProps> = ({ 
  experimentsCompleted, 
  correctPredictions, 
  badges 
}) => {
  const accuracy = experimentsCompleted > 0 ? (correctPredictions / experimentsCompleted) * 100 : 0;
  
  const getBadgeIcon = (badgeName: string) => {
    switch (badgeName) {
      case 'First Roll': return <Zap className="w-4 h-4" />;
      case 'Lucky Guess': return <Star className="w-4 h-4" />;
      case 'Probability Pro': return <Trophy className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Card className="slide-up bg-gradient-to-br from-card to-card/80">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Your Progress
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{experimentsCompleted}</div>
              <div className="text-sm text-muted-foreground">Experiments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{correctPredictions}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{accuracy.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {badges.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="flex items-center gap-1 bg-success/20 text-success hover:bg-success/30"
                  >
                    {getBadgeIcon(badge)}
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameProgress;