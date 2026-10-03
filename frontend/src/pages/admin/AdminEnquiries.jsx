import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Phone, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Trash2,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import EnquiryDetailModal from '../../components/admin/EnquiryDetailModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const STATUS_FILTERS = ["All", "New", "Contacted", "In Progress", "Completed", "Cancelled"];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15
      };
      if (activeStatus !== "All") params.status = activeStatus;
      if (search) params.search = search;

      const res = await api.enquiries.list(params);
      setEnquiries(res.data.items || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error("Failed to load enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [activeStatus, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEnquiries();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.enquiries.delete(deleteTarget.id);
      setDeleteTarget(null);
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch {
      alert("Failed to delete enquiry.");
    } finally {
      setDeleteLoading(false);
    }
  };

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
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Customer Leads & Quotation Enquiries
          </h2>
          <p className="text-xs text-slate-500">
            Total of {totalCount} leads recorded for Agra furniture orders
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setActiveStatus(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeStatus === st
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, phone, or area..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-brand-red"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Product / Item</th>
                <th className="py-3.5 px-4 text-center">Qty</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Loading customer leads...
                  </td>
                </tr>
              ) : enquiries.length > 0 ? (
                enquiries.map((enq) => {
                  const cleanPhone = (enq.phone || "").replace(/[^\d+]/g, "");
                  return (
                    <tr
                      key={enq.id}
                      onClick={() => setSelectedEnquiry(enq)}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      {/* Customer */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{enq.customer_name}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-red flex-shrink-0" />
                          {enq.city || 'Agra'}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {enq.phone}
                        {enq.email && (
                          <span className="block text-[11px] text-slate-400 font-sans truncate max-w-[140px]">
                            {enq.email}
                          </span>
                        )}
                      </td>

                      {/* Product */}
                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">
                          {enq.product_name || "General Furniture"}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {enq.message}
                        </p>
                      </td>

                      {/* Qty */}
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {enq.quantity || 1}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(enq.status)}`}>
                          {enq.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition"
                            title="View lead"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(enq)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                            title="Delete enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No customer leads found matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <EnquiryDetailModal
        isOpen={!!selectedEnquiry}
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onUpdated={fetchEnquiries}
        onDeleteRequest={(enq) => setDeleteTarget(enq)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Customer Lead"
        message={`Are you sure you want to permanently delete the lead from ${deleteTarget?.customer_name}?`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
