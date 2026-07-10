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
  // MOBILE (5 products)
  {
    id: 'prod-1',
    title: 'iPhone 13 Pro (128GB) - খুবই ফ্রেশ কন্ডিশন',
    category: 'mobile',
    price: 58000,
    condition: 'like_new',
    usedDuration: '৬ মাস',
    description: 'ব্যাটারি হেলথ ৮৭%। ফোনে কোনো প্রকার দাগ বা স্ক্র্যাচ নেই। সাথে বক্স এবং অরিজিনাল চার্জার ক্যাবল দেওয়া হবে। কখনো খোলা বা সার্ভিসিং করানো হয়নি। সরাসরি এসে দেখে নিতে পারেন।',
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
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    views: 124,
  },
  {
    id: 'prod-9',
    title: 'Samsung Galaxy S22 Ultra 5G (Official)',
    category: 'mobile',
    price: 48000,
    condition: 'good',
    usedDuration: '১ বছর',
    description: 'ফোনে কোনো প্রকার দাগ নেই, ডিসপ্লে একদম ফ্রেশ। এস-পেন একদম ঠিকভাবে কাজ করে। প্রফেশনাল ক্যামেরা কোয়ালিটি। সাথে অরিজিনাল ফাস্ট চার্জার এবং রসিদ পাবেন।',
    location: 'ঢাকা',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    views: 89,
  },
  {
    id: 'prod-10',
    title: 'Redmi Note 11 Pro - খুবই আকর্ষণীয় অফার',
    category: 'mobile',
    price: 12500,
    condition: 'good',
    usedDuration: '৮ মাস',
    description: '৬ জিবি র‍্যাম এবং ১২৮ জিবি রম। ফোনটি দিয়ে খুব ভালো গেমিং করা যায় এবং ৫০০০ এমএএইচ বড় ব্যাটারির কারণে ব্যাকআপ দারুণ। ডিসপ্লে প্রোটেক্টর লাগানো আছে।',
    location: 'চট্টগ্রাম',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    views: 142,
  },
  {
    id: 'prod-11',
    title: 'OnePlus 9 Pro 5G (Pine Green)',
    category: 'mobile',
    price: 28000,
    condition: 'good',
    usedDuration: '১.২ বছর',
    description: 'হ্যাসেলব্লাড ক্যামেরা সিস্টেম খুবই নিখুঁত ছবি তোলে। ফোনটি অত্যন্ত দ্রুত কাজ করে। স্ক্রিনে কোনো স্ক্র্যাচ নেই, ব্যাক সাইডে সামান্য ব্যবহারের দাগ রয়েছে।',
    location: 'সিলেট',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    views: 201,
  },
  {
    id: 'prod-12',
    title: 'Google Pixel 6a (Charcoal Color)',
    category: 'mobile',
    price: 22000,
    condition: 'like_new',
    usedDuration: '৪ মাস',
    description: 'একদম অফিসিয়াল ফোন, মাত্র ৪ মাস ব্যবহৃত হয়েছে। ক্যামেরা কোয়ালিটি আইফোনের মতোই চমৎকার। স্টক অ্যান্ড্রয়েড এক্সপেরিয়েন্স। কোনো স্ক্র্যাচ বা স্পট নেই।',
    location: 'খুলনা',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 70).toISOString(),
    views: 95,
  },

  // LAPTOP (5 products)
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
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    views: 298,
  },
  {
    id: 'prod-13',
    title: 'HP Pavilion 15 (Core i5, 11th Gen)',
    category: 'laptop',
    price: 35000,
    condition: 'good',
    usedDuration: '১ বছর',
    description: '৮ জিবি ডিডিআর৪ র‍্যাম, ৫১২ জিবি এসএসডি। মেটাল বডি হওয়ায় প্রিমিয়াম ফিল দেয়। স্টুডেন্ট এবং ফ্রিল্যান্সারদের কাজের জন্য আদর্শ। ৩ ঘন্টার বেশি ব্যাটারি ব্যাকআপ পাওয়া যায়।',
    location: 'ঢাকা',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1496181130204-7552cc1524e2?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    views: 110,
  },
  {
    id: 'prod-14',
    title: 'MacBook Air M1 (8GB / 256GB SSD)',
    category: 'laptop',
    price: 65000,
    condition: 'like_new',
    usedDuration: '৭ মাস',
    description: 'ব্যাটারি হেলথ ৯৪%, চার্জ সাইকেল মাত্র ৮০। অরিজিনাল বক্স ও অল অ্যাকসেসরিজ সাথে দেওয়া হবে। গ্রাফিক্স ডিজাইন এবং ভিডিও এডিটিং এর জন্য খুবই অসাধারণ স্পিড দেয়।',
    location: 'ঢাকা',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    views: 312,
  },
  {
    id: 'prod-15',
    title: 'Dell Latitude 7490 (Core i7, Business Series)',
    category: 'laptop',
    price: 18500,
    condition: 'good',
    usedDuration: '২ বছর',
    description: '১৬ জিবি র‍্যাম এবং ২৫৬ জিবি এনভিএমই এসএসডি। অফিশিয়াল ব্যবহারের জন্য খুবই উপযোগী এবং হালকা ওজনের ল্যাপটপ। কোনো ইন্টারনাল সমস্যা নেই।',
    location: 'রাজশাহী',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 90).toISOString(),
    views: 75,
  },
  {
    id: 'prod-16',
    title: 'Lenovo ThinkPad T480 (Legendary Keyboard)',
    category: 'laptop',
    price: 21000,
    condition: 'good',
    usedDuration: '১.৮ বছর',
    description: 'Intel Core i5 8th Gen, 8GB RAM, 256GB SSD. থিংকপ্যাডের বিল্ড কোয়ালিটি এবং কিবোর্ড খুবই প্রখ্যাত। ডুয়াল ব্যাটারি সিস্টেম রয়েছে তাই দীর্ঘ ব্যাকআপ পাবেন।',
    location: 'রংপুর',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 110).toISOString(),
    views: 82,
  },

  // TV (4 products)
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
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    views: 78,
  },
  {
    id: 'prod-17',
    title: 'Sony Bravia 55-inch OLED 4K Smart TV',
    category: 'tv',
    price: 55000,
    condition: 'like_new',
    usedDuration: '৫ মাস',
    description: 'OLED প্যানেল হওয়ায় কালার এবং ব্রাইটনেস চমৎকার। ট্রিলুমিনাস ডিসপ্লে টেকনোলজি। অ্যান্ড্রয়েড ওএস সচল রয়েছে, প্লে স্টোর থেকে যেকোনো অ্যাপ ইনস্টল করা যায়।',
    location: 'ঢাকা',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    views: 240,
  },
  {
    id: 'prod-18',
    title: 'Walton 32-inch HD LED TV (অফিশিয়াল)',
    category: 'tv',
    price: 9500,
    condition: 'good',
    usedDuration: '১.২ বছর',
    description: 'খুবই কম বিদ্যুৎ খরচ করে। পিকচার কোয়ালিটি ক্রিস্টাল ক্লিয়ার। ২ টি এইচডিএমআই এবং ইউএসবি পোর্ট রয়েছে। ডিসপ্লে প্যানেল খুবই ফ্রেশ আছে।',
    location: 'ময়মনসিংহ',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 45).toISOString(),
    views: 66,
  },
  {
    id: 'prod-19',
    title: 'Xiaomi Mi Smart TV 4A (43-inch Edition)',
    category: 'tv',
    price: 18000,
    condition: 'good',
    usedDuration: '১ বছর',
    description: 'বিল্ট-ইন ক্রোমকাস্ট এবং গুগল অ্যাসিস্ট্যান্ট সাপোর্ট করে। সাউন্ড কোয়ালিটি অনেক জোরালো। ডলবি অডিও সিস্টেম। কোনো প্রকার বাফারিং ছাড়াই এইচডি চ্যানেল চলে।',
    location: 'ঢাকা',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 62).toISOString(),
    views: 118,
  },

  // FRIDGE (4 products)
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
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    views: 145,
  },
  {
    id: 'prod-21',
    title: 'Walton Direct Cool Refrigerator 150L',
    category: 'fridge',
    price: 14000,
    condition: 'good',
    usedDuration: '১ বছর',
    description: 'ছোট ফ্যামিলির জন্য একদম উপযুক্ত ফ্রিজ। দ্রুত বরফ জমে এবং বিদ্যুৎ সাশ্রয়ী। বডিতে কোনো মরিচা নেই, একদম পরিষ্কার পরিচ্ছন্ন অবস্থায় রাখা হয়েছে।',
    location: 'বরিশাল',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 55).toISOString(),
    views: 71,
  },
  {
    id: 'prod-22',
    title: 'Samsung No-Frost Inverter Refrigerator (320L)',
    category: 'fridge',
    price: 28500,
    condition: 'like_new',
    usedDuration: '৮ মাস',
    description: 'ডিজিটাল ইনভার্টার টেকনোলজি সম্পন্ন। অল-এরাউন্ড কুলিং সিস্টেম সব খাবার দীর্ঘক্ষণ তাজা রাখে। টাচ কন্ট্রোল প্যানেল আছে। কোনো সার্ভিসিং হিস্ট্রি নেই।',
    location: 'ঢাকা',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    views: 195,
  },
  {
    id: 'prod-23',
    title: 'Sharp Inverter Refrigerator 220L',
    category: 'fridge',
    price: 21000,
    condition: 'good',
    usedDuration: '১.৫ বছর',
    description: 'জাপানি ব্র্যান্ড শার্পের চমৎকার বিল্ড কোয়ালিটি। গন্ধ দূর করার জন্য ডিওডোরাইজার ফিল্টার বিল্ট-ইন আছে। গ্যাস রিফিল করানো হয়নি, কম্প্রেসর ১০ বছরের অফিশিয়াল ওয়ারেন্টি আছে।',
    location: 'চট্টগ্রাম',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
    views: 84,
  },

  // FURNITURE (4 products)
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
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    views: 92,
  },
  {
    id: 'prod-25',
    title: 'কাঠের আধুনিক ডাইনিং টেবিল ও ৪টি চেয়ার',
    category: 'furniture',
    price: 15000,
    condition: 'good',
    usedDuration: '১ বছর',
    description: 'টেবিলের ওপর মোটা টেম্পার্ড গ্লাস বসানো আছে। চেয়ারের কুশনগুলো সফট ফোম দিয়ে রি-প্যাডিং করা হয়েছে। অত্যন্ত পরিপাটি এবং ফ্রেশ কন্ডিশন।',
    location: 'সিলেট',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    views: 121,
  },
  {
    id: 'prod-26',
    title: '৪-ড্রয়ার মেলামাইন বোর্ড ওয়্যারড্রোব',
    category: 'furniture',
    price: 9800,
    condition: 'good',
    usedDuration: '১.৫ বছর',
    description: 'হাতিল ব্র্যান্ডের প্রিমিয়াম মেলামাইন বোর্ড ওয়্যারড্রোব। অনেক বড় এবং ড্রয়ারের চ্যানেলগুলো খুবই স্মুথলি চলে। ডাস্ট প্রোটেক্টেড সেলফ রয়েছে।',
    location: 'ঢাকা',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 49).toISOString(),
    views: 58,
  },
  {
    id: 'prod-27',
    title: 'কিং সাইজ চিটাগাং সেগুন কাঠের ডাবল খাট',
    category: 'furniture',
    price: 18000,
    condition: 'good',
    usedDuration: '২ বছর',
    description: '৬ বাই ৭ ফিট কিং সাইজ খাট। ফুলবক্স মডেল। নকশাগুলো হাতে খোদাই করে তৈরি। কাঠ অনেক ভারী এবং টেকসই। কোনো পোকা বা ঘুনপোকা নেই।',
    location: 'চট্টগ্রাম',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 13).toISOString(),
    views: 154,
  },

  // BIKE (4 products)
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
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    views: 92,
  },
  {
    id: 'prod-28',
    title: 'Suzuki Gixxer SF 150cc (FI / ABS) 2022',
    category: 'bike',
    price: 185000,
    condition: 'like_new',
    usedDuration: '১০ মাস',
    description: 'প্রথম মালিকের বাইক। মাত্র ৮,২০০ কিমি রানিং। ডুয়াল চ্যানেল এবিএস সংস্করণ। কোনো প্রকার ডেন্ট বা ক্র্যাশ গার্ডে স্ক্র্যাচ নেই। নাম পরিবর্তন যেকোনো সময় সম্ভব।',
    location: 'ঢাকা',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    views: 310,
  },
  {
    id: 'prod-29',
    title: 'Hero Splendor Plus 100cc (খুবই সাশ্রয়ী)',
    category: 'bike',
    price: 45000,
    condition: 'good',
    usedDuration: '৩ বছর',
    description: 'প্রতি লিটারে ৬০+ কিমি মাইলেজ পাওয়া যায়। ইঞ্জিনের সাউন্ড খুবই স্মুথ। অফিশিয়াল কাজে যাতায়াতের জন্য ব্যবহৃত হয়েছে। সামনের এবং পেছনের টায়ার একদম নতুন লাগানো হয়েছে।',
    location: 'খুলনা',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 85).toISOString(),
    views: 141,
  },
  {
    id: 'prod-30',
    title: 'Bajaj Pulsar 150 Neon Edition 2021',
    category: 'bike',
    price: 110000,
    condition: 'good',
    usedDuration: '২ বছর',
    description: '২৫,০০০ কিমি রানিং। ম্যাট ব্ল্যাক এবং নিয়ন গ্রিন এক্সেন্ট। কোনো কাজ নেই, শুধু নিবেন আর চালাবেন। ইঞ্জিন সিল খোলা হয়নি এখনো। পেপারস ২ বছরের জন্য আপডেট করা।',
    location: 'রংপুর',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 52).toISOString(),
    views: 128,
  },

  // SPORTS (4 products)
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
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    views: 63,
  },
  {
    id: 'prod-31',
    title: 'Cosco ফিটনেস জগিং ট্রেডমিল (ফোল্ডেবল)',
    category: 'sports',
    price: 18000,
    condition: 'good',
    usedDuration: '১ বছর',
    description: 'বাসায় ওয়ার্কআউট করার জন্য দারুণ মেশিন। ডিজিটাল স্পিড ও ক্যালরি ট্র্যাকার একদম নিখুঁত কাজ করে। ফোল্ডেবল হওয়ার কারণে খুব কম জায়গা নেয়।',
    location: 'ঢাকা',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    views: 94,
  },
  {
    id: 'prod-32',
    title: 'ডাম্বেল এবং বারবেল হোম জিম সেট (৪০ কেজি)',
    category: 'sports',
    price: 4500,
    condition: 'like_new',
    usedDuration: '৩ মাস',
    description: 'টোটাল ৪০ কেজির কাস্টম প্লেট সেট। সাথে কানেক্টিং রড দিয়ে বারবেল বানানো যায়। রাবার কোটিং করা তাই ঘরের টাইলসের কোনো ক্ষতি হবে না।',
    location: 'চট্টগ্রাম',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    views: 112,
  },
  {
    id: 'prod-33',
    title: 'Yonex Voltric 7 অরিজিনাল ব্যাডমিন্টন র্যাকেট',
    category: 'sports',
    price: 3200,
    condition: 'good',
    usedDuration: '৫ মাস',
    description: 'খুবই হালকা ওজনের এবং হাই টেনশন স্ট্রিং লাগানো আছে। স্ম্যাশ মারার জন্য অত্যন্ত জুতসই। ফুল কভারসহ দেয়া হবে। ফ্রেম একদম সোজা ও ক্র্যাক মুক্ত।',
    location: 'সিলেট',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    views: 86,
  },

  // OTHER (5 products)
  {
    id: 'prod-8',
    title: 'Canon EOS 80D DSLR ক্যামেরা (১৮-৫৫মিমি লেন্স)',
    category: 'other',
    price: 25000,
    condition: 'good',
    usedDuration: '১.৫ বছর',
    description: 'ভিডিওগ্রাফি এবং ফটোগ্রাফির জন্য সেরা ক্যামেরা। টাচস্ক্রিন ডিসপ্লে এবং ওয়াইফাই কানেক্টিভিটি আছে। চার্জার, ২ টি ব্যাটারি, ব্যাগ এবং ১৬জিবি মেমোরি কার্ড ফ্রি পাবেন। শার্টার কাউন্ট মাত্র ১২,০০০।',
    location: 'ঢাকা',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    views: 412,
  },
  {
    id: 'prod-34',
    title: 'BRB ওরিয়েন্টাল হাই স্পিড সিলিং ফ্যান',
    category: 'other',
    price: 18000 / 10, // 1800
    condition: 'good',
    usedDuration: '৮ মাস',
    description: '৫৬ ইঞ্চি সিলিং ফ্যান। বাতাস অনেক বেশি হয় এবং শব্দহীন। বাসা বদলানোর কারণে বিক্রি করে দিচ্ছি। রেগুলেটর ফ্রি দেয়া হবে।',
    location: 'খুলনা',
    sellerId: 'user-4',
    sellerName: 'মাহমুদুল হাসান',
    sellerPhone: '01911223344',
    isSellerVerified: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 75).toISOString(),
    views: 49,
  },
  {
    id: 'prod-35',
    title: 'Philips হেয়ার ড্রায়ার (1600W Fast Dry)',
    category: 'other',
    price: 1200,
    condition: 'like_new',
    usedDuration: '২ মাস',
    description: '৩টি স্পিড এবং হিট সেটিং রয়েছে। চুল শুকানোর জন্য খুবই শক্তিশালী এবং সেফ হিটিং ফিচার আছে। সম্পূর্ণ ফ্রেশ অবস্থায় আছে।',
    location: 'রাজশাহী',
    sellerId: 'user-2',
    sellerName: 'সাকিব আল হাসান',
    sellerPhone: '01712345678',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: false,
    createdAt: new Date(Date.now() - 3600000 * 92).toISOString(),
    views: 52,
  },
  {
    id: 'prod-36',
    title: 'Casio Edifice অরিজিনাল ক্রনোগ্রাফ হাতঘড়ি',
    category: 'other',
    price: 4500,
    condition: 'good',
    usedDuration: '১ বছর',
    description: '১০০% অরিজিনাল ক্যাসিও ঘড়ি। স্টেইনলেস স্টিল স্ট্র্যাপ। স্ক্র্যাচ রেজিস্ট্যান্ট গ্লাস। ওয়াটার রেজিস্ট্যান্স ১০০ মিটার পর্যন্ত। বক্স এবং ক্যাসিও অফিসিয়াল কার্ড সাথে পাবেন।',
    location: 'ঢাকা',
    sellerId: 'user-3',
    sellerName: 'নাজমুল হুদা',
    sellerPhone: '01898765432',
    isSellerVerified: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&auto=format&fit=crop'
    ],
    isApproved: true,
    isFeatured: true,
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    views: 184,
  },
];

// Curated mockup user profiles (Masked and Anonymous to respect admin privacy)
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'অ্যাডমিন (Admin)',
    email: 'admin@aponbazar.com',
    phone: '01700000000',
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

export const getFallbackImage = (category: string): string => {
  const bgColors: Record<string, string> = {
    mobile: '%23ecfdf5', // emerald-50
    laptop: '%23eff6ff', // blue-50
    tv: '%23f5f3ff', // violet-50
    fridge: '%23ecfeff', // cyan-50
    furniture: '%23fff7ed', // orange-50
    bike: '%23fef2f2', // red-50
    sports: '%23f0fdf4', // green-50
    other: '%23f8fafc', // slate-50
  };

  const textColors: Record<string, string> = {
    mobile: '%23047857', // emerald-700
    laptop: '%231d4ed8', // blue-700
    tv: '%236d28d9', // violet-700
    fridge: '%230e7490', // cyan-700
    furniture: '%23c2410c', // orange-700
    bike: '%23b91c1c', // red-700
    sports: '%2315803d', // green-700
    other: '%23334155', // slate-700
  };

  const labels: Record<string, string> = {
    mobile: 'মোবাইল',
    laptop: 'ল্যাপটপ',
    tv: 'টেলিভিশন',
    fridge: 'ফ্রিজ',
    furniture: 'আসবাবপত্র',
    bike: 'মোটরসাইকেল',
    sports: 'খেলাধুলা ও জিম',
    other: 'পণ্য',
  };

  const bg = bgColors[category] || '%23f1f5f9';
  const text = textColors[category] || '%23475569';
  const label = labels[category] || 'পণ্য ছবি';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="${bg}"/><g transform="translate(0,0)"><text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="${text}">আপনবাজার</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="18" fill="${text}">${label}</text><rect x="10%" y="8%" width="80%" height="84%" fill="none" stroke="${text}" stroke-width="3" stroke-dasharray="10,10" rx="16"/></g></svg>`;
};
