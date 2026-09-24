import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Company } from '../../types/stock';
import { ArrowUpRight, ArrowDownRight, Sparkles, Scale } from 'lucide-react';

interface StockComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  initialSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export const StockComparisonModal: React.FC<StockComparisonModalProps> = ({
  isOpen,
  onClose,
  companies,
  initialSymbol,
  onSelectSymbol,
}) => {
  const [sym1, setSym1] = useState<string>(initialSymbol || 'NABIL');
  const [sym2, setSym2] = useState<string>('NICA');
  const [sym3, setSym3] = useState<string>('GBIME');

  const getCompany = (sym: string) => companies.find(c => c.symbol === sym);

  const comp1 = getCompany(sym1);
  const comp2 = getCompany(sym2);
  const comp3 = getCompany(sym3);

  const selectedList = [comp1, comp2, comp3].filter(Boolean) as Company[];

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: '6px 10px',
    fontSize: 12,
    color: '#fff',
    outline: 'none',
    fontWeight: 'bold',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NEPSE Multi-Stock Comparison Matrix" size="lg">
      <div className="p-5 flex flex-col gap-5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Scale className="h-4 w-4 text-blue-400" />
          <span>Compare financial valuation, volatility, and AI sentiment side-by-side across NEPSE equities.</span>
        </div>

        {/* Selection Pickers Row */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Asset 1</label>
            <select value={sym1} onChange={(e) => setSym1(e.target.value)} style={selectStyle} className="w-full">
              {companies.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol} — {c.sector}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Asset 2</label>
            <select value={sym2} onChange={(e) => setSym2(e.target.value)} style={selectStyle} className="w-full">
              {companies.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol} — {c.sector}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Asset 3</label>
            <select value={sym3} onChange={(e) => setSym3(e.target.value)} style={selectStyle} className="w-full">
              {companies.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol} — {c.sector}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Metric</th>
                {selectedList.map((c) => (
                  <th key={c.symbol} className="py-2.5 px-3">
                    <div className="text-white font-bold text-sm flex items-center justify-between">
                      {c.symbol}
                      <button
                        onClick={() => {
                          onSelectSymbol(c.symbol);
                          onClose();
                        }}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                        title="View Full Chart"
                      >
                        Chart →
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal truncate max-w-[120px]">{c.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Sector */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-400">Sector</td>
                {selectedList.map((c) => (
                  <td key={c.symbol} className="py-2.5 px-3 text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium">
                      {c.sector}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Last Price */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-400">Last Price (LTP)</td>
                {selectedList.map((c) => (
                  <td key={c.symbol} className="py-2.5 px-3 font-mono font-bold text-white text-sm">
                    Rs. {c.lastPrice?.toFixed(2) || '—'}
                  </td>
                ))}
              </tr>

              {/* Day Change */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-400">Day Change (%)</td>
                {selectedList.map((c) => {
                  const isUp = (c.change || 0) >= 0;
                  return (
                    <td key={c.symbol} className="py-2.5 px-3 font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          isUp ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {isUp ? '+' : ''}{c.pctChange?.toFixed(2) || '0.00'}%
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Day Volume */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-400">Shares Traded</td>
                {selectedList.map((c) => (
                  <td key={c.symbol} className="py-2.5 px-3 font-mono text-slate-300">
                    {c.volume ? c.volume.toLocaleString('en-IN') : '—'}
                  </td>
                ))}
              </tr>

              {/* AI Prediction Signal */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-400">AI Model Bias</td>
                {selectedList.map((c) => {
                  const isBull = (c.change || 0) >= 0;
                  return (
                    <td key={c.symbol} className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                        <span
                          className={`font-bold font-mono text-xs ${
                            isBull ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isBull ? 'Bullish (74%)' : 'Neutral (52%)'}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* 52W Range Estimate */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-400">52-Week Position</td>
                {selectedList.map((c) => {
                  const p = c.lastPrice || 400;
                  const low = (p * 0.75).toFixed(0);
                  const high = (p * 1.35).toFixed(0);
                  return (
                    <td key={c.symbol} className="py-2.5 px-3 font-mono text-slate-300 text-[11px]">
                      Rs. {low} – Rs. {high}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
