import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Save, Layers } from 'lucide-react';
import { api } from '../../services/api';

const CATEGORIES = [
  "Office Furniture",
  "School Furniture",
  "Study Furniture",
  "Other Furniture"
];

export default function ProductModal({
  isOpen,
  product = null,
  onClose,
  onSaved
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Office Furniture',
    subcategory: '',
    description: '',
    material: '',
    dimensions: '',
    price_display: 'Get a Quote',
    featured: false,
    is_active: true,
    images: [''],
    specifications: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      // Transform specifications dict to array of { key, value }
      const specsArray = product.specifications
        ? Object.entries(product.specifications).map(([k, v]) => ({ key: k, value: v }))
        : [];

      setFormData({
        name: product.name || '',
        category: product.category || 'Office Furniture',
        subcategory: product.subcategory || '',
        description: product.description || '',
        material: product.material || '',
        dimensions: product.dimensions || '',
        price_display: product.price_display || 'Get a Quote',
        featured: !!product.featured,
        is_active: product.is_active !== undefined ? product.is_active : true,
        images: product.images && product.images.length > 0 ? product.images : [''],
        specifications: specsArray
      });
    } else {
      setFormData({
        name: '',
        category: 'Office Furniture',
        subcategory: '',
        description: '',
        material: '',
        dimensions: '',
        price_display: 'Get a Quote',
        featured: false,
        is_active: true,
        images: ['/images/category-office.jpg'],
        specifications: [
          { key: 'Material', value: 'High-Density Board' },
          { key: 'Ideal For', value: 'Commercial Offices' }
        ]
      });
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updated.length ? updated : [''] }));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const addSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecRow = (index) => {
    const updated = formData.specifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Rebuild specifications dictionary
      const specsDict = {};
      formData.specifications.forEach((s) => {
        if (s.key && s.key.trim()) {
          specsDict[s.key.trim()] = s.value.trim();
        }
      });

      // Filter empty images
      const cleanedImages = formData.images.filter((img) => img && img.trim());

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        subcategory: formData.subcategory ? formData.subcategory.trim() : null,
        description: formData.description.trim(),
        material: formData.material ? formData.material.trim() : null,
        dimensions: formData.dimensions ? formData.dimensions.trim() : null,
        price_display: formData.price_display || 'Get a Quote',
        featured: formData.featured,
        is_active: formData.is_active,
        images: cleanedImages.length > 0 ? cleanedImages : ['/images/category-office.jpg'],
        specifications: specsDict
      };

      if (product && (product.id || product._id)) {
        const prodId = product.id || product._id;
        await api.products.update(prodId, payload);
      } else {
        await api.products.create(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to save product. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-brand-navy px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-red" />
            <h3 className="text-base font-bold">
              {product ? `Edit Product: ${product.name}` : 'Add New Furniture Product'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Executive Wooden Office Desk"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Main Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subcategory
              </label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="e.g. Executive Tables, Chairs, Desks"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="e.g. High-Density Engineered Wood"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dimensions / Sizing
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g. 6ft (W) x 3ft (D) x 2.5ft (H)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Price Display */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Price Display
              </label>
              <input
                type="text"
                name="price_display"
                value={formData.price_display}
                onChange={handleChange}
                placeholder="e.g. Get a Quote or On Request"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-brand-red focus:ring-red-400"
                />
                Mark as Featured
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-400"
                />
                Active (Visible in Catalog)
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of furniture features, build quality, and use cases..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
            ></textarea>
          </div>

          {/* Image URLs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Image URLs
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="text-[11px] font-bold text-brand-navy hover:text-brand-red flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Image URL
              </button>
            </div>
            {formData.images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  placeholder="/images/category-office.jpg or https://..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-brand-red"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(i)}
                    className="p-2 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Specifications Key-Value Pairs */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Technical Specifications (Key - Value)
              </label>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-[11px] font-bold text-brand-navy hover:text-brand-red flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Specification
              </button>
            </div>
            {formData.specifications.map((spec, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Frame Material"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-brand-red"
                />
                <input
                  type="text"
                  placeholder="e.g. CRCA Powder-coated Steel"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-brand-red"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(i)}
                  className="p-2 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold shadow-md shadow-brand-red/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Product...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
