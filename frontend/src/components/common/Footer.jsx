import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/logo.png';

export default function Footer() {
  const { settings, openEnquiry } = useApp();

  const cleanPhone = (settings.phone || "").replace(/[^\d+]/g, "");
  const cleanWhatsapp = (settings.whatsapp || "").replace(/[^\d]/g, "");

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-1.5 bg-white rounded-lg inline-block">
                <img src={logo} alt="Mr. Office Logo" className="h-10 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  MR. <span className="text-brand-red">OFFICE</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  Agra, Uttar Pradesh
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Agra's trusted furniture supplier specializing in modern office workspaces, classroom benches, study rooms, and institutional requirements through our order-based manufacturing network.
            </p>

            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <strong className="text-white font-semibold block mb-1">Order-Based Model:</strong>
              We coordinate directly with verified furniture manufacturers to arrange tailored specifications, bulk institutional quantities, and custom configurations for your requirements.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Mr.%20Office,%20I%20would%20like%20to%20enquire%20about%20furniture%20in%20Agra`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 hover:bg-emerald-600/30 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Us
              </a>
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="px-3.5 py-2 rounded-lg bg-brand-red text-white text-xs font-semibold hover:bg-brand-redDark transition cursor-pointer"
              >
                Request a Quote
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Furniture Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> About Mr. Office
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Contact & Location
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  className="hover:text-white transition flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Custom Furniture Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Specializations</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Office%20Furniture" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Office Workstations & Desks
                </Link>
              </li>
              <li>
                <Link to="/products?category=Office%20Furniture" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Ergonomic Office Chairs
                </Link>
              </li>
              <li>
                <Link to="/products?category=School%20Furniture" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> School Benches & Dual Desks
                </Link>
              </li>
              <li>
                <Link to="/products?category=School%20Furniture" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Teacher Tables & Storage
                </Link>
              </li>
              <li>
                <Link to="/products?category=Study%20Furniture" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Home Study Desks & Shelves
                </Link>
              </li>
              <li>
                <Link to="/products?category=Other%20Furniture" className="hover:text-white transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> Sofas & Lounge Seating
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Agra Contact Center</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <span>{settings.address || "Agra, Uttar Pradesh, India"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-red flex-shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-red flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400 leading-snug">{settings.business_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Mr. Office. All rights reserved. Agra, Uttar Pradesh, India.</p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <p>
              Developed by{" "}
              <a
                href="https://shivam-srivastava-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-red font-semibold transition-colors underline decoration-slate-600 hover:decoration-brand-red underline-offset-4"
              >
                shivamsrivastava.dev
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden lg:inline text-slate-400">Primary Focus: Office • School • Study Furniture</span>
            <Link to="/admin/login" className="hover:text-white transition flex items-center gap-1 text-slate-400 hover:text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
