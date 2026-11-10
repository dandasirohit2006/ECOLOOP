import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { MaterialListing } from '../types';
import { MarketplaceCard } from '../components/MarketplaceCard';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
  RefreshCw,
  PackageX,
  MapPin,
  Tag,
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState<MaterialListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filters state initialized from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || (user ? 'match' : 'newest'));

  const categories = [
    'All',
    'Paper/Cardboard',
    'Plastic',
    'Metal',
    'Glass',
    'Wood',
    'Textile',
    'Food waste',
    'Packaging materials',
    'Construction materials',
    'Industrial scrap',
    'Furniture',
    'Business equipment',
  ];

  const cities = ['All', 'Kolkata', 'Howrah', 'Siliguri', 'Guwahati', 'Durgapur'];
  const conditions = ['All', 'Clean / High Grade', 'Surplus / Unused', 'Minor Defects', 'Recyclable / Unsorted', 'Scrap'];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        sort,
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (city !== 'All') params.city = city;
      if (condition !== 'All') params.condition = condition;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.materials.getAll(params);
      setListings(res.listings);
    } catch (err) {
      console.error('Fetch marketplace listings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, city, condition, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handlePriceApply = () => {
    fetchListings();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setCity('All');
    setCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    city !== 'All' ||
    condition !== 'All' ||
    minPrice !== '' ||
    maxPrice !== '';

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Marketplace Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-emerald-100/80 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Live Exchange
                </span>
                {user && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    AI Synergy Enabled
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                Secondary Material Marketplace
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Source pre-inspected industrial scrap, surplus lots, and recyclable secondary materials from registered enterprises.
              </p>
            </div>

            {/* Search form in header */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
              <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200 p-1.5 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search cardboard, plastic drums, scrap..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-forest-900 hover:bg-forest-800 text-white transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Quick Category Chips */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  <span>Refine Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Location / Cluster
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c === 'All' ? 'All Locations' : c}</option>
                  ))}
                </select>
              </div>

              {/* Material Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  Condition Grade
                </label>
                <div className="space-y-1.5">
                  {conditions.map((cond) => (
                    <label key={cond} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="radio"
                        name="condition"
                        checked={condition === cond}
                        onChange={() => setCondition(cond)}
                        className="text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                      />
                      <span>{cond === 'All' ? 'Any Condition' : cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Price per Unit (₹)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePriceApply}
                  className="w-full py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Apply Price Range
                </button>
              </div>
            </div>
          </div>

          {/* Main Listings Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sorting bar & count */}
            <div className="bg-white rounded-2xl px-5 py-3 shadow-card border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-semibold text-slate-500">
                Showing <span className="font-bold text-slate-900">{listings.length}</span> listed waste materials
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {user && <option value="match">✨ Highest AI Synergy</option>}
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="quantity_desc">Quantity: High to Low</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl aspect-[4/5] animate-pulse border border-slate-100" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">No materials match your current criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try broadening your location filter, resetting price parameters, or selecting another waste stream category.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <MarketplaceCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
