import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle, Building2, Phone, Mail, Clock, MapPin, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function AdminSettings() {
  const { settings: globalSettings, setSettings: setGlobalSettings } = useApp();

  const [formData, setFormData] = useState({
    business_name: 'Mr. Office',
    tagline: 'Office, School & Study Furniture Specialists in Agra',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'contact@mroffice.in',
    address: 'Agra, Uttar Pradesh, India',
    business_hours: 'Monday – Saturday: 10:00 AM – 8:00 PM',
    google_maps_embed_url: '',
    about_short: '',
    hero_headline: 'Premium Office, School & Study Furniture in Agra',
    hero_subheadline: 'Direct order-based supply for offices, educational institutions, study spaces & corporate setups.',
    social_links: {
      instagram: '',
      facebook: '',
      linkedin: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (globalSettings) {
      setFormData(globalSettings);
    }
  }, [globalSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const network = name.replace('social_', '');
      setFormData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [network]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSaveSuccess(false);

    try {
      const res = await api.settings.update(formData);
      if (res.data) {
        setFormData(res.data);
        setGlobalSettings(res.data);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update business settings. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Business Information & Website Settings
        </h2>
        <p className="text-xs text-slate-500">
          Update business contact details, Agra location, and homepage headlines without editing source code.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Business settings updated successfully! Live website copy updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Core Identity & Contact */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-brand-red" />
            <h3 className="text-base font-bold text-slate-900">Core Identity & Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                name="business_name"
                required
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (Calls)
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Business Number
              </label>
              <input
                type="text"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Agra Address / Service Area
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Operating Hours
              </label>
              <input
                type="text"
                name="business_hours"
                value={formData.business_hours}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Homepage Marketing Headlines */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-5 h-5 text-brand-navy" />
            <h3 className="text-base font-bold text-slate-900">Homepage Headlines & Marketing Copy</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Main Headline
              </label>
              <input
                type="text"
                name="hero_headline"
                value={formData.hero_headline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Subheadline / Description
              </label>
              <textarea
                name="hero_subheadline"
                rows="2"
                value={formData.hero_subheadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                About Section Summary
              </label>
              <textarea
                name="about_short"
                rows="3"
                value={formData.about_short}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-brand-red"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-red/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Business Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
