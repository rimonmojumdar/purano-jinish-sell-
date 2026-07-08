import React from 'react';
import { 
  MapPin, Phone, MessageSquare, ShieldCheck, Sparkles, Eye, 
  ArrowLeft, Calendar, Info, Clock, CheckCircle, AlertCircle, Coins,
  Star, Share2, Link2, Check, Tag
} from 'lucide-react';
import { Product, User } from '../types';

interface ProductDetailsProps {
  product: Product;
  currentUser: User | null;
  users: User[];
  onBack: () => void;
  onStartChat: (product: Product, offerPrice?: number) => void;
  onBoostProduct: (productId: string) => void;
  onAddFunds: () => void;
  onOpenLogin: () => void;
  onAddReview: (sellerId: string, rating: number, comment: string) => void;
  onBuyProduct?: (product: Product) => void;
}

export default function ProductDetails({
  product,
  currentUser,
  users,
  onBack,
  onStartChat,
  onBoostProduct,
  onAddFunds,
  onOpenLogin,
  onAddReview,
  onBuyProduct
}: ProductDetailsProps) {
  const [activeImage, setActiveImage] = React.useState(product.imageUrls[0]);
  const [phoneRevealed, setPhoneRevealed] = React.useState(false);
  const [copiedPhone, setCopiedPhone] = React.useState(false);
  const [showSharePanel, setShowSharePanel] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  
  // Bargaining states
  const [showOfferForm, setShowOfferForm] = React.useState(false);
  const [offerPriceInput, setOfferPriceInput] = React.useState('');
  
  // Review inputs
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [reviewSuccess, setReviewSuccess] = React.useState(false);

  const isOwner = currentUser?.id === product.sellerId;

  // Retrieve current seller data for reviews
  const seller = users.find(u => u.id === product.sellerId);
  const sellerReviews = seller?.sellerReviews || [];
  const sellerRating = sellerReviews.length > 0 
    ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length 
    : 5.0; // Default 5 star

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareSocial = (platform: 'fb' | 'wa' | 'messenger') => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`আপনবাজার-এ এই দারুণ পণ্যটি দেখুন: ${product.title}`);
    let url = '';
    if (platform === 'fb') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    } else if (platform === 'wa') {
      url = `https://api.whatsapp.com/send?text=${text}%20${shareUrl}`;
    } else if (platform === 'messenger') {
      url = `fb-messenger://share/?link=${shareUrl}&app_id=123456789`;
    }
    window.open(url, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    if (!reviewComment.trim()) return;
    onAddReview(product.sellerId, reviewRating, reviewComment.trim());
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(product.sellerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const getConditionText = (cond: string) => {
    switch (cond) {
      case 'like_new': return { text: 'নতুন এর মতো (Like New)', desc: 'পণ্যটিতে কোনো স্ক্র্যাচ বা দাগ নেই, একদম নতুনের মতো কাজ করে।' };
      case 'good': return { text: 'ভালো (Good)', desc: 'সামান্য ব্যবহৃত, তবে সম্পূর্ণ সচল এবং কোনো ইন্টারনাল সমস্যা নেই।' };
      case 'fair': return { text: 'চলবে (Fair)', desc: 'কিছু স্ক্র্যাচ বা দাগ আছে, তবে ব্যবহারের উপযোগী এবং কাজ করে।' };
      default: return { text: 'ব্যবহৃত', desc: 'সাধারণ ব্যবহৃত পণ্য।' };
    }
  };

  const condInfo = getConditionText(product.condition);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-all active:scale-95 cursor-pointer"
        id="btn-back-to-home"
      >
        <ArrowLeft className="h-4 w-4" />
        হোম পেজে ফিরে যান
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-xs aspect-4/3">
            <img 
              src={activeImage} 
              alt={product.title} 
              className="h-full w-full object-cover transition-all"
              referrerPolicy="no-referrer"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-extrabold text-white shadow-md">
                <Sparkles className="h-4.5 w-4.5" />
                FEATURED LISTING
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.imageUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(url)}
                  className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === url 
                      ? 'border-emerald-500 scale-95 shadow-md' 
                      : 'border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  <img src={url} alt={`product-thumb-${index}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              পণ্যের বিবরণ
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Side: Product Details & CTA */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Info Box */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
            
            {/* Category & Location & Share */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <span className="rounded-md bg-emerald-50 px-2 py-1 dark:bg-emerald-950/40">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <MapPin className="h-3 w-3 text-emerald-500" />
                  {product.location}
                </span>
              </div>
              
              <button 
                onClick={() => setShowSharePanel(!showSharePanel)}
                className="flex items-center gap-1 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
                title="বিজ্ঞাপনটি শেয়ার করুন"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>শেয়ার</span>
              </button>
            </div>

            {/* Social Share Popover Panel */}
            {showSharePanel && (
              <div className="mb-4 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/20 animate-in fade-in slide-in-from-top-2 duration-200">
                <span className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2.5">দ্রুত সোশ্যাল শেয়ার করুন:</span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleShareSocial('fb')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95 transition-all font-bold text-[10px]"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShareSocial('wa')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer active:scale-95 transition-all font-bold text-[10px]"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShareSocial('messenger')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white cursor-pointer active:scale-95 transition-all font-bold text-[10px]"
                  >
                    Messenger
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 cursor-pointer active:scale-95 transition-all"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Link2 className="h-3.5 w-3.5" />}
                    <span className="text-[10px] font-bold mt-0.5">{copiedLink ? 'কপিড!' : 'লিঙ্ক কপি'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Title */}
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              {product.title}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                ৳{product.price.toLocaleString('bn-BD')}
              </span>
              <span className="text-xs text-gray-400 font-bold">ফিক্সড প্রাইস</span>
            </div>

            {/* Grid Attributes */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 dark:border-gray-800 py-4 mb-6">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">কন্ডিশন</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {product.condition === 'like_new' ? 'নতুন এর মতো' : product.condition === 'good' ? 'ভালো' : 'চলবে (Fair)'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">কতদিন ব্যবহার করা হয়েছে</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  {product.usedDuration}
                </span>
              </div>
            </div>

            {/* Condition Warning Box */}
            <div className="rounded-2xl bg-amber-50/50 border border-amber-100/50 p-3.5 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 flex gap-2.5">
              <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">{condInfo.text}</span>
                <p className="leading-relaxed">{condInfo.desc}</p>
              </div>
            </div>
          </div>

          {/* Seller / Contact Box */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">বিক্রেতার তথ্য</h3>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
                  {product.sellerName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    {product.sellerName}
                    {product.isSellerVerified && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] text-white font-black" title="NID ভেরিফাইড সেলার">
                        ✓
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    {product.isSellerVerified ? 'NID ভেরিফাইড বিক্রেতা' : 'সাধারন বিক্রেতা'}
                  </span>

                  {/* Seller Rating Stars */}
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-3 w-3 ${
                            s <= Math.round(sellerRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-700'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-700 dark:text-gray-300">
                      {sellerRating.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold">
                      ({sellerReviews.length} রিভিউ)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for Buyers */}
            {!isOwner ? (
              <div className="space-y-3">
                {/* Direct Online Buy Button */}
                {product.isSold ? (
                  <div className="rounded-2xl bg-red-500/5 dark:bg-red-950/20 border border-red-500/10 dark:border-red-900/40 p-3 text-center mb-1">
                    <span className="block text-xs font-black text-red-600 dark:text-red-400">🚨 এই পণ্যটি ইতিমধ্যে বিক্রিত (SOLD OUT)</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5 block">নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে লেনদেনটি সম্পন্ন হয়েছে।</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onBuyProduct && onBuyProduct(product)}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-600 hover:from-pink-700 hover:via-purple-700 hover:to-amber-700 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30 active:scale-98 transition-all cursor-pointer border border-white/5"
                    id="btn-buy-mfs"
                  >
                    <Coins className="h-4.5 w-4.5 animate-bounce" />
                    বিকাশ / নগদ / রকেটে সরাসরি কিনুন
                  </button>
                )}

                {/* Chat Button */}
                <button
                  disabled={product.isSold}
                  onClick={() => onStartChat(product)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  id="btn-chat-seller"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  বিক্রেতার সাথে চ্যাট করুন
                </button>

                {/* Make an Offer Button & Panel */}
                {!product.isSold && (
                  <div className="pt-1.5" id="offer-panel-container">
                    {!showOfferForm ? (
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            onOpenLogin();
                          } else {
                            setShowOfferForm(true);
                            setOfferPriceInput(String(product.price - Math.round(product.price * 0.10)));
                          }
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-600/60 bg-emerald-500/5 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/5 py-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 cursor-pointer transition-all active:scale-98"
                        id="btn-make-offer"
                      >
                        <Tag className="h-4 w-4" />
                        দামাদামি করুন (Make an Offer) 💬
                      </button>
                    ) : (
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/30 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-extrabold text-gray-700 dark:text-gray-300">আপনার অফার করা মূল্য দিন (BDT)</span>
                          <button 
                            type="button"
                            onClick={() => setShowOfferForm(false)}
                            className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-white font-extrabold cursor-pointer"
                          >
                            বন্ধ করুন
                          </button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600">৳</span>
                          <input
                            type="number"
                            required
                            max={product.price - 1}
                            placeholder="যেমন: ৪,৫০০"
                            value={offerPriceInput}
                            onChange={(e) => setOfferPriceInput(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 py-2.5 pl-8 pr-4 text-xs font-extrabold text-gray-800 dark:text-white focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                          সাধারণত মূল দামের চেয়ে ১০-১৫% কম অফার করলে বিক্রেতা দ্রুত রাজি হন।
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const parsed = parseInt(offerPriceInput);
                            if (isNaN(parsed) || parsed <= 0) {
                              alert('দয়া করে একটি সঠিক ইতিবাচক মূল্য লিখুন।');
                              return;
                            }
                            if (parsed >= product.price) {
                              alert('অফার করা মূল্য অবশ্যই পণ্যের মূল দামের চেয়ে কম হতে হবে।');
                              return;
                            }
                            // Start chat with offer price!
                            onStartChat(product, parsed);
                            setShowOfferForm(false);
                          }}
                          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-black cursor-pointer transition-all active:scale-95 shadow-sm"
                        >
                          অফারটি বিক্রেতাকে পাঠান
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Call Button */}
                {!phoneRevealed ? (
                  <button
                    onClick={() => setPhoneRevealed(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-600 bg-emerald-50/50 py-3.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/10 dark:text-emerald-400 cursor-pointer"
                    id="btn-reveal-phone"
                  >
                    <Phone className="h-4.5 w-4.5" />
                    নাম্বার দেখুন (Call Seller)
                  </button>
                ) : (
                  <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/20 p-3.5 text-center dark:border-emerald-800">
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">বিক্রেতার ফোন নাম্বার</span>
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 block mb-2">
                      {product.sellerPhone}
                    </span>
                    <div className="flex gap-2 justify-center">
                      <a 
                        href={`tel:${product.sellerPhone}`}
                        className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer"
                      >
                        সরাসরি কল
                      </a>
                      <button 
                        onClick={handleCopyPhone}
                        className="rounded-lg bg-gray-100 px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-all cursor-pointer"
                      >
                        {copiedPhone ? 'কপি হয়েছে!' : 'নাম্বার কপি'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* If current user is the OWNER of this product */
              <div className="mt-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50/20 p-4 dark:border-amber-800">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  এটি আপনার নিজের বিজ্ঞাপন!
                </span>
                
                {product.isFeatured ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl">
                    <CheckCircle className="h-4.5 w-4.5" />
                    বিজ্ঞাপনটি অলরেডি বুস্ট করা আছে এবং হোমপেজে সবার উপরে দেখাবে।
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 leading-normal">
                      পণ্যটি দ্রুত বিক্রি করতে চান? মাত্র <b>৳১৫০</b> দিয়ে আপনার পণ্যটিকে ৩ দিনের জন্য <b>Featured Product</b> হিসেবে বুস্ট করুন!
                    </p>
                    
                    {currentUser && currentUser.balance >= 150 ? (
                      <button
                        onClick={() => onBoostProduct(product.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-xs font-extrabold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 active:scale-98 transition-all cursor-pointer"
                        id="btn-boost-action"
                      >
                        <Coins className="h-4 w-4" />
                        ৳১৫০ দিয়ে বুস্ট করুন
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-50 p-2 rounded-lg">
                          <AlertCircle className="h-3.5 w-3.5" />
                          আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই (বুস্ট করতে ৳১৫০ প্রয়োজন)।
                        </div>
                        <button
                          onClick={onAddFunds}
                          className="flex w-full items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer"
                        >
                          ওয়ালেটে ফান্ড যোগ করুন (+৳৫০০)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Section */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">ক্রেতাদের রিভিউসমূহ</h4>
              
              {sellerReviews.length === 0 ? (
                <p className="text-xs text-gray-400 italic">এই বিক্রেতার এখনও কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
              ) : (
                <div className="space-y-3 max-h-52 overflow-y-auto mb-4 pr-1">
                  {sellerReviews.map((rev) => (
                    <div key={rev.id} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="h-5 w-5 rounded-full object-cover" />
                          <span className="text-[11px] font-extrabold text-gray-800 dark:text-gray-200">{rev.reviewerName}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-2.5 w-2.5 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-700'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-normal">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Review Form */}
              {!isOwner && currentUser && (
                <form onSubmit={handleReviewSubmit} className="mt-4 p-3.5 rounded-2xl bg-emerald-50/10 border border-emerald-100/50 dark:border-emerald-950/20 dark:bg-emerald-950/5 space-y-3">
                  <span className="block text-[11px] font-extrabold text-gray-700 dark:text-gray-300">বিক্রেতাকে রেটিং দিন:</span>
                  
                  {/* Star selector */}
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={`h-5 w-5 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <textarea
                      required
                      placeholder="বিক্রেতা এবং পণ্য সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white bg-white py-2 px-3 text-xs text-gray-800 focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  {reviewSuccess && (
                    <span className="block text-[10px] text-emerald-600 font-bold animate-pulse">✓ রিভিউটি সফলভাবে সাবমিট হয়েছে!</span>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 py-2 text-xs font-bold cursor-pointer"
                  >
                    রিভিউ সাবমিট করুন
                  </button>
                </form>
              )}

              {!currentUser && !isOwner && (
                <div className="mt-3 text-center bg-gray-50 dark:bg-gray-800/20 py-2 rounded-xl">
                  <button 
                    onClick={onOpenLogin}
                    className="text-[10px] font-bold text-emerald-600 hover:underline"
                  >
                    রিভিউ দিতে লগইন করুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Safety Tips Card */}
          <div className="rounded-3xl border border-gray-100 bg-amber-50/20 p-6 dark:border-gray-800/50">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">নিরাপত্তা টিপস</h4>
            <ul className="text-xs text-amber-900/80 dark:text-gray-300 space-y-1.5 list-disc pl-4">
              <li>সব সময় পাবলিক স্থানে বিক্রেতার সাথে দেখা করুন।</li>
              <li>পণ্যটি নিজ হাতে চেক করার আগে অগ্রিম টাকা পাঠাবেন না।</li>
              <li>ভেরিফাইড ব্যাজ (✓) দেখে বিক্রেতার সত্যতা নিশ্চিত করুন।</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
