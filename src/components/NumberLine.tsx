import { useEffect, useRef, useState } from 'react';
import { MathExample } from '@/pages/Index';

interface NumberLineProps {
  examples: MathExample[];
}

const NumberLine = ({ examples }: NumberLineProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1400, height: 600 });
  
  const maxValue = Math.max(5000, ...examples.map(ex => Math.max(ex.num1, ex.result, ex.num1 + ex.num2)));
  const scale = (dimensions.width - 100) / maxValue;
  const baseY = dimensions.height - 100;

  const getArcPath = (start: number, end: number, index: number): string => {
    const startX = 50 + start * scale;
    const endX = 50 + end * scale;
    const midX = (startX + endX) / 2;
    const distance = Math.abs(endX - startX);
    const arcHeight = Math.min(150 + index * 30, 300);
    const controlY = baseY - arcHeight;

    return `M ${startX} ${baseY} Q ${midX} ${controlY}, ${endX} ${baseY}`;
  };

  const generateTicks = () => {
    const ticks = [];
    const step = maxValue <= 100 ? 10 : maxValue <= 1000 ? 100 : 500;
    
    for (let i = 0; i <= maxValue; i += step) {
      const x = 50 + i * scale;
      const isMajor = i % (step * 5) === 0;
      ticks.push(
        <g key={`tick-${i}`}>
          <line
            x1={x}
            y1={baseY}
            x2={x}
            y2={baseY + (isMajor ? 15 : 10)}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={isMajor ? 2 : 1}
            opacity={0.6}
          />
          {isMajor && (
            <text
              x={x}
              y={baseY + 35}
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="12"
              fontWeight="500"
            >
              {i}
            </text>
          )}
        </g>
      );
    }
    return ticks;
  };

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: 600
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      {examples.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple/20 to-magenta/20 flex items-center justify-center">
            <span className="text-4xl">📐</span>
          </div>
          <p className="text-muted-foreground text-lg">Добавьте примеры на вкладке "Примеры"</p>
        </div>
      ) : (
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
        >
          <line
            x1={50}
            y1={baseY}
            x2={dimensions.width - 50}
            y2={baseY}
            stroke="hsl(var(--foreground))"
            strokeWidth={3}
            opacity={0.8}
          />
          
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3, 0 6"
                fill="hsl(var(--foreground))"
                opacity={0.8}
              />
            </marker>
          </defs>

          <line
            x1={dimensions.width - 50}
            y1={baseY}
            x2={dimensions.width - 40}
            y2={baseY}
            stroke="hsl(var(--foreground))"
            strokeWidth={3}
            markerEnd="url(#arrowhead)"
            opacity={0.8}
          />

          {generateTicks()}

          {examples.map((example, index) => {
            const isPositive = example.operation === '+' || example.operation === '×';
            const start = example.operation === '×' || example.operation === '÷' 
              ? 0 
              : example.num1;
            const end = example.result;

            return (
              <g key={example.id} className="animate-fade-in">
                <path
                  d={getArcPath(start, end, index)}
                  stroke={example.color}
                  strokeWidth={4}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.9}
                  className="animate-draw-arc"
                  style={{
                    strokeDasharray: 1000,
                    strokeDashoffset: 0
                  }}
                />
                
                <circle
                  cx={50 + start * scale}
                  cy={baseY}
                  r={6}
                  fill={example.color}
                  className="animate-scale-in"
                />
                
                <circle
                  cx={50 + end * scale}
                  cy={baseY}
                  r={6}
                  fill={example.color}
                  className="animate-scale-in"
                />

                <text
                  x={50 + ((start + end) / 2) * scale}
                  y={baseY - 160 - index * 30}
                  textAnchor="middle"
                  fill={example.color}
                  fontSize="16"
                  fontWeight="600"
                  className="animate-fade-in"
                >
                  {example.num1} {example.operation} {example.num2} = {example.result}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default NumberLine;
