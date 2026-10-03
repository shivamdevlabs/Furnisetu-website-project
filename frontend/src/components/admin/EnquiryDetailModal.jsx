import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Save, 
  Loader2, 
  MessageSquare, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';

const STATUSES = ["New", "Contacted", "In Progress", "Completed", "Cancelled"];

export default function EnquiryDetailModal({
  isOpen,
  enquiry,
  onClose,
  onUpdated,
  onDeleteRequest
}) {
  const [status, setStatus] = useState("New");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (enquiry) {
      setStatus(enquiry.status || "New");
      setNotes(enquiry.notes || "");
      setSavedSuccess(false);
      setError("");
    }
  }, [enquiry, isOpen]);

  if (!isOpen || !enquiry) return null;

  const handleSaveStatus = async () => {
    setLoading(true);
    setError("");
    setSavedSuccess(false);

    try {
      await api.enquiries.updateStatus(enquiry.id, {
        status,
        notes: notes.trim()
      });
      setSavedSuccess(true);
      onUpdated();
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = (enquiry.phone || "").replace(/[^\d+]/g, "");

  const getStatusBadge = (st) => {
    switch (st) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-brand-navy px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h3 className="text-base font-bold">Enquiry Lead Details</h3>
            <p className="text-xs text-slate-300">Reference: {enquiry.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Row */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Current Lead Status</span>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(enquiry.status)}`}>
                {enquiry.status}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Received: {new Date(enquiry.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Customer Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Customer Name</span>
                <span className="font-bold text-slate-900">{enquiry.customer_name}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone</span>
                  <a href={`tel:${cleanPhone}`} className="font-bold text-brand-navy hover:text-brand-red">
                    {enquiry.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`https://wa.me/${cleanPhone.replace('+', '')}?text=Hello%20${encodeURIComponent(enquiry.customer_name)},%20this%20is%20Mr.%20Office%20regarding%20your%20furniture%20enquiry.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="p-1.5 rounded-lg bg-blue-50 text-brand-navy hover:bg-blue-100"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Email</span>
                <span className="font-medium text-slate-700">{enquiry.email || "Not provided"}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Location</span>
                <span className="font-bold text-slate-900">{enquiry.city || "Agra"}</span>
              </div>
            </div>
          </div>

          {/* Product & Message */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Enquiry Requirements
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Furniture Item / Model:</span>
                <span className="font-bold text-slate-900">{enquiry.product_name || "General Furniture Requirement"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Quantity:</span>
                <span className="font-bold text-slate-900">{enquiry.quantity || 1} units</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 font-medium block mb-1">Customer Note / Message:</span>
                <p className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-normal">
                  {enquiry.message}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Management Section */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Lead Workflow & Follow-Up
            </h4>

            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                {error}
              </div>
            )}

            {savedSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs border border-emerald-200 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Status updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Change Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-brand-red bg-white"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quick Actions
                </label>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(enquiry)}
                  className="w-full py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Enquiry
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Internal Follow-Up Notes
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Quoted ₹45,000 for 4-seater workstation. Meeting scheduled at Agra office on Friday..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-brand-red bg-white"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={handleSaveStatus}
                className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-brand-navyDark text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
