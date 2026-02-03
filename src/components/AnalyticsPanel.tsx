import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { MathExample, Operation } from '@/pages/Index';

interface AnalyticsPanelProps {
  examples: MathExample[];
}

const AnalyticsPanel = ({ examples }: AnalyticsPanelProps) => {
  const getOperationStats = () => {
    const stats: Record<Operation, number> = { '+': 0, '-': 0, '×': 0, '÷': 0 };
    examples.forEach(ex => {
      stats[ex.operation]++;
    });
    return stats;
  };

  const stats = getOperationStats();
  const total = examples.length;

  const operationInfo = [
    { 
      op: '+' as Operation, 
      name: 'Сложение', 
      icon: 'Plus', 
      color: '#8B5CF6',
      gradient: 'from-purple to-purple/60'
    },
    { 
      op: '-' as Operation, 
      name: 'Вычитание', 
      icon: 'Minus', 
      color: '#D946EF',
      gradient: 'from-magenta to-magenta/60'
    },
    { 
      op: '×' as Operation, 
      name: 'Умножение', 
      icon: 'X', 
      color: '#F97316',
      gradient: 'from-orange to-orange/60'
    },
    { 
      op: '÷' as Operation, 
      name: 'Деление', 
      icon: 'Divide', 
      color: '#0EA5E9',
      gradient: 'from-blue to-blue/60'
    },
  ];

  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border animate-fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Icon name="BarChart3" size={24} className="text-blue" />
        Статистика по операциям
      </h2>

      {total === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="TrendingUp" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Добавьте примеры для просмотра статистики</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {operationInfo.map(({ op, name, icon, color, gradient }) => {
              const count = stats[op];
              const percentage = getPercentage(count);
              
              return (
                <div
                  key={op}
                  className="p-4 rounded-xl bg-background/50 border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      <Icon name={icon as any} size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color }}>
                        {count}
                      </div>
                      <div className="text-xs text-muted-foreground">{name}</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    {percentage}% от всех
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple/10 to-magenta/10 border border-purple/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Calculator" size={24} className="text-purple" />
                <div>
                  <div className="text-sm text-muted-foreground">Всего примеров</div>
                  <div className="text-3xl font-bold text-purple">{total}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Самая популярная операция</div>
                <div className="text-lg font-semibold">
                  {operationInfo.find(info => stats[info.op] === Math.max(...Object.values(stats)))?.name || '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ArrowUp" size={16} className="text-green-500" />
                <span className="text-sm text-muted-foreground">Максимальный результат</span>
              </div>
              <div className="text-2xl font-bold text-green-500">
                {examples.length > 0 ? Math.max(...examples.map(ex => ex.result)) : 0}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ArrowDown" size={16} className="text-red-500" />
                <span className="text-sm text-muted-foreground">Минимальный результат</span>
              </div>
              <div className="text-2xl font-bold text-red-500">
                {examples.length > 0 ? Math.min(...examples.map(ex => ex.result)) : 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AnalyticsPanel;
