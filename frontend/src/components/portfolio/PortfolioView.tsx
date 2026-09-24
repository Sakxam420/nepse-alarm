import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart, Briefcase, ExternalLink } from 'lucide-react';
import { PortfolioPosition, PortfolioSummary, Company } from '../../types/stock';
import { Modal } from '../common/Modal';

interface PortfolioViewProps {
  positions: PortfolioPosition[];
  summary: PortfolioSummary;
  companies: Company[];
  onAddPosition: (symbol: string, buyPrice: number, quantity: number, buyDate?: string, notes?: string) => Promise<void>;
  onDeletePosition: (id: string) => Promise<void>;
  onSelectSymbol: (symbol: string) => void;
  onAddToast: (message: string, type: 'success' | 'info' | 'error', title?: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '9px 12px',
  fontSize: 13,
  color: '#f1f5f9',
  outline: 'none',
};

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  positions,
  summary,
  companies,
  onAddPosition,
  onDeletePosition,
  onSelectSymbol,
  onAddToast,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [symbol, setSymbol] = useState<string>('NABIL');
  const [buyPrice, setBuyPrice] = useState<string>('520');
  const [quantity, setQuantity] = useState<string>('100');
  const [buyDate, setBuyDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSymbolChange = (sym: string) => {
    setSymbol(sym);
    const comp = companies.find(c => c.symbol === sym);
    if (comp && comp.lastPrice) {
      setBuyPrice(String(comp.lastPrice));
    }
  };

  const handleAddTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(buyPrice);
    const qtyNum = parseFloat(quantity);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(qtyNum) || qtyNum <= 0) {
      onAddToast('Please enter valid numeric price and quantity values.', 'error', 'Validation');
      return;
    }

    setSubmitting(true);
    try {
      await onAddPosition(symbol, priceNum, qtyNum, buyDate, notes);
      onAddToast(`Position added: ${qtyNum} shares of ${symbol} at Rs. ${priceNum}`, 'success', 'Portfolio Updated');
      setModalOpen(false);
      setNotes('');
    } catch {
      onAddToast('Failed to save position', 'error', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="card p-5 flex flex-col gap-1.5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Portfolio Net Worth</span>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            Rs. {summary.currentValuation.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500">{positions.length} Active Positions</span>
        </div>

        {/* Total Invested */}
        <div className="card p-5 flex flex-col gap-1.5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Invested</span>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-200 font-mono mt-1">
            Rs. {summary.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500">Cost Basis</span>
        </div>

        {/* All-time PnL */}
        <div className="card p-5 flex flex-col gap-1.5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Unrealized P&L</span>
            {summary.totalPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-400" />
            )}
          </div>
          <div
            className={`text-2xl font-black font-mono mt-1 ${
              summary.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {summary.totalPnL >= 0 ? '+' : ''}Rs. {summary.totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono ${
                summary.totalPnLPct >= 0
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                  : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
              }`}
            >
              {summary.totalPnLPct >= 0 ? '+' : ''}{summary.totalPnLPct.toFixed(2)}%
            </span>
            <span className="text-[11px] text-slate-500">Return</span>
          </div>
        </div>

        {/* Today's Gain/Loss */}
        <div className="card p-5 flex flex-col gap-1.5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Day's Movement</span>
            <PieChart className="h-4 w-4 text-purple-400" />
          </div>
          <div
            className={`text-2xl font-black font-mono mt-1 ${
              summary.dayGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {summary.dayGainLoss >= 0 ? '+' : ''}Rs. {summary.dayGainLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500">Today's Trading Session</span>
        </div>
      </div>

      {/* Main Holdings Table & Sector Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Holdings Table: 8 cols */}
        <div className="lg:col-span-8 card p-5 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Stock Holdings</h2>
              <p className="text-xs text-slate-400">Track and monitor your NEPSE equity positions</p>
            </div>
            <button
              onClick={() => {
                setModalOpen(true);
                if (companies.length > 0) handleSymbolChange(companies[0].symbol);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
            >
              <Plus className="h-4 w-4" />
              Add Position
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-2">Symbol</th>
                  <th className="py-2.5 px-2">Qty</th>
                  <th className="py-2.5 px-2">Avg Buy</th>
                  <th className="py-2.5 px-2">LTP</th>
                  <th className="py-2.5 px-2">Current Value</th>
                  <th className="py-2.5 px-2">Unrealized P&L</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No stock positions added yet. Click &quot;Add Position&quot; to build your portfolio.
                    </td>
                  </tr>
                ) : (
                  positions.map((pos) => {
                    const isProfit = pos.unrealizedPnL >= 0;
                    return (
                      <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-2">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span
                              onClick={() => onSelectSymbol(pos.symbol)}
                              className="cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-1"
                              title="Inspect on Chart"
                            >
                              {pos.symbol}
                              <ExternalLink className="h-3 w-3 text-slate-500" />
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {pos.companyName || pos.sector}
                          </div>
                        </td>
                        <td className="py-3 px-2 font-mono text-slate-300 font-semibold">{pos.quantity}</td>
                        <td className="py-3 px-2 font-mono text-slate-300">Rs. {pos.buyPrice.toFixed(2)}</td>
                        <td className="py-3 px-2 font-mono text-white font-bold">Rs. {pos.currentPrice.toFixed(2)}</td>
                        <td className="py-3 px-2 font-mono text-slate-200">
                          Rs. {pos.currentValuation.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-2">
                          <div className={`font-mono font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? '+' : ''}Rs. {pos.unrealizedPnL.toFixed(2)}
                          </div>
                          <div
                            className={`text-[10px] font-mono ${
                              isProfit ? 'text-emerald-500' : 'text-rose-500'
                            }`}
                          >
                            {isProfit ? '+' : ''}{pos.unrealizedPnLPct.toFixed(2)}%
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => {
                              onDeletePosition(pos.id);
                              onAddToast(`Removed ${pos.symbol} position`, 'info', 'Portfolio');
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Position"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Allocation Card: 4 cols */}
        <div className="lg:col-span-4 card p-5 border border-slate-800 flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Sector Diversification</h2>
            <p className="text-xs text-slate-400">Capital distribution across NEPSE sectors</p>
          </div>

          <div className="flex flex-col gap-3.5 mt-1">
            {summary.sectorAllocation.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Add positions to view sector diversification breakdown.
              </div>
            ) : (
              summary.sectorAllocation.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{item.sector}</span>
                    <span className="font-mono text-slate-400">
                      {item.percentage}% (Rs. {item.value.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        background:
                          idx === 0
                            ? '#3b82f6'
                            : idx === 1
                            ? '#10b981'
                            : idx === 2
                            ? '#a855f7'
                            : idx === 3
                            ? '#f59e0b'
                            : '#64748b',
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Position Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Stock Buy Position" size="md">
        <form onSubmit={handleAddTrade} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Select Company / Symbol</label>
            <select
              value={symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              style={inputStyle}
            >
              {companies.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol} — {c.name} ({c.sector})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Purchase Price (NPR)</label>
              <input
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="Buy Price"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Quantity (Units)</label>
              <input
                type="number"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Shares"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Buy Date</label>
              <input
                type="date"
                value={buyDate}
                onChange={(e) => setBuyDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Total Cost (Estimated)</label>
              <div
                style={inputStyle}
                className="font-mono font-bold text-white flex items-center bg-slate-900"
              >
                Rs. {((parseFloat(buyPrice) || 0) * (parseFloat(quantity) || 0)).toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Notes / Target Goal</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dividend hold, 6-month swing trade"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
          >
            {submitting ? 'Saving…' : 'Record Trade Position'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
