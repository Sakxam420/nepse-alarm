import React from 'react';
import { TrendingUp } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="mt-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
    <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-semibold text-white">NEPSE<span className="text-blue-400">.AI</span></span>
        <span className="text-xs text-slate-500 ml-2">8th Semester BCA Research Project</span>
      </div>
      <div className="text-xs text-slate-500">
        Hybrid LSTM + XGBoost · Not financial advice · Data via @rumess/nepse-api
      </div>
    </div>
  </footer>
);
