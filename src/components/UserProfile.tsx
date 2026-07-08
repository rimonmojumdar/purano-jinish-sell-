import React from 'react';
import { User, Product, WalletTransaction } from '../types';
import { 
  ShieldCheck, Wallet, Plus, AlertCircle, Trash2, Eye, ShieldAlert, 
  CheckCircle, FileText, Smartphone, Fingerprint, Coins, Heart,
  TrendingUp, BarChart2, ArrowUpRight, ArrowDownLeft, History, Sparkles,
  Camera, MapPin, User as UserIcon, Lock, Shield, Check, Upload, CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  AreaChart, Area, CartesianGrid 
} from 'recharts';

interface UserProfileProps {
  currentUser: User | null;
  products: Product[];
  walletTransactions: WalletTransaction[];
  onAddFunds: () => void;
  onVerifySeller: () => void;
  onDeleteProduct: (productId: string) => void;
  onBoostProduct: (productId: string) => void;
  onNavigateUpload: () => void;
  onNavigateDetails: (product: Product) => void;
  onToggleSave?: (productId: string) => void;
  onUpdateProfile?: (updatedFields: Partial<User>) => void;
}

export default function UserProfile({
  currentUser,
  products,
  walletTransactions = [],
  onAddFunds,
  onVerifySeller,
  onDeleteProduct,
  onBoostProduct,
  onNavigateUpload,
  onNavigateDetails,
  onToggleSave,
  onUpdateProfile
}: UserProfileProps) {
  // Local input states initialized from current user values
  const [name, setName] = React.useState(currentUser?.name || '');
  const [phone, setPhone] = React.useState(currentUser?.phone || '');
  const [address, setAddress] = React.useState(currentUser?.address || '');
  const [nidNumber, setNidNumber] = React.useState(currentUser?.nidNumber || '');
  const [nidFront, setNidFront] = React.useState<string | null>(currentUser?.nidImageFront || null);
  const [nidBack, setNidBack] = React.useState<string | null>(currentUser?.nidImageBack || null);
  
  const [verifying, setVerifying] = React.useState(false);
  const [successVerified, setSuccessVerified] = React.useState(false);
  const [profileSaved, setProfileSaved] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'listings' | 'wishlist' | 'analytics' | 'wallet'>('listings');

  // Keep state synchronized with current user
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setNidNumber(currentUser.nidNumber || '');
      setNidFront(currentUser.nidImageFront || null);
      setNidBack(currentUser.nidImageBack || null);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  // Filter listings uploaded by the current user
  const myListings = products.filter(p => p.sellerId === currentUser.id);
  const savedListings = products.filter(p => currentUser.savedProductIds?.includes(p.id));

  // Analytics helper data
  const totalViews = myListings.reduce((sum, p) => sum + (p.views || 0), 0);
  const averageViews = myListings.length > 0 ? Math.round(totalViews / myListings.length) : 0;
  const boostedCount = myListings.filter(p => p.isFeatured).length;

  const maxViews = Math.max(...myListings.map(p => p.views || 1), 10);

  // Profile completeness calculation
  let completionScore = 0;
  if (currentUser.avatar) completionScore += 20;
  if (currentUser.name) completionScore += 20;
  if (currentUser.phone) completionScore += 20;
  if (currentUser.address) completionScore += 20;
  if (currentUser.isVerified) completionScore += 20;

  // Security levels based on completion
  const getSecurityLevel = () => {
    if (completionScore <= 40) return { level: 'দুর্বল (Low Security)', color: 'text-red-500 bg-red-500/10' };
    if (completionScore <= 60) return { level: 'মাঝারি (Medium Security)', color: 'text-amber-500 bg-amber-500/10' };
    if (completionScore <= 80) return { level: 'উচ্চ নিরাপদ (High Security)', color: 'text-indigo-500 bg-indigo-500/10' };
    return { level: '১০০% ভেরিফাইড ও সর্বোচ্চ নিরাপদ (Fully Verified & Secured)', color: 'text-emerald-500 bg-emerald-500/10' };
  };

  const security = getSecurityLevel();

  // Photo uploads
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile?.({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNidFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setNidFront(dataUrl);
        onUpdateProfile?.({ nidImageFront: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNidBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setNidBack(dataUrl);
        onUpdateProfile?.({ nidImageBack: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile?.({
      name,
      phone,
      address
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleNidVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidNumber || (nidNumber.length !== 10 && nidNumber.length !== 13)) {
      alert('দয়া করে সঠিক ১০ বা ১৩ ডিজিটের জাতীয় পরিচয়পত্র (NID) নাম্বার দিন।');
      return;
    }
    if (!nidFront) {
      alert('দয়া করে এনআইডি কার্ডের সামনের ছবি আপলোড করুন।');
      return;
    }
    if (!nidBack) {
      alert('দয়া করে এনআইডি কার্ডের পিছনের ছবি আপলোড করুন।');
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setSuccessVerified(true);
      onVerifySeller(); // Adds 1000 BDT to user balance & triggers system notifications
      onUpdateProfile?.({
        nidNumber,
        isVerified: true,
        verificationRequestStatus: 'verified'
      });
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Profile Information & NID Verification */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Profile Details Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center mb-6 border-b border-gray-50 dark:border-gray-800 pb-5">
              
              {/* Profile Image with Camera Overlay */}
              <div className="relative mx-auto h-24 w-24 group">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="h-full w-full rounded-full border-4 border-emerald-500 object-cover shadow-md transition-all duration-300 group-hover:brightness-75" 
                />
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-black">
                  <Camera className="h-5 w-5 mb-0.5" />
                  <span>পরিবর্তন</span>
                  <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
                </label>
                {currentUser.isVerified && (
                  <span className="absolute right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white font-extrabold border-2 border-white dark:border-gray-900 shadow-sm" title="ভেরিফাইড বিক্রেতা">
                    ✓
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-lg font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                {currentUser.name}
                {currentUser.isVerified && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white font-black" title="Verified Seller">
                    ✓
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400 font-medium">{currentUser.email}</p>
              
              {currentUser.role === 'admin' && (
                <span className="mt-2 inline-flex items-center rounded-md bg-red-50 dark:bg-red-950/20 px-2 py-1 text-[10px] font-bold text-red-700 dark:text-red-400 uppercase">
                  PLATFORM ADMINISTRATOR
                </span>
              )}

              {/* Progress Bar of Completion */}
              <div className="mt-5 text-left border-t border-gray-50 dark:border-gray-800 pt-4 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-gray-500 dark:text-gray-400">প্রোফাইল নিরাপত্তা স্কোর:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{completionScore}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500" 
                    style={{ width: `${completionScore}%` }}
                  />
                </div>
                <div className={`mt-2 rounded-lg py-1 px-2.5 text-[9px] font-black inline-flex items-center gap-1 ${security.color}`}>
                  <Lock className="h-3 w-3" />
                  <span>নিরাপত্তা লেভেল: {security.level}</span>
                </div>
              </div>
            </div>

            {/* Edit Personal Information Form */}
            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase flex items-center gap-1.5 mb-2">
                <UserIcon className="h-4 w-4 text-emerald-500" />
                ব্যক্তিগত তথ্য ও প্রোফাইল সেটআপ
              </h3>

              {profileSaved && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 p-2 text-center text-xs text-emerald-800 dark:text-emerald-400 font-extrabold animate-in fade-in slide-in-from-top-2">
                  ✔️ প্রোফাইল তথ্য সফলভাবে সেভ হয়েছে!
                </div>
              )}

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">পূর্ণ নাম (Full Name)</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: আরিয়ান আহমেদ"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">মোবাইল নম্বর (Phone Number)</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      required 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      maxLength={11}
                      placeholder="যেমন: ০১৭xxxxxxxx"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">বর্তমান ঠিকানা (Address)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-3.5 w-3.5 text-gray-400" />
                    <textarea 
                      required 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="যেমন: বাড়ি ১২, রোড ৪, মিরপুর ২, ঢাকা-১২১৬"
                      rows={2}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 text-xs transition-all cursor-pointer shadow-xs active:scale-98"
              >
                তথ্য সংরক্ষণ করুন (Save Profile)
              </button>
            </form>
          </div>

          {/* Verification (NID Card) Panel */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-black text-gray-400 uppercase flex items-center gap-1.5 mb-4">
              <Fingerprint className="h-4.5 w-4.5 text-emerald-500" />
              ভেরিফাইড ব্যাজ (Verified Badge)
            </h3>

            {currentUser.isVerified ? (
              <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-4 text-center dark:bg-blue-950/20">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/40 mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300">আপনার প্রোফাইল ভেরিফাইড!</h4>
                <p className="text-xs text-gray-500 mt-1 leading-normal font-semibold">
                  আপনার নামের পাশে নীল ভেরিফাইড ব্যাজটি (✓) যুক্ত করা আছে। এখন ক্রেতারা আপনাকে ১০০% বিশ্বাস করবে এবং আপনার পণ্য দ্রুত বিক্রি হবে।
                </p>
                {currentUser.nidNumber && (
                  <p className="text-[10px] text-gray-400 font-bold mt-2">এনআইডি নম্বর: {currentUser.nidNumber}</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleNidVerify} className="space-y-4">
                <p className="text-xs text-gray-500 leading-normal font-semibold">
                  জাতীয় পরিচয়পত্র (NID) নাম্বার ও ছবি দিয়ে প্রোফাইল ভেরিফাই করুন। ভেরিফাইড হলে আপনার পণ্যে <b>"Verified Seller"</b> ব্যাজ যুক্ত হবে এবং আপনি <b>৳১০০০</b> বোনাস পাবেন!
                </p>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">এনআইডি কার্ড নাম্বার (10 or 13 Digits)</label>
                  <input
                    type="text"
                    required
                    maxLength={13}
                    placeholder="যেমন: ৩১২৩৪৫৬৭৮৯"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* NID Card Front */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase block">এনআইডি কার্ডের সামনের ছবি</span>
                  <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50/30 dark:border-gray-700 hover:border-emerald-500 cursor-pointer transition-colors">
                    {nidFront ? (
                      <div className="relative w-full h-24">
                        <img src={nidFront} alt="NID Front" className="w-full h-full object-cover rounded-lg" />
                        <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black">আপলোড করা হয়েছে</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-gray-400 mb-1" />
                        <span className="text-[10px] font-bold text-gray-500">সামনের ছবি সিলেক্ট করুন</span>
                        <span className="text-[8px] text-gray-400 font-mono">Scan file or select from device</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleNidFrontChange} className="hidden" />
                  </label>
                </div>

                {/* NID Card Back */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase block">এনআইডি কার্ডের পিছনের ছবি</span>
                  <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50/30 dark:border-gray-700 hover:border-emerald-500 cursor-pointer transition-colors">
                    {nidBack ? (
                      <div className="relative w-full h-24">
                        <img src={nidBack} alt="NID Back" className="w-full h-full object-cover rounded-lg" />
                        <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black">আপলোড করা হয়েছে</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-gray-400 mb-1" />
                        <span className="text-[10px] font-bold text-gray-500">পিছনের ছবি সিলেক্ট করুন</span>
                        <span className="text-[8px] text-gray-400 font-mono">Scan file or select from device</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleNidBackChange} className="hidden" />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-extrabold text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {verifying ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      ভেরিফাই করুন ও বোনাস নিন
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Wallet Balance Refill Block */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-100/50 p-5 mb-0">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">ওয়ালেট ব্যালেন্স</span>
                  <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">৳{currentUser.balance}</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mb-4 leading-normal font-semibold">
                এই ব্যালেন্স দিয়ে আপনি আপনার পণ্যসমূহ Featured Listing হিসেবে সবার উপরে বুস্ট করতে পারবেন।
              </p>
              <button
                onClick={onAddFunds}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                ফান্ড যোগ করুন (+৳৫০০)
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Tab-based Panel */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 h-full flex flex-col">
            
            {/* Top Navigation Bar Tabs */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`text-xs font-black pb-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'listings' 
                      ? 'border-emerald-600 text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  বিজ্ঞাপনসমূহ ({myListings.length})
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`text-xs font-black pb-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'wishlist' 
                      ? 'border-emerald-600 text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  পছন্দের তালিকা ({savedListings.length})
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`text-xs font-black pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'analytics' 
                      ? 'border-emerald-600 text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                  পারফরম্যান্স
                </button>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className={`text-xs font-black pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'wallet' 
                      ? 'border-emerald-600 text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  লেজার হিস্ট্রি ({walletTransactions.length})
                </button>
              </div>
              
              <button
                onClick={onNavigateUpload}
                className="flex items-center gap-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 cursor-pointer justify-center"
              >
                <Plus className="h-3.5 w-3.5" />
                বিজ্ঞাপন দিন
              </button>
            </div>

            {/* --- TAB CONTENT ROUTER --- */}

            {/* 1. MY LISTINGS TAB */}
            {activeTab === 'listings' && (
              myListings.length === 0 ? (
                <div className="py-20 text-center my-auto">
                  <p className="text-sm text-gray-400 mb-4 font-semibold">আপনার কোনো সচল বিজ্ঞাপন নেই।</p>
                  <button
                    onClick={onNavigateUpload}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    বিজ্ঞাপন প্রকাশ করুন
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myListings.map((prod) => (
                    <div 
                      key={prod.id} 
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-gray-50 hover:border-emerald-100 transition-all bg-gray-50/20 dark:border-gray-800"
                    >
                      <button 
                        onClick={() => onNavigateDetails(prod)}
                        className="flex items-center gap-3 text-left focus:outline-hidden min-w-0 flex-1"
                      >
                        <img src={prod.imageUrls[0]} alt={prod.title} className="h-12 w-14 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1 hover:text-emerald-600 transition-colors">
                            {prod.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-[10px] font-black text-emerald-600">৳{prod.price}</span>
                            <span className="text-[9px] text-gray-400 flex items-center gap-0.5 font-bold">
                              <Eye className="h-3 w-3 text-gray-400" />
                              {prod.views} ভিউস
                            </span>
                            {prod.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 text-[8px] font-black text-amber-700 dark:text-amber-400 animate-pulse border border-amber-200">
                                <Sparkles className="h-2 w-2 text-amber-500 fill-amber-500" />
                                Featured Active
                              </span>
                            )}
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 shrink-0 justify-end">
                        {/* Live / Pending Status */}
                        {prod.isApproved ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 text-[8px] font-black text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                            LIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2 py-1 text-[8px] font-black text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                            PENDING APPROVAL
                          </span>
                        )}

                        {/* Boost Button (Only if approved and not featured yet) */}
                        {prod.isApproved && !prod.isFeatured && (
                          <button
                            onClick={() => onBoostProduct(prod.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 text-[10px] font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                            title="ফি ৳১৫০ কেটে নেওয়া হবে"
                          >
                            <TrendingUp className="h-3 w-3" />
                            বুস্ট (৳১৫০)
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="rounded-xl bg-red-50 dark:bg-red-950/20 p-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                          title="বিজ্ঞাপনটি ডিলিট করুন"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* 2. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              savedListings.length === 0 ? (
                <div className="py-20 text-center my-auto">
                  <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 mb-1 font-semibold">আপনার পছন্দের তালিকায় কোনো পণ্য সংরক্ষিত নেই।</p>
                  <p className="text-xs text-gray-400">হোমপেজ থেকে ব্রাউজ করে পণ্য সংরক্ষণ করুন।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedListings.map((prod) => (
                    <div 
                      key={prod.id} 
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-gray-100 hover:border-emerald-100 transition-all bg-gray-50/20 dark:border-gray-800"
                    >
                      <button 
                        onClick={() => onNavigateDetails(prod)}
                        className="flex items-center gap-3 text-left focus:outline-hidden min-w-0"
                      >
                        <img src={prod.imageUrls[0]} alt={prod.title} className="h-12 w-14 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1 hover:text-emerald-600 transition-colors">
                            {prod.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-emerald-600">৳{prod.price}</span>
                            <span className="text-[9px] text-gray-400 font-bold">{prod.location}</span>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <button
                          onClick={() => onToggleSave && onToggleSave(prod.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer dark:bg-red-950/20"
                          title="পছন্দের তালিকা থেকে বাদ দিন"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* 3. PERFORMANCE ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              myListings.length === 0 ? (
                <div className="py-20 text-center my-auto">
                  <BarChart2 className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 mb-1 font-semibold">আপনার কোনো প্রকাশিত বিজ্ঞাপন নেই।</p>
                  <p className="text-xs text-gray-400">অ্যানালিটিক্স দেখতে প্রথমে একটি বিজ্ঞাপন প্রকাশ করুন।</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overview statistics bento cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-center border border-gray-100 dark:border-gray-800">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">মোট ভিউস</span>
                      <span className="text-xl font-black text-gray-800 dark:text-white">{totalViews}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-center border border-gray-100 dark:border-gray-800">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">গড় ভিউস</span>
                      <span className="text-xl font-black text-gray-800 dark:text-white">{averageViews}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-center border border-gray-100 dark:border-gray-800">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">বুস্টেড বিজ্ঞাপন</span>
                      <span className="text-xl font-black text-amber-600 dark:text-amber-400">{boostedCount}</span>
                    </div>
                  </div>

                  {/* Recharts: Views Comparison */}
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900 shadow-xs">
                    <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      বিজ্ঞাপন ভিউস চার্ট (Listing Views Chart)
                    </h4>
                    <div className="h-56 w-full text-[10px] font-bold">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={myListings.map(p => ({
                            name: p.title.length > 15 ? p.title.slice(0, 15) + '...' : p.title,
                            'ভিউস (Views)': p.views,
                          }))}
                          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                          <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                          <YAxis tick={{ fill: '#94a3b8' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              borderColor: '#374151',
                              borderRadius: '12px',
                              color: '#ffffff',
                              fontSize: '11px'
                            }} 
                          />
                          <Bar dataKey="ভিউস (Views)" fill="#059669" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recharts: Wallet Earnings & Activity */}
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900 shadow-xs">
                    <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-amber-500" />
                      ওয়ালেট লেনদেন ও আয়-ব্যয় চার্ট (Wallet Earnings & Activity Chart)
                    </h4>
                    <div className="h-56 w-full text-[10px] font-bold">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={walletTransactions.length > 0 
                            ? walletTransactions.slice(-7).reverse().map((t, idx) => ({
                                name: t.timestamp.split(',')[0] || `লেনদেন ${idx+1}`,
                                'টাকার পরিমাণ (BDT)': t.amount,
                                type: t.type === 'credit' ? 'আয়' : 'ব্যয়'
                              }))
                            : [
                                { name: '০১ জুলাই', 'টাকার পরিমাণ (BDT)': 500, type: 'আয়' },
                                { name: '০৩ জুলাই', 'টাকার পরিমাণ (BDT)': 150, type: 'ব্যয়' },
                                { name: '০৫ জুলাই', 'টাকার পরিমাণ (BDT)': 1000, type: 'আয়' },
                                { name: '০৬ জুলাই', 'টাকার পরিমাণ (BDT)': 150, type: 'ব্যয়' },
                                { name: '০৮ জুলাই', 'টাকার পরিমাণ (BDT)': 150, type: 'ব্যয়' }
                              ]}
                          margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorWallet" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" className="hidden dark:block" />
                          <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                          <YAxis tick={{ fill: '#94a3b8' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              borderColor: '#374151',
                              borderRadius: '12px',
                              color: '#ffffff',
                              fontSize: '11px'
                            }} 
                          />
                          <Area type="monotone" dataKey="টাকার পরিমাণ (BDT)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorWallet)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center font-semibold leading-relaxed">
                      *ওয়ালেটে ক্রেডিট করা ফান্ড এবং বিজ্ঞাপন প্রোমোট/পণ্য বিক্রয় সংক্রান্ত খরচের গতিধারা উপরে দেখানো হয়েছে।
                    </p>
                  </div>

                  {/* Boosting educational banner */}
                  <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/10 p-4 flex gap-3 items-start">
                    <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-black text-amber-800 dark:text-amber-400 uppercase">পণ্য দ্রুত বিক্রি করার সিক্রেট!</h5>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mt-0.5">
                        আপনার পণ্যটি সবার উপরে রাখতে ওয়ালেট ব্যালেন্স দিয়ে "বুস্ট" করুন। বুস্ট করা বিজ্ঞাপনে সাধারণ বিজ্ঞাপনের চেয়ে ৫ গুণের বেশি ভিউ ও বেশি কল আসে!
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* 4. WALLET LEDGER / TRANSACTION HISTORY TAB */}
            {activeTab === 'wallet' && (
              walletTransactions.length === 0 ? (
                <div className="py-20 text-center my-auto">
                  <History className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 mb-1 font-semibold">কোনো ট্রানজেকশন হিস্ট্রি পাওয়া যায়নি।</p>
                  <p className="text-xs text-gray-400">ব্যালেন্স এড বা প্রোডাক্ট বুস্ট করার পর এখানে হিস্ট্রি দেখতে পাবেন।</p>
                </div>
              ) : (
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-1">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                    <Coins className="h-4 w-4 text-emerald-500" />
                    ওয়ালেট লেনদেন খতিয়ান
                  </h4>

                  {walletTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-3.5 rounded-2xl border border-gray-50 dark:border-gray-800 flex items-center justify-between gap-4 bg-gray-50/20 hover:bg-gray-50/50 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Circle badge based on type */}
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                          tx.type === 'credit' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                            : 'bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400'
                        }`}>
                          {tx.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                            {tx.description}
                          </p>
                          <span className="block text-[8px] text-gray-400 font-mono mt-0.5">
                            {tx.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className={`text-sm font-black shrink-0 ${
                        tx.type === 'credit' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-500 dark:text-red-400'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}৳{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
