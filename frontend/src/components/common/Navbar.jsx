import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare, MapPin, ChevronDown, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { settings, openEnquiry } = useApp();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  };

  const cleanPhone = (settings.phone || "").replace(/[^\d+]/g, "");
  const cleanWhatsapp = (settings.whatsapp || "").replace(/[^\d]/g, "");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro bar for Agra location & quick contact */}
      <div className="bg-[#0F172A] text-slate-200 text-xs py-2 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
            <span className="font-bold text-white tracking-wide">Agra, Uttar Pradesh</span>
            <span className="hidden sm:inline text-slate-300 font-medium">| Order-Based Supply for Offices & Schools</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline text-slate-300">Hours: {settings.business_hours?.split('(')[0]}</span>
            <Link to="/admin/login" className="text-slate-200 hover:text-white transition flex items-center gap-1 font-semibold bg-white/10 px-2 py-0.5 rounded border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <img
              src={logo}
              alt="FURNISETU Furniture Agra"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition ${
                isActive('/') ? 'text-brand-red' : 'text-slate-700 hover:text-brand-navy'
              }`}
            >
              Home
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <Link
                to="/products"
                className={`text-sm font-semibold flex items-center gap-1 transition ${
                  location.pathname.startsWith('/products') ? 'text-brand-red' : 'text-slate-700 hover:text-brand-navy'
                }`}
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </Link>

              {categoriesOpen && (
                <div className="absolute top-full left-0 pt-2 w-60 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 text-sm flex flex-col gap-1">
                    <Link
                      to="/products?category=Office%20Furniture"
                      className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-brand-red font-medium transition"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      Office Furniture
                      <span className="block text-xs text-slate-400 font-normal">Desks, Chairs, Workstations</span>
                    </Link>
                    <Link
                      to="/products?category=School%20Furniture"
                      className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-brand-red font-medium transition"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      School Furniture
                      <span className="block text-xs text-slate-400 font-normal">Desks, Benches, Teacher Sets</span>
                    </Link>
                    <Link
                      to="/products?category=Study%20Furniture"
                      className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-brand-red font-medium transition"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      Study Furniture
                      <span className="block text-xs text-slate-400 font-normal">Tables, Chairs, Shelves</span>
                    </Link>
                    <Link
                      to="/products?category=Other%20Furniture"
                      className="px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-brand-red font-medium transition"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      Other Furniture
                      <span className="block text-xs text-slate-400 font-normal">Sofas, Tables on Request</span>
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <Link
                        to="/products"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-navy hover:text-brand-red block"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        View Full Catalog →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`text-sm font-semibold transition ${
                isActive('/about') ? 'text-brand-red' : 'text-slate-700 hover:text-brand-navy'
              }`}
            >
              About FURNISETU
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-semibold transition ${
                isActive('/contact') ? 'text-brand-red' : 'text-slate-700 hover:text-brand-navy'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Desktop Right Actions: Call, WhatsApp, Get Quote */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hello%20FURNISETU,%20I%20would%20like%20to%20enquire%20about%20furniture%20in%20Agra`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              title="Call FURNISETU"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => openEnquiry()}
              className="px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-sm font-semibold shadow-md shadow-brand-red/20 transition cursor-pointer active:scale-95"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="px-3.5 py-2 rounded-lg bg-brand-red text-white text-xs font-semibold shadow-xs"
            >
              Get Quote
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={closeMenu}
            className={`block py-2 text-base font-semibold ${
              isActive('/') ? 'text-brand-red' : 'text-slate-800'
            }`}
          >
            Home
          </Link>
          <div className="py-1">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Furniture Categories
            </span>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/products?category=Office%20Furniture"
                onClick={closeMenu}
                className="p-2.5 bg-slate-50 rounded-lg text-slate-700 font-medium hover:bg-red-50 hover:text-brand-red"
              >
                Office Furniture
              </Link>
              <Link
                to="/products?category=School%20Furniture"
                onClick={closeMenu}
                className="p-2.5 bg-slate-50 rounded-lg text-slate-700 font-medium hover:bg-red-50 hover:text-brand-red"
              >
                School Furniture
              </Link>
              <Link
                to="/products?category=Study%20Furniture"
                onClick={closeMenu}
                className="p-2.5 bg-slate-50 rounded-lg text-slate-700 font-medium hover:bg-red-50 hover:text-brand-red"
              >
                Study Furniture
              </Link>
              <Link
                to="/products?category=Other%20Furniture"
                onClick={closeMenu}
                className="p-2.5 bg-slate-50 rounded-lg text-slate-700 font-medium hover:bg-red-50 hover:text-brand-red"
              >
                Other Furniture
              </Link>
            </div>
          </div>
          <Link
            to="/about"
            onClick={closeMenu}
            className={`block py-2 text-base font-semibold ${
              isActive('/about') ? 'text-brand-red' : 'text-slate-800'
            }`}
          >
            About FURNISETU
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className={`block py-2 text-base font-semibold ${
              isActive('/contact') ? 'text-brand-red' : 'text-slate-800'
            }`}
          >
            Contact Agra Office
          </Link>

          {/* Quick contact row */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-navy" />
              Call Now
            </a>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hello%20FURNISETU,%20I%20would%20like%20to%20enquire%20about%20furniture%20in%20Agra`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
