import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  User
} from 'lucide-react';
import { api } from '../services/api';
import logo from '../assets/logo.png';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = api.auth.getUser() || { name: 'Admin', email: 'admin@mroffice.in' };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products Catalog', path: '/admin/products', icon: Layers },
    { label: 'Customer Leads', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Business Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="p-1.5 bg-white rounded-lg">
                <img src={logo} alt="FURNISETU Logo" className="h-8 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-white leading-none">
                  FURNI<span className="text-brand-red">SETU</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  Admin Portal
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs sm:text-sm font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                    active
                      ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom utility: View site & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View Public Website
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Live</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition cursor-pointer font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">
              {navItems.find((n) => n.path === location.pathname)?.label || 'Administration'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900">{user.name || 'Admin'}</span>
              <span className="text-[11px] text-slate-400">{user.email || 'admin@mroffice.in'}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-navyLight text-brand-navy flex items-center justify-center border border-slate-200 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
