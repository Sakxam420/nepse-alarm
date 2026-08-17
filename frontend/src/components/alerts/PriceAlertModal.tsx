import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Bell, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { PriceAlert } from '../../types/stock';
import { formatNPR } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymbol: string;
  currentPrice: number;
  onAddToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  selectedSymbol,
  currentPrice,
  onAddToast,
}) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      symbol: selectedSymbol,
      condition: 'ABOVE',
      targetValue: currentPrice ? Math.round(currentPrice * 1.05) : 500,
      createdAt: new Date().toLocaleDateString(),
      isActive: true,
    },
    {
      id: '2',
      symbol: selectedSymbol,
      condition: 'RSI_OVERSOLD',
      targetValue: 30,
      createdAt: new Date().toLocaleDateString(),
      isActive: true,
    },
  ]);

  const [condition, setCondition] = useState<'ABOVE' | 'BELOW' | 'RSI_OVERSOLD' | 'RSI_OVERBOUGHT'>('ABOVE');
  const [targetValue, setTargetValue] = useState<string>(currentPrice ? String(Math.round(currentPrice * 1.05)) : '500');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetValue);
    if (isNaN(val) || val <= 0) {
      onAddToast('Please specify a valid numeric threshold', 'error');
      return;
    }

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol: selectedSymbol,
      condition,
      targetValue: val,
      createdAt: new Date().toLocaleDateString(),
      isActive: true,
    };

    setAlerts([newAlert, ...alerts]);
    onAddToast(`Alert activated for ${selectedSymbol} when ${condition} ${val}`, 'success');
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    onAddToast('Alert deleted', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Security Alerts & Triggers"
      subtitle={`Configure quantitative thresholds for ${selectedSymbol}`}
      icon={<Bell className="h-5 w-5" />}
      maxWidth="lg"
    >
      <div className="flex flex-col gap-6">
        
        {/* Create Alert Form */}
        <form onSubmit={handleCreateAlert} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Create New Alert Trigger
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e: any) => setCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="ABOVE">Price Rises Above (Rs.)</option>
                <option value="BELOW">Price Drops Below (Rs.)</option>
                <option value="RSI_OVERSOLD">RSI Drops Below (Oversold)</option>
                <option value="RSI_OVERBOUGHT">RSI Rises Above (Overbought)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Target Threshold Value
              </label>
              <input
                type="number"
                step="any"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="Target value..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050811] text-xs font-bold font-mono transition-colors shadow-glow-cyan"
          >
            <Plus className="h-4 w-4" />
            <span>Activate Alert</span>
          </button>
        </form>

        {/* Existing Alerts List */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Active Alerts ({alerts.length})
          </span>

          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs font-mono">
                No alerts configured for this security.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">
                          {alert.symbol}
                        </span>
                        <Badge variant="cyan" size="sm">
                          {alert.condition.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Trigger at: {alert.condition.includes('RSI') ? alert.targetValue : formatNPR(alert.targetValue)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="h-4 w-4" />
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
