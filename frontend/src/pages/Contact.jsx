import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Building2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function Contact() {
  const { settings } = useApp();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    product_name: 'General Enquiry',
    quantity: 1,
    city: 'Agra',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const cleanPhone = (settings.phone || "").replace(/[^\d+]/g, "");
  const cleanWhatsapp = (settings.whatsapp || "").replace(/[^\d]/g, "");

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
      setFormData({
        customer_name: '',
        phone: '',
        email: '',
        product_name: 'General Enquiry',
        quantity: 1,
        city: 'Agra',
        message: ''
      });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setErrorMessage(detail);
      } else if (Array.isArray(detail)) {
        setErrorMessage(detail.map(d => d.msg || 'Validation error').join(', '));
      } else {
        setErrorMessage('Failed to send enquiry. Please call us directly or check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>Agra Operations & Consultation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-xs">
            Contact Mr. Office
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto">
            Discuss your furniture requirements, ask questions, or request an itemized quotation for your space in Agra.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Cards + Enquiry Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
                Direct Communication
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Reach Out in Agra
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We work closely with clients across Agra to understand layout specifications and facilitate direct manufacturer ordering.
              </p>
            </div>

            <div className="space-y-4">
              {/* Address card */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-50 text-brand-red flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Business Location</h3>
                  <p className="text-xs text-slate-600 mt-1">{settings.address || "Agra, Uttar Pradesh, India"}</p>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-brand-navy bg-blue-50 px-2 py-0.5 rounded">
                    Serving Entire Agra District & Surroundings
                  </span>
                </div>
              </div>

              {/* Phone card */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-brand-navy flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Call Us</h3>
                  <p className="text-xs text-slate-600 mt-1">Available for quick queries & orders</p>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-block mt-1 text-sm font-bold text-brand-navy hover:text-brand-red transition"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp card */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Chat on WhatsApp</h3>
                  <p className="text-xs text-slate-600 mt-1">Send floor plans, room photos & specs</p>
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Mr.%20Office,%20I%20have%20a%20furniture%20requirement%20in%20Agra.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-1 text-sm font-bold text-emerald-700 hover:underline"
                  >
                    {settings.whatsapp}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Business Hours</h3>
                  <p className="text-xs text-slate-600 mt-1">{settings.business_hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Full Enquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-soft">
            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
                Online Quotation Request
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Send Us Your Requirements
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Fill in the details below and we will get back to you with custom catalog options and price guidance.
              </p>
            </div>

            {successResponse ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Thank You!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your enquiry has been successfully logged. Our Agra representative will review your requirement and reach out shortly.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 inline-block font-mono">
                  Reference: {successResponse.enquiry_reference}
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSuccessResponse(null)}
                    className="px-6 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navyDark transition"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="e.g. Amit Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
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
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Agra (Sanjay Place, Sikandra, Dayalbagh)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category of Interest */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Furniture Category
                    </label>
                    <select
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition bg-white"
                    >
                      <option value="General Enquiry">General Furniture Enquiry</option>
                      <option value="Office Workstations & Desks">Office Workstations & Desks</option>
                      <option value="Executive Office Cabin">Executive Office Cabin</option>
                      <option value="Office Chairs">Office Chairs</option>
                      <option value="Conference & Meeting Tables">Conference & Meeting Tables</option>
                      <option value="School Classroom Benches">School Classroom Benches & Desks</option>
                      <option value="School Teacher / Faculty Sets">School Teacher / Faculty Sets</option>
                      <option value="Home Study Room Setup">Home Study Room Setup</option>
                      <option value="Reception Sofa / Other">Reception Sofa / Other Furniture</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Approximate Quantity
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

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Requirement Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your space, timeline, preferred material/color, or any custom specifications..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100 transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-bold text-sm shadow-md shadow-brand-red/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Enquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Enquiry to Mr. Office
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Location Map Placeholder Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Agra Service Coverage</h3>
              <p className="text-xs text-slate-600">
                Operating across Sanjay Place, Sikandra, Dayalbagh, Kamla Nagar, Trans Yamuna, and nearby regions.
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=Hello%20Mr.%20Office,%20I%20would%20like%20to%20request%20a%20site%20visit%20or%20meeting%20in%20Agra.`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition"
            >
              Request a Site Meeting in Agra
            </a>
          </div>

          {/* Visual Map Canvas Placeholder */}
          <div className="w-full h-64 bg-slate-200/80 rounded-2xl border border-slate-300/80 relative flex items-center justify-center overflow-hidden">
            <div className="text-center space-y-2 p-6 z-10 bg-white/85 backdrop-blur-xs rounded-2xl shadow-sm border border-slate-200">
              <MapPin className="w-8 h-8 text-brand-red mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-slate-900">Mr. Office — Agra Hub</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                {settings.address || "Agra, Uttar Pradesh, India"}
              </p>
              <span className="text-[11px] text-slate-400 block">
                (Exact street location details provided upon order confirmation)
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
