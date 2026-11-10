import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Building2, User, ChevronUp, ChevronDown, CheckCircle2, LogOut } from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const { user, login, logout } = useAuth();
  const toast = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (role: 'seller' | 'buyer') => {
    setSwitching(true);
    try {
      if (role === 'seller') {
        await login('seller@ecoloop.com', 'ecoloop123');
        toast.success('Switched to Demo Seller', 'Logged in as GreenPack Innovations Pvt Ltd (Kolkata)');
      } else {
        await login('buyer@ecoloop.com', 'ecoloop123');
        toast.success('Switched to Demo Buyer', 'Logged in as Bengal EcoRecycle Solutions (Howrah)');
      }
    } catch (err: any) {
      toast.error('Switch Failed', err.message);
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info('Signed Out', 'You are now browsing in Guest Mode');
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto">
      <div className="bg-slate-900/90 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-500/30 p-2 sm:px-4 sm:py-2.5 transition-all">
        <div className="flex items-center justify-between gap-3 text-xs">
          {/* Status info */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            <div className="font-semibold text-slate-200 truncate">
              {user ? (
                <span>
                  <strong className="text-emerald-400">{user.businessName}</strong> ({user.category})
                </span>
              ) : (
                <span className="text-slate-400">Browsing as Guest</span>
              )}
            </div>
          </div>

          {/* Quick 1-click action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleSwitch('seller')}
              disabled={switching || user?.email === 'seller@ecoloop.com'}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                user?.email === 'seller@ecoloop.com'
                  ? 'bg-emerald-500 text-slate-950 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title="1-Click Login as Seller (GreenPack Innovations)"
            >
              Seller Mode
            </button>

            <button
              onClick={() => handleSwitch('buyer')}
              disabled={switching || user?.email === 'buyer@ecoloop.com'}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                user?.email === 'buyer@ecoloop.com'
                  ? 'bg-teal-400 text-slate-950 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title="1-Click Login as Buyer (Bengal EcoRecycle)"
            >
              Buyer Mode
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Log Out to Guest Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
