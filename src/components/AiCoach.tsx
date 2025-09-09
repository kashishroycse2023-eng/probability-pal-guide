import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Heart, Trophy, Target } from 'lucide-react';

interface AiCoachProps {
  message: string;
  type: 'welcome' | 'encourage' | 'feedback' | 'hint' | 'success' | 'challenge' | 'reflection';
  onNext?: () => void;
  actionText?: string;
}

const AiCoach: React.FC<AiCoachProps> = ({ message, type, onNext, actionText = "Continue" }) => {
  const getIcon = () => {
    switch (type) {
      case 'hint': return <Lightbulb className="w-6 h-6" />;
      case 'success': return <Trophy className="w-6 h-6" />;
      case 'challenge': return <Target className="w-6 h-6" />;
      default: return <Heart className="w-6 h-6" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'success': return 'success';
      case 'hint': return 'warning';
      case 'challenge': return 'experiment';
      default: return 'coach';
    }
  };

  return (
    <Card className="bounce-in bg-card/80 backdrop-blur-sm border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 p-3 rounded-full ${
            type === 'success' ? 'bg-success/20 text-success' :
            type === 'hint' ? 'bg-warning/20 text-warning' :
            type === 'challenge' ? 'bg-primary/20 text-primary' :
            'bg-secondary/20 text-secondary'
          }`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-foreground leading-relaxed text-base">{message}</p>
            </div>
            {onNext && (
              <Button 
                variant={getVariant()} 
                size="lg"
                onClick={onNext}
                className="w-full sm:w-auto"
              >
                {actionText}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiCoach;