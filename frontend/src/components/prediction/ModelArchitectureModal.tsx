import React from 'react';
import { Modal } from '../common/Modal';
import { Cpu, Database, GitMerge, CheckCircle, Award } from 'lucide-react';

interface ModelArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelArchitectureModal: React.FC<ModelArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hybrid LSTM-XGBoost Architecture"
      subtitle="BCA 8th Semester Academic Deep Learning Pipeline"
      icon={<Cpu className="h-5 w-5" />}
      maxWidth="2xl"
    >
      <div className="flex flex-col gap-6 text-slate-300 text-xs leading-relaxed">
        
        {/* Banner Alert */}
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
          <Award className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white text-sm block">
              2-Stage Neuro-Tree Architecture
            </span>
            <span className="text-slate-300 text-xs">
              Combines deep sequential feature extraction from recurrent neural networks (LSTM) with the tabular classification accuracy and interpretability of Gradient Boosted Trees (XGBoost).
            </span>
          </div>
        </div>

        {/* Visual Pipeline Flowchart */}
        <div className="flex flex-col gap-3">
          <span className="font-mono uppercase text-slate-400 font-bold tracking-wider text-[11px]">
            Data & Inference Pipeline Flow
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1: Sequence Ingestion */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  STAGE 1
                </span>
                <Database className="h-4 w-4 text-slate-500" />
              </div>
              <span className="font-bold text-white text-sm font-sans">
                30-Day OHLCV Sequences
              </span>
              <p className="text-slate-400 text-[11px]">
                Raw prices normalized via Min-Max scaling into sliding windows of shape (30, 5) fed to an LSTM network.
              </p>
            </div>

            {/* Step 2: Temporal Embedding */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">
                  STAGE 2
                </span>
                <Cpu className="h-4 w-4 text-slate-500" />
              </div>
              <span className="font-bold text-white text-sm font-sans">
                LSTM Feature Extractor
              </span>
              <p className="text-slate-400 text-[11px]">
                Hidden state vectors (16-dim) capture non-linear temporal momentum and memory dependencies.
              </p>
            </div>

            {/* Step 3: XGBoost Classifier */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  STAGE 3
                </span>
                <GitMerge className="h-4 w-4 text-slate-500" />
              </div>
              <span className="font-bold text-white text-sm font-sans">
                XGBoost Inference Engine
              </span>
              <p className="text-slate-400 text-[11px]">
                Concatenates LSTM embeddings with RSI, MACD, and EMA 50 to output trend direction and confidence score.
              </p>
            </div>
          </div>
        </div>

        {/* Hyperparameters & Specifications Grid */}
        <div className="flex flex-col gap-3">
          <span className="font-mono uppercase text-slate-400 font-bold tracking-wider text-[11px]">
            Model Specifications & Hyperparameters
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Sequence Window</span>
              <span className="text-white font-bold text-sm">30 Trading Days</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">LSTM Hidden Dim</span>
              <span className="text-cyan-400 font-bold text-sm">16 Neurons</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">XGBoost Estimators</span>
              <span className="text-emerald-400 font-bold text-sm">100 Trees</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Evaluation Metric</span>
              <span className="text-amber-400 font-bold text-sm">Directional Acc</span>
            </div>
          </div>
        </div>

        {/* Academic Defense Key Points */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
          <span className="font-bold text-white font-sans text-sm flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Key Strengths for BCA Defense
          </span>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 text-xs">
            <li>
              <strong>Decoupled Microservice:</strong> NestJS serves application & database logic while FastAPI runs heavy PyTorch/XGBoost matrix math.
            </li>
            <li>
              <strong>Overcoming Single-Model Limitations:</strong> LSTM alone suffers on small NEPSE datasets; XGBoost alone misses sequential temporal patterns. The hybrid yields optimal stability.
            </li>
            <li>
              <strong>Graceful Heuristic Fallback:</strong> If the ML worker is offline or dataset has &lt; 30 points, the system automatically falls back to deterministic technical indicators without crashing.
            </li>
          </ul>
        </div>

      </div>
    </Modal>
  );
};
