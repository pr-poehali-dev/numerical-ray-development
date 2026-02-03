import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NumberLine from '@/components/NumberLine';
import ExamplesPanel from '@/components/ExamplesPanel';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import Icon from '@/components/ui/icon';

export type Operation = '+' | '-' | '×' | '÷';

export interface MathExample {
  id: string;
  num1: number;
  num2: number;
  operation: Operation;
  color: string;
  result: number;
}

const Index = () => {
  const [examples, setExamples] = useState<MathExample[]>([]);
  const [activeTab, setActiveTab] = useState('main');

  const addExample = (example: Omit<MathExample, 'id'>) => {
    const newExample: MathExample = {
      ...example,
      id: `example-${Date.now()}-${Math.random()}`
    };
    setExamples(prev => [...prev, newExample]);
  };

  const removeExample = (id: string) => {
    setExamples(prev => prev.filter(ex => ex.id !== id));
  };

  const clearExamples = () => {
    setExamples([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple to-magenta flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple via-magenta to-orange bg-clip-text text-transparent">
                Числовой луч
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="TrendingUp" size={16} />
              <span>{examples.length} {examples.length === 1 ? 'пример' : 'примера'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-card/50 backdrop-blur-sm">
            <TabsTrigger 
              value="main" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple data-[state=active]:to-magenta data-[state=active]:text-white"
            >
              <Icon name="Home" size={16} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger 
              value="examples"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange data-[state=active]:to-magenta data-[state=active]:text-white"
            >
              <Icon name="BookOpen" size={16} className="mr-2" />
              Примеры
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-6 animate-fade-in">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 shadow-2xl">
              <NumberLine examples={examples} />
            </div>
            
            <AnalyticsPanel examples={examples} />
          </TabsContent>

          <TabsContent value="examples" className="animate-fade-in">
            <ExamplesPanel 
              examples={examples}
              onAddExample={addExample}
              onRemoveExample={removeExample}
              onClearExamples={clearExamples}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
