import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';
import { PriceBar } from '../../types/stock';

interface IndicatorSubpanelsProps {
  data: PriceBar[];
  showRSI: boolean;
  showMACD: boolean;
}

const tooltipStyle = {
  background: '#1a2035',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10,
  fontSize: 11,
  fontFamily: 'JetBrains Mono',
};

export const IndicatorSubpanels: React.FC<IndicatorSubpanelsProps> = ({ data, showRSI, showMACD }) => {
  if (!showRSI && !showMACD) return null;

  const latest = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      {showRSI && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>RSI (14)</span>
            {latest?.rsi14 != null && (
              <span className="text-xs font-mono font-bold" style={{
                color: latest.rsi14 > 70 ? '#f87171' : latest.rsi14 < 30 ? '#4ade80' : '#fbbf24'
              }}>
                {latest.rsi14.toFixed(1)} · {latest.rsi14 > 70 ? 'Overbought' : latest.rsi14 < 30 ? 'Oversold' : 'Neutral'}
              </span>
            )}
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rsiG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="dateLabel" hide />
                <YAxis domain={[0, 100]} ticks={[30, 70]} tick={{ fontSize: 9, fill: '#334155' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94a3b8' }} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" strokeWidth={1} />
                <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="2 2" strokeWidth={1} />
                <Area type="monotone" dataKey="rsi14" stroke="#fbbf24" strokeWidth={1.8} fill="url(#rsiG)" dot={false} name="RSI" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showMACD && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: '#f87171' }}>MACD (12,26,9)</span>
            {latest?.macdHist != null && (
              <span className="text-xs font-mono font-bold" style={{ color: latest.macdHist >= 0 ? '#4ade80' : '#f87171' }}>
                Hist: {latest.macdHist >= 0 ? '+' : ''}{latest.macdHist.toFixed(2)}
              </span>
            )}
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="dateLabel" hide />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9, fill: '#334155' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94a3b8' }} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                <Bar dataKey="macdHist" fill="#60a5fa" opacity={0.6} maxBarSize={6} name="Histogram" />
                <Line type="monotone" dataKey="macdLine" stroke="#f87171" dot={false} strokeWidth={1.5} name="MACD" />
                <Line type="monotone" dataKey="macdSignal" stroke="#a78bfa" dot={false} strokeWidth={1.5} name="Signal" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
