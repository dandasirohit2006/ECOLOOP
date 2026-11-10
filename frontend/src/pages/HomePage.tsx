import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MaterialListing, ImpactSummary } from '../types';
import { MarketplaceCard } from '../components/MarketplaceCard';
import {
  ArrowRight,
  Sparkles,
  Recycle,
  TrendingUp,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  Search,
  CheckCircle2,
  Building2,
  Boxes,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<MaterialListing[]>([]);
  const [impactData, setImpactData] = useState<ImpactSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [matRes, impRes] = await Promise.all([
          api.materials.getAll({ limit: 4 }),
          api.impact.getSummary(),
        ]);
        setFeaturedListings(matRes.listings.slice(0, 4));
        setImpactData(impRes);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const categories = [
    { name: 'Paper/Cardboard', icon: '📦', count: '1200+ kg', desc: 'Corrugated cartons, pulp, trimmings' },
    { name: 'Plastic', icon: '🧴', count: '3500+ kg', desc: 'HDPE drums, PET regrind, polymer flakes' },
    { name: 'Metal', icon: '🔩', count: '4500+ kg', desc: 'Rebar offcuts, aluminum turnings, scrap' },
    { name: 'Glass', icon: '🍾', count: '2800+ pcs', desc: 'Amber bottles, clear jars, cullet' },
    { name: 'Wood', icon: '🪵', count: '5000+ kg', desc: 'ISPM-15 pallets, wood shavings, timber' },
    { name: 'Textile', icon: '🧵', count: '1800+ kg', desc: 'Combed cotton, knit offcuts, yarn' },
    { name: 'Industrial scrap', icon: '⚙️', count: '1100+ kg', desc: 'CNC turnings, machine shavings' },
    { name: 'Food waste', icon: '🌱', count: '950+ kg', desc: 'Spent coffee, brewery grain, compostables' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-forest-gradient text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-emerald-400/20 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>India's Premier B2B Circular Economy Platform</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              Turn Business Waste Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                Business Value
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              EcoLoop connects manufacturing, industrial, and commercial enterprises with certified recyclers and secondary manufacturers. Convert excess inventory and scrap into revenue while meeting corporate ESG targets.
            </p>

            {/* Search Bar inside Hero */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-1.5 border border-white/20">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search cardboard, HDPE plastic, steel offcuts, pallets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shrink-0 shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-forest-950 transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02]"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/list-waste"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-[1.02]"
              >
                <span>List Your Waste</span>
                <Zap className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                GST-Verified Businesses
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                Integrated Regional Logistics
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                AI Proximity Matching
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Counter */}
      <section className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="bg-white rounded-2xl shadow-card border border-emerald-100/80 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-emerald-700">
                {impactData ? `${impactData.metrics.totalMaterialsReusedTons} Tons` : '12.4 Tons'}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Materials Diverted
              </div>
            </div>

            <div className="p-2 pt-6 md:pt-2">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                ₹{impactData ? (impactData.metrics.totalValueExchanged / 100000).toFixed(1) : '3.8'}L+
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Value Circulated
              </div>
            </div>

            <div className="p-2 pt-6 md:pt-2">
              <div className="text-3xl sm:text-4xl font-black text-teal-600">
                {impactData ? `${impactData.metrics.totalCo2SavedKg.toLocaleString('en-IN')} kg` : '8,420 kg'}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                CO₂ Emissions Saved
              </div>
            </div>

            <div className="p-2 pt-6 md:pt-2">
              <div className="text-3xl sm:text-4xl font-black text-forest-800">
                {impactData ? impactData.metrics.completedTransactions : '8'}+
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Closed B2B Trades
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How EcoLoop Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Circular Workflow
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
            How EcoLoop Closes the Loop
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            A frictionless end-to-end marketplace engineered for commercial waste generators and material processors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">List Excess Waste</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sellers upload scrap specifications, weight, condition, photographs, and minimum order requirements in under 2 minutes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-lg mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Smart AI Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our 6-factor deterministic algorithm calculates geographic proximity, industry synergy, and budget compatibility.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Direct Negotiation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Negotiate unit pricing, counter-offer terms, select freight options (Self or EcoLoop Fleet), and approve purchase orders.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center font-black text-lg mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Escrow & Impact Log</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Simulated settlement triggers instant order dispatch and computes verified carbon, water, and landfill diversion records.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Featured Marketplace Materials */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Fresh Inventory
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                Featured Materials Ready for Reuse
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Verified high-grade industrial surplus and recyclable lots available across Kolkata, Howrah, and Eastern India.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 font-bold text-sm text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-50 rounded-2xl aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((item) => (
                <MarketplaceCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Circular Material Categories Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Browse by Industrial Waste Stream
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Categorized materials with verified purity standards and volume availability.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c, idx) => (
            <Link
              key={idx}
              to={`/marketplace?category=${encodeURIComponent(c.name)}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{c.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                <span>{c.count}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Environmental Benefits Section */}
      <section className="py-20 bg-forest-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700">
                ESG & Sustainability Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Empowering Businesses to Decarbonize Supply Chains
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                By rerouting post-production excess directly into industrial reuse, EcoLoop curtails virgin raw material extraction, saves operational disposal costs, and generates verified lifecycle carbon offsets.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-900/80 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Direct Virgin Resource Displacement</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Every ton of recycled cardboard saves 17 trees and up to 26,000 liters of fresh water.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-900/80 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Full Traceability & CSR Documentation</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Automated environmental impact receipts generated per transaction for corporate filings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-900/80 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Substantial Cost Optimization</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Buyers purchase secondary feedstock at 30% to 60% below primary market indices.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/impact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 text-forest-950 hover:bg-emerald-400 transition-colors shadow-md"
                >
                  <span>Explore Environmental Impact Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Impact Metric Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-900/30 p-6 rounded-2xl border border-emerald-800/80 backdrop-blur-sm space-y-2">
                <div className="text-3xl font-extrabold text-emerald-400">1.85 kg</div>
                <div className="text-xs font-bold text-white">CO₂ Saved per kg Plastic</div>
                <p className="text-[11px] text-slate-400">Avoids oil refining and polymer cracking emissions.</p>
              </div>

              <div className="bg-emerald-900/30 p-6 rounded-2xl border border-emerald-800/80 backdrop-blur-sm space-y-2">
                <div className="text-3xl font-extrabold text-emerald-400">3.50 kg</div>
                <div className="text-xs font-bold text-white">CO₂ Saved per kg Metal</div>
                <p className="text-[11px] text-slate-400">Massive energy reduction vs blast furnace smelting.</p>
              </div>

              <div className="bg-emerald-900/30 p-6 rounded-2xl border border-emerald-800/80 backdrop-blur-sm space-y-2">
                <div className="text-3xl font-extrabold text-emerald-400">26 L</div>
                <div className="text-xs font-bold text-white">Water Saved per kg Paper</div>
                <p className="text-[11px] text-slate-400">Reduces intense water effluent treatment loads.</p>
              </div>

              <div className="bg-emerald-900/30 p-6 rounded-2xl border border-emerald-800/80 backdrop-blur-sm space-y-2">
                <div className="text-3xl font-extrabold text-emerald-400">100%</div>
                <div className="text-xs font-bold text-white">Zero Landfill Goal</div>
                <p className="text-[11px] text-slate-400">Direct closed-loop transport from seller to factory.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Quick Demo Business Switcher / Fast Test Box */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl p-8 sm:p-10 border border-emerald-200/80 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Demo Test Hub
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ready to Test the Full Platform Flow?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Log in with our pre-configured demo accounts to test listing waste, AI match calculation, purchase negotiation, order generation, and simulated escrow payment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/login?demo=seller"
              className="px-6 py-3.5 rounded-xl text-center font-bold text-xs bg-forest-900 text-white hover:bg-forest-800 transition-colors shadow-sm"
            >
              Sign In as Demo Seller (GreenPack)
            </Link>
            <Link
              to="/login?demo=buyer"
              className="px-6 py-3.5 rounded-xl text-center font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Sign In as Demo Buyer (EcoRecycle)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
