import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Sofa, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  Layers,
  Sparkles,
  ClipboardList,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { INITIAL_PRODUCTS } from '../utils/initialProducts';
import ProductCard from '../components/ui/ProductCard';

export default function Home() {
  const { settings, openEnquiry } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // Attempt to load featured products from backend API
    api.products.featured(6)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setFeaturedProducts(res.data);
        } else {
          // Fallback to initial seed items
          setFeaturedProducts(INITIAL_PRODUCTS.filter(p => p.featured));
        }
      })
      .catch(() => {
        // Fallback to initial seed items on connection standby
        setFeaturedProducts(INITIAL_PRODUCTS.filter(p => p.featured));
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-office.jpg"
            alt="FURNISETU Executive Furniture in Agra"
            className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32 flex flex-col items-start justify-center">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-slate-200 mb-6">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>Serving Agra & Surrounding Uttar Pradesh Regions</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.15]">
            {settings.hero_headline || "Premium Office, School & Study Furniture in Agra"}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            {settings.hero_subheadline || "Direct order-based supply for corporate offices, schools, colleges, and home study rooms. We coordinate directly with premier manufacturers to deliver the exact specifications you require."}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="px-7 py-3.5 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-red/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Get a Free Quote
            </button>
            <Link
              to="/products"
              className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>View Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Key Value Badges */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Office Workspaces</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>School Desks & Benches</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Home Study Setups</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Direct Manufacturer Sourcing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Core Focus Areas
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Furniture Tailored for Productive Spaces
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            FURNISETU specializes primarily in commercial, educational, and study room requirements across Agra.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Office Furniture */}
          <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-card hover:border-slate-300 transition-all flex flex-col">
            <div className="aspect-16/10 relative overflow-hidden bg-slate-100">
              <img
                src="/images/category-office.jpg"
                alt="Office Furniture Agra"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-brand-navy text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <Building2 className="w-3.5 h-3.5" />
                Office Furniture
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-red transition">
                  Corporate & Commercial Offices
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Workstations, director executive desks, conference tables, ergonomic revolving chairs, and secure office storage cabinets.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                  <li className="flex items-center gap-2">✓ Modular Linear & Cluster Workstations</li>
                  <li className="flex items-center gap-2">✓ Ergonomic Mesh & High-Back Executive Chairs</li>
                  <li className="flex items-center gap-2">✓ 8 to 16 Seater Boardroom Tables</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/products?category=Office%20Furniture"
                  className="text-xs font-bold text-brand-navy hover:text-brand-red flex items-center gap-1"
                >
                  Explore Office Range <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiry({ category: 'Office Furniture' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-red hover:text-white text-slate-700 text-xs font-semibold transition"
                >
                  Quote
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: School Furniture */}
          <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-card hover:border-slate-300 transition-all flex flex-col">
            <div className="aspect-16/10 relative overflow-hidden bg-slate-100">
              <img
                src="/images/category-school.jpg"
                alt="School Furniture Agra"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <GraduationCap className="w-3.5 h-3.5" />
                School Furniture
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-red transition">
                  Schools & Educational Institutes
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Sturdy classroom dual desks, single benches, teacher tables, lab benches, and library shelving built for institutional durability.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                  <li className="flex items-center gap-2">✓ Dual & Single Student Desks with Steel Frame</li>
                  <li className="flex items-center gap-2">✓ Faculty Desk Sets with Lockable Storage</li>
                  <li className="flex items-center gap-2">✓ Institutional Library Book Racks</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/products?category=School%20Furniture"
                  className="text-xs font-bold text-amber-700 hover:text-brand-red flex items-center gap-1"
                >
                  Explore School Range <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiry({ category: 'School Furniture' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-red hover:text-white text-slate-700 text-xs font-semibold transition"
                >
                  Quote
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Study Furniture */}
          <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-card hover:border-slate-300 transition-all flex flex-col">
            <div className="aspect-16/10 relative overflow-hidden bg-slate-100">
              <img
                src="/images/category-study.jpg"
                alt="Study Furniture Agra"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <BookOpen className="w-3.5 h-3.5" />
                Study Furniture
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-red transition">
                  Study Rooms & Work-From-Home
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Ergonomic study tables, integrated bookshelf units, comfortable student study chairs, and compact storage solutions.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                  <li className="flex items-center gap-2">✓ Compact Desks with Overhead Bookcases</li>
                  <li className="flex items-center gap-2">✓ Student Ergonomic Swivel Study Chairs</li>
                  <li className="flex items-center gap-2">✓ Modular Bookshelves and File Organizers</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/products?category=Study%20Furniture"
                  className="text-xs font-bold text-emerald-800 hover:text-brand-red flex items-center gap-1"
                >
                  Explore Study Range <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openEnquiry({ category: 'Study Furniture' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-red hover:text-white text-slate-700 text-xs font-semibold transition"
                >
                  Quote
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Furniture on Request Banner */}
        <div className="mt-8 bg-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white text-brand-navy flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-200">
              <Sofa className="w-6 h-6 text-brand-red" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Need Sofas, Lounge Seating, or Other Specialized Furniture?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                In addition to office and school setups, we can arrange commercial reception sofas, visitor seating, café tables, and custom institutional items on request.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openEnquiry({ category: 'Other Furniture' })}
            className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyDark text-white text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer"
          >
            Enquire for Other Furniture
          </button>
        </div>
      </section>

      {/* 3. BUSINESS PROCESS / HOW WE WORK */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
              Transparent Order-Based Model
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How FURNISETU Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              We eliminate showroom markups by working directly with top manufacturers to fulfill your custom furniture orders.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft relative flex flex-col">
              <span className="w-8 h-8 rounded-full bg-red-100 text-brand-red font-black text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900">1. Share Requirements</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Contact FURNISETU online, by phone, or WhatsApp. Specify dimensions, seating count, preferred materials, and room layout.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft relative flex flex-col">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-brand-navy font-black text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900">2. Tailored Quotation</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                We prepare a competitive quote with material choices, finish options, and realistic timelines tailored to Agra delivery.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft relative flex flex-col">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900">3. Manufacturer Sourcing</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Once confirmed, we coordinate with our manufacturing partners for precision fabrication and quality inspection.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft relative flex flex-col">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="text-base font-bold text-slate-900">4. Delivery & Assembly</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your furniture is transported safely to your location in Agra with professional on-site placement and assembly assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
              Curated Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Furniture Models
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore frequently ordered office workstations, classroom benches, and study desks.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-navy hover:text-brand-red transition flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE FURNISETU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-brand-navy text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-card">
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Why Choose FURNISETU
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Dedicated Furniture Sourcing for Agra Businesses & Schools
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Instead of being limited to rigid off-the-shelf retail inventory, FURNISETU provides flexibility in sizing, materials, and quantities directly aligned with your space and budget.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-white flex-shrink-0">
                  <Sliders className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Custom Sizing & Specs</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Select tailored desk dimensions, acoustic partition heights, and surface materials.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-white flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Bulk Institutional Orders</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Ideal for schools, coaching institutes, colleges, and commercial corporate floors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-white flex-shrink-0">
                  <MapPin className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Local Agra Point-of-Contact</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Reliable local communication, requirement discussion, and coordination in Agra.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-white flex-shrink-0">
                  <Truck className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Safe Delivery & Setup</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    We arrange transportation directly to your site with guided assembly support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION / ENQUIRY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Have an Upcoming Office or Classroom Furniture Requirement?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Get in touch with FURNISETU today to discuss configurations, material samples, and customized quotes for your space in Agra.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openEnquiry()}
              className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-bold text-sm shadow-md shadow-brand-red/20 transition cursor-pointer"
            >
              Request a Free Quote
            </button>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm transition"
            >
              Contact Agra Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
