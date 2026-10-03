import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Layers, X, Sparkles, Building2, GraduationCap, BookOpen, Sofa } from 'lucide-react';
import { api } from '../services/api';
import { INITIAL_PRODUCTS, CATEGORIES } from '../utils/initialProducts';
import ProductCard from '../components/ui/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All Products';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory && activeCategory !== 'All Products') {
      params.category = activeCategory;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }

    api.products.list(params)
      .then((res) => {
        if (res.data && res.data.items && res.data.items.length > 0) {
          setProducts(res.data.items);
        } else {
          // Filter locally from fallback catalog
          let list = [...INITIAL_PRODUCTS];
          if (activeCategory && activeCategory !== 'All Products') {
            list = list.filter(p => p.category === activeCategory);
          }
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p => 
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              (p.material && p.material.toLowerCase().includes(q))
            );
          }
          setProducts(list);
        }
      })
      .catch(() => {
        // Fallback filter
        let list = [...INITIAL_PRODUCTS];
        if (activeCategory && activeCategory !== 'All Products') {
          list = list.filter(p => p.category === activeCategory);
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          list = list.filter(p => 
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.material && p.material.toLowerCase().includes(q))
          );
        }
        setProducts(list);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All Products') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Office Furniture':
        return <Building2 className="w-4 h-4" />;
      case 'School Furniture':
        return <GraduationCap className="w-4 h-4" />;
      case 'Study Furniture':
        return <BookOpen className="w-4 h-4" />;
      case 'Other Furniture':
        return <Sofa className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Furniture Catalog
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Explore Our Furniture Range
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Order-based furniture manufactured to your dimensions, finish choices, and quantity requirements. Available for delivery and assembly in Agra.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tables, chairs, benches..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Active Filter Chips */}
      {(activeCategory !== 'All Products' || searchQuery) && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">Filtered by:</span>
          {activeCategory !== 'All Products' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-brand-navy font-medium border border-blue-200">
              {activeCategory}
              <button type="button" onClick={() => handleCategoryChange('All Products')}>
                <X className="w-3 h-3 hover:text-brand-red" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-brand-red font-medium border border-red-200">
              "{searchQuery}"
              <button type="button" onClick={clearSearch}>
                <X className="w-3 h-3 hover:text-brand-redDark" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
              <div className="aspect-4/3 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-8 bg-slate-200 rounded-xl mt-4"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 max-w-lg mx-auto">
          <Layers className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find products matching your filters. FURNISETU can arrange custom designs directly from manufacturers.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                handleCategoryChange('All Products');
                clearSearch();
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Custom Quote Footer Callout */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold">Don't see your exact layout or dimensions?</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Because FURNISETU works on an order-based model, we can arrange custom office clusters, specialized classroom benches, and tailor-made study desks directly from our manufacturing partners.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleCategoryChange('All Products')}
          className="px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer"
        >
          Enquire for Custom Order
        </button>
      </div>
    </div>
  );
}
