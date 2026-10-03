import React from 'react';
import { Phone, MessageSquare, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MobileActionBar() {
  const { settings, openEnquiry } = useApp();

  const cleanPhone = (settings.phone || "").replace(/[^\d+]/g, "");
  const cleanWhatsapp = (settings.whatsapp || "").replace(/[^\d]/g, "");

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-2xl flex items-center justify-between gap-2">
      {/* Call Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="flex-1 py-2.5 px-2 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition"
      >
        <Phone className="w-4 h-4 text-brand-navy" />
        <span>Call</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Mr.%20Office,%20I%20would%20like%20to%20enquire%20about%20furniture%20in%20Agra`}
        target="_blank"
        rel="noreferrer"
        className="flex-1 py-2.5 px-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 active:scale-95 transition"
      >
        <MessageSquare className="w-4 h-4" />
        <span>WhatsApp</span>
      </a>

      {/* Get Quote Button */}
      <button
        type="button"
        onClick={() => openEnquiry()}
        className="flex-1 py-2.5 px-2 rounded-xl bg-brand-red text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-brand-redDark active:scale-95 transition cursor-pointer shadow-sm"
      >
        <FileText className="w-4 h-4" />
        <span>Get Quote</span>
      </button>
    </div>
  );
}
