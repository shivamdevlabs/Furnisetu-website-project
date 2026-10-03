import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export default function EnquiryModal() {
  const { isEnquiryModalOpen, closeEnquiry, enquiryModalData } = useApp();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    product_id: '',
    product_name: '',
    quantity: 1,
    city: 'Agra',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isEnquiryModalOpen) {
      setFormData({
        customer_name: '',
        phone: '',
        email: '',
        product_id: enquiryModalData.productId || '',
        product_name: enquiryModalData.productName || '',
        quantity: 1,
        city: 'Agra',
        message: enquiryModalData.productName
          ? `Hello FURNISETU, I would like to enquire about "${enquiryModalData.productName}". Please provide availability and a price quote for Agra delivery.`
          : 'Hello FURNISETU, I have a requirement for furniture for my office/school/study in Agra. Please get in touch.'
      });
      setSuccessResponse(null);
      setErrorMessage('');
    }
  }, [isEnquiryModalOpen, enquiryModalData]);

  if (!isEnquiryModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? (parseInt(value, 10) || 1) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await api.enquiries.submit(formData);
      setSuccessResponse(res.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setErrorMessage(detail);
      } else if (Array.isArray(detail)) {
        setErrorMessage(detail.map(d => d.msg || 'Validation error').join(', '));
      } else {
        setErrorMessage('Failed to submit enquiry. Please call us directly or check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="bg-brand-navyDark px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-bold">Request a Quote / Enquire</h3>
            <p className="text-xs text-slate-300">FURNISETU • Agra, Uttar Pradesh</p>
          </div>
          <button
            type="button"
            onClick={closeEnquiry}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successResponse ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Enquiry Received!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                {successResponse.message || "Thank you for reaching out to FURNISETU. Our Agra team will review your requirements and contact you shortly."}
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                Reference ID: <span className="font-mono font-semibold text-slate-700">{successResponse.enquiry_reference}</span>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={closeEnquiry}
                  className="px-6 py-2.5 rounded-xl bg-brand-navy text-white text-sm font-semibold hover:bg-brand-navyDark transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {enquiryModalData.productName && (
                <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl text-xs text-brand-red font-medium flex items-center justify-between">
                  <span>Enquiring for: <strong>{enquiryModalData.productName}</strong></span>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-red-200 text-brand-navy">
                    {enquiryModalData.category || 'Product'}
                  </span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                  />
                </div>
              </div>

              {/* City / Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery City / Location
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Agra, Dayalbagh, Sanjay Place, Mathura"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requirements & Specifications <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your furniture requirement, preferred material, sizes, or custom institutional needs..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-bold text-sm shadow-md shadow-brand-red/20 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Enquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Quote Request
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-normal">
                FURNISETU coordinates directly with quality furniture manufacturers to supply order-based furniture in Agra.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
