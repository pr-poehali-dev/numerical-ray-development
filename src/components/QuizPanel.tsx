import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Operation } from '@/pages/Index';

interface QuizPanelProps {
  score: { correct: number; total: number };
  onScoreUpdate: (score: { correct: number; total: number }) => void;
}

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
}

const QuizPanel = ({ score, onScoreUpdate }: QuizPanelProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const calculateResult = (n1: number, n2: number, op: Operation): number => {
    switch (op) {
      case '+': return n1 + n2;
      case '-': return n1 - n2;
      case '×': return n1 * n2;
      case '÷': return Math.floor(n1 / n2);
      default: return 0;
    }
  };

  const generateQuestion = () => {
    const operations: Operation[] = ['+', '-', '×', '÷'];
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    
    let n1, n2;
    
    if (randomOp === '×') {
      n1 = Math.floor(Math.random() * 50) + 1;
      n2 = Math.floor(Math.random() * 20) + 1;
    } else if (randomOp === '÷') {
      n2 = Math.floor(Math.random() * 20) + 1;
      n1 = n2 * (Math.floor(Math.random() * 50) + 1);
    } else if (randomOp === '-') {
      n1 = Math.floor(Math.random() * 500) + 100;
      n2 = Math.floor(Math.random() * n1);
    } else {
      n1 = Math.floor(Math.random() * 500) + 10;
      n2 = Math.floor(Math.random() * 500) + 10;
    }
    
    const correctAnswer = calculateResult(n1, n2, randomOp);
    
    setCurrentQuestion({ num1: n1, num2: n2, operation: randomOp, correctAnswer });
    setUserAnswer('');
    setFeedback(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = () => {
    if (!currentQuestion || userAnswer === '') return;
    
    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setIsAnswered(true);
    
    onScoreUpdate({
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    });
  };

  const handleNext = () => {
    generateQuestion();
  };

  const resetScore = () => {
    onScoreUpdate({ correct: 0, total: 0 });
    generateQuestion();
  };

  const getOperationSymbol = (op: Operation) => {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '×': return '×';
      case '÷': return '÷';
    }
  };

  const successRate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Icon name="Brain" size={28} className="text-blue" />
              Математическая викторина
            </h2>
            <p className="text-muted-foreground mt-1">Проверьте свои знания!</p>
          </div>
          <Button variant="outline" size="sm" onClick={resetScore}>
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Сбросить
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Icon name="Check" size={24} className="text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{score.correct}</div>
                <div className="text-xs text-muted-foreground">Правильных</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Icon name="X" size={24} className="text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{score.total - score.correct}</div>
                <div className="text-xs text-muted-foreground">Неправильных</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue/10 to-purple/10 border-blue/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue/20 flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue">{successRate}%</div>
                <div className="text-xs text-muted-foreground">Успешность</div>
              </div>
            </div>
          </Card>
        </div>

        {score.total > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Прогресс</span>
              <span className="text-sm font-semibold">{score.correct} / {score.total}</span>
            </div>
            <Progress value={successRate} className="h-2" />
          </div>
        )}

        {currentQuestion && (
          <div className="space-y-6">
            <div className="text-center py-12 bg-gradient-to-br from-purple/5 to-magenta/5 rounded-2xl border border-border">
              <div className="text-6xl font-bold mb-4 font-mono">
                <span className="text-purple">{currentQuestion.num1}</span>
                <span className="text-muted-foreground mx-4">{getOperationSymbol(currentQuestion.operation)}</span>
                <span className="text-magenta">{currentQuestion.num2}</span>
                <span className="text-muted-foreground mx-4">=</span>
                <span className="text-orange">?</span>
              </div>
              <p className="text-muted-foreground">Введите ответ ниже</p>
            </div>

            {!isAnswered ? (
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="Ваш ответ"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="text-2xl text-center font-bold h-16 bg-background/50"
                  autoFocus
                />
                <Button
                  onClick={handleSubmit}
                  disabled={userAnswer === ''}
                  className="h-16 px-8 bg-gradient-to-r from-purple to-magenta hover:from-purple/90 hover:to-magenta/90"
                >
                  <Icon name="CheckCircle" size={24} className="mr-2" />
                  Проверить
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Card className={`p-6 border-2 ${
                  feedback === 'correct' 
                    ? 'bg-green-500/10 border-green-500' 
                    : 'bg-red-500/10 border-red-500'
                }`}>
                  <div className="flex items-center gap-4">
                    {feedback === 'correct' ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center animate-scale-in">
                          <Icon name="Check" size={32} className="text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-500">Правильно!</div>
                          <div className="text-muted-foreground">
                            {currentQuestion.num1} {getOperationSymbol(currentQuestion.operation)} {currentQuestion.num2} = {currentQuestion.correctAnswer}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center animate-scale-in">
                          <Icon name="X" size={32} className="text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-500">Неправильно</div>
                          <div className="text-muted-foreground">
                            Правильный ответ: {currentQuestion.correctAnswer}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                <Button
                  onClick={handleNext}
                  className="w-full h-16 bg-gradient-to-r from-orange to-magenta hover:from-orange/90 hover:to-magenta/90"
                >
                  <Icon name="ArrowRight" size={24} className="mr-2" />
                  Следующий вопрос
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {score.total >= 10 && (
        <Card className="p-6 bg-gradient-to-br from-purple/10 to-magenta/10 border-purple/20 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-magenta flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
            <div>
              <div className="text-xl font-bold">Отличная работа!</div>
              <div className="text-muted-foreground">
                Вы ответили на {score.total} вопросов с результатом {successRate}%
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuizPanel;
