import React from 'react';

export default function Leads() {
  return (
    <div className="p-6 text-center space-y-3 max-w-md mx-auto mt-12 animate-fade-in">
      <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto font-bold">L</div>
      <h2 className="text-lg font-bold">Leads Pipeline</h2>
      <p className="text-sm text-slate-400 leading-relaxed">
        This section tracks initial potential opportunities. Brand leads metrics are integrated directly into the master spreadsheet metrics.
      </p>
    </div>
  );
}