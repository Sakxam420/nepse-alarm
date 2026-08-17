import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { PriceBar } from '../../types/stock';
import { Badge } from '../common/Badge';

interface IndicatorSubpanelsProps {
  data: PriceBar[];
  showRSI: boolean;
  showMACD: boolean;
}

export const IndicatorSubpanels: React.FC<IndicatorSubpanelsProps> = ({
  data,
  showRSI,
  showMACD,
}) => {
  if (!showRSI && !showMACD) return null;

  const latest = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
      {/* RSI (14) Panel */}
      {showRSI && (
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400">RSI (14)</span>
              <span className="text-[10px] text-slate-500">Momentum Oscillator</span>
            </div>
            {latest?.rsi14 !== null && latest?.rsi14 !== undefined && (
              <Badge
                variant={latest.rsi14 > 70 ? 'rose' : latest.rsi14 < 30 ? 'emerald' : 'amber'}
                size="sm"
              >
                {latest.rsi14.toFixed(1)}{' '}
                {latest.rsi14 > 70 ? '• OVERBOUGHT' : latest.rsi14 < 30 ? '• OVERSOLD' : '• NEUTRAL'}
              </Badge>
            )}
          </div>

          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rsiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="dateFormatted" hide />
                <YAxis
                  domain={[0, 100]}
                  ticks={[30, 50, 70]}
                  tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#ef4444"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  label={{ value: '70', position: 'insideTopRight', fill: '#ef4444', fontSize: 9 }}
                />
                <ReferenceLine
                  y={30}
                  stroke="#10b981"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  label={{ value: '30', position: 'insideBottomRight', fill: '#10b981', fontSize: 9 }}
                />
                <Area
                  type="monotone"
                  dataKey="rsi14"
                  stroke="#f59e0b"
                  strokeWidth={1.8}
                  fill="url(#rsiGradient)"
                  dot={false}
                  name="RSI 14"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MACD (12, 26, 9) Panel */}
      {showMACD && (
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-pink-400">MACD (12, 26, 9)</span>
              <span className="text-[10px] text-slate-500">Trend & Momentum</span>
            </div>
            {latest?.macdHist !== null && latest?.macdHist !== undefined && (
              <Badge variant={latest.macdHist >= 0 ? 'emerald' : 'rose'} size="sm">
                Hist: {latest.macdHist >= 0 ? '+' : ''}{latest.macdHist.toFixed(2)}
              </Badge>
            )}
          </div>

          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="dateFormatted" hide />
                <YAxis
                  tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />
                <Bar
                  dataKey="macdHist"
                  name="Histogram"
                  fill="#38bdf8"
                  opacity={0.7}
                  maxBarSize={6}
                />
                <Line
                  type="monotone"
                  dataKey="macdLine"
                  name="MACD"
                  stroke="#ec4899"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="macdSignal"
                  name="Signal"
                  stroke="#8b5cf6"
                  dot={false}
                  strokeWidth={1.5}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
