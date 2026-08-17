import React from 'react';
import { Cpu, Terminal, Database, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050811] border-t border-slate-900/90 py-8 px-6 mt-16 text-slate-400 text-xs font-mono select-none">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Column: Project summary */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold font-sans text-sm">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>NEPSE AI Quantitative Platform</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              8th Sem BCA Project
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Decision Support & Time-Series Inference Engine for Nepal Stock Exchange securities.
          </p>
        </div>

        {/* Center: System Architecture Tags */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>LSTM + XGBoost Hybrid</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span>FastAPI & NestJS Core</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span>Prisma ORM & PostgreSQL</span>
          </div>
        </div>

        {/* Right Column: Disclaimer */}
        <div className="text-center md:text-right text-[11px] text-slate-500">
          <span>Academic prototype for research purposes.</span>
          <span className="block text-slate-600 mt-0.5">Not financial or investment advice.</span>
        </div>

      </div>
    </footer>
  );
};
