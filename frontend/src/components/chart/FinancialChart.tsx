import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { PriceBar, Company, ChartType, Timeframe } from '../../types/stock';
import { ChartToolbar } from './ChartToolbar';
import { ChartHeader } from './ChartHeader';
import { IndicatorSubpanels } from './IndicatorSubpanels';
import { formatShortDate } from '../../utils/formatters';

interface FinancialChartProps {
  company?: Company;
  history: PriceBar[];
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ company, history }) => {
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [timeframe, setTimeframe] = useState<Timeframe>('3M');
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [showMACD, setShowMACD] = useState<boolean>(false);
  const [hoveredBar, setHoveredBar] = useState<PriceBar | null>(null);

  // Filter history based on selected timeframe
  const filteredData = useMemo(() => {
    if (history.length === 0) return [];
    let sliceCount = history.length;
    switch (timeframe) {
      case '1W':
        sliceCount = 7;
        break;
      case '1M':
        sliceCount = 22;
        break;
      case '3M':
        sliceCount = 65;
        break;
      case '6M':
        sliceCount = 130;
        break;
      case '1Y':
        sliceCount = 250;
        break;
      case 'ALL':
      default:
        sliceCount = history.length;
    }

    return history.slice(-sliceCount).map((bar) => ({
      ...bar,
      dateFormatted: formatShortDate(bar.date),
      ema12: bar.ema12 ?? undefined,
      ema26: bar.ema26 ?? undefined,
      ema50: bar.ema50 ?? undefined,
      bbUpper: bar.bbUpper ?? undefined,
      bbMiddle: bar.bbMiddle ?? undefined,
      bbLower: bar.bbLower ?? undefined,
    }));
  }, [history, timeframe]);

  const latestBar = history.length > 0 ? history[history.length - 1] : null;

  // Custom Candlestick Renderer
  const CandlestickBar = (props: any) => {
    const { x, y, width, height, open, close, high, low } = props;
    if (open === undefined || close === undefined || high === undefined || low === undefined) {
      return null;
    }

    const isBullish = close >= open;
    const color = isBullish ? '#10b981' : '#ef4444';

    // Calculate scale factor: price difference to pixel height
    const priceDelta = Math.abs(open - close) || 0.01;
    const ratio = height / priceDelta;

    const topPixel = Math.min(y, y + height);
    const wickTop = topPixel - (high - Math.max(open, close)) * ratio;
    const wickBottom = topPixel + height + (Math.min(open, close) - low) * ratio;
    const wickX = x + width / 2;

    return (
      <g>
        {/* Upper/Lower Wick */}
        <line
          x1={wickX}
          y1={isNaN(wickTop) ? topPixel : wickTop}
          x2={wickX}
          y2={isNaN(wickBottom) ? topPixel + height : wickBottom}
          stroke={color}
          strokeWidth={1.5}
        />
        {/* Real Body */}
        <rect
          x={x}
          y={topPixel}
          width={Math.max(width, 2)}
          height={Math.max(height, 2)}
          fill={color}
          stroke={color}
          rx={1}
        />
      </g>
    );
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-slate-800/80 flex flex-col gap-3">
      {/* Chart Control Toolbar */}
      <ChartToolbar
        chartType={chartType}
        onChangeChartType={setChartType}
        timeframe={timeframe}
        onChangeTimeframe={setTimeframe}
        showEMA={showEMA}
        onToggleEMA={() => setShowEMA(!showEMA)}
        showBollinger={showBollinger}
        onToggleBollinger={() => setShowBollinger(!showBollinger)}
        showVolume={showVolume}
        onToggleVolume={() => setShowVolume(!showVolume)}
        showRSI={showRSI}
        onToggleRSI={() => setShowRSI(!showRSI)}
        showMACD={showMACD}
        onToggleMACD={() => setShowMACD(!showMACD)}
      />

      {/* Sticky Interactive OHLCV Readout Header */}
      <ChartHeader
        company={company}
        hoveredBar={hoveredBar}
        latestBar={latestBar}
      />

      {/* Main Chart Graphic Area */}
      <div className="h-[360px] sm:h-[420px] w-full relative">
        {filteredData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm font-mono">
            No price bars loaded for this security.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              onMouseMove={(state: any) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  setHoveredBar(state.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <defs>
                <linearGradient id="priceAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="dateFormatted"
                stroke="#334155"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#334155"
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                orientation="right"
                tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7)',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
                labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
              />

              {/* Volume Bars */}
              {showVolume && (
                <Bar
                  dataKey="volume"
                  name="Volume"
                  fill="#1e293b"
                  opacity={0.35}
                  maxBarSize={12}
                />
              )}

              {/* Candlestick Mode */}
              {chartType === 'candlestick' && (
                <Bar
                  dataKey="close"
                  name="Price Action"
                  shape={<CandlestickBar />}
                  maxBarSize={14}
                />
              )}

              {/* Area Gradient Mode */}
              {chartType === 'area' && (
                <Area
                  type="monotone"
                  dataKey="close"
                  name="LTP (Rs.)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#priceAreaGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#06b6d4' }}
                />
              )}

              {/* Line Mode */}
              {chartType === 'line' && (
                <Line
                  type="monotone"
                  dataKey="close"
                  name="LTP (Rs.)"
                  stroke="#38bdf8"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 5, fill: '#38bdf8' }}
                />
              )}

              {/* Bollinger Bands Envelopes */}
              {showBollinger && (
                <Line
                  type="monotone"
                  dataKey="bbUpper"
                  name="BB Upper (20, 2)"
                  stroke="#a855f7"
                  strokeDasharray="3 3"
                  strokeWidth={1.2}
                  dot={false}
                />
              )}
              {showBollinger && (
                <Line
                  type="monotone"
                  dataKey="bbLower"
                  name="BB Lower (20, 2)"
                  stroke="#a855f7"
                  strokeDasharray="3 3"
                  strokeWidth={1.2}
                  dot={false}
                />
              )}

              {/* Moving Average Overlays */}
              {showEMA && (
                <Line
                  type="monotone"
                  dataKey="ema12"
                  name="EMA 12"
                  stroke="#f59e0b"
                  strokeWidth={1.4}
                  dot={false}
                />
              )}
              {showEMA && (
                <Line
                  type="monotone"
                  dataKey="ema26"
                  name="EMA 26"
                  stroke="#ec4899"
                  strokeWidth={1.4}
                  dot={false}
                />
              )}
              {showEMA && (
                <Line
                  type="monotone"
                  dataKey="ema50"
                  name="EMA 50"
                  stroke="#8b5cf6"
                  strokeWidth={1.8}
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Sub-panel Oscillators (RSI & MACD) */}
      <IndicatorSubpanels data={filteredData} showRSI={showRSI} showMACD={showMACD} />
    </div>
  );
};
