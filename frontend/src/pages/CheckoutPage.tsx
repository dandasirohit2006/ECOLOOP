import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Order, Payment } from '../types';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'BANK_TRANSFER'>('UPI');
  const [paymentSuccess, setPaymentSuccess] = useState<Payment | null>(null);

  // Form mock fields
  const [upiVpa, setUpiVpa] = useState('company@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [bank, setBank] = useState('HDFC Bank');

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        const res = await api.checkout.getOrder(id);
        setOrder(res.order);
        if (res.order.paymentStatus === 'PAID') {
          setPaymentSuccess(res.order.payment || null);
        }
      } catch (err) {
        console.error('Failed to load order for payment:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setSubmitting(true);
    try {
      const res = await api.checkout.pay(order.id, {
        paymentMethod,
        paymentDetails: { upiVpa, bank },
      });

      setPaymentSuccess(res.payment);

      // Launch celebratory circular confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch (err: any) {
      alert(err.message || 'Payment simulation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] dark:bg-ecoDark-bg flex items-center justify-center py-20 px-4">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">Initializing EcoLoop Escrow Gateway...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] dark:bg-ecoDark-bg flex items-center justify-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Order Not Found</h2>
      </div>
    );
  }

  // Payment Success Screen
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] dark:bg-ecoDark-bg py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-white dark:bg-ecoDark-surface rounded-3xl p-8 sm:p-10 shadow-card dark:shadow-glow-sm border border-emerald-100/80 dark:border-emerald-500/20 text-center space-y-6 transition-colors"
        >
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-ecoDark-card px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
              Escrow Verified
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              Payment Confirmed!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ₹{order.totalAmount.toLocaleString('en-IN')} held securely in EcoLoop Escrow. Seller will dispatch material.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-ecoDark-card p-4 rounded-2xl border border-slate-100 dark:border-emerald-950/60 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Order Ref:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">#{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Transaction ID:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">{paymentSuccess.transactionRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Payment Channel:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{paymentSuccess.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Escrow Status:</span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">HELD_IN_ESCROW</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 text-left flex items-start gap-2.5">
            <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Circular Economy Impact Recorded!</p>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                Your purchase will officially divert {order.quantity} {order.material?.unit} of waste from local landfills.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to={`/orders/${order.id}`}
              className="w-full py-3 rounded-xl font-bold text-xs bg-forest-900 dark:bg-emerald-600 text-white hover:bg-forest-800 dark:hover:bg-emerald-500 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>View Tracking & Commercial Invoice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/marketplace"
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-ecoDark-card transition-colors"
            >
              Explore More Materials
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-ecoDark-bg py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-ecoDark-surface rounded-3xl p-6 sm:p-10 shadow-card dark:shadow-glow-sm border border-emerald-100/80 dark:border-emerald-500/20 transition-colors"
        >
          {/* Header */}
          <div className="border-b border-slate-100 dark:border-emerald-950/60 pb-6 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Simulated B2B Escrow Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Settle Commercial Transaction
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Test mode simulated payment. No real currency is charged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Payment Form (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              {/* Payment Methods tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CARD', label: 'Card', icon: CreditCard },
                  { id: 'NETBANKING', label: 'NetBank', icon: Building },
                  { id: 'BANK_TRANSFER', label: 'RTGS', icon: ShieldCheck },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-700 dark:border-emerald-500 bg-emerald-50 dark:bg-ecoDark-card text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-emerald-950/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-emerald-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-emerald-700 dark:text-emerald-400" />
                      <span className="text-[11px] font-bold block">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Simulated Payment Form based on method */}
              <form onSubmit={handlePay} className="space-y-4">
                {paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-ecoDark-card border border-slate-200/80 dark:border-emerald-950/60 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Simulated UPI Intent</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        Zero Fee
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">UPI VPA</label>
                      <input
                        type="text"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-ecoDark-surface text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="text-center py-2">
                      <div className="w-28 h-28 mx-auto bg-white dark:bg-ecoDark-surface rounded-xl border border-slate-200 dark:border-emerald-900/60 p-2 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[10px] font-mono">
                        [SIMULATED QR]
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Scan with BHIM, PhonePe, GooglePay</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-ecoDark-card border border-slate-200/80 dark:border-emerald-950/60 space-y-3">
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">Simulated Commercial Card</span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-ecoDark-surface text-slate-900 dark:text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Valid Thru</label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-ecoDark-surface text-slate-900 dark:text-white focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">CVV</label>
                        <input
                          type="password"
                          defaultValue="789"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-ecoDark-surface text-slate-900 dark:text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NETBANKING' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-ecoDark-card border border-slate-200/80 dark:border-emerald-950/60 space-y-3">
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">Select Commercial Corporate Bank</span>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-ecoDark-surface text-slate-900 dark:text-white focus:outline-none font-medium"
                    >
                      <option value="HDFC Bank">HDFC Bank Corporate</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank Corporate</option>
                      <option value="Axis Bank">Axis Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-ecoDark-card border border-slate-200/80 dark:border-emerald-950/60 space-y-2 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">EcoLoop Escrow Virtual Account</span>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-mono bg-white dark:bg-ecoDark-surface p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/60">
                      <div>Beneficiary: EcoLoop Settlement Escrow</div>
                      <div>IFSC: ECLP0009823</div>
                      <div>Account: 994200881920</div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-forest-900 dark:bg-emerald-600 hover:bg-forest-800 dark:hover:bg-emerald-500 text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-emerald-400 dark:text-emerald-200" />
                  <span>
                    {submitting ? 'Confirming Simulated Settlement...' : `Confirm Payment: ₹${order.totalAmount.toLocaleString('en-IN')}`}
                  </span>
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-ecoDark-card border border-slate-200/80 dark:border-emerald-950/60 space-y-3 text-xs">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Order Summary</h4>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Item:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{order.material?.title}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Quantity:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{order.quantity} {order.material?.unit}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Rate:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{order.unitPrice}/{order.material?.unit}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-emerald-950/60 space-y-1.5">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Base Value:</span>
                    <span>₹{order.baseAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Platform Escrow (3%):</span>
                    <span>₹{order.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  {order.logisticsFee > 0 && (
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Logistics Freight:</span>
                      <span>₹{order.logisticsFee}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 dark:border-emerald-950/60 flex justify-between font-extrabold text-sm text-emerald-950 dark:text-white">
                    <span>Total Outlay:</span>
                    <span className="text-base text-emerald-800 dark:text-emerald-400">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Buyer Protection:</strong> Funds are held in escrow until seller confirms dispatch and delivery verification is logged.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
