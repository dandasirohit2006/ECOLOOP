import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ImpactSummary } from '../types';
import {
  Leaf,
  Droplets,
  Trees,
  TrendingUp,
  Recycle,
  ShieldAlert,
  BarChart3,
  Scale,
  IndianRupee,
  Calculator,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

export const ImpactDashboardPage: React.FC = () => {
  const [data, setData] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive Waste-to-Impact Calculator State
  const [calcCat, setCalcCat] = useState('Paper/Cardboard');
  const [calcWeight, setCalcWeight] = useState(1000);

  const IMPACT_FACTORS: Record<string, { co2: number; landfill: number; water: number; trees: number }> = {
    'Paper/Cardboard': { co2: 0.94, landfill: 1.0, water: 26.0, trees: 0.017 },
    'Plastic': { co2: 1.85, landfill: 1.0, water: 22.0, trees: 0.005 },
    'Metal': { co2: 3.50, landfill: 1.0, water: 15.0, trees: 0.008 },
    'Textile': { co2: 3.80, landfill: 1.0, water: 35.0, trees: 0.010 },
    'Glass': { co2: 0.38, landfill: 1.0, water: 5.0, trees: 0.002 },
    'Wood': { co2: 0.85, landfill: 1.0, water: 8.0, trees: 0.035 },
    'Food waste': { co2: 1.25, landfill: 1.0, water: 12.0, trees: 0.004 },
    'Packaging materials': { co2: 1.10, landfill: 1.0, water: 20.0, trees: 0.012 },
  };

  const calculatedCo2 = Math.round(calcWeight * (IMPACT_FACTORS[calcCat]?.co2 || 1.0));
  const calculatedWater = Math.round(calcWeight * (IMPACT_FACTORS[calcCat]?.water || 10.0));
  const calculatedTrees = Math.round(calcWeight * (IMPACT_FACTORS[calcCat]?.trees || 0.005) * 10) / 10;

  useEffect(() => {
    async function loadImpact() {
      try {
        const res = await api.impact.getSummary();
        setData(res);
      } catch (err) {
        console.error('Failed to load impact data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadImpact();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Calculating circular environmental telemetry...</p>
      </div>
    );
  }

  const { metrics, categoryBreakdown, monthlyTrends } = data;

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-forest-gradient text-white rounded-3xl p-8 sm:p-12 shadow-card relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
              Sustainability Telemetry
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Environmental Impact Dashboard
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Empirical metrics on diverted landfill waste, avoided carbon emissions, and water preservation generated through closed-loop B2B exchange.
            </p>
          </div>
        </div>

        {/* 1. Main 4 Eco-KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Materials Diverted</span>
              <Recycle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 mt-3">
              {metrics.totalMaterialsReusedTons} <span className="text-lg font-bold text-slate-500">Tons</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              {metrics.totalMaterialsReusedKg.toLocaleString('en-IN')} kg kept from dumping
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">CO₂ Footprint Saved</span>
              <Leaf className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-teal-700 mt-3">
              {(metrics.totalCo2SavedKg / 1000).toFixed(2)} <span className="text-lg font-bold text-slate-500">Tons</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              {metrics.totalCo2SavedKg.toLocaleString('en-IN')} kg emissions avoided
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Water Conserved</span>
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-blue-700 mt-3">
              {(metrics.totalWaterSavedLiters / 1000).toFixed(1)}k <span className="text-lg font-bold text-slate-500">Liters</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              Industrial process water offset
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Tree Equivalency</span>
              <Trees className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-forest-800 mt-3">
              {metrics.totalTreesEquivalent} <span className="text-lg font-bold text-slate-500">Trees</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              Annual carbon sequestration equiv.
            </div>
          </div>
        </div>

        {/* 2. Monthly Trend Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-emerald-100/80 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Monthly Diversion Trends (kg)</h3>
              <p className="text-xs text-slate-400">Growth trajectory of scrap recycled and diverted from landfills</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}kg`} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString('en-IN')} kg`, 'Diverted Weight']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="weightKg" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorKg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Category Breakdown Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-emerald-100/80 space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Diversion by Waste Stream</h3>
            <p className="text-xs text-slate-400">Total volume and verified carbon reduction per category</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Material Stream</th>
                  <th className="p-3">Weight Diverted</th>
                  <th className="p-3">CO₂ Prevented</th>
                  <th className="p-3 text-right rounded-r-xl">Value Exchanged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryBreakdown.map((c) => (
                  <tr key={c.category} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{c.category}</td>
                    <td className="p-3 font-semibold text-emerald-800">{c.weightKg.toLocaleString('en-IN')} kg</td>
                    <td className="p-3 font-semibold text-teal-700">{c.co2Kg.toLocaleString('en-IN')} kg CO₂e</td>
                    <td className="p-3 text-right font-bold text-slate-800">₹{c.value.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Interactive Waste-to-Carbon Savings Simulator */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-base text-slate-900">
              Interactive Circular Savings Calculator
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-6 max-w-xl">
            Simulate prospective ESG savings for your manufacturing plant. Select a material type and planned reuse weight to compute instant carbon offsets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Material Stream</label>
                <select
                  value={calcCat}
                  onChange={(e) => setCalcCat(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {Object.keys(IMPACT_FACTORS).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Planned Diversion Weight (kg)</label>
                <input
                  type="number"
                  min="10"
                  step="50"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-800">{calculatedCo2} kg</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">CO₂ Prevented</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                <div className="text-xl sm:text-2xl font-black text-blue-700">{calculatedWater} L</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Water Conserved</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs">
                <div className="text-xl sm:text-2xl font-black text-teal-800">{calculatedTrees}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Trees Equiv.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-slate-500 text-[11px] leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong>Standard Estimation Disclaimer:</strong> {data.disclaimer} Values serve as baseline decision-support for corporate environmental reporting and Scope 3 supply chain greenhouse gas emission mitigation.
          </div>
        </div>
      </div>
    </div>
  );
};
