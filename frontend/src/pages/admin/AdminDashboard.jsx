import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Phone, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import ProductModal from '../../components/admin/ProductModal';
import EnquiryDetailModal from '../../components/admin/EnquiryDetailModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteConfirmEnquiry, setDeleteConfirmEnquiry] = useState(null);

  const fetchDashboard = () => {
    setLoading(true);
    api.admin.getDashboard()
      .then((res) => {
        setDashboardData(res.data);
      })
      .catch((err) => {
        setError('Failed to load live dashboard stats. Ensure backend server is running.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDeleteEnquiry = async () => {
    if (!deleteConfirmEnquiry) return;
    try {
      await api.enquiries.delete(deleteConfirmEnquiry.id);
      setDeleteConfirmEnquiry(null);
      setSelectedEnquiry(null);
      fetchDashboard();
    } catch {
      alert("Failed to delete enquiry.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200"></div>
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    total_products: 0,
    active_products: 0,
    featured_products: 0,
    total_enquiries: 0,
    new_enquiries: 0,
    in_progress_enquiries: 0,
    completed_enquiries: 0
  };

  const recentEnquiries = dashboardData?.recent_enquiries || [];
  const recentProducts = dashboardData?.recent_products || [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
            Operational Overview
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Mr. Office Business Control Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your furniture catalog, respond to incoming customer leads, and update Agra business settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsProductModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold shadow-md shadow-brand-red/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Products</span>
            <div className="p-2 rounded-xl bg-blue-50 text-brand-navy">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.total_products}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
            <span className="text-emerald-600 font-bold">{stats.active_products} Active</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">{stats.featured_products} Featured</span>
          </div>
        </div>

        {/* Total Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Customer Enquiries</span>
            <div className="p-2 rounded-xl bg-red-50 text-brand-red">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.total_enquiries}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
            <span className="text-blue-600 font-bold">{stats.new_enquiries} New Leads</span>
            <span>•</span>
            <span className="text-purple-600 font-bold">{stats.in_progress_enquiries} In Progress</span>
          </div>
        </div>

        {/* Completed Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Closed Orders</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {stats.completed_enquiries}
          </div>
          <div className="text-[11px] text-slate-500">
            Fulfillments & delivered orders
          </div>
        </div>

        {/* Hub Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Location & Network</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            Agra Hub Active
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            Order-based manufacturer dispatch
          </div>
        </div>
      </div>

      {/* Grid: Recent Enquiries (7 cols) + Recent Products (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customer Leads</h3>
              <p className="text-xs text-slate-500">Latest quotations and inquiries submitted by visitors</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-brand-navy hover:text-brand-red flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{enq.customer_name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        enq.status === 'New' ? 'bg-blue-100 text-blue-700' :
                        enq.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {enq.product_name} • {enq.city || 'Agra'} • Qty: {enq.quantity || 1}
                    </p>
                  </div>
                  <div className="text-right flex items-center sm:flex-col justify-between sm:justify-center">
                    <span className="text-[11px] font-mono font-semibold text-brand-navy">{enq.phone}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent enquiries logged yet.
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Products</h3>
              <p className="text-xs text-slate-500">Catalog inventory items</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-brand-navy hover:text-brand-red flex items-center gap-1"
            >
              Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition"
                >
                  <img
                    src={p.images && p.images.length > 0 ? p.images[0] : '/images/category-office.jpg'}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                    <span className="text-[11px] text-slate-400 block">{p.category}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No products found in database.
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSaved={fetchDashboard}
      />

      {/* Enquiry Detail Modal */}
      <EnquiryDetailModal
        isOpen={!!selectedEnquiry}
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onUpdated={fetchDashboard}
        onDeleteRequest={(enq) => setDeleteConfirmEnquiry(enq)}
      />

      {/* Delete Enquiry Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmEnquiry}
        title="Delete Customer Enquiry"
        message={`Are you sure you want to permanently delete the enquiry from ${deleteConfirmEnquiry?.customer_name}?`}
        onConfirm={handleDeleteEnquiry}
        onCancel={() => setDeleteConfirmEnquiry(null)}
      />
    </div>
  );
}
