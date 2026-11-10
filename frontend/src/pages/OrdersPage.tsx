import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  PackageCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [role, setRole] = useState<'all' | 'buyer' | 'seller'>('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.orders.getAll({
        status: activeTab === 'ALL' ? undefined : activeTab,
        role: role === 'all' ? undefined : role,
      });
      setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, role]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Procurement & Fulfillment
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Orders & Commercial Transactions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track freight status, simulated escrow clearances, and environmental savings receipts.
            </p>
          </div>

          {/* Role Filter toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setRole('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                role === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Trades
            </button>
            <button
              onClick={() => setRole('buyer')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                role === 'buyer' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Purchases
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                role === 'seller' ? 'bg-white text-forest-800 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sales
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Shipments' },
            { id: 'ACTIVE', label: 'Active / In Transit' },
            { id: 'COMPLETED', label: 'Delivered & Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-20 text-center text-xs font-medium text-slate-400">Loading order records...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <PackageCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No orders found in this view</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When purchase requests are accepted by sellers, transaction orders are automatically established here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isBuyer = order.buyerId === user?.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:border-emerald-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Order Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-black text-sm text-slate-900 tracking-tight">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Payment: {order.paymentStatus}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        order.deliveryStatus === 'DELIVERED' ? 'bg-teal-100 text-teal-800' :
                        order.deliveryStatus === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Transit: {order.deliveryStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-medium">Material Item</span>
                        <span className="font-bold text-slate-900 truncate block mt-0.5">
                          {order.material?.title}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Quantity Volume</span>
                        <span className="font-bold text-slate-800 block mt-0.5">
                          {order.quantity} {order.material?.unit}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Trade Partner</span>
                        <span className="font-bold text-slate-800 block mt-0.5 truncate">
                          {isBuyer ? `Seller: ${order.seller.businessName}` : `Buyer: ${order.buyer.businessName}`}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Total Transaction</span>
                        <span className="font-black text-emerald-800 block mt-0.5 text-sm">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                    {/* Pay button if buyer and pending */}
                    {isBuyer && order.paymentStatus === 'PENDING' && (
                      <Link
                        to={`/checkout/${order.id}`}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{order.totalAmount.toLocaleString('en-IN')} (Simulated)</span>
                      </Link>
                    )}

                    <Link
                      to={`/orders/${order.id}`}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-forest-900 text-white hover:bg-forest-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Order Details & Invoice</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
