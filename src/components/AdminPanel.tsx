import React from 'react';
import { 
  Users, Check, X, Shield, ShieldCheck, ShieldAlert, AlertTriangle, 
  Trash2, TrendingUp, ShoppingBag, Coins, BarChart3, Star, CheckCircle2,
  Lock, Unlock, Settings, RefreshCw, Send, FileText, Sparkles
} from 'lucide-react';
import { Product, User } from '../types';
import { getFallbackImage } from '../data';

interface AdminPanelProps {
  products: Product[];
  users: User[];
  onApproveProduct: (productId: string) => void;
  onRejectProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleUserBan: (userId: string) => void;
  onToggleUserVerify: (userId: string) => void;
  adminLogs: { id: string; type: string; message: string; timestamp: string }[];
  systemSettings: { autoApprove: boolean; bannerMessage: string; showBanner: boolean; minNidLength: number };
  onUpdateSettings: React.Dispatch<React.SetStateAction<{ autoApprove: boolean; bannerMessage: string; showBanner: boolean; minNidLength: number }>>;
  isAdminVerified: boolean;
  onVerifyAdmin: (verified: boolean) => void;
  onClearLogs: () => void;
}

export default function AdminPanel({
  products,
  users,
  onApproveProduct,
  onRejectProduct,
  onDeleteProduct,
  onToggleUserBan,
  onToggleUserVerify,
  adminLogs,
  systemSettings,
  onUpdateSettings,
  isAdminVerified,
  onVerifyAdmin,
  onClearLogs
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'products' | 'users' | 'settings'>('overview');
  
  // PIN lock screen states
  const [pin, setPin] = React.useState<string>('');
  const [pinError, setPinError] = React.useState<string>('');
  const [showPinHelp, setShowPinHelp] = React.useState<boolean>(false);

  // Settings form states
  const [inputBanner, setInputBanner] = React.useState(systemSettings.bannerMessage);
  const [inputAutoApprove, setInputAutoApprove] = React.useState(systemSettings.autoApprove);

  // Stats calculation
  const totalUsers = users.length;
  const totalProducts = products.length;
  const approvedProducts = products.filter(p => p.isApproved).length;
  const pendingProducts = products.filter(p => !p.isApproved).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;
  
  // Simulated revenue from boosts (৳150 per boosted product)
  const boostRevenue = featuredProducts * 150;

  // Group products by category for chart
  const categoriesCount = products.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // SVG Chart data preparations
  const chartData = Object.entries(categoriesCount).map(([category, count]) => ({
    name: category.toUpperCase(),
    value: count,
  }));

  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  // Handle PIN code inputs
  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setPinError('');
      
      if (nextPin === '2026') {
        // Success
        setTimeout(() => {
          onVerifyAdmin(true);
          setPin('');
        }, 150);
      } else if (nextPin.length === 4) {
        // Failure
        setTimeout(() => {
          setPinError('ভুল সিকিউরিটি পিন! সঠিক পিন হলো: ২০২৬ (2026)');
          setPin('');
        }, 200);
      }
    }
  };

  const handlePinBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...systemSettings,
      bannerMessage: inputBanner,
      autoApprove: inputAutoApprove,
      showBanner: true
    });
    alert('সিস্টেম সেটিংস সফলভাবে আপডেট করা হয়েছে!');
  };

  // --- RENDERING SECURE LOCK SCREEN ---
  if (!isAdminVerified) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <Lock className="h-6 w-6 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">অ্যাডমিন সিকিউরিটি লক</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              আপনবাজার মডারেশন প্যানেলে প্রবেশের জন্য আপনার ৪ ডিজিটের সিকিউরিটি পিন (Security PIN) দিন।
            </p>
          </div>

          {/* Code Dots Indicator */}
          <div className="flex justify-center gap-4 py-4">
            {[0, 1, 2, 3].map((index) => (
              <div 
                key={index}
                className={`h-4 w-4 rounded-full border-2 transition-all duration-150 ${
                  index < pin.length 
                    ? 'bg-emerald-600 border-emerald-600 scale-110' 
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {pinError && (
            <p className="text-xs font-bold text-red-600 animate-bounce">{pinError}</p>
          )}

          {/* Dial Pad Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handlePinInput(num)}
                className="h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-lg font-black text-gray-800 dark:text-white transition-all cursor-pointer flex items-center justify-center shadow-xs"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => { setPin(''); setPinError(''); }}
              className="h-14 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              CLEAR
            </button>
            <button
              onClick={() => handlePinInput('0')}
              className="h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-lg font-black text-gray-800 dark:text-white transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              0
            </button>
            <button
              onClick={handlePinBackspace}
              className="h-14 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center"
            >
              DELETE
            </button>
          </div>

          {/* Demo Hint Toggle */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => setShowPinHelp(!showPinHelp)}
              className="text-xs text-emerald-600 hover:underline font-bold"
            >
              {showPinHelp ? 'পিন ইঙ্গিত বন্ধ করুন' : 'অ্যাডমিন ডেমো পিন কত?'}
            </button>
            {showPinHelp && (
              <p className="text-[11px] font-bold text-gray-400 mt-1">
                আপনার পরীক্ষার জন্য ডেমো পিনটি হলো: <span className="text-emerald-500 font-extrabold text-xs">2026</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING SECURE ADMIN PANEL WHEN PIN VERIFIED ---
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-8 text-white shadow-xl dark:bg-black md:px-10 mb-8">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 to-teal-600"></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              SYSTEM SECURED & ONLINE
            </div>
            <h1 className="text-2xl font-black md:text-3xl flex items-center gap-2">
              অ্যাডমিন কন্ট্রোল সেন্টার
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              আপনবাজার মার্কেটপ্লেস মডারেশন, নিরাপত্তা কাস্টমাইজেশন এবং লাইভ ঘোষণা কনসোল।
            </p>
          </div>

          {/* Lock Action Button & Navigation */}
          <div className="flex flex-wrap gap-2.5 items-center">
            <button
              onClick={() => onVerifyAdmin(false)}
              className="rounded-xl bg-red-600/90 hover:bg-red-700 active:scale-95 px-3 py-2 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="প্যানেলটি লক করুন"
            >
              <Lock className="h-3.5 w-3.5" />
              লক প্যানেল
            </button>

            <div className="h-5 w-px bg-white/20 hidden sm:block" />

            <button
              onClick={() => setActiveTab('overview')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              পরিসংখ্যান & লগস
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`relative rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              বিজ্ঞাপন মডারেশন
              {pendingProducts > 0 && (
                <span className="absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {pendingProducts}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              ইউজার কন্ট্রোল
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'settings' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              সিস্টেম সেটিংস
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Overview Panel */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Bento Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Stat 1 */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-4">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">মোট ইউজার</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">
                {totalUsers} জন
              </span>
            </div>

            {/* Stat 2 */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 mb-4">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">লাইভ পণ্য</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">
                {approvedProducts} টি
              </span>
            </div>

            {/* Stat 3 */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">পেন্ডিং অনুমোদন</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                {pendingProducts} টি
              </span>
            </div>

            {/* Stat 4 */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400 mb-4">
                <Coins className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">বুস্ট ফি আয়</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">
                ৳{boostRevenue}
              </span>
            </div>

          </div>

          {/* Graphical Analytics & Live System Logs Panel */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left: Pure-SVG chart of categories */}
            <div className="lg:col-span-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-6">
                  <BarChart3 className="h-4.5 w-4.5 text-emerald-500" />
                  ক্যাটাগরি ভিত্তিক বিজ্ঞাপনের বিভাজন
                </h3>

                {chartData.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-400">কোনো তথ্য নেই</div>
                ) : (
                  <div className="space-y-4">
                    {chartData.map((data, idx) => {
                      const pct = Math.round((data.value / products.length) * 100);
                      const barWidth = `${(data.value / maxVal) * 100}%`;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                            <span className="uppercase">{data.name}</span>
                            <span>{data.value} টি ({pct}%)</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                              style={{ width: barWidth }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Summary Tip */}
              <div className="mt-6 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 p-4 border border-emerald-100/30 text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">💡 মডারেশন টিপস:</span>
                <p className="text-gray-500 dark:text-gray-400 leading-normal">
                  যেসব বিজ্ঞাপনের ছবি অস্পষ্ট বা বিবরণীতে আপত্তিকর লেখা রয়েছে, অ্যাকশন ট্যাব থেকে সরাসরি ডিলিট করে দিন।
                </p>
              </div>
            </div>

            {/* Right: Live System Log Stream */}
            <div className="lg:col-span-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5 text-emerald-500" />
                    লাইভ অ্যাক্টিভিটি লগ (Live Logs)
                  </h3>
                  {adminLogs.length > 0 && (
                    <button 
                      onClick={onClearLogs}
                      className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      লগ মুছুন
                    </button>
                  )}
                </div>

                <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                  {adminLogs.map((log) => (
                    <div key={log.id} className="flex gap-2.5 items-start text-xs border-b border-gray-50 dark:border-gray-800 pb-2 text-gray-600 dark:text-gray-300">
                      <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[9px] font-mono font-bold text-gray-400">
                        {log.timestamp}
                      </span>
                      <div className="leading-relaxed flex-1">
                        <span className="font-semibold block text-gray-800 dark:text-gray-100">
                          {log.type.toUpperCase() === 'SYSTEM' && '⚙️ SYSTEM: '}
                          {log.type.toUpperCase() === 'PRODUCT_ADD' && '📦 NEW POST: '}
                          {log.type.toUpperCase() === 'PRODUCT_APPROVE' && '✅ APPROVED: '}
                          {log.type.toUpperCase() === 'PRODUCT_REJECT' && '⚠️ REJECTED: '}
                          {log.type.toUpperCase() === 'PRODUCT_DELETE' && '🗑️ DELETED: '}
                          {log.type.toUpperCase() === 'USER_BAN' && '🚫 BANNED: '}
                          {log.type.toUpperCase() === 'USER_VERIFY' && '💎 VERIFICATION: '}
                        </span>
                        {log.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800 text-[10px] font-bold text-gray-400 flex items-center gap-1 justify-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                রিয়েল-টাইম সিস্টেম অ্যাকশন লাইভ স্ট্রিমিং অন
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Product Moderation */}
      {activeTab === 'products' && (
        <div className="rounded-3xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900 overflow-hidden animate-in fade-in duration-200">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-400 uppercase">বিজ্ঞাপন অনুমোদন তালিকা</h3>
            <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
              {pendingProducts} টি পেন্ডিং
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 border-b border-gray-100 font-bold uppercase dark:bg-gray-800/50 dark:border-gray-800">
                  <th className="p-4">পণ্যের ছবি & টাইটেল</th>
                  <th className="p-4">ক্যাটাগরি</th>
                  <th className="p-4">দাম (Price)</th>
                  <th className="p-4">বিক্রেতা</th>
                  <th className="p-4">অবস্থা (Status)</th>
                  <th className="p-4 text-right">মডারেশন অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">কোনো পণ্যের ডাটাবেজ খালি।</td>
                  </tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={prod.imageUrls[0]} 
                            alt={prod.title} 
                            className="h-10 w-12 rounded-lg object-cover" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = getFallbackImage(prod.category);
                            }}
                          />
                          <div className="max-w-[220px]">
                            <span className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{prod.title}</span>
                            <span className="text-[10px] text-gray-400 block">{prod.location} • {prod.usedDuration} ব্যবহৃত</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-md text-[10px]">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-gray-900 dark:text-white">৳{prod.price}</td>
                      <td className="p-4 font-semibold text-gray-600 dark:text-gray-400">{prod.sellerName}</td>
                      <td className="p-4">
                        {prod.isApproved ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            ✓ LIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 animate-pulse">
                            ● PENDING
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {!prod.isApproved ? (
                            <button
                              onClick={() => onApproveProduct(prod.id)}
                              className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                              title="অনুমোদন দিন"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onRejectProduct(prod.id)}
                              className="rounded-lg bg-amber-500 p-1.5 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                              title="হাইড/ডিজেবল করুন"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="rounded-lg bg-red-100 dark:bg-red-950/40 p-1.5 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="rounded-3xl border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900 overflow-hidden animate-in fade-in duration-200">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 uppercase">প্ল্যাটফর্ম ইউজার তালিকা</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 border-b border-gray-100 font-bold uppercase dark:bg-gray-800/50 dark:border-gray-800">
                  <th className="p-4">ইউজার ও ইমেইল</th>
                  <th className="p-4">মোবাইল নাম্বার</th>
                  <th className="p-4">রোল (Role)</th>
                  <th className="p-4">ভেরিফাইড ব্যাজ</th>
                  <th className="p-4">অবস্থা (Status)</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full" />
                        <div>
                          <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                            {user.name}
                            {user.isVerified && (
                              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white font-black">
                                ✓
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 block">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-600 dark:text-gray-400">{user.phone || 'N/A'}</td>
                    <td className="p-4 uppercase font-bold text-[10px]">
                      {user.role === 'admin' ? (
                        <span className="text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 px-2 py-0.5 rounded-md">ADMIN</span>
                      ) : (
                        <span className="text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-md">USER</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => onToggleUserVerify(user.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          user.isVerified 
                            ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40' 
                            : 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/60'
                        }`}
                      >
                        {user.isVerified ? '✓ VERIFIED' : 'Verify Seller'}
                      </button>
                    </td>
                    <td className="p-4">
                      {user.isBanned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 animate-pulse">
                          BANNED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => onToggleUserBan(user.id)}
                          className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-colors cursor-pointer ${
                            user.isBanned 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400'
                          }`}
                        >
                          {user.isBanned ? 'আনব্যান করুন' : 'ব্যান (Block)'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: System Settings */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 animate-in fade-in duration-200">
          
          {/* Main settings form */}
          <form onSubmit={handleSaveSettings} className="lg:col-span-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-1.5 border-b border-gray-50 dark:border-gray-800 pb-3">
              <Settings className="h-4.5 w-4.5 text-emerald-500" />
              মার্কেটপ্লেস কাস্টমাইজেশন প্যানেল
            </h3>

            {/* Toggle switch 1 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40">
              <div className="space-y-0.5 max-w-md">
                <label className="text-xs font-bold text-gray-800 dark:text-white block">স্বয়ংক্রিয় বিজ্ঞাপন অনুমোদন (Auto-Approve Ads)</label>
                <p className="text-[10px] text-gray-400 leading-normal">
                  এটি চালু থাকলে নতুন কোনো ব্যবহারকারী বিজ্ঞাপন দিলে সাথে সাথেই লাইভ হয়ে যাবে। বন্ধ থাকলে অ্যাডমিন মডারেশনের পর লাইভ হবে।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInputAutoApprove(!inputAutoApprove)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all cursor-pointer ${
                  inputAutoApprove ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-200 ${
                  inputAutoApprove ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Live broadcast announcement text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-bounce" />
                লাইভ ব্যানার ঘোষণা (Global Announcement Banner)
              </label>
              <textarea
                value={inputBanner}
                onChange={(e) => setInputBanner(e.target.value)}
                rows={3}
                placeholder="যেমন: আসন্ন ঈদ উপলক্ষে আপনবাজারে ফ্রি বিজ্ঞাপন বুস্ট অফার!..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white leading-normal"
                required
              />
              <p className="text-[10px] text-gray-400">
                এই মেসেজটি সমস্ত মার্কেটপ্লেস স্ক্রীনের উপরে একটি স্পার্কলিং সবুজ হেডারে লাইভ দেখানো হবে।
              </p>
            </div>

            <div className="pt-2 border-t border-gray-50 dark:border-gray-800 flex justify-end">
              <button 
                type="submit"
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-6 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                <Send className="h-3.5 w-3.5" />
                সেটিংস সংরক্ষণ করুন (Save Settings)
              </button>
            </div>
          </form>

          {/* Quick Stats Summary Card */}
          <div className="lg:col-span-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Coins className="h-4.5 w-4.5 text-emerald-500" />
              সিস্টেম প্যারামিটারস
            </h3>

            <div className="space-y-3.5 text-xs text-gray-600 dark:text-gray-300 leading-normal">
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800 pb-2">
                <span className="font-bold text-gray-400">বুস্টিং ফি:</span>
                <span className="font-extrabold text-gray-800 dark:text-white">৳১৫০ / ৩ দিন</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800 pb-2">
                <span className="font-bold text-gray-400">এনআইডি সাইজ:</span>
                <span className="font-extrabold text-gray-800 dark:text-white">১০-১৭ ডিজিট</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800 pb-2">
                <span className="font-bold text-gray-400">ভেরিফিকেশন ক্যাশব্যাক:</span>
                <span className="font-extrabold text-emerald-600">৳১০০০ (স্বয়ংক্রিয়)</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800 pb-2">
                <span className="font-bold text-gray-400">প্লাটফর্ম কমিশন:</span>
                <span className="font-extrabold text-gray-800 dark:text-white">০.০০% (ফ্রি)</span>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                নিরাপত্তা পরামর্শ:
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
                ব্যবহারকারীদের সরাসরি মেসেজিং সিস্টেমে সংবেদনশীল ব্যাংকিং তথ্য বা পিন প্রদান থেকে বিরত থাকতে সিস্টেম পপ-আপ প্রদর্শন করুন।
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
