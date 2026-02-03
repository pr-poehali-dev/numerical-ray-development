import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { MathExample, Operation } from '@/pages/Index';

interface ExamplesPanelProps {
  examples: MathExample[];
  onAddExample: (example: Omit<MathExample, 'id'>) => void;
  onRemoveExample: (id: string) => void;
  onClearExamples: () => void;
}

const colors = [
  { name: 'Фиолетовый', value: '#8B5CF6' },
  { name: 'Розовый', value: '#D946EF' },
  { name: 'Оранжевый', value: '#F97316' },
  { name: 'Синий', value: '#0EA5E9' },
  { name: 'Зелёный', value: '#10B981' },
  { name: 'Жёлтый', value: '#F59E0B' },
];

const ExamplesPanel = ({ examples, onAddExample, onRemoveExample, onClearExamples }: ExamplesPanelProps) => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState<Operation>('+');
  const [selectedColor, setSelectedColor] = useState(colors[0].value);

  const calculateResult = (n1: number, n2: number, op: Operation): number => {
    switch (op) {
      case '+': return n1 + n2;
      case '-': return n1 - n2;
      case '×': return n1 * n2;
      case '÷': return Math.floor(n1 / n2);
      default: return 0;
    }
  };

  const handleAddExample = () => {
    const n1 = parseInt(num1);
    const n2 = parseInt(num2);

    if (isNaN(n1) || isNaN(n2)) {
      return;
    }

    if (n1 < 0 || n1 > 5000 || n2 < 0 || n2 > 5000) {
      return;
    }

    if (operation === '÷' && n2 === 0) {
      return;
    }

    const result = calculateResult(n1, n2, operation);

    onAddExample({
      num1: n1,
      num2: n2,
      operation,
      color: selectedColor,
      result
    });

    setNum1('');
    setNum2('');
  };

  const getOperationIcon = (op: Operation) => {
    switch (op) {
      case '+': return 'Plus';
      case '-': return 'Minus';
      case '×': return 'X';
      case '÷': return 'Divide';
    }
  };

  const generateRandomExample = () => {
    const operations: Operation[] = ['+', '-', '×', '÷'];
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)].value;
    
    let n1, n2;
    
    if (randomOp === '×') {
      n1 = Math.floor(Math.random() * 50) + 1;
      n2 = Math.floor(Math.random() * 50) + 1;
    } else if (randomOp === '÷') {
      n2 = Math.floor(Math.random() * 50) + 1;
      n1 = n2 * (Math.floor(Math.random() * 50) + 1);
    } else if (randomOp === '-') {
      n1 = Math.floor(Math.random() * 500) + 100;
      n2 = Math.floor(Math.random() * n1);
    } else {
      n1 = Math.floor(Math.random() * 500) + 10;
      n2 = Math.floor(Math.random() * 500) + 10;
    }
    
    const result = calculateResult(n1, n2, randomOp);
    
    onAddExample({
      num1: n1,
      num2: n2,
      operation: randomOp,
      color: randomColor,
      result
    });
  };

  const generateMultipleExamples = (count: number) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => generateRandomExample(), i * 100);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="PlusCircle" size={24} className="text-purple" />
          Добавить пример
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Первое число</label>
            <Input
              type="number"
              placeholder="0-5000"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              min={0}
              max={5000}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Операция</label>
            <Select value={operation} onValueChange={(v) => setOperation(v as Operation)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+">➕ Сложение (+)</SelectItem>
                <SelectItem value="-">➖ Вычитание (−)</SelectItem>
                <SelectItem value="×">✖️ Умножение (×)</SelectItem>
                <SelectItem value="÷">➗ Деление (÷)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Второе число</label>
            <Input
              type="number"
              placeholder="0-5000"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              min={0}
              max={5000}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Цвет дуги</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colors.map(color => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground opacity-0">Действие</label>
            <Button 
              onClick={handleAddExample}
              className="w-full bg-gradient-to-r from-purple to-magenta hover:from-purple/90 hover:to-magenta/90"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => generateRandomExample()}
            className="bg-gradient-to-r from-purple/10 to-magenta/10 hover:from-purple/20 hover:to-magenta/20 border-purple/30"
          >
            <Icon name="Sparkles" size={16} className="mr-2" />
            Случайный пример
          </Button>
          <Button
            variant="outline"
            onClick={() => generateMultipleExamples(3)}
            className="bg-gradient-to-r from-orange/10 to-magenta/10 hover:from-orange/20 hover:to-magenta/20 border-orange/30"
          >
            <Icon name="Zap" size={16} className="mr-2" />
            3 примера
          </Button>
          <Button
            variant="outline"
            onClick={() => generateMultipleExamples(5)}
            className="bg-gradient-to-r from-blue/10 to-purple/10 hover:from-blue/20 hover:to-purple/20 border-blue/30"
          >
            <Icon name="Flame" size={16} className="mr-2" />
            5 примеров
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Icon name="List" size={24} className="text-orange" />
            Текущие примеры ({examples.length})
          </h2>
          {examples.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onClearExamples}
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Очистить всё
            </Button>
          )}
        </div>

        {examples.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Нет добавленных примеров</p>
          </div>
        ) : (
          <div className="space-y-3">
            {examples.map((example) => (
              <div
                key={example.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all animate-fade-in"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: example.color }}
                  />
                  <div className="flex items-center gap-2 text-lg font-mono">
                    <span className="text-foreground font-semibold">{example.num1}</span>
                    <Icon name={getOperationIcon(example.operation)} size={16} className="text-muted-foreground" />
                    <span className="text-foreground font-semibold">{example.num2}</span>
                    <span className="text-muted-foreground">=</span>
                    <span 
                      className="font-bold"
                      style={{ color: example.color }}
                    >
                      {example.result}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveExample(example.id)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExamplesPanel;