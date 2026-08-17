import React from 'react';
import { Modal } from '../common/Modal';
import { Cpu, Database, GitMerge, CheckCircle2, Award } from 'lucide-react';

interface ModelArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelArchitectureModal: React.FC<ModelArchitectureModalProps> = ({ isOpen, onClose }) => {
  const specs = [
    { label: 'Sequence Window', value: '30 Days', color: '#60a5fa' },
    { label: 'LSTM Hidden Dim', value: '16 Neurons', color: '#a78bfa' },
    { label: 'XGBoost Trees', value: '100 Est.', color: '#4ade80' },
    { label: 'Metric', value: 'Dir. Accuracy', color: '#fbbf24' },
  ];

  const stages = [
    {
      num: '01',
      color: '#60a5fa',
      icon: <Database className="h-4 w-4" />,
      title: '30-Day OHLCV Sequences',
      desc: 'Raw prices normalized via Min-Max scaling into sliding windows of shape (30, 5) fed to the LSTM.',
    },
    {
      num: '02',
      color: '#a78bfa',
      icon: <Cpu className="h-4 w-4" />,
      title: 'LSTM Feature Extractor',
      desc: 'Hidden state vectors (16-dim) capture non-linear temporal momentum and memory dependencies.',
    },
    {
      num: '03',
      color: '#4ade80',
      icon: <GitMerge className="h-4 w-4" />,
      title: 'XGBoost Classifier',
      desc: 'Fuses LSTM embeddings with RSI, MACD, EMA 50 to output trend direction + confidence.',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hybrid LSTM-XGBoost Model" size="lg">
      <div className="p-5 flex flex-col gap-5">
        {/* Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)' }}>
          <Award className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-white mb-0.5">2-Stage Neuro-Tree Architecture</div>
            <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
              Combines deep sequential feature extraction from LSTM recurrent networks with the tabular classification accuracy of XGBoost gradient boosted trees.
            </p>
          </div>
        </div>

        {/* Pipeline stages */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Inference Pipeline</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stages.map((s) => (
              <div key={s.num} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md" style={{ background: `${s.color}15`, color: s.color }}>
                    Stage {s.num}
                  </span>
                  <span style={{ color: '#475569' }}>{s.icon}</span>
                </div>
                <div className="text-sm font-semibold text-white mb-1">{s.title}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: '#64748b' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Spec grid */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Hyperparameters</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {specs.map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-[11px] mb-1" style={{ color: '#475569' }}>{s.label}</div>
                <div className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Defense points */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            Key Strengths (BCA Defense)
          </div>
          <ul className="space-y-2 text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
            <li>• <strong className="text-white">Decoupled microservice:</strong> NestJS handles business logic; FastAPI runs heavy PyTorch/XGBoost math independently.</li>
            <li>• <strong className="text-white">Hybrid approach:</strong> LSTM alone suffers on small NEPSE datasets; XGBoost alone misses sequential patterns. The hybrid yields optimal stability.</li>
            <li>• <strong className="text-white">Graceful fallback:</strong> If ML worker is offline or data &lt; 30 points, system auto-falls back to deterministic technical indicators.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
