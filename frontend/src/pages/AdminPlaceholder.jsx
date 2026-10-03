import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminPlaceholder() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-soft text-center space-y-4">
        <div className="w-12 h-12 bg-blue-50 text-brand-navy rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6 text-brand-red" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">FURNISETU Admin Portal</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The administrative authentication and management portal will be connected in Phase 4 of development.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navyDark transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
