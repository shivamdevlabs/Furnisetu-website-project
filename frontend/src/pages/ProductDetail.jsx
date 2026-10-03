import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Ruler, 
  Layers, 
  MessageSquare, 
  FileText, 
  PhoneCall, 
  Share2, 
  ShieldCheck, 
  Sparkles,
  Truck
} from 'lucide-react';
import { api } from '../services/api';
import { INITIAL_PRODUCTS } from '../utils/initialProducts';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { settings, openEnquiry } = useApp();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    // Fetch product from API
    api.products.get(idOrSlug)
      .then((res) => {
        if (res.data) {
          setProduct(res.data);
          loadRelated(res.data.category, res.data.id);
        }
      })
      .catch(() => {
        // Fallback to initial local products
        const found = INITIAL_PRODUCTS.find(p => p.slug === idOrSlug || p.id === idOrSlug);
        if (found) {
          setProduct(found);
          loadRelated(found.category, found.id);
        } else {
          setProduct(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idOrSlug]);

  const loadRelated = (category, currentId) => {
    const related = INITIAL_PRODUCTS
      .filter(p => p.category === category && p.id !== currentId)
      .slice(0, 3);
    setRelatedProducts(related);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-8 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-4/3 bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-24 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested furniture item could not be located in our catalog.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const cleanPhone = (settings.phone || "").replace(/[^\d+]/g, "");
  const cleanWhatsapp = (settings.whatsapp || "").replace(/[^\d]/g, "");
  const images = product.images && product.images.length > 0 ? product.images : ['/images/category-office.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand-navy">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-navy">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-navy">
          {product.category}
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-soft">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-brand-red shadow-md' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Notice */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <Truck className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 font-semibold">Order-Based Sourcing & Agra Delivery</strong>
              This product is manufactured to order. Custom finishes, modular sizes, and bulk institutional quantities are arranged on request.
            </div>
          </div>
        </div>

        {/* Right: Info & Enquiry Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-navy border border-blue-200 text-xs font-bold">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="text-xs font-semibold text-slate-400">
                  • {product.subcategory}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available on Order
              </span>
              <span className="text-slate-400">
                Location: Agra, Uttar Pradesh
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs summary */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            {product.material && (
              <div className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Material: </span>
                  <span className="text-slate-800 font-semibold">{product.material}</span>
                </div>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-start gap-2">
                <Ruler className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="text-slate-500 font-medium">Dimensions: </span>
                  <span className="text-slate-800 font-semibold">{product.dimensions}</span>
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Order Model Callout */}
          <div className="p-5 rounded-2xl bg-brand-navyLight border border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Pricing Model</span>
                <span className="text-lg font-black text-brand-navy">
                  {product.price_display || "Get a Quote"}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Volume / Custom Sizing Dependent
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Because Mr. Office works directly with manufacturers, pricing is calculated transparently based on your quantity, material specification, and Agra delivery requirements.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => openEnquiry(product)}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-red/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <FileText className="w-4 h-4" />
                Request Quote for this Product
              </button>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Mr.%20Office,%20I%20would%20like%20to%20enquire%20about%20"${encodeURIComponent(product.name)}"%20for%20delivery%20in%20Agra.`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-soft">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
            Technical Specifications & Customization Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex items-start justify-between py-2 border-b border-slate-100 text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">{key}</span>
                <span className="text-slate-900 font-semibold text-right max-w-[60%]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Related {product.category}
            </h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-brand-navy hover:text-brand-red"
            >
              View More in {product.category} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id || rel.slug} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
