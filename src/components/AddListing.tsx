import React from 'react';
import { UploadCloud, CheckCircle, Smartphone, Laptop, Tv, X, AlertCircle, Sparkles } from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '../data';
import { Product, User } from '../types';

interface AddListingProps {
  currentUser: User | null;
  onAddProduct: (product: Product) => void;
  onNavigateHome: () => void;
}

const SAMPLE_IMAGES = {
  mobile: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop'
  ],
  laptop: [
    'https://images.unsplash.com/photo-1496181130204-755241544e35?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&auto=format&fit=crop'
  ],
  tv: [
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop'
  ],
  fridge: [
    'https://images.unsplash.com/photo-1571175432247-fe03365b6024?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop'
  ],
  bike: [
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop'
  ],
  furniture: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop'
  ],
  sports: [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&auto=format&fit=crop'
  ],
  other: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'
  ]
};

export default function AddListing({ currentUser, onAddProduct, onNavigateHome }: AddListingProps) {
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('mobile');
  const [price, setPrice] = React.useState('');
  const [condition, setCondition] = React.useState<'like_new' | 'good' | 'fair'>('good');
  const [usedDuration, setUsedDuration] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState('ঢাকা');
  const [phone, setPhone] = React.useState(currentUser?.phone || '');
  const [selectedImage, setSelectedImage] = React.useState('');
  const [customImageLink, setCustomImageLink] = React.useState('');
  const [uploadedImage, setUploadedImage] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  // Price Estimator state
  const [origPrice, setOrigPrice] = React.useState('');
  const [durationMonths, setDurationMonths] = React.useState('6');
  const [estimatorOpen, setEstimatorOpen] = React.useState(false);

  // AI Description state
  const [generatingAi, setGeneratingAi] = React.useState(false);
  const [aiError, setAiError] = React.useState('');
  const [aiSuccess, setAiSuccess] = React.useState(false);

  const handleGenerateAiDescription = async () => {
    if (!title) {
      alert('দয়া করে প্রথমে বিজ্ঞাপনের টাইটেলটি লিখুন।');
      return;
    }
    setGeneratingAi(true);
    setAiError('');
    setAiSuccess(false);

    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          category,
          condition,
          usedDuration: usedDuration || '৬ মাস'
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Gemini API call failed');
      }

      const data = await response.json();
      if (data.description) {
        setDescription(data.description);
        setAiSuccess(true);
      } else {
        throw new Error('কোনো বিবরণী পাওয়া যায়নি।');
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'বিবরণী তৈরিতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setGeneratingAi(false);
    }
  };

  // Auto pick first pre-curated image when category changes
  React.useEffect(() => {
    const cats = category as keyof typeof SAMPLE_IMAGES;
    if (SAMPLE_IMAGES[cats]) {
      setSelectedImage(SAMPLE_IMAGES[cats][0]);
    }
  }, [category]);

  const getSuggestedResalePrice = () => {
    const oPrice = Number(origPrice);
    if (!oPrice || isNaN(oPrice)) return null;

    // Base depreciation based on condition
    let minDep = 0.15;
    let maxDep = 0.25;
    if (condition === 'good') {
      minDep = 0.30;
      maxDep = 0.40;
    } else if (condition === 'fair') {
      minDep = 0.50;
      maxDep = 0.65;
    }

    // Additional depreciation based on usage
    const months = Number(durationMonths);
    let addDep = 0.0;
    if (months <= 3) {
      addDep = 0.05;
    } else if (months <= 6) {
      addDep = 0.10;
    } else if (months <= 12) {
      addDep = 0.18;
    } else if (months <= 24) {
      addDep = 0.28;
    } else {
      addDep = 0.45;
    }

    const finalMinDep = Math.min(0.90, minDep + addDep);
    const finalMaxDep = Math.min(0.95, maxDep + addDep);

    const minPrice = Math.round(oPrice * (1 - finalMaxDep));
    const maxPrice = Math.round(oPrice * (1 - finalMinDep));
    const avgPrice = Math.round((minPrice + maxPrice) / 2);

    return { minPrice, maxPrice, avgPrice };
  };

  const est = getSuggestedResalePrice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const imgToUse = uploadedImage || customImageLink || selectedImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title,
      category,
      price: Number(price),
      condition,
      usedDuration: usedDuration || '৬ মাস',
      description,
      location,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: phone || '01700000000',
      isSellerVerified: currentUser.isVerified,
      imageUrls: [imgToUse],
      isApproved: currentUser.role === 'admin', // Auto approve if admin uploaded
      isFeatured: false,
      createdAt: new Date().toISOString(),
      views: 0
    };

    onAddProduct(newProduct);
    setSubmitted(true);
  };

  if (submitted) {
    const autoApproved = currentUser?.role === 'admin';
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
          বিজ্ঞাপন সফলভাবে আপলোড হয়েছে!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
          {autoApproved 
            ? 'আপনার বিজ্ঞাপনটি সফলভাবে আপনবাজারে লাইভ করা হয়েছে।' 
            : 'আপনার বিজ্ঞাপনটি মডারেশনের জন্য পাঠানো হয়েছে। এটি এডমিন প্যানেলে অনুমোদিত হওয়ার সাথে সাথেই হোমপেজে প্রদর্শিত হবে। দ্রুত অনুমোদন দেখতে এডমিন ইমেইল (rimonmajumder67@gmail.com) দিয়ে লগইন করে ড্যাশবোর্ড থেকে Approve করতে পারেন।'}
        </p>
        <button
          onClick={onNavigateHome}
          className="rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-emerald-700 transition-all cursor-pointer"
        >
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 md:p-8">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-50 dark:border-gray-800 pb-5">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            নতুন পণ্য বিক্রি করুন
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            আপনার পুরনো ল্যাপটপ, মোবাইল বা অন্য কোনো পণ্য বিক্রির জন্য বিজ্ঞাপনটি সঠিকভাবে পূরণ করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Attributes */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Title */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">বিজ্ঞাপনের টাইটেল (Title) <span className="text-red-500">*</span></label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: iPhone 13 Pro (128GB) - খুবই নতুন কন্ডিশন"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">ক্যাটাগরি সিলেক্ট করুন <span className="text-red-500">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">দাম (৳ - Price) <span className="text-red-500">*</span></label>
              <input 
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="যেমন: ৪৫০০০"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Condition */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">পণ্যের কন্ডিশন <span className="text-red-500">*</span></label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="like_new">নতুন এর মতো (Like New)</option>
                <option value="good">ভালো (Good)</option>
                <option value="fair">চলবে (Fair)</option>
              </select>
            </div>

            {/* Used Duration */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">কতদিন ব্যবহার করেছেন <span className="text-red-500">*</span></label>
              <input 
                type="text"
                required
                value={usedDuration}
                onChange={(e) => setUsedDuration(e.target.value)}
                placeholder="যেমন: ৩ মাস অথবা ১.২ বছর"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">লোকেশন / জেলা <span className="text-red-500">*</span></label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>

            {/* Contact Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">যোগাযোগের নাম্বার <span className="text-red-500">*</span></label>
              <input 
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="যেমন: 017xxxxxxxx"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

          </div>

          {/* AI Price Estimator Widget */}
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/10 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50">
                  <AlertCircle className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">স্মার্ট প্রাইস সাজেস্টর (AI Price Estimator)</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Calculate fair market resale value</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEstimatorOpen(!estimatorOpen)}
                className="rounded-xl border border-emerald-200/50 hover:bg-emerald-50 bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 cursor-pointer"
              >
                {estimatorOpen ? 'লুকিয়ে রাখুন' : 'ক্যালকুলেটর খুলুন'}
              </button>
            </div>

            {estimatorOpen && (
              <div className="space-y-4 pt-2 border-t border-emerald-100/30 dark:border-emerald-800/20 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">নতুন কেনার সময় দাম (৳ - Original Price)</label>
                    <input
                      type="number"
                      placeholder="যেমন: ৮০০০০"
                      value={origPrice}
                      onChange={(e) => setOrigPrice(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-800 focus:border-emerald-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">ব্যবহারের সময়কাল</label>
                    <select
                      value={durationMonths}
                      onChange={(e) => {
                        setDurationMonths(e.target.value);
                        // Also auto sync the other text input usedDuration
                        const mapping: Record<string, string> = {
                          '3': '৩ মাস',
                          '6': '৬ মাস',
                          '12': '১ বছর',
                          '24': '১.৫ বছর',
                          '36': '৩ বছর+'
                        };
                        setUsedDuration(mapping[e.target.value] || '৬ মাস');
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs font-semibold text-gray-800 focus:border-emerald-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="3">১ - ৩ মাস</option>
                      <option value="6">৪ - ৬ মাস</option>
                      <option value="12">৭ - ১২ মাস</option>
                      <option value="24">১ - ২ বছর</option>
                      <option value="36">২ বছরের বেশি</option>
                    </select>
                  </div>
                </div>

                {est && (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                    <span className="block text-xs text-emerald-800 dark:text-emerald-400 font-bold mb-1">আদর্শ সেকেন্ড-হ্যান্ড বিক্রয় মূল্য (Suggested Resale Price)</span>
                    <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                      ৳{est.minPrice.toLocaleString('bn-BD')} - ৳{est.maxPrice.toLocaleString('bn-BD')}
                    </div>
                    <span className="block text-[10px] text-gray-400 font-semibold mt-1">গড় সাজেস্টেড মূল্য: ৳{est.avgPrice}</span>
                    <button
                      type="button"
                      onClick={() => setPrice(String(est.avgPrice))}
                      className="mt-3 inline-flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-extrabold shadow-sm hover:shadow-md cursor-pointer transition-all"
                    >
                      এই দামটি ব্যবহার করুন (Use suggested price)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Image Upload Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
              পণ্যের ছবি যোগ করুন <span className="text-red-500">*</span>
            </label>
            
            {/* Curated Pre-picks */}
            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50/50">
              <span className="text-[10px] font-bold text-gray-400 block mb-3 uppercase tracking-wider">
                সহজে যুক্ত করতে আমাদের ডেমো ছবি সিলেক্ট করুন:
              </span>
              <div className="grid grid-cols-3 gap-3">
                {SAMPLE_IMAGES[category as keyof typeof SAMPLE_IMAGES]?.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSelectedImage(url); setCustomImageLink(''); }}
                    className={`relative h-20 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === url && !customImageLink
                        ? 'border-emerald-500 scale-95 shadow-md' 
                        : 'border-gray-200 hover:border-emerald-200'
                    }`}
                  >
                    <img src={url} alt={`demo-img-${i}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold block text-center py-1">--- অথবা ---</span>
              <input 
                type="url"
                value={customImageLink}
                onChange={(e) => { setCustomImageLink(e.target.value); setSelectedImage(''); }}
                placeholder="নিজের ছবির অনলাইন লিঙ্ক দিন (যেমন: https://...)"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Real File Input & Upload Preview */}
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold block text-center py-1">--- অথবা আপনার ডিভাইস থেকে ছবি আপলোড করুন ---</span>
              <div className="flex flex-col items-center justify-center">
                {uploadedImage ? (
                  <div className="relative w-full max-w-xs h-48 rounded-2xl border border-emerald-100 overflow-hidden group shadow-md">
                    <img src={uploadedImage} alt="Uploaded product preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedImage('')}
                      className="absolute top-2 right-2 rounded-full bg-red-600/90 hover:bg-red-700 text-white p-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title="ছবিটি মুছুন"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-900/80 backdrop-blur-xs py-1 px-3 text-center text-[10px] font-bold text-white">
                      ✓ ছবিটি সফলভাবে যুক্ত হয়েছে!
                    </div>
                  </div>
                ) : (
                  <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-emerald-500 dark:border-gray-800 dark:hover:border-emerald-700 rounded-2xl p-6 text-center bg-gray-50/20 hover:bg-emerald-50/10 cursor-pointer transition-all">
                    <UploadCloud className="h-10 w-10 text-emerald-500 mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">ডিভাইস থেকে ফাইল নির্বাচন করুন</span>
                    <span className="text-[10px] text-gray-400 mt-1">ক্লিক করে আপনার ফাইল ম্যানেজার থেকে ছবি সিলেক্ট করুন</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setUploadedImage(reader.result);
                              setCustomImageLink('');
                              setSelectedImage('');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                পণ্যের বিবরণ (Description) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={generatingAi}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95 ${
                  generatingAi
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 animate-pulse'
                    : title
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                }`}
                title={title ? "Gemini AI দিয়ে আকর্ষণীয় বিবরণী তৈরি করুন" : "আগে টাইটেল লিখুন"}
              >
                <Sparkles className={`h-3.5 w-3.5 ${generatingAi ? 'animate-spin' : ''}`} />
                {generatingAi ? 'এআই বিবরণী লিখছে... 🤖' : 'এআই বিবরণী লিখুন (AI Writer)'}
              </button>
            </div>

            {aiError && (
              <div className="text-[10px] text-red-600 dark:text-red-400 font-bold bg-red-500/10 rounded-xl py-2 px-3 mb-2 animate-in fade-in">
                ⚠️ {aiError}
              </div>
            )}
            {aiSuccess && (
              <div className="text-[10px] text-purple-700 dark:text-purple-400 font-extrabold bg-purple-500/10 rounded-xl py-2 px-3 mb-2 animate-in fade-in">
                ✨ Gemini AI আপনার টাইটেল ও তথ্য বিশ্লেষণ করে চমৎকার বিবরণী লিখে দিয়েছে!
              </div>
            )}

            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="পণ্যটির অবস্থা, কোনো সমস্যা আছে কি না, বা কেন বিক্রি করছেন ইত্যাদি বিস্তারিতভাবে লিখুন অথবা উপরের 'এআই বিবরণী লিখুন' বাটনে ক্লিক করুন..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Notice for Normal user vs Admin */}
          {currentUser && currentUser.role !== 'admin' && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-800 flex gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">মডারেশন নোটিশ</span>
                <p className="leading-relaxed">
                  নিরাপত্তার স্বার্থে আপনার বিজ্ঞাপনটি আপলোড হওয়ার পর <b>Admin Approval</b> এর জন্য যাবে। অ্যাডমিন অনুমোদন দিলেই পণ্যটি সবার ফোনে দেখতে পাওয়া যাবে। আপনি ইমেইলটি <b>rimonmajumder67@gmail.com</b> দিয়ে সাইন-ইন করে নিজেই এটি অনুমোদন করতে পারবেন।
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-extrabold text-white shadow-lg hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer"
            id="btn-upload-submit"
          >
            বিজ্ঞাপন প্রকাশ করুন
          </button>

        </form>

      </div>
    </div>
  );
}
