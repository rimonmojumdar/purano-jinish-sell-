import { Product, User } from './types';

export const CATEGORIES = [
  { id: 'mobile', name: 'মোবাইল', icon: 'Smartphone' },
  { id: 'laptop', name: 'ল্যাপটপ', icon: 'Laptop' },
  { id: 'tv', name: 'টেলিভিশন', icon: 'Tv' },
  { id: 'fridge', name: 'ফ্রিজ', icon: 'IceCream' },
  { id: 'furniture', name: 'আসবাবপত্র', icon: 'Armchair' },
  { id: 'bike', name: 'মোটরসাইকেল', icon: 'Bike' },
  { id: 'sports', name: 'খেলাধুলা ও জিম', icon: 'Dumbbell' },
  { id: 'other', name: 'অন্যান্য', icon: 'Grid' },
];

export const LOCATIONS = [
  { id: 'dhaka', name: 'ঢাকা', enName: 'Dhaka' },
  { id: 'chattogram', name: 'চট্টগ্রাম', enName: 'Chattogram' },
  { id: 'sylhet', name: 'সিলেট', enName: 'Sylhet' },
  { id: 'khulna', name: 'খুলনা', enName: 'Khulna' },
  { id: 'rajshahi', name: 'রাজশাহী', enName: 'Rajshahi' },
  { id: 'barishal', name: 'বরিশাল', enName: 'Barishal' },
  { id: 'rangpur', name: 'রংপুর', enName: 'Rangpur' },
  { id: 'mymensingh', name: 'ময়মনসিংহ', enName: 'Mymensingh' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'iPhone 13 Pro (128GB) - খুবই ফ্রেশ কন্ডিশন',
    category: 'mobile',
    price: 58000,
    condition: 'like_new',
    usedDuration: '৬ মাস',
    description: 'ব্যাটারি হেলথ ৮৭%। ফোনে কোনো প্রকার দাগ বা স্কেচ নেই। সাথে বক্স এবং অরিজিনাল চার্জার ক্যাবল দেওয়া হবে। কখনো খোলা বা সার্ভিসিং করানো হয়নি। সরাসরি এসে দেখে নিতে পারেন।',
    location: 'ঢাকা',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    views: 124,
  },
  {
    id: 'prod-2',
    title: 'Asus ROG Zephyrus G14 গেমিং ল্যাপটপ',
    category: 'laptop',
    price: 85000,
    condition: 'good',
    usedDuration: '১.৫ বছর',
    description: 'AMD Ryzen 7, 16GB RAM, 512GB SSD, GTX 1660Ti। অত্যন্ত যত্নের সাথে ব্যবহার করা হয়েছে। ভারী কোডিং এবং গেম খেলার জন্য অত্যন্ত দারুণ পারফরম্যান্স দেয়। কিবোর্ড ব্যাকলাইট ঠিক আছে, কুলিং ফ্যান একদম নিখুঁত।',
    location: 'চট্টগ্রাম',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(), // 10 hours ago
    views: 298,
  },
  {
    id: 'prod-3',
    title: 'Samsung 43-inch 4K Smart TV (২০২৩ মডেল)',
    category: 'tv',
    price: 32000,
    condition: 'like_new',
    usedDuration: '৩ মাস',
    description: 'কোনো ইন্টারনাল বা এক্সটারনাল সমস্যা নেই। একদম নতুন এর মতো চকচকে কন্ডিশন। ইউটিউব, নেটফ্লিক্স, অ্যামাজন প্রাইম খুব স্মুথলি চলে। অফিসিয়াল ওয়ারেন্টি এখনো সচল আছে (৯ মাস বাকি)। বাসা পরিবর্তনের কারণে বিক্রি করা হবে।',
    location: 'সিলেট',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    views: 78,
  },
  {
    id: 'prod-4',
    title: 'Singer Double Door Refrigerator 250L',
    category: 'fridge',
    price: 19500,
    condition: 'good',
    usedDuration: '২ বছর',
    description: 'ফ্রিজে কোনো ধরনের শব্দ নেই এবং কুলিং সিস্টেম অসাধারণ। কম্প্রেসর কখনো চেঞ্জ করতে হয়নি। বিদ্যুত সাশ্রয়ী ইনভার্টার প্রযুক্তি সম্পন্ন। সরাসরি বাসায় এসে চালিয়ে টেস্ট করে নিয়ে যেতে পারেন।',
    location: 'খুলনা',
    sellerId: 'user-5',
    sellerName: 'তানজিলা রহমান',
    sellerPhone: '01555667788',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1571175432247-fe03365b6024?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    views: 145,
  },
  {
    id: 'prod-5',
    title: 'সেগুন কাঠের এক্সক্লুসিভ সোফা সেট (৩+১+১)',
    category: 'furniture',
    price: 24000,
    condition: 'good',
    usedDuration: '৩ বছর',
    description: 'খাঁটি চিটাগাং সেগুন কাঠের তৈরি। অত্যন্ত মজবুত এবং ভারী কাঠ। ফোম এবং কভারগুলো ধুয়ে পরিষ্কার করে রাখা হয়েছে। ড্রয়িং রুমের সৌন্দর্য অনেক বাড়িয়ে দেবে। দাম সামান্য কিছু সম্মান করা যাবে।',
    location: 'ঢাকা',
    sellerId: 'user-6',
    sellerName: 'জাকির হোসেন',
    sellerPhone: '01311223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
    views: 92,
  },
  {
    id: 'prod-6',
    title: 'Yamaha R15 V3 (Dual ABS) - ১৫,০০০ কি.মি. চালিত',
    category: 'bike',
    price: 345000,
    condition: 'good',
    usedDuration: '১ বছর',
    description: 'কোনো এক্সিডেন্ট হিস্ট্রি নেই। ডিজিটাল নাম্বার প্লেট করা আছে এবং ট্যাক্স টোকেন ২০২৬ সাল পর্যন্ত আপডেট করা। নিয়মিত ইয়ামাহা সার্ভিস সেন্টারে মোবাইল পরিবর্তন এবং পিরিওডিক চেক করানো হয়েছে। শোরুম কন্ডিশন।',
    location: 'রাজশাহী',
    sellerId: 'user-7',
    sellerName: 'ইমরান খান',
    sellerPhone: '01611223344',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    views: 412,
  },
  {
    id: 'prod-7',
    title: 'Kookaburra অরিজিনাল কাশ্মীর উইলো ক্রিকেট ব্যাট',
    category: 'sports',
    price: 3200,
    condition: 'fair',
    usedDuration: '৮ মাস',
    description: 'ব্যাটের স্ট্রোক চমৎকার। কাঠের মান অনেক ভালো এবং কোনো ক্র্যাক নেই। প্রফেশনাল বা টেনিস বলের ম্যাচের জন্য আদর্শ। ফ্রি গ্রিপ এবং থ্রেড গার্ড দেয়া হবে। অল্প দামে ভালো ব্যাট কিনতে চাইলে নিতে পারেন।',
    location: 'রংপুর',
    sellerId: 'user-8',
    sellerName: 'রাব্বি হোসেন',
    sellerPhone: '01711223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1531415080290-bc9b161a0fc3?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(), // 4 days ago
    views: 63,
  },
];

// Curated mockup user profiles
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'রিমন্ড মজুমদার (Admin)',
    email: 'rimonmajumder67@gmail.com',
    phone: '01711122233',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    isVerified: true,
    isBanned: false,
    role: 'admin',
    createdAt: '2025-01-10T12:00:00Z',
    balance: 5000,
  },
  {
    id: 'user-2',
    name: 'সাকিব আল হাসান',
    email: 'shakib@gmail.com',
    phone: '01712345678',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop',
    isVerified: true,
    isBanned: false,
    role: 'user',
    createdAt: '2025-02-15T08:00:00Z',
    balance: 1500,
  },
  {
    id: 'user-3',
    name: 'নাজমুল হুদা',
    email: 'nazmul@gmail.com',
    phone: '01898765432',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    isVerified: true,
    isBanned: false,
    role: 'user',
    createdAt: '2025-03-01T10:00:00Z',
    balance: 800,
  },
  {
    id: 'user-4',
    name: 'মাহমুদুল হাসান',
    email: 'mahmud@gmail.com',
    phone: '01911223344',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    isVerified: false,
    isBanned: false,
    role: 'user',
    createdAt: '2025-04-12T09:30:00Z',
    balance: 300,
  },
];

// Intelligent Bot Auto-Responder replies based on user message matching keywords
export const getBotResponse = (sellerName: string, message: string): string => {
  const msg = message.toLowerCase();
  
  if (msg.includes('দাম') || msg.includes('price') || msg.includes('কত') || msg.includes('koto')) {
    return `আসসালামু আলাইকুম। আমি ${sellerName} বলছি। পণ্যটির দাম যেটা দেওয়া আছে সেটাই রাখার চেষ্টা করেছি, তবে আপনি যদি সরাসরি এসে নিয়ে যান বা গুরুত্ব দিয়ে কিনতে চান, তবে সামান্য কিছু কমানো যেতে পারে। আপনার বাজেট কত?`;
  }
  
  if (msg.includes('কন্ডিশন') || msg.includes('অবস্থা') || msg.includes('condition') || msg.includes('ভালো') || msg.includes('fresh')) {
    return `পণ্যটির কন্ডিশন খুবই ভালো এবং একদম নিখুঁত। পোস্টে যা বিবরণ দেওয়া আছে হুবহু সেটাই পাবেন। ফোনে বা অন্য কিছুতে কোনো ইন্টারনাল সমস্যা নেই। আপনি এসে সম্পূর্ণ চেক করে নিতে পারবেন।`;
  }

  if (msg.includes('ঠিকানা') || msg.includes('লোকেশন') || msg.includes('কোথায়') || msg.includes('location') || msg.includes('address') || msg.includes('basha')) {
    return `আমার মূল লোকেশন হচ্ছে পোস্টের ঠিকানায়। আপনি কখন আসতে পারবেন বলুন, আমি আপনাকে স্পেসিফিক লোকেশন এবং ল্যান্ডমার্ক শেয়ার করে দেবো।`;
  }

  if (msg.includes('নাম্বার') || msg.includes('number') || msg.includes('ফোন') || msg.includes('phone') || msg.includes('jogajog')) {
    return `জি, আমার সাথে যোগাযোগের নাম্বার হলো পোস্টের Call Seller বাটনে ক্লিক করলেই পাবেন, অথবা সরাসরি চ্যাটেও কথা বলতে পারেন। আমি নিয়মিত অনলাইনে আছি।`;
  }

  if (msg.includes('বিক্রি') || msg.includes('sell') || msg.includes('keno') || msg.includes('কেন')) {
    return `আসলে আমি অন্য একটি নতুন মডেল আপগ্রেড করেছি, তাই এই পুরাতন মডেলটি আর প্রয়োজন হচ্ছে না। সম্পূর্ণ ভালো জিনিস, ফেলে না রেখে বিক্রি করে দিচ্ছি।`;
  }

  return `আসসালামু আলাইকুম। আপনার মেসেজটির জন্য ধন্যবাদ! পণ্যটি এখনো বিক্রির জন্য অ্যাভেলেবল আছে। এ বিষয়ে আপনার কোনো সুনির্দিষ্ট প্রশ্ন থাকলে দয়া করে জানান, আমি উত্তর দেওয়ার চেষ্টা করছি।`;
};
