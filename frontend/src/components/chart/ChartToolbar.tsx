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
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
      
      {/* Left: Timeframe Range Buttons */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onChangeTimeframe(tf)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              timeframe === tf
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Center & Right: Chart Types & Indicator Overlays */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* Chart Style Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <button
            onClick={() => onChangeChartType('candlestick')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              chartType === 'candlestick'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Candlestick Chart"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Candles</span>
          </button>
          <button
            onClick={() => onChangeChartType('area')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              chartType === 'area'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Area Gradient Chart"
          >
            <LineChart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Area</span>
          </button>
          <button
            onClick={() => onChangeChartType('line')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium ${
              chartType === 'line'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Line Chart"
          >
            <LineChart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Line</span>
          </button>
        </div>

        {/* Indicator Overlays & Panels */}
        <div className="flex items-center gap-1.5 pl-1">
          <button
            onClick={onToggleEMA}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              showEMA
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle EMA (12, 26, 50)"
          >
            EMA
          </button>

          <button
            onClick={onToggleBollinger}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              showBollinger
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Bollinger Bands (20, 2)"
          >
            BB
          </button>

          <button
            onClick={onToggleVolume}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              showVolume
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Volume Bars"
          >
            VOL
          </button>

          <button
            onClick={onToggleRSI}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              showRSI
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle RSI Panel"
          >
            RSI
          </button>

          <button
            onClick={onToggleMACD}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              showMACD
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle MACD Panel"
          >
            MACD
          </button>
        </div>

      </div>
    </div>
  );
};
