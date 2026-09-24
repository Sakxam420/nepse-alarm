import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PriceBar, Company, ChartType, Timeframe } from '../../types/stock';
import { IndicatorSubpanels } from './IndicatorSubpanels';
import { Download } from 'lucide-react';

const fmtDate = (d: string) => {
  if (!d) return '';
  const parts = d.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return d;
};

const TIMEFRAME_BARS: Record<Timeframe, number> = {
  '1W': 7,
  '1M': 22,
  '3M': 65,
  '6M': 130,
  '1Y': 252,
  ALL: 9999,
};

interface FinancialChartProps {
  company?: Company;
  history: PriceBar[];
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ company, history }) => {
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
    return history.slice(-count).map((b) => ({
      ...b,
      dateLabel: fmtDate(b.date),
      volColor: b.close >= b.open ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
    }));
  }, [history, tf]);

  const latest = data[data.length - 1] ?? null;
  const active = hovered ?? latest;
  const isUp = active ? active.close >= active.open : true;

  // Window trend direction for area gradient
  const windowIsUp = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1].close >= data[0].close;
  }, [data]);

  // Export dataset as CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'Date',
      'Symbol',
      'Open',
      'High',
      'Low',
      'Close',
      'Volume',
      'EMA12',
      'EMA26',
      'EMA50',
      'RSI14',
      'MACD_Line',
      'MACD_Signal',
      'MACD_Hist',
      'BB_Upper',
      'BB_Middle',
      'BB_Lower',
    ];

    const rows = history.map((b) => [
      b.date.split('T')[0],
      b.symbol,
      b.open,
      b.high,
      b.low,
      b.close,
      b.volume,
      b.ema12 ?? '',
      b.ema26 ?? '',
      b.ema50 ?? '',
      b.rsi14 ?? '',
      b.macdLine ?? '',
      b.macdSignal ?? '',
      b.macdHist ?? '',
      b.bbUpper ?? '',
      b.bbMiddle ?? '',
      b.bbLower ?? '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${company?.symbol || 'NEPSE'}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CandlestickShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload || !height || !width) return null;
    const _open = payload.open;
    const _close = payload.close;
    const _high = payload.high;
    const _low = payload.low;
    const bull = _close >= _open;
    const color = bull ? '#22c55e' : '#ef4444';
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
        <rect
          x={x + 1}
          y={bodyTop}
          width={Math.max(width - 2, 2)}
          height={Math.max(Math.abs(height), 2)}
          fill={color}
          rx={1}
        />
      </g>
    );
  };

  const TF_OPTS: Timeframe[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

  const IndicatorToggle = ({
    label,
    active: on,
    onClick,
    color,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    color: string;
  }) => (
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
    <div className="card p-4 sm:p-5 flex flex-col gap-4 border border-slate-800">
      {/* Toolbar row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Timeframe selector */}
        <div className="seg-control">
          {TF_OPTS.map((t) => (
            <button
              key={t}
              className={`seg-btn ${tf === t ? 'active' : ''}`}
              onClick={() => setTf(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="seg-control">
            <button
              className={`seg-btn ${type === 'area' ? 'active' : ''}`}
              onClick={() => setType('area')}
            >
              Area
            </button>
            <button
              className={`seg-btn ${type === 'candlestick' ? 'active' : ''}`}
              onClick={() => setType('candlestick')}
            >
              Candles
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Indicators Toggle */}
          <div className="flex items-center gap-1">
            <IndicatorToggle label="EMA" active={showEMA} onClick={() => setShowEMA((v) => !v)} color="#60a5fa" />
            <IndicatorToggle label="BB" active={showBB} onClick={() => setShowBB((v) => !v)} color="#a78bfa" />
            <IndicatorToggle label="Vol" active={showVol} onClick={() => setShowVol((v) => !v)} color="#94a3b8" />
            <IndicatorToggle label="RSI" active={showRSI} onClick={() => setShowRSI((v) => !v)} color="#fbbf24" />
            <IndicatorToggle label="MACD" active={showMACD} onClick={() => setShowMACD((v) => !v)} color="#f87171" />
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
            title="Download OHLCV Data (CSV)"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* OHLC readout bar */}
      {active && (
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono" style={{ color: '#64748b' }}>
          <span style={{ color: '#94a3b8' }}>{active.date?.split('T')[0]}</span>
          <span>
            O <strong className="text-white">Rs. {active.open.toFixed(2)}</strong>
          </span>
          <span>
            H <strong className="text-green-400">Rs. {active.high.toFixed(2)}</strong>
          </span>
          <span>
            L <strong className="text-red-400">Rs. {active.low.toFixed(2)}</strong>
          </span>
          <span>
            C <strong className={isUp ? 'text-green-400' : 'text-red-400'}>Rs. {active.close.toFixed(2)}</strong>
          </span>
          <span>
            Vol <strong className="text-white">{active.volume.toLocaleString('en-IN')}</strong>
          </span>
        </div>
      )}

      {/* Main chart */}
      <div className="h-[340px] sm:h-[390px]" onMouseLeave={() => setHovered(null)}>
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Loading price data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: -10 }}
              onMouseMove={(state: any) => {
                if (state?.activePayload?.[0]?.payload) setHovered(state.activePayload[0].payload);
              }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={windowIsUp ? '#22c55e' : '#ef4444'}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor={windowIsUp ? '#22c55e' : '#ef4444'}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                interval="preserveStartEnd"
              />
              <YAxis
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  background: '#161b27',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#e2e8f0' }}
              />

              {showVol && (
                <Bar dataKey="volume" fill="rgba(255,255,255,0.06)" maxBarSize={8} yAxisId={0} name="Volume" />
              )}

              {type === 'area' && (
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={windowIsUp ? '#22c55e' : '#ef4444'}
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: windowIsUp ? '#22c55e' : '#ef4444',
                    stroke: '#0e1117',
                    strokeWidth: 2,
                  }}
                  name="Close Price"
                />
              )}

              {type === 'candlestick' && (
                <Bar dataKey="close" shape={<CandlestickShape />} maxBarSize={14} name="Price" />
              )}

              {showEMA && (
                <>
                  <Line type="monotone" dataKey="ema12" stroke="#60a5fa" strokeWidth={1.5} dot={false} name="EMA 12" />
                  <Line type="monotone" dataKey="ema26" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="EMA 26" />
                  <Line type="monotone" dataKey="ema50" stroke="#a855f7" strokeWidth={1.5} dot={false} name="EMA 50" />
                </>
              )}

              {showBB && (
                <>
                  <Line
                    type="monotone"
                    dataKey="bbUpper"
                    stroke="#c084fc"
                    strokeWidth={1.2}
                    strokeDasharray="3 3"
                    dot={false}
                    name="BB Upper"
                  />
                  <Line
                    type="monotone"
                    dataKey="bbMiddle"
                    stroke="#a855f7"
                    strokeWidth={1}
                    dot={false}
                    name="BB Middle (SMA 20)"
                  />
                  <Line
                    type="monotone"
                    dataKey="bbLower"
                    stroke="#c084fc"
                    strokeWidth={1.2}
                    strokeDasharray="3 3"
                    dot={false}
                    name="BB Lower"
                  />
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
