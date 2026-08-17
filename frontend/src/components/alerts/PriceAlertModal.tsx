import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { PriceAlert } from '../../types/stock';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymbol: string;
  currentPrice: number;
  onAddToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10,
  padding: '8px 12px',
  fontSize: 13,
  color: '#f1f5f9',
  outline: 'none',
};

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen, onClose, selectedSymbol, currentPrice, onAddToast,
}) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: '1', symbol: selectedSymbol, condition: 'ABOVE', targetValue: currentPrice ? Math.round(currentPrice * 1.05) : 500, createdAt: new Date().toLocaleDateString(), isActive: true },
    { id: '2', symbol: selectedSymbol, condition: 'RSI_OVERSOLD', targetValue: 30, createdAt: new Date().toLocaleDateString(), isActive: true },
  ]);
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW' | 'RSI_OVERSOLD' | 'RSI_OVERBOUGHT'>('ABOVE');
  const [targetValue, setTargetValue] = useState<string>(currentPrice ? String(Math.round(currentPrice * 1.05)) : '500');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetValue);
    if (isNaN(val) || val <= 0) { onAddToast('Enter a valid numeric value', 'error'); return; }
    const newAlert: PriceAlert = { id: Date.now().toString(), symbol: selectedSymbol, condition, targetValue: val, createdAt: new Date().toLocaleDateString(), isActive: true };
    setAlerts(prev => [newAlert, ...prev]);
    onAddToast(`Alert set for ${selectedSymbol} — ${condition} ${val}`, 'success');
  };

  const conditionLabel: Record<string, string> = {
    ABOVE: 'Price Above (Rs.)',
    BELOW: 'Price Below (Rs.)',
    RSI_OVERSOLD: 'RSI Oversold (<)',
    RSI_OVERBOUGHT: 'RSI Overbought (>)',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Price Alerts" size="md">
      <div className="p-5 flex flex-col gap-5">
        {/* Form */}
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>
            New Alert — {selectedSymbol}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#64748b' }}>Condition</label>
              <select
                value={condition}
                onChange={(e: any) => setCondition(e.target.value)}
                style={inputStyle}
              >
                <option value="ABOVE">Price Rises Above</option>
                <option value="BELOW">Price Drops Below</option>
                <option value="RSI_OVERSOLD">RSI Oversold</option>
                <option value="RSI_OVERBOUGHT">RSI Overbought</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#64748b' }}>Target Value</label>
              <input
                type="number"
                step="any"
                value={targetValue}
                onChange={e => setTargetValue(e.target.value)}
                placeholder="e.g. 500"
                style={inputStyle}
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'rgba(79,142,247,0.2)', border: '1px solid rgba(79,142,247,0.35)' }}
          >
            <Plus className="h-4 w-4" />
            Add Alert
          </button>
        </form>

        {/* Alert list */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>
            Active Alerts ({alerts.length})
          </div>
          <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="py-8 text-center text-sm" style={{ color: '#475569' }}>
                No alerts configured
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">{alert.symbol}</div>
                      <div className="text-[11px]" style={{ color: '#475569' }}>
                        {conditionLabel[alert.condition] ?? alert.condition} — {alert.targetValue}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setAlerts(a => a.filter(x => x.id !== alert.id)); onAddToast('Alert removed', 'info'); }}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#475569' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#475569'; }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
