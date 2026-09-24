import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Plus, Trash2, Bell, Volume2, VolumeX, CheckCircle2, History } from 'lucide-react';
import { AlertCondition, PriceAlert, TriggeredAlertItem } from '../../types/stock';
import { soundSynthesizer } from '../../utils/audioAlarm';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymbol: string;
  currentPrice: number;
  alerts: PriceAlert[];
  triggeredHistory: TriggeredAlertItem[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onAddAlert: (symbol: string, condition: AlertCondition, targetValue: number, note?: string) => Promise<void>;
  onDeleteAlert: (id: string) => Promise<void>;
  onToggleAlert: (id: string) => Promise<void>;
  onClearHistory: () => void;
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

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  selectedSymbol,
  currentPrice,
  alerts,
  triggeredHistory,
  soundEnabled,
  onToggleSound,
  onAddAlert,
  onDeleteAlert,
  onToggleAlert,
  onClearHistory,
  onAddToast,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [condition, setCondition] = useState<AlertCondition>('ABOVE');
  const [targetValue, setTargetValue] = useState<string>(
    currentPrice ? String(Math.round(currentPrice * 1.05)) : '500',
  );
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Auto-adjust target suggestion when condition changes
  const handleConditionChange = (newCond: AlertCondition) => {
    setCondition(newCond);
    if (newCond === 'ABOVE') {
      setTargetValue(String(Math.round(currentPrice * 1.05) || 500));
    } else if (newCond === 'BELOW') {
      setTargetValue(String(Math.round(currentPrice * 0.95) || 450));
    } else if (newCond === 'PCT_CHANGE_UP') {
      setTargetValue('4.0');
    } else if (newCond === 'PCT_CHANGE_DOWN') {
      setTargetValue('3.0');
    } else if (newCond === 'RSI_OVERSOLD') {
      setTargetValue('30');
    } else if (newCond === 'RSI_OVERBOUGHT') {
      setTargetValue('70');
    } else if (newCond === 'MACD_CROSSOVER') {
      setTargetValue('0');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetValue);
    if (isNaN(val) && condition !== 'MACD_CROSSOVER') {
      onAddToast('Enter a valid numeric target', 'error', 'Validation Error');
      return;
    }

    setSubmitting(true);
    try {
      await onAddAlert(selectedSymbol, condition, isNaN(val) ? 0 : val, note);
      onAddToast(
        `Alarm armed for ${selectedSymbol} (${condition} ${val || ''})`,
        'success',
        'Alarm Activated',
      );
      setNote('');
    } catch {
      onAddToast('Failed to create alert', 'error', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestChime = () => {
    soundSynthesizer.playChime();
    onAddToast('Playing acoustic alarm chime test (Web Audio API)', 'info', 'Audio Test');
  };

  const conditionLabels: Record<AlertCondition, string> = {
    ABOVE: 'Price Rises Above Target (Rs.)',
    BELOW: 'Price Drops Below Target (Rs.)',
    PCT_CHANGE_UP: 'Intraday Gain Surges Above (%)',
    PCT_CHANGE_DOWN: 'Intraday Drop Falls Below (%)',
    RSI_OVERSOLD: 'RSI Oversold Threshold (≤)',
    RSI_OVERBOUGHT: 'RSI Overbought Threshold (≥)',
    MACD_CROSSOVER: 'MACD Golden Crossover (Bullish)',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NEPSE Real-Time Alarms" size="lg">
      <div className="p-5 flex flex-col gap-5">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'create'
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Alarms ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              Trigger Log ({triggeredHistory.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestChime}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5"
              title="Test Chime Sound"
            >
              <Bell className="h-3.5 w-3.5 text-amber-400" />
              <span>Test Chime</span>
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={soundEnabled ? 'Alarm Sound: Enabled' : 'Alarm Sound: Muted'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {activeTab === 'create' ? (
          <div className="flex flex-col gap-5">
            {/* Create Alert Form */}
            <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Arm New Alarm for <span className="text-blue-400">{selectedSymbol}</span>
                </span>
                <span className="text-xs text-slate-400">
                  Current: <strong className="text-white font-mono">Rs. {currentPrice ? currentPrice.toFixed(2) : '—'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Trigger Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => handleConditionChange(e.target.value as AlertCondition)}
                    style={inputStyle}
                  >
                    <option value="ABOVE">Price Rises Above Target (Rs.)</option>
                    <option value="BELOW">Price Drops Below Target (Rs.)</option>
                    <option value="PCT_CHANGE_UP">Day Gain Surges Above (+%)</option>
                    <option value="PCT_CHANGE_DOWN">Day Drop Exceeds (-%)</option>
                    <option value="RSI_OVERSOLD">RSI Oversold (≤ 30)</option>
                    <option value="RSI_OVERBOUGHT">RSI Overbought (≥ 70)</option>
                    <option value="MACD_CROSSOVER">MACD Golden Cross (0 line)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                    {condition === 'MACD_CROSSOVER' ? 'Signal Trigger' : 'Target Threshold'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    disabled={condition === 'MACD_CROSSOVER'}
                    value={condition === 'MACD_CROSSOVER' ? '0' : targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="Enter threshold value"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Optional Note / Execution Strategy</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Exit 50% shares on break, Take Profit target"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus className="h-4 w-4" />
                {submitting ? 'Arming Alarm…' : `Set Alarm for ${selectedSymbol}`}
              </button>
            </form>

            {/* List of Active Alarms */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Configured Alarms ({alerts.length})
              </div>

              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No alarms configured yet. Set your first alarm above to get instant chimes and desktop alerts!
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        alert.isActive
                          ? 'bg-slate-900/80 border-slate-800'
                          : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            alert.isActive ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{alert.symbol}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                alert.isActive
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {alert.isActive ? 'ARMED' : 'PAUSED'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {conditionLabels[alert.condition] ?? alert.condition}
                            {alert.condition !== 'MACD_CROSSOVER' && (
                              <strong className="text-slate-200 ml-1 font-mono">{alert.targetValue}</strong>
                            )}
                          </div>
                          {alert.note && <div className="text-[11px] text-slate-500 italic mt-0.5">{alert.note}</div>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleAlert(alert.id)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                        >
                          {alert.isActive ? 'Pause' : 'Resume'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(alert.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Alarm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Trigger History Log */
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Triggered Alarms Audit Log
              </span>
              {triggeredHistory.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
              {triggeredHistory.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No alerts have been triggered yet.
                </div>
              ) : (
                triggeredHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.symbol}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{item.triggeredAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
