import React from 'react';
import logo from './assets/logo.png';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-card max-w-md border border-slate-100 flex flex-col items-center">
        <img src={logo} alt="Mr. Office Logo" className="h-16 w-auto object-contain mb-4" />
        <h1 className="text-2xl font-bold text-brand-navy">Mr. Office</h1>
        <p className="text-sm font-medium text-brand-red mt-1">Agra, Uttar Pradesh</p>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          Office, School & Study Furniture Specialists. Platform setup initialized.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Phase 1 Architecture Ready
        </div>
      </div>
    </div>
  );
}

export default App;
