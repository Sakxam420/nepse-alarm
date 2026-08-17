import React from 'react';
import { ChartType, Timeframe } from '../../types/stock';
import { BarChart3, LineChart } from 'lucide-react';

interface ChartToolbarProps {
  chartType: ChartType;
  onChangeChartType: (type: ChartType) => void;
  timeframe: Timeframe;
  onChangeTimeframe: (tf: Timeframe) => void;
  showEMA: boolean;
  onToggleEMA: () => void;
  showBollinger: boolean;
  onToggleBollinger: () => void;
  showVolume: boolean;
  onToggleVolume: () => void;
  showRSI: boolean;
  onToggleRSI: () => void;
  showMACD: boolean;
  onToggleMACD: () => void;
}

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  chartType,
  onChangeChartType,
  timeframe,
  onChangeTimeframe,
  showEMA,
  onToggleEMA,
  showBollinger,
  onToggleBollinger,
  showVolume,
  onToggleVolume,
  showRSI,
  onToggleRSI,
  showMACD,
  onToggleMACD,
}) => {
  const timeframes: Timeframe[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
      
      {/* Timeframe Selector */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onChangeTimeframe(tf)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
              timeframe === tf
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart Style & Indicators */}
      <div className="flex items-center gap-2">
        {/* Style */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => onChangeChartType('candlestick')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
              chartType === 'candlestick'
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Candles</span>
          </button>
          <button
            onClick={() => onChangeChartType('area')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
              chartType === 'area'
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Area</span>
          </button>
        </div>

        {/* Indicators Divider */}
        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        {/* Indicator Toggles */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={onToggleEMA}
            className={`px-2 py-1 rounded-md border transition-all font-mono font-medium ${
              showEMA
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Moving Averages"
          >
            EMA
          </button>
          <button
            onClick={onToggleBollinger}
            className={`px-2 py-1 rounded-md border transition-all font-mono font-medium ${
              showBollinger
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Bollinger Bands"
          >
            BB
          </button>
          <button
            onClick={onToggleVolume}
            className={`px-2 py-1 rounded-md border transition-all font-mono font-medium ${
              showVolume
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Volume Bars"
          >
            VOL
          </button>
          <button
            onClick={onToggleRSI}
            className={`px-2 py-1 rounded-md border transition-all font-mono font-medium ${
              showRSI
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="RSI Oscillator Panel"
          >
            RSI
          </button>
          <button
            onClick={onToggleMACD}
            className={`px-2 py-1 rounded-md border transition-all font-mono font-medium ${
              showMACD
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="MACD Momentum Panel"
          >
            MACD
          </button>
        </div>
      </div>

    </div>
  );
};
