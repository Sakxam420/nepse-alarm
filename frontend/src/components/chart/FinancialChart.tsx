import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Area, Line, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { PriceBar, Company, ChartType, Timeframe } from '../../types/stock';
import { IndicatorSubpanels } from './IndicatorSubpanels';

const fmtDate = (d: string) => {
  const [, m, day] = d.split('-');
  return `${day}/${m}`;
};

const TIMEFRAME_BARS: Record<Timeframe, number> = {
  '1W': 7, '1M': 22, '3M': 65, '6M': 130, '1Y': 252, 'ALL': 9999,
};

interface FinancialChartProps {
  company?: Company;
  history: PriceBar[];
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ history }) => {
  const [tf, setTf] = useState<Timeframe>('3M');
  const [type, setType] = useState<ChartType>('area');
  const [showEMA, setShowEMA] = useState(true);
  const [showBB, setShowBB] = useState(false);
  const [showVol, setShowVol] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [hovered, setHovered] = useState<PriceBar | null>(null);

  const data = useMemo(() => {
    const count = TIMEFRAME_BARS[tf];
    return history.slice(-count).map(b => ({ ...b, dateLabel: fmtDate(b.date) }));
  }, [history, tf]);

  const latest = data[data.length - 1] ?? null;
  const active = hovered ?? latest;

  const isUp = active ? active.close >= active.open : true;

  const CandlestickShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;
    const _open = payload.open;
    const _close = payload.close;
    const _high = payload.high;
    const _low = payload.low;
    const bull = _close >= _open;
    const color = bull ? '#22c55e' : '#ef4444';
    if (!height || !width) return null;
    const mid = x + width / 2;
    const bodyTop = Math.min(y, y + height);
    const bodyBot = Math.max(y, y + height);
    const pxPerUnit = Math.abs(height) / (Math.abs(_close - _open) || 0.01);
    const wickTop = bodyTop - (_high - Math.max(_open, _close)) * pxPerUnit;
    const wickBot = bodyBot + (Math.min(_open, _close) - _low) * pxPerUnit;
    return (
      <g>
        <line x1={mid} y1={wickTop} x2={mid} y2={bodyTop} stroke={color} strokeWidth={1.5} />
        <line x1={mid} y1={bodyBot} x2={mid} y2={wickBot} stroke={color} strokeWidth={1.5} />
        <rect x={x + 1} y={bodyTop} width={Math.max(width - 2, 2)} height={Math.max(Math.abs(height), 2)} fill={color} rx={1} />
      </g>
    );
  };

  const TF_OPTS: Timeframe[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

  const IndicatorToggle = ({ label, active: on, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) => (
    <button
      onClick={onClick}
      className="text-xs font-mono px-2.5 py-1 rounded-lg border transition-all"
      style={{
        background: on ? `${color}15` : 'transparent',
        borderColor: on ? `${color}40` : 'rgba(255,255,255,0.07)',
        color: on ? color : '#475569',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-4">
      {/* Toolbar row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Timeframe selector */}
        <div className="seg-control">
          {TF_OPTS.map(t => (
            <button key={t} className={`seg-btn ${tf === t ? 'active' : ''}`} onClick={() => setTf(t)}>{t}</button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="seg-control">
            <button className={`seg-btn ${type === 'area' ? 'active' : ''}`} onClick={() => setType('area')}>Area</button>
            <button className={`seg-btn ${type === 'candlestick' ? 'active' : ''}`} onClick={() => setType('candlestick')}>Candles</button>
          </div>
          <div className="h-4 w-px bg-white/8 hidden sm:block" />
          <div className="flex items-center gap-1">
            <IndicatorToggle label="EMA" active={showEMA} onClick={() => setShowEMA(v => !v)} color="#60a5fa" />
            <IndicatorToggle label="BB" active={showBB} onClick={() => setShowBB(v => !v)} color="#a78bfa" />
            <IndicatorToggle label="Vol" active={showVol} onClick={() => setShowVol(v => !v)} color="#94a3b8" />
            <IndicatorToggle label="RSI" active={showRSI} onClick={() => setShowRSI(v => !v)} color="#fbbf24" />
            <IndicatorToggle label="MACD" active={showMACD} onClick={() => setShowMACD(v => !v)} color="#f87171" />
          </div>
        </div>
      </div>

      {/* OHLC readout bar */}
      {active && (
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono" style={{ color: '#64748b' }}>
          <span style={{ color: '#94a3b8' }}>{active.date}</span>
          <span>O <strong className="text-white">{active.open.toFixed(2)}</strong></span>
          <span>H <strong className="text-green-400">{active.high.toFixed(2)}</strong></span>
          <span>L <strong className="text-red-400">{active.low.toFixed(2)}</strong></span>
          <span>C <strong className={isUp ? 'text-green-400' : 'text-red-400'}>{active.close.toFixed(2)}</strong></span>
          <span>Vol <strong className="text-white">{(active.volume / 1000).toFixed(1)}K</strong></span>
        </div>
      )}

      {/* Main chart */}
      <div className="h-[340px] sm:h-[380px]" onMouseLeave={() => setHovered(null)}>
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">Loading price data…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
              onMouseMove={(state: any) => {
                if (state?.activePayload?.[0]?.payload) setHovered(state.activePayload[0].payload);
              }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#334155', fontFamily: 'JetBrains Mono' }}
                interval="preserveStartEnd"
              />
              <YAxis
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#334155', fontFamily: 'JetBrains Mono' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a2035',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 10,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#e2e8f0' }}
              />

              {showVol && (
                <Bar dataKey="volume" fill="rgba(255,255,255,0.04)" maxBarSize={8} yAxisId={0} />
              )}

              {type === 'area' && (
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#22c55e', stroke: '#0e1117', strokeWidth: 2 }}
                  name="Price"
                />
              )}

              {type === 'candlestick' && (
                <Bar dataKey="close" shape={<CandlestickShape />} maxBarSize={12} name="Price" />
              )}

              {showEMA && (
                <>
                  <Line type="monotone" dataKey="ema12" stroke="#60a5fa" strokeWidth={1.5} dot={false} name="EMA 12" />
                  <Line type="monotone" dataKey="ema50" stroke="#818cf8" strokeWidth={1.5} dot={false} name="EMA 50" />
                </>
              )}
              {showBB && (
                <>
                  <Line type="monotone" dataKey="bbUpper" stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Upper" />
                  <Line type="monotone" dataKey="bbLower" stroke="#a78bfa" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Lower" />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Sub-panels */}
      <IndicatorSubpanels data={data} showRSI={showRSI} showMACD={showMACD} />
    </div>
  );
};
