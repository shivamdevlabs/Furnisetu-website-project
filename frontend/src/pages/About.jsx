import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Sofa, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight,
  Handshake,
  Workflow
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function About() {
  const { settings, openEnquiry } = useApp();

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-[#0F172A] text-white py-16 sm:py-20 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>Agra, Uttar Pradesh, India</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-xs">
            About Mr. Office
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Professional furniture supply for commercial offices, schools, colleges, and dedicated study spaces in Agra.
          </p>
        </div>
      </section>

      {/* Business Introduction */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
              Business Introduction
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              Specialized Furniture Supply Built on Real Customer Requirements
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              <strong>Mr. Office</strong> is an Agra-based furniture enterprise dedicated to solving furniture requirements for businesses, institutions, and home study rooms.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Unlike generic retail showrooms that offer limited, pre-set catalog items with high overhead costs, Mr. Office operates on an <strong>order-based business model</strong>. Customers discuss their specific floor plan, quantity, and aesthetic preferences with us, and we coordinate directly with quality manufacturers to deliver custom-suited furniture.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => openEnquiry()}
                className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-red/20 hover:bg-brand-redDark transition cursor-pointer"
              >
                Discuss Your Requirements
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
              Core Principles
            </h3>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Transparent Specifications</strong>
                  <span className="text-xs text-slate-500">
                    We clearly specify board thickness, steel pipe gauges, foam density, and edge finishes.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">No Retail Markup Waste</strong>
                  <span className="text-xs text-slate-500">
                    Direct-to-client manufacturer logistics save institutional and corporate buyers significant budget.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Local Agra Commitment</strong>
                  <span className="text-xs text-slate-500">
                    Prompt local coordination, site measurements, and doorstep delivery throughout Agra.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the Company Provides */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
              Comprehensive Supply
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              What Mr. Office Supplies
            </h2>
            <p className="text-sm text-slate-600">
              Our core focus is commercial workspaces, educational institutes, and dedicated study setups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Office Furniture */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-navy flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Office Furniture</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Tailored workstations, executive tables, conference tables, ergonomic revolving chairs, and file storage.
                </p>
              </div>
              <Link to="/products?category=Office%20Furniture" className="mt-4 text-xs font-bold text-brand-navy hover:text-brand-red flex items-center gap-1">
                View Office Models <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 2. School Furniture */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">School Furniture</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Dual classroom desks, student benches, teacher faculty podiums, library racks, and school lockers.
                </p>
              </div>
              <Link to="/products?category=School%20Furniture" className="mt-4 text-xs font-bold text-amber-700 hover:text-brand-red flex items-center gap-1">
                View School Models <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 3. Study Furniture */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Study Furniture</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Ergonomic study tables, integrated study bookshelves, contoured student chairs, and compact organizers.
                </p>
              </div>
              <Link to="/products?category=Study%20Furniture" className="mt-4 text-xs font-bold text-emerald-700 hover:text-brand-red flex items-center gap-1">
                View Study Models <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 4. Other Furniture */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                  <Sofa className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Other Furniture</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Commercial sofas, reception seating, café tables, and custom institutional items arranged on request.
                </p>
              </div>
              <Link to="/products?category=Other%20Furniture" className="mt-4 text-xs font-bold text-slate-700 hover:text-brand-red flex items-center gap-1">
                View Other Items <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area & Business Approach */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
              Operational Scope
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Service Area & Order Fulfillment
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Mr. Office primarily serves <strong>Agra, Uttar Pradesh</strong> and surrounding districts (such as Mathura, Firozabad, and neighboring regions).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Handshake className="w-5 h-5 text-brand-navy" />
                Why Contact Mr. Office?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If you are planning a new office setup, upgrading a school classroom, or outfitting an institutional premises, you do not have to settle for standard sizes that waste floor area. We help you choose exact dimensions, materials, and quantities directly from manufacturers at reasonable pricing.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-brand-red" />
                Our Business Approach
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe in straightforward business communication without hidden costs. All quotes are prepared based on actual material specifications, delivery logistics, and assembly requirements.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
            <strong>Note for clients & visitors:</strong> Mr. Office operates on an order-based supply model. Photographs and specifications on this website illustrate typical manufacturing models. Exact colors, veneers, and sizes can be tailored during your consultation.
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-brand-navy text-white space-y-4">
          <h2 className="text-2xl font-bold">Ready to Discuss Your Furniture Project?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Contact Mr. Office in Agra to schedule a discussion or obtain a free itemized quote for your space.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              Get a Quote Now
            </button>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-xs border border-white/20 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
