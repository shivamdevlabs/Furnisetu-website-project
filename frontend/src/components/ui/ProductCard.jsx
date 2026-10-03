import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Ruler } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProductCard({ product }) {
  const { openEnquiry } = useApp();

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Office Furniture':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'School Furniture':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Study Furniture':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const imageSrc = product.images && product.images.length > 0
    ? product.images[0]
    : '/images/category-office.jpg';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs ${getCategoryBadgeClass(product.category)}`}>
            {product.category}
          </span>
          {product.featured && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-red text-white shadow-xs">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {product.subcategory && (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {product.subcategory}
            </span>
          )}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-red transition line-clamp-1">
            <Link to={`/products/${product.slug || product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specifications preview */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            {product.material && (
              <div className="flex items-center gap-1.5 line-clamp-1">
                <Layers className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate"><strong>Material:</strong> {product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-1.5 line-clamp-1">
                <Ruler className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate"><strong>Size:</strong> {product.dimensions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Pricing</span>
            <span className="text-xs font-bold text-brand-navy">
              {product.price_display || "Get a Quote"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product.slug || product.id}`}
              className="p-2 rounded-xl text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition"
              title="View product specifications"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => openEnquiry(product)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
