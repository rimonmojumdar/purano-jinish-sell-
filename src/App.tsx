import React from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import AddListing from './components/AddListing';
import AdminPanel from './components/AdminPanel';
import ChatSystem from './components/ChatSystem';
import UserProfile from './components/UserProfile';
import { CATEGORIES, LOCATIONS, INITIAL_PRODUCTS, MOCK_USERS, getBotResponse } from './data';
import { Product, User, Chat, ChatMessage, ViewType } from './types';
import { 
  Smartphone, Search, MapPin, Filter, X, Grid, Heart, Sparkles, 
  CheckCircle2, RefreshCw, SlidersHorizontal, AlertCircle, ChevronLeft, ChevronRight,
  ShieldCheck, HelpCircle, PhoneCall, Lock, Award
} from 'lucide-react';

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [currentUser, setCurrentUser] = React.useState<User | null>(() => {
    const saved = localStorage.getItem('aponbazar_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = React.useState<Product[]>(() => {
    const saved = localStorage.getItem('aponbazar_products');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('aponbazar_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  const [users, setUsers] = React.useState<User[]>(() => {
    const saved = localStorage.getItem('aponbazar_users');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('aponbazar_users', JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  });

  const [chats, setChats] = React.useState<Chat[]>(() => {
    const saved = localStorage.getItem('aponbazar_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDark, setIsDark] = React.useState<boolean>(() => {
    const saved = localStorage.getItem('aponbazar_theme');
    return saved ? saved === 'dark' : false;
  });

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aponbazar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aponbazar_theme', 'light');
    }
  }, [isDark]);

  // --- UI Routing and View states ---
  const [currentView, setCurrentView] = React.useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showSafetyTipsModal, setShowSafetyTipsModal] = React.useState(false);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);

  // --- MFS Payment Gateway States ---
  const [paymentConfig, setPaymentConfig] = React.useState<{
    type: 'add_funds' | 'buy_product';
    amount: number;
    productId?: string;
    productTitle?: string;
    recipientName?: string;
    recipientId?: string;
  } | null>(null);
  const [paymentStep, setPaymentStep] = React.useState<'operator' | 'details' | 'otp' | 'success'>('operator');
  const [paymentOperator, setPaymentOperator] = React.useState<'bkash' | 'nagad' | 'rocket' | null>(null);
  const [paymentPhone, setPaymentPhone] = React.useState('');
  const [paymentPin, setPaymentPin] = React.useState('');
  const [paymentAmountInput, setPaymentAmountInput] = React.useState('500');
  const [otpInput, setOtpInput] = React.useState('');
  const [systemOtpCode, setSystemOtpCode] = React.useState('');
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [activeTxId, setActiveTxId] = React.useState('');
  const [smsNotification, setSmsNotification] = React.useState<{ title: string; body: string } | null>(null);

  // --- Admin Security & System Settings ---
  const [isAdminVerified, setIsAdminVerified] = React.useState<boolean>(() => {
    const session = sessionStorage.getItem('aponbazar_admin_verified');
    return session === 'true';
  });

  const [systemSettings, setSystemSettings] = React.useState(() => {
    const saved = localStorage.getItem('aponbazar_settings');
    return saved ? JSON.parse(saved) : {
      autoApprove: false,
      bannerMessage: 'আসন্ন ঈদ উৎসব উপলক্ষে আপনবাজারে বিজ্ঞাপন বুস্ট ফিতে ৫০% ক্যাশব্যাক অফার! 🎉',
      showBanner: true,
      minNidLength: 10
    };
  });

  const [adminLogs, setAdminLogs] = React.useState<any[]>(() => {
    const saved = localStorage.getItem('aponbazar_admin_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'log-1',
        type: 'system',
        message: 'আপনবাজার অ্যাডমিন মডারেশন সিস্টেম সফলভাবে চালু হয়েছে।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('aponbazar_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  React.useEffect(() => {
    localStorage.setItem('aponbazar_admin_logs', JSON.stringify(adminLogs));
  }, [adminLogs]);

  const handleAddAdminLog = (type: string, message: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };
    setAdminLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  // --- Filtering & Sorting States ---
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedLocation, setSelectedLocation] = React.useState('all');
  const [conditionFilter, setConditionFilter] = React.useState<string>('all');
  const [maxPriceFilter, setMaxPriceFilter] = React.useState<number>(500000);
  const [onlyVerified, setOnlyVerified] = React.useState(false);
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<string>('default');

  const [searchHistory, setSearchHistory] = React.useState<string[]>(() => {
    const saved = localStorage.getItem('aponbazar_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('aponbazar_search_history', JSON.stringify(next));
      return next;
    });
  };

  // --- Banner Slider States & Configurations ---
  const [currentSlideIdx, setCurrentSlideIdx] = React.useState(0);
  const [isBannerPaused, setIsBannerPaused] = React.useState(false);

  const bannerSlides = React.useMemo(() => [
    {
      id: 1,
      badge: 'ধামাকা অফার 💥',
      badgeColor: 'bg-amber-500/25 border-amber-500/40 text-amber-300',
      message: 'আসন্ন উৎসব উপলক্ষে আপনবাজারে বিজ্ঞাপন বুস্ট ফি-তে ৫০% ক্যাশব্যাক অফার! 🎉',
      actionText: 'বুস্ট করে ৫ গুণ ভিউ পান 🚀',
      actionView: 'profile'
    },
    {
      id: 2,
      badge: 'নিরাপত্তা সতর্কবার্তা 🛡️',
      badgeColor: 'bg-red-500/25 border-red-500/40 text-red-300 animate-pulse',
      message: 'নিরাপদ থাকুন! লেনদেন করার সময় কোনো গোপন পিন বা পাসওয়ার্ড কারও সাথে শেয়ার করবেন না।',
      actionText: 'নিরাপত্তা টিপস জানুন 💡',
      actionView: 'safety'
    },
    {
      id: 3,
      badge: 'ভেরিফিকেশন বোনাস 💎',
      badgeColor: 'bg-emerald-500/25 border-emerald-500/40 text-emerald-300',
      message: 'জাতীয় পরিচয়পত্র (NID) দিয়ে প্রোফাইল ভেরিফাই করুন এবং সাথে সাথেই ১,০০০ টাকা ফ্রি বোনাস বুঝে নিন!',
      actionText: 'ভেরিফাই প্রোফাইল 💸',
      actionView: 'profile'
    }
  ], []);

  React.useEffect(() => {
    if (isBannerPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIdx(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isBannerPaused, bannerSlides.length]);

  // --- System Notifications & Wallet Ledgers ---
  const [notifications, setNotifications] = React.useState<any[]>(() => {
    const saved = localStorage.getItem('aponbazar_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif-1',
        title: 'আপনবাজারে স্বাগতম! 🌟',
        message: 'আপনার প্রোফাইল ভেরিফাই করে ১,০০০ টাকা ফ্রি ওয়ালেট বোনাস বুঝে নিন!',
        type: 'system',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        linkToView: 'profile'
      }
    ];
  });

  const [walletTransactions, setWalletTransactions] = React.useState<any[]>(() => {
    const saved = localStorage.getItem('aponbazar_transactions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'tx-1',
        amount: 1000,
        description: 'সদস্যপদ খোলার উপহার বোনাস 🎁',
        timestamp: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        type: 'credit'
      }
    ];
  });

  const addNotification = (title: string, message: string, type: 'message' | 'approval' | 'system' | 'wallet', linkToView?: any) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      linkToView
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addWalletTransaction = (amount: number, description: string, type: 'credit' | 'debit') => {
    const newTx = {
      id: `tx-${Date.now()}`,
      amount,
      description,
      timestamp: new Date().toLocaleDateString('bn-BD') + ' ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setWalletTransactions(prev => [newTx, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // --- Sync State changes to LocalStorage ---
  React.useEffect(() => {
    localStorage.setItem('aponbazar_products', JSON.stringify(products));
  }, [products]);

  React.useEffect(() => {
    localStorage.setItem('aponbazar_users', JSON.stringify(users));
  }, [users]);

  React.useEffect(() => {
    localStorage.setItem('aponbazar_chats', JSON.stringify(chats));
  }, [chats]);

  React.useEffect(() => {
    localStorage.setItem('aponbazar_notifications', JSON.stringify(notifications));
  }, [notifications]);

  React.useEffect(() => {
    localStorage.setItem('aponbazar_transactions', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aponbazar_user', JSON.stringify(currentUser));
      // update user in main users array as well
      setUsers(prev => prev.map(u => u.id === currentUser.id ? currentUser : u));
    } else {
      localStorage.removeItem('aponbazar_user');
    }
  }, [currentUser]);

  // --- Auto Seeding Default Chat if user logs in to make it lively ---
  React.useEffect(() => {
    if (currentUser && chats.length === 0) {
      // Find a product that does not belong to user to simulate buying
      const foreignProd = products.find(p => p.sellerId !== currentUser.id);
      if (foreignProd) {
        const seedChat: Chat = {
          id: `chat-seed-${Date.now()}`,
          buyerId: currentUser.id,
          buyerName: currentUser.name,
          buyerAvatar: currentUser.avatar,
          sellerId: foreignProd.sellerId,
          sellerName: foreignProd.sellerName,
          sellerAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${foreignProd.sellerName}`,
          productId: foreignProd.id,
          productTitle: foreignProd.title,
          productPrice: foreignProd.price,
          productImage: foreignProd.imageUrls[0],
          messages: [
            {
              id: 'msg-seed-1',
              senderId: foreignProd.sellerId,
              text: `আসসালামু আলাইকুম, আমি ${foreignProd.sellerName} বলছি। পণ্যটি বিষয়ে আপনার কোনো প্রশ্ন থাকলে নিচে চ্যাটে লিখতে পারেন।`,
              timestamp: '১০:৩০ AM'
            }
          ],
          updatedAt: new Date().toISOString()
        };
        setChats([seedChat]);
      }
    }
  }, [currentUser, chats.length, products]);

  // --- Authentication Handlers ---
  const handleLoginSuccess = (user: User) => {
    // Check if user is banned
    const dbUser = users.find(u => u.email === user.email);
    if (dbUser?.isBanned) {
      alert('দুঃখিত! এই অ্যাকাউন্টটি প্ল্যাটফর্ম পলিসি ভঙ্গের কারণে ব্যান করা হয়েছে।');
      return;
    }

    // Add user to users list if new
    if (!users.some(u => u.email === user.email)) {
      setUsers(prev => [...prev, user]);
    } else if (dbUser) {
      // Restore existing user database values (like balance, verification status)
      user = { ...user, ...dbUser };
    }

    setCurrentUser(user);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    setSelectedProduct(null);
  };

  const handleOpenLoginAndRedirect = (targetView?: ViewType) => {
    setShowLoginModal(true);
  };

  // --- Product Action Handlers ---
  const handleAddProduct = (newProduct: Product) => {
    const isAutoApproved = systemSettings.autoApprove;
    const finalProduct = { ...newProduct, isApproved: isAutoApproved };
    setProducts(prev => [finalProduct, ...prev]);
    handleAddAdminLog(
      'product_add',
      `${newProduct.sellerName} একটি নতুন বিজ্ঞাপন (${newProduct.title}) পোস্ট করেছেন। (${isAutoApproved ? 'স্বয়ংক্রিয়ভাবে অনুমোদিত' : 'অ্যাডমিন মডারেশন পেন্ডিং'})`
    );
  };

  const handleApproveProduct = (productId: string) => {
    const matched = products.find(p => p.id === productId);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isApproved: true } : p));
    if (matched) {
      handleAddAdminLog('product_approve', `বিজ্ঞাপন অনুমোদন করা হয়েছে: "${matched.title}" (বিক্রেতা: ${matched.sellerName})`);
      addNotification(
        'বিজ্ঞাপন অনুমোদিত! ✅',
        `আপনার "${matched.title.slice(0, 25)}..." বিজ্ঞাপনটি সফলভাবে আপনবাজারে লাইভ করা হয়েছে।`,
        'approval',
        'profile'
      );
    }
  };

  const handleRejectProduct = (productId: string) => {
    const matched = products.find(p => p.id === productId);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isApproved: false } : p));
    if (matched) {
      handleAddAdminLog('product_reject', `বিজ্ঞাপন সাময়িকভাবে হাইড/রিজেক্ট করা হয়েছে: "${matched.title}" (বিক্রেতা: ${matched.sellerName})`);
      addNotification(
        'বিজ্ঞাপন প্রত্যাখ্যাত! ⚠️',
        `আপনার "${matched.title.slice(0, 25)}..." বিজ্ঞাপনটি মডারেশনের শর্ত পূরণ করতে পারেনি।`,
        'system',
        'profile'
      );
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const matched = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (matched) {
      handleAddAdminLog('product_delete', `বিজ্ঞাপন সম্পূর্ণ ডিলিট করা হয়েছে: "${matched.title}" (বিক্রেতা: ${matched.sellerName})`);
    }
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
      setCurrentView('home');
    }
  };

  const handleBoostProduct = (productId: string) => {
    if (!currentUser || currentUser.balance < 150) return;

    // Deduct fee and update product status
    setCurrentUser(prev => prev ? { ...prev, balance: prev.balance - 150 } : null);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isFeatured: true } : p));
    addWalletTransaction(150, 'বিজ্ঞাপন বুস্টিং ফি (Featured Boost)', 'debit');
    addNotification(
      'বিজ্ঞাপন বুস্ট সফল! 🚀',
      `আপনার লিস্টিংটি ৩ দিনের জন্য Featured Listings-এ সবার উপরে বুস্ট করা হয়েছে।`,
      'wallet',
      'profile'
    );
  };

  const handleAddFunds = () => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    handleInitiatePayment({ type: 'add_funds', amount: 500 });
  };

  const handleVerifySeller = () => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, isVerified: true, balance: prev.balance + 1000 } : null);
    addWalletTransaction(1000, 'প্রোফাইল ভেরিফিকেশন উপহার বোনাস 💎', 'credit');
    addNotification(
      'প্রোফাইল ভেরিফিকেশন সফল! 🏅',
      `আপনার এনআইডি ভেরিফাইড হয়েছে এবং ১,০০০ টাকা ফ্রি ওয়ালেট বোনাস যোগ করা হয়েছে।`,
      'wallet',
      'profile'
    );
  };

  const handleUpdateProfile = (updatedFields: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...updatedFields } : null);
  };

  // --- MFS Payment Handlers ---
  const handleInitiatePayment = (config: {
    type: 'add_funds' | 'buy_product';
    amount: number;
    productId?: string;
    productTitle?: string;
    recipientName?: string;
    recipientId?: string;
  }) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    setPaymentConfig(config);
    setPaymentStep('operator');
    setPaymentOperator(null);
    setPaymentPhone(currentUser.phone || '');
    setPaymentPin('');
    setPaymentAmountInput(String(config.amount));
    setOtpInput('');
    setSystemOtpCode('');
    setIsProcessingPayment(false);
    setActiveTxId('');
    setSmsNotification(null);
  };

  const handleConfirmPaymentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentOperator) {
      alert('দয়া করে একটি মোবাইল ব্যাংকিং অপারেটর (বিকাশ, নগদ বা রকেট) সিলেক্ট করুন।');
      return;
    }
    if (paymentPhone.length !== 11 || !paymentPhone.startsWith('01')) {
      alert('দয়া করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: ০১৭xxxxxxxx)।');
      return;
    }
    if (paymentPin.length < 4) {
      alert('দয়া করে সঠিক ৪ বা ৫ ডিজিটের গোপন পিন দিন।');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      // Generate simulated OTP
      const randomOtp = String(Math.floor(100000 + Math.random() * 900000));
      setSystemOtpCode(randomOtp);
      setPaymentStep('otp');

      const opName = paymentOperator === 'bkash' ? 'bKash' : paymentOperator === 'nagad' ? 'Nagad' : 'Rocket';
      const finalAmount = paymentConfig?.type === 'add_funds' ? paymentAmountInput : (paymentConfig?.amount || 0);

      // Trigger SMS Notification banner
      setSmsNotification({
        title: `💬 SMS from ${opName}`,
        body: `AponBazar Payment Request OTP: ${randomOtp} for authorizing BDT ${finalAmount}. Do NOT share this OTP with anyone.`
      });

      // Auto clear after 12 seconds
      setTimeout(() => {
        setSmsNotification(null);
      }, 12000);
    }, 1200);
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput !== systemOtpCode) {
      alert('ভুল ওটিপি (OTP) কোড লিখেছেন! দয়া করে আবার টাইপ করুন।');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const generatedTxId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setActiveTxId(generatedTxId);
      setPaymentStep('success');
      setSmsNotification(null);

      const opName = paymentOperator === 'bkash' ? 'বিকাশ' : paymentOperator === 'nagad' ? 'নগদ' : 'রকেট';
      const parsedAmount = paymentConfig?.type === 'add_funds' ? Number(paymentAmountInput) : (paymentConfig?.amount || 0);

      if (paymentConfig?.type === 'add_funds') {
        // Recharge User's Local Wallet
        setCurrentUser(prev => prev ? { ...prev, balance: prev.balance + parsedAmount } : null);
        addWalletTransaction(parsedAmount, `ওয়ালেট রিচার্জ (${opName})`, 'credit');
        addNotification(
          'ওয়ালেট ফান্ড সফলভাবে যুক্ত হয়েছে! 💰',
          `আপনার ওয়ালেট ব্যালেন্সে ${opName}-এর মাধ্যমে ৳${parsedAmount} যোগ করা হয়েছে। ট্রানজেকশন আইডি: ${generatedTxId}`,
          'wallet',
          'profile'
        );
      } else if (paymentConfig?.type === 'buy_product' && paymentConfig.productId) {
        // Direct checkout of product
        const pId = paymentConfig.productId;
        const pTitle = paymentConfig.productTitle || '';
        const sId = paymentConfig.recipientId || '';
        const sName = paymentConfig.recipientName || '';
        const price = paymentConfig.amount;

        // 1. Mark product as sold
        setProducts(prev => prev.map(p => p.id === pId ? { ...p, isSold: true, buyerId: currentUser.id } : p));
        
        // 2. Add Debit entry for buyer
        addWalletTransaction(price, `পণ্য ক্রয়: "${pTitle.slice(0, 20)}..." (MFS)`, 'debit');

        // 3. Add Credit entry for seller (minus 2% platform transaction fee)
        const sellerEarnings = Math.round(price * 0.98);
        setUsers(prev => prev.map(u => {
          if (u.id === sId) {
            return { ...u, balance: u.balance + sellerEarnings };
          }
          return u;
        }));

        // 4. Send chat message dynamically inside buyer-seller chat context
        const existingChat = chats.find(c => c.productId === pId && ((c.buyerId === currentUser.id && c.sellerId === sId) || (c.buyerId === sId && c.sellerId === currentUser.id)));
        const timestampText = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
        
        const systemMsg: ChatMessage = {
          id: `msg-system-pay-${Date.now()}`,
          senderId: currentUser.id,
          text: `[লেনদেন সফল] আমি ${opName}-এর মাধ্যমে এই পণ্যটির মূল্য BDT ৳${price} সরাসরি পেমেন্ট সম্পন্ন করেছি! ট্রানজেকশন আইডি: ${generatedTxId}। দয়া করে হ্যান্ডওভার ও ডেলিভারি নিশ্চিত করুন। 🤝`,
          timestamp: timestampText
        };

        if (existingChat) {
          setChats(prev => prev.map(c => c.id === existingChat.id ? {
            ...c,
            messages: [...c.messages, systemMsg],
            updatedAt: new Date().toISOString()
          } : c));
        } else {
          const newChat: Chat = {
            id: `chat-${Date.now()}`,
            buyerId: currentUser.id,
            buyerName: currentUser.name,
            buyerAvatar: currentUser.avatar,
            sellerId: sId,
            sellerName: sName,
            sellerAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${sName}`,
            productId: pId,
            productTitle: pTitle,
            productPrice: price,
            productImage: selectedProduct?.imageUrls[0] || '',
            messages: [systemMsg],
            updatedAt: new Date().toISOString()
          };
          setChats(prev => [newChat, ...prev]);
        }

        // 5. Send Notification to seller
        addNotification(
          'পণ্য বিক্রি সম্পন্ন হয়েছে! 🎉',
          `আপনার "${pTitle.slice(0, 25)}..." পণ্যটি ${currentUser.name} কিনেছেন এবং ${opName}-এর মাধ্যমে ৳${price} পেমেন্ট করেছেন। আপনার একাউন্টে ৳${sellerEarnings} যুক্ত করা হয়েছে।`,
          'wallet',
          'profile'
        );

        // 6. Admin Panel logs
        handleAddAdminLog(
          'product_sale',
          `${currentUser.name} ${sName} এর "${pTitle}" পণ্যটি ৳${price} টাকায় সরাসরি কিনে নিয়েছেন (${opName} পেমেন্ট)`
        );

        // Sync view state if open
        if (selectedProduct?.id === pId) {
          setSelectedProduct(prev => prev ? { ...prev, isSold: true, buyerId: currentUser.id } : null);
        }
      }
    }, 1500);
  };

  const handleToggleSaveProduct = (productId: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    const currentSaved = currentUser.savedProductIds || [];
    let updatedSaved: string[];
    if (currentSaved.includes(productId)) {
      updatedSaved = currentSaved.filter(id => id !== productId);
    } else {
      updatedSaved = [...currentSaved, productId];
    }

    const updatedUser = { ...currentUser, savedProductIds: updatedSaved };
    setCurrentUser(updatedUser);
  };

  const handleAddReview = (sellerId: string, rating: number, comment: string) => {
    if (!currentUser) return;

    const newReview = {
      id: `review-${Date.now()}`,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => prev.map(u => {
      if (u.id === sellerId) {
        const currentReviews = u.sellerReviews || [];
        return {
          ...u,
          sellerReviews: [newReview, ...currentReviews]
        };
      }
      return u;
    }));

    // Sync current user state if they review their own profile or if needed
    if (currentUser.id === sellerId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        sellerReviews: [newReview, ...(prev.sellerReviews || [])]
      } : null);
    }
  };

  // --- User Moderator Actions ---
  const handleToggleUserBan = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
    if (targetUser) {
      const action = !targetUser.isBanned ? 'ব্যান (Banned)' : 'আনব্যান (Unbanned)';
      handleAddAdminLog('user_ban', `ইউজারকে ${action} করা হয়েছে: ${targetUser.name} (${targetUser.email})`);
    }
    // If banned user is logged in right now, log them out
    if (currentUser?.id === userId) {
      handleLogout();
    }
  };

  const handleToggleUserVerify = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    if (targetUser) {
      const action = !targetUser.isVerified ? 'ভেরিফাইড ব্যাজ দেওয়া হয়েছে' : 'ভেরিফাইড ব্যাজ তুলে নেওয়া হয়েছে';
      handleAddAdminLog('user_verify', `${targetUser.name} ইউজারকে ${action}`);
    }
    // Sync if currently logged in
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, isVerified: !prev.isVerified } : null);
    }
  };

  // --- Chat/Messaging Actions ---
  const handleStartChat = (product: Product, offerPrice?: number) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    // Check if conversation already exists
    const existingChat = chats.find(c => c.productId === product.id && c.buyerId === currentUser.id);

    if (existingChat) {
      if (offerPrice) {
        // Update offer price on existing chat and send an offer message
        const timestampText = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
        const offerMsgText = `[দামাদামি অফার] আমি এই পণ্যটি ৳${offerPrice.toLocaleString('bn-BD')} টাকায় কিনতে চাচ্ছি। আপনি কি রাজি আছেন? 🤝`;
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          text: offerMsgText,
          timestamp: timestampText
        };
        setChats(prev => prev.map(c => c.id === existingChat.id ? {
          ...c,
          offerPrice,
          offerStatus: 'pending',
          messages: [...c.messages, newMsg],
          updatedAt: new Date().toISOString()
        } : c));
      }
      setActiveChatId(existingChat.id);
      setCurrentView('chat');
      return;
    }

    // Create a new chat
    const timestampText = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    const welcomeText = offerPrice 
      ? `[দামাদামি অফার] আসসালামু আলাইকুম! আমি আপনার "${product.title}" পণ্যটি ৳${offerPrice.toLocaleString('bn-BD')} টাকায় কিনতে চাচ্ছি। আপনি কি রাজি আছেন? 🤝`
      : `আসসালামু আলাইকুম! আমি আপনার "${product.title}" পণ্যটি কিনতে আগ্রহী। পণ্যটি কি এখনো বিক্রির জন্য অ্যাভেলেবল আছে?`;

    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${product.sellerName}`,
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.imageUrls[0],
      offerPrice: offerPrice || undefined,
      offerStatus: offerPrice ? 'pending' : undefined,
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          senderId: currentUser.id,
          text: welcomeText,
          timestamp: timestampText
        }
      ],
      updatedAt: new Date().toISOString()
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setCurrentView('chat');
  };

  const handleAcceptOffer = (chatId: string) => {
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        const timestampText = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
        const sysMsg: ChatMessage = {
          id: `msg-system-accept-${Date.now()}`,
          senderId: c.sellerId,
          text: `[অফার গৃহীত] অভিনন্দন! আমি আপনার ৳${c.offerPrice?.toLocaleString('bn-BD')} টাকার অফারটি গ্রহণ করেছি। আপনি এখন সরাসরি পেমেন্ট গেটওয়ের মাধ্যমে কিনতে পারেন। 🤝`,
          timestamp: timestampText
        };
        addNotification(
          'অফার গৃহীত হয়েছে! 🎉',
          `${c.sellerName} আপনার ৳${c.offerPrice} অফারটি গ্রহণ করেছেন। দ্রুত পেমেন্ট সম্পন্ন করুন!`,
          'wallet',
          'chat'
        );
        return {
          ...c,
          offerStatus: 'accepted',
          messages: [...c.messages, sysMsg]
        };
      }
      return c;
    }));
  };

  const handleDeclineOffer = (chatId: string) => {
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        const timestampText = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
        const sysMsg: ChatMessage = {
          id: `msg-system-decline-${Date.now()}`,
          senderId: c.sellerId,
          text: `[অফার প্রত্যাখ্যাত] দুঃখিত, আমি আপনার ৳${c.offerPrice?.toLocaleString('bn-BD')} টাকার অফারটি গ্রহণ করতে পারছি না। দয়া করে অন্য কোনো মূল্য অফার করুন।`,
          timestamp: timestampText
        };
        addNotification(
          'অফার প্রত্যাখ্যাত হয়েছে! ⚠️',
          `${c.sellerName} আপনার ৳${c.offerPrice} অফারটি প্রত্যাখ্যান করেছেন।`,
          'system',
          'chat'
        );
        return {
          ...c,
          offerStatus: 'declined',
          messages: [...c.messages, sysMsg]
        };
      }
      return c;
    }));
  };

  const handleSendMessage = (chatId: string, text: string) => {
    if (!currentUser) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        // Trigger simulated automatic reply from seller
        setTimeout(() => {
          const sellerName = c.sellerName;
          const replyText = getBotResponse(sellerName, text);
          const botMsg: ChatMessage = {
            id: `msg-bot-${Date.now()}`,
            senderId: c.sellerId,
            text: replyText,
            timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
          };

          setChats(currentChats => currentChats.map(item => {
            if (item.id === chatId) {
              addNotification(
                `${sellerName} একটি মেসেজ পাঠিয়েছেন 💬`,
                `"${replyText.slice(0, 35)}${replyText.length > 35 ? '...' : ''}"`,
                'message',
                'chat'
              );
              return {
                ...item,
                messages: [...item.messages, botMsg],
                updatedAt: new Date().toISOString()
              };
            }
            return item;
          }));
        }, 1200);

        return {
          ...c,
          messages: [...c.messages, newMsg],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  // --- Navigation & Product View tracking ---
  const handleViewProduct = (product: Product) => {
    // Increment view count
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, views: p.views + 1 } : p));
    setSelectedProduct({ ...product, views: product.views + 1 });
    setCurrentView('details');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setConditionFilter('all');
    setMaxPriceFilter(500000);
    setOnlyVerified(false);
    setSortBy('default');
  };

  // --- Filtering Products Logic ---
  const filteredProducts = products.filter(prod => {
    // If product is approved by admin, or belongs to currently logged-in user
    const isVisible = prod.isApproved || prod.sellerId === currentUser?.id;
    if (!isVisible) return false;

    // Search input match
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Match
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;

    // Location Match
    const matchesLocation = selectedLocation === 'all' || prod.location === selectedLocation;

    // Price Match
    const matchesPrice = prod.price <= maxPriceFilter;

    // Condition Match
    const matchesCondition = conditionFilter === 'all' || prod.condition === conditionFilter;

    // Verified match
    const matchesVerified = !onlyVerified || prod.isSellerVerified;

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesCondition && matchesVerified;
  });

  // Sort: Featured/Promoted products go to the top, then newest first unless a custom sorting is selected
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'default') {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'views') return b.views - a.views;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 dark:bg-gray-950 dark:text-gray-200 flex flex-col font-sans transition-colors duration-300">
      
      {/* Floating Simulated SMS Push Notification Banner */}
      {smsNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-gray-900/95 text-white p-4 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-6 duration-300 flex gap-3.5 items-start">
          <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-500/25 text-emerald-400 flex items-center justify-center text-lg animate-pulse border border-emerald-500/20">
            💬
          </div>
          <div className="flex-grow space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-xs tracking-wider text-emerald-400 uppercase">{smsNotification.title}</span>
              <span className="text-[9px] text-gray-400 font-extrabold">NOW</span>
            </div>
            <p className="text-[11px] leading-relaxed font-semibold text-gray-100 select-all">{smsNotification.body}</p>
          </div>
          <button 
            onClick={() => setSmsNotification(null)}
            className="text-gray-400 hover:text-white shrink-0 p-1 rounded-full hover:bg-white/10 cursor-pointer active:scale-95"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Navbar Component */}
      <Navbar 
        currentUser={currentUser} 
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setSelectedProduct(null);
        }}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
      />

      {/* Dynamic Announcement Banner Slider */}
      {systemSettings.showBanner && (
        <div 
          onMouseEnter={() => setIsBannerPaused(true)}
          onMouseLeave={() => setIsBannerPaused(false)}
          className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 dark:from-black dark:via-emerald-950/80 dark:to-black text-white py-3.5 px-4 sm:px-12 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-500/20 group/banner transition-all duration-300"
        >
          {/* Subtle glowing lights overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-transparent to-transparent pointer-events-none animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

          {/* Left Navigation Chevron Button (Visible on hover on desktop) */}
          <button
            onClick={() => setCurrentSlideIdx(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white p-1.5 rounded-xl border border-white/5 transition-all cursor-pointer opacity-0 group-hover/banner:opacity-100 hidden sm:flex items-center justify-center active:scale-90"
            title="পূর্ববর্তী স্লাইড"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Active Banner Slide Content Wrapper */}
          <div 
            key={currentSlideIdx} 
            className="relative flex flex-col lg:flex-row items-center gap-3.5 mx-auto text-center lg:text-left overflow-hidden w-full max-w-5xl justify-center animate-in fade-in slide-in-from-right-3 duration-300 pb-1.5 lg:pb-0"
          >
            {/* Glowing badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${bannerSlides[currentSlideIdx].badgeColor}`}>
                <Sparkles className="h-3 w-3 animate-pulse" />
                {bannerSlides[currentSlideIdx].badge}
              </span>
            </div>
            
            {/* Banner Main Message */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 min-w-0">
              <p className="text-xs sm:text-sm font-extrabold tracking-wide text-emerald-50 drop-shadow-sm leading-relaxed">
                {bannerSlides[currentSlideIdx].message}
              </p>
              
              {/* Dynamic Action Button based on Slide */}
              <button 
                onClick={() => {
                  if (bannerSlides[currentSlideIdx].actionView === 'safety') {
                    setShowSafetyTipsModal(true);
                  } else if (bannerSlides[currentSlideIdx].actionView === 'profile') {
                    if (currentUser) {
                      setCurrentView('profile');
                    } else {
                      setShowLoginModal(true);
                    }
                  } else if (bannerSlides[currentSlideIdx].actionView === 'chat') {
                    if (currentUser) {
                      setCurrentView('chat');
                    } else {
                      setShowLoginModal(true);
                    }
                  }
                }}
                className="inline-flex items-center gap-1 text-xs font-black text-amber-400 hover:text-amber-300 hover:scale-102 transition-all cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1 rounded-xl border border-amber-400/20 shadow-xs shrink-0"
              >
                {bannerSlides[currentSlideIdx].actionText}
              </button>
            </div>
          </div>

          {/* Right Navigation Chevron Button (Visible on hover on desktop) */}
          <button
            onClick={() => setCurrentSlideIdx(prev => (prev + 1) % bannerSlides.length)}
            className="absolute right-12 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white p-1.5 rounded-xl border border-white/5 transition-all cursor-pointer opacity-0 group-hover/banner:opacity-100 hidden sm:flex items-center justify-center active:scale-90"
            title="পরবর্তী স্লাইড"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIdx(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlideIdx === index ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                title={`স্লাইড ${index + 1}`}
              />
            ))}
          </div>

          {/* Close Banner Button */}
          <button 
            onClick={() => setSystemSettings(prev => ({ ...prev, showBanner: false }))}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white p-1.5 hover:bg-white/10 rounded-xl transition-all cursor-pointer border border-white/5 active:scale-95"
            title="ঘোষণাটি বন্ধ করুন"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content Stage */}
      <main className="flex-grow">

        {/* --- INTERACTIVE MFS PAYMENT MODAL GATEWAY --- */}
        {paymentConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
              
              {/* Top Branded Bar */}
              <div className={`p-4 text-white text-center font-black text-sm flex items-center justify-between transition-colors duration-300 ${
                paymentOperator === 'bkash' ? 'bg-[#D12053]' : 
                paymentOperator === 'nagad' ? 'bg-[#EC1C24]' : 
                paymentOperator === 'rocket' ? 'bg-[#8C3494]' : 
                'bg-gradient-to-r from-emerald-800 to-teal-800'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🛡️</span>
                  <span className="tracking-tight">নিরাপদ পেমেন্ট গেটওয়ে</span>
                </div>
                <button 
                  onClick={() => setPaymentConfig(null)}
                  className="rounded-full p-1 bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Stepper indicators */}
              <div className="bg-gray-50 dark:bg-gray-950/40 border-b border-gray-100 dark:border-gray-800/60 px-6 py-3 flex justify-between text-[10px] font-bold text-gray-400">
                <span className={paymentStep === 'operator' ? 'text-emerald-600 dark:text-emerald-400' : ''}>১. অপারেটর</span>
                <span className={paymentStep === 'details' ? 'text-emerald-600 dark:text-emerald-400' : ''}>২. পিন নম্বর</span>
                <span className={paymentStep === 'otp' ? 'text-emerald-600 dark:text-emerald-400' : ''}>৩. ওটিপি কোড</span>
                <span className={paymentStep === 'success' ? 'text-emerald-600 dark:text-emerald-400' : ''}>৪. সফল</span>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                
                {/* Loader Screen */}
                {isProcessingPayment && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin" />
                    <div className="text-center">
                      <p className="text-xs font-black text-gray-800 dark:text-gray-100">সার্ভার প্রসেসিং হচ্ছে...</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">দয়া করে ব্রাউজার রিলোড বা বন্ধ করবেন না।</p>
                    </div>
                  </div>
                )}

                {/* STEP 1: OPERATOR SELECTOR */}
                {!isProcessingPayment && paymentStep === 'operator' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">মোবাইল ব্যাংকিং গেটওয়ে সিলেক্ট করুন</h3>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Select payment provider</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 pt-2">
                      {/* bKash card */}
                      <button
                        onClick={() => {
                          setPaymentOperator('bkash');
                          setPaymentStep('details');
                        }}
                        className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#D12053]/50 bg-white dark:bg-gray-855 hover:bg-pink-500/5 transition-all cursor-pointer group text-left active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-[#D12053] flex items-center justify-center font-black text-white text-xs shadow-md">
                            bKash
                          </div>
                          <div>
                            <span className="block font-black text-xs text-gray-800 dark:text-gray-100">বিকাশ পেমেন্ট</span>
                            <span className="text-[9px] text-gray-400 font-bold">ইনস্ট্যান্ট বিকাশ পেমেন্ট গেটওয়ে</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-pink-600 group-hover:translate-x-1 transition-transform">→</span>
                      </button>

                      {/* Nagad card */}
                      <button
                        onClick={() => {
                          setPaymentOperator('nagad');
                          setPaymentStep('details');
                        }}
                        className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#EC1C24]/50 bg-white dark:bg-gray-855 hover:bg-orange-500/5 transition-all cursor-pointer group text-left active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-[#EC1C24] flex items-center justify-center font-black text-white text-xs shadow-md">
                            Nagad
                          </div>
                          <div>
                            <span className="block font-black text-xs text-gray-800 dark:text-gray-100">নগদ পেমেন্ট</span>
                            <span className="text-[9px] text-gray-400 font-bold">ইনস্ট্যান্ট নগদ পেমেন্ট গেটওয়ে</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-orange-600 group-hover:translate-x-1 transition-transform">→</span>
                      </button>

                      {/* Rocket card */}
                      <button
                        onClick={() => {
                          setPaymentOperator('rocket');
                          setPaymentStep('details');
                        }}
                        className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#8C3494]/50 bg-white dark:bg-gray-855 hover:bg-purple-500/5 transition-all cursor-pointer group text-left active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-[#8C3494] flex items-center justify-center font-black text-white text-xs shadow-md">
                            Rocket
                          </div>
                          <div>
                            <span className="block font-black text-xs text-gray-800 dark:text-gray-100">রকেট পেমেন্ট</span>
                            <span className="text-[9px] text-gray-400 font-bold">রকেট মোবাইল গেটওয়ে ভায়া ডিবিবিএল</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-purple-600 group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>

                    <div className="rounded-xl bg-gray-50 dark:bg-gray-850 p-3 flex gap-2 items-start mt-4">
                      <span className="text-sm shrink-0">ℹ️</span>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal font-semibold">
                        আপনবাজার পেমেন্ট সিস্টেম সম্পূর্ণ সিমুলেটেড এবং নিরাপদ। কোনো বাস্তব টাকা লেনদেন হবে না, কিন্তু রিয়েলটাইম ডাটা আপডেট হবে।
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 2: DETAILS ENTRY */}
                {!isProcessingPayment && paymentStep === 'details' && (
                  <form onSubmit={handleConfirmPaymentDetails} className="space-y-4">
                    {/* Header with Back button */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setPaymentStep('operator')}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        পিছনে যান
                      </button>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        paymentOperator === 'bkash' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30' :
                        paymentOperator === 'nagad' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30'
                      }`}>
                        {paymentOperator === 'bkash' ? 'bKash' : paymentOperator === 'nagad' ? 'Nagad' : 'Rocket'} Active
                      </span>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-2xl border border-gray-100/50 dark:border-gray-800 text-center space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        {paymentConfig.type === 'buy_product' ? 'পণ্য ক্রয় পেমেন্ট' : 'ওয়ালেট ফান্ড রিচার্জ'}
                      </span>
                      <p className="text-xs font-black text-gray-800 dark:text-white truncate">
                        {paymentConfig.type === 'buy_product' ? paymentConfig.productTitle : 'ওয়ালেট ব্যালেন্স রিচার্জ'}
                      </p>
                      {paymentConfig.type === 'buy_product' && (
                        <p className="text-[10px] text-gray-400 font-bold">বিক্রেতা: {paymentConfig.recipientName}</p>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3.5">
                      {/* Mobile Number */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-gray-500 dark:text-gray-400 mb-1.5">
                          ১১-ডিজিটের একাউন্ট নাম্বার
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">📱</span>
                          <input
                            type="text"
                            maxLength={11}
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="যেমন: ০১৭xxxxxxxx"
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 py-3 pl-10 pr-4 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:outline-hidden dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      {/* Price/Amount */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-gray-500 dark:text-gray-400 mb-1.5">
                          টাকার পরিমাণ (BDT)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-gray-400">৳</span>
                          <input
                            type="number"
                            value={paymentConfig.type === 'buy_product' ? paymentConfig.amount : paymentAmountInput}
                            onChange={(e) => paymentConfig.type === 'add_funds' && setPaymentAmountInput(e.target.value)}
                            disabled={paymentConfig.type === 'buy_product'}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 py-3 pl-10 pr-4 text-xs font-black text-gray-800 focus:outline-hidden dark:text-white disabled:opacity-75 disabled:text-gray-500"
                            required
                          />
                        </div>
                        {paymentConfig.type === 'add_funds' && (
                          <div className="flex gap-2 mt-2">
                            {['100', '500', '1000', '2000'].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setPaymentAmountInput(val)}
                                className={`flex-1 rounded-lg py-1.5 text-[10px] font-black transition-all cursor-pointer ${
                                  paymentAmountInput === val 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                ৳{val}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Secret PIN */}
                      <div>
                        <label className="block text-[11px] font-extrabold text-gray-500 dark:text-gray-400 mb-1.5">
                          গোপন পিন নাম্বার (PIN)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔒</span>
                          <input
                            type="password"
                            maxLength={5}
                            value={paymentPin}
                            onChange={(e) => setPaymentPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="৪ বা ৫ ডিজিটের গোপন পিন"
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 py-3 pl-10 pr-4 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:outline-hidden dark:text-white"
                            required
                          />
                        </div>
                        <span className="text-[9px] text-red-500/90 font-bold block mt-1">🛡️ নিরাপত্তা টিপস: কোনো পিন বা ওটিপি কারও সাথে শেয়ার করবেন না।</span>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      className={`w-full rounded-2xl py-3.5 text-xs font-black text-white shadow-md active:scale-95 transition-all cursor-pointer ${
                        paymentOperator === 'bkash' ? 'bg-[#D12053] hover:bg-[#b01642]' :
                        paymentOperator === 'nagad' ? 'bg-[#EC1C24] hover:bg-[#c71219]' :
                        'bg-[#8C3494] hover:bg-[#72277a]'
                      }`}
                    >
                      ভেরিফিকেশন ওটিপি (OTP) পাঠান
                    </button>
                  </form>
                )}

                {/* STEP 3: OTP VERIFICATION */}
                {!isProcessingPayment && paymentStep === 'otp' && (
                  <form onSubmit={handleConfirmOtp} className="space-y-4">
                    <div className="text-center space-y-1">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 mb-2 animate-bounce">
                        💬
                      </div>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">৬-ডিজিটের ওটিপি ভেরিফিকেশন</h3>
                      <p className="text-[10px] text-gray-400 font-semibold leading-normal">
                        আপনার mobile number <span className="font-bold text-gray-700 dark:text-gray-300">{paymentPhone}</span> এ প্রেরিত OTP কোডটি লিখুন।
                      </p>
                    </div>

                    <div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="ওটিপি টাইপ করুন"
                        className="w-full text-center tracking-[0.3em] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 py-3.5 text-sm font-black text-gray-800 focus:border-emerald-500 focus:outline-hidden dark:text-white"
                        required
                      />
                      <p className="text-[9px] text-gray-400 font-bold text-center mt-2">
                        উপরের এসএমএস নোটিফিকেশন থেকে ওটিপি কোডটি দেখে টাইপ করুন।
                      </p>
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          const newOtp = String(Math.floor(100000 + Math.random() * 900000));
                          setSystemOtpCode(newOtp);
                          const opName = paymentOperator === 'bkash' ? 'bKash' : paymentOperator === 'nagad' ? 'Nagad' : 'Rocket';
                          setSmsNotification({
                            title: `💬 SMS from ${opName}`,
                            body: `AponBazar Payment Request OTP: ${newOtp} for BDT ${paymentConfig.type === 'add_funds' ? paymentAmountInput : paymentConfig.amount}. Do NOT share.`
                          });
                          alert('নতুন একটি ওটিপি পাঠানো হয়েছে!');
                        }}
                        className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-850 text-gray-700 dark:text-gray-300 py-3 text-xs font-bold transition-all"
                      >
                        রিসেন্ড ওটিপি (Resend)
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-black transition-all shadow-md shadow-emerald-600/15"
                      >
                        কনফার্ম করুন
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 4: SUCCESS RECEIPT */}
                {!isProcessingPayment && paymentStep === 'success' && (
                  <div className="space-y-5 text-center">
                    <div className="mx-auto h-14 w-14 rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 flex items-center justify-center text-2xl border-4 border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                      ✔️
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white">লেনদেন সফলভাবে সম্পন্ন হয়েছে!</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Transaction completed successfully</p>
                    </div>

                    {/* Premium Digital Receipt */}
                    <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 p-4 text-left space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] border-b border-gray-100 dark:border-gray-800 pb-1.5 font-semibold text-gray-400">
                        <span>লেনদেনের ধরন:</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-100">
                          {paymentConfig.type === 'buy_product' ? 'পণ্য ক্রয় পেমেন্ট' : 'ওয়ালেট রিচার্জ'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] border-b border-gray-100 dark:border-gray-800 pb-1.5 font-semibold text-gray-400">
                        <span>মোবাইল অপারেটর:</span>
                        <span className="font-extrabold text-emerald-600 uppercase tracking-wide">
                          {paymentOperator === 'bkash' ? 'bKash' : paymentOperator === 'nagad' ? 'Nagad' : 'Rocket'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] border-b border-gray-100 dark:border-gray-800 pb-1.5 font-semibold text-gray-400">
                        <span>একাউন্ট নাম্বার:</span>
                        <span className="font-extrabold text-gray-800 dark:text-gray-100">{paymentPhone}</span>
                      </div>

                      {paymentConfig.type === 'buy_product' && (
                        <div className="flex justify-between items-start text-[10px] border-b border-gray-100 dark:border-gray-800 pb-1.5 font-semibold text-gray-400">
                          <span>পণ্যের নাম:</span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-100 truncate max-w-[180px]">
                            {paymentConfig.productTitle}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[10px] border-b border-gray-100 dark:border-gray-800 pb-1.5 font-semibold text-gray-400">
                        <span>ট্রানজেকশন আইডি:</span>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 select-all">{activeTxId}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs font-black text-gray-800 dark:text-white pt-1">
                        <span>টোটাল পেমেন্ট:</span>
                        <span className="text-sm text-emerald-600">
                          ৳{paymentConfig.type === 'add_funds' ? Number(paymentAmountInput).toLocaleString('bn-BD') : paymentConfig.amount.toLocaleString('bn-BD')} BDT
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 flex gap-2 items-start text-left">
                      <span className="text-xs">🛡️</span>
                      <p className="text-[10px] text-emerald-800 dark:text-emerald-300 leading-relaxed font-semibold">
                        {paymentConfig.type === 'buy_product' 
                          ? `পেমেন্ট সম্পন্ন হয়েছে। বিক্রেতা চ্যাটের মাধ্যমে লেনদেনের সত্যতা নিশ্চিত করবেন এবং ডেলিভারি সম্পন্ন করবেন।`
                          : `ওয়ালেট ব্যালেন্স রিচার্জ সম্পন্ন হয়েছে। আপনি এখন যেকোনো বিজ্ঞাপন বুস্ট করতে বা পেমেন্ট করতে পারবেন।`}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setPaymentConfig(null);
                        if (paymentConfig.type === 'buy_product') {
                          setCurrentView('chat'); // Redirect to chats so they can follow up!
                        } else {
                          setCurrentView('profile'); // Show updated wallet
                        }
                      }}
                      className="w-full rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-extrabold text-xs py-3.5 transition-all shadow-md active:scale-95"
                    >
                      {paymentConfig.type === 'buy_product' ? 'বিক্রেতার চ্যাট রুমে যান' : 'ব্যালেন্স ও ওয়ালেট দেখুন'}
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Modal Overlay for Login Page */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-md my-8">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
              >
                <X className="h-4 w-4" />
              </button>
              <LoginPage 
                onLoginSuccess={handleLoginSuccess}
                onCancel={() => setShowLoginModal(false)}
              />
            </div>
          </div>
        )}

        {/* Modal Overlay for Safety Tips */}
        {showSafetyTipsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-850 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
              <button 
                onClick={() => setShowSafetyTipsModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all active:scale-95 z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-950 dark:text-white">নিরাপদ লেনদেন নির্দেশিকা 🛡️</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">AponBazar Safe Trade Protocol</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3.5 items-start p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 dark:bg-amber-500/10">
                  <span className="text-xl shrink-0">🚫</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-amber-800 dark:text-amber-300">গোপন পিন বা ওটিপি (OTP) গোপন রাখুন</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mt-0.5">
                      বিকাশ, রকেট, নগদ বা কোনো ব্যাংকের পিন কোড কিংবা ওটিপি কারো সাথে শেয়ার করবেন না। আপনবাজার অ্যাডমিন বা প্রতিনিধি কখনো আপনার পিন জানতে চাইবে না।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 dark:bg-blue-500/10">
                  <span className="text-xl shrink-0">🤝</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-blue-800 dark:text-blue-300">সরাসরি দেখা করে লেনদেন করুন</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mt-0.5">
                      পণ্য কেনার আগে জনাকীর্ণ জায়গায় বা পাবলিক প্লেসে সরাসরি বিক্রেতার সাথে দেখা করুন। পণ্য ভালোভাবে যাচাই করে সন্তুষ্ট হয়েই কেবল টাকা পরিশোধ করুন।
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 dark:bg-emerald-500/10">
                  <span className="text-xl shrink-0">✔️</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300">ভেরিফাইড ব্যাজ লক্ষ্য করুন</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold mt-0.5">
                      যে সকল বিক্রেতার নামের পাশে নীল ভেরিফাইড টিক চিহ্ন (✓) রয়েছে, তাদের সাথে লেনদেন অনেক বেশি নিরাপদ কারণ তারা আমাদের কাছে এনআইডি কার্ড দিয়ে ভেরিফাইড।
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  onClick={() => setShowSafetyTipsModal(false)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 transition-all shadow-sm shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-95 cursor-pointer"
                >
                  আমি বুঝতে পেরেছি ও সচেতন থাকব
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW ROUTER --- */}

        {/* 1. HOME VIEW */}
        {currentView === 'home' && (
          <div className="space-y-8 pb-16">
            
            {/* Elegant Bengali Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 to-teal-900 py-16 px-4 text-white text-center shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent"></div>
              
              <div className="relative mx-auto max-w-3xl space-y-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1.5 text-xs font-black text-emerald-300 uppercase tracking-widest border border-emerald-500/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  BANGLADESH'S #1 TRUSTED MARKETPLACE
                </span>
                
                <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl leading-tight tracking-tight">
                  আপনার পুরনো জিনিস কেনাবেচার <br />
                  <span className="text-emerald-400 font-black">নির্ভরযোগ্য আপনবাজার</span>
                </h1>
                
                <p className="text-sm text-emerald-100/80 max-w-lg mx-auto leading-relaxed">
                  মোবাইল, ল্যাপটপ, ফ্রিজ বা টিভি—নিরাপদ পরিবেশে ক্রেতা-বিক্রেতার সরাসরি যোগাযোগের সেরা প্ল্যাটফর্ম।
                </p>

                {/* Hero Integrated Search Capsule */}
                <div className="mx-auto max-w-2xl bg-white rounded-3xl p-2 shadow-xl flex flex-col md:flex-row gap-2 text-gray-800 border border-emerald-500/20">
                  
                  {/* Search Bar */}
                  <div className="flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-gray-100">
                    <Search className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSearchHistory(searchQuery);
                        }
                      }}
                      onBlur={() => {
                        handleAddSearchHistory(searchQuery);
                      }}
                      placeholder="কি খুঁজছেন? যেমন: iPhone 13..."
                      className="w-full bg-transparent border-none py-2 text-sm focus:outline-hidden text-gray-800 placeholder-gray-400 font-semibold"
                    />
                  </div>

                  {/* Location Selector */}
                  <div className="flex items-center px-3 md:w-48">
                    <MapPin className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-transparent border-none py-2 text-sm focus:outline-hidden font-bold text-gray-700"
                    >
                      <option value="all">সমগ্র বাংলাদেশ</option>
                      {LOCATIONS.map(loc => (
                        <option key={loc.id} value={loc.name}>{loc.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Advanced Collapsible Filter toggle */}
                  <button 
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      showFilterPanel 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    ফিল্টার
                  </button>
                </div>

                {/* Search History Tags/Chips */}
                {searchHistory.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                    <span className="text-emerald-300/90 font-bold">সাম্প্রতিক সার্চ:</span>
                    {searchHistory.map((hQuery, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(hQuery);
                        }}
                        className="rounded-full bg-white/10 hover:bg-white/20 hover:text-white px-3 py-1 text-[11px] font-semibold text-emerald-100 cursor-pointer transition-all active:scale-95 flex items-center gap-1 border border-white/5 animate-in fade-in zoom-in-95"
                      >
                        <History className="h-3 w-3 opacity-60" />
                        <span>{hQuery}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSearchHistory([]);
                        localStorage.removeItem('aponbazar_search_history');
                      }}
                      className="text-[10px] font-black text-red-300 hover:text-red-400 cursor-pointer uppercase tracking-wider underline ml-2 transition-all"
                    >
                      মুছে ফেলুন
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Advanced Filters Drawer Panel */}
            {showFilterPanel && (
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-3 mb-4">
                    <h4 className="text-xs font-black uppercase text-gray-400">অ্যাডভান্সড ফিল্টারস</h4>
                    <button 
                      onClick={handleResetFilters}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                      ফিল্টার রিসেট
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Price Slider */}
                    <div className="space-y-1.5">
                      <span className="block text-xs font-bold text-gray-600 dark:text-gray-300">
                        সর্বোচ্চ বাজেট: ৳{maxPriceFilter.toLocaleString('bn-BD')}
                      </span>
                      <input 
                        type="range"
                        min={1000}
                        max={500000}
                        step={1000}
                        value={maxPriceFilter}
                        onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    {/* Condition Filter */}
                    <div className="space-y-1.5">
                      <span className="block text-xs font-bold text-gray-600 dark:text-gray-300">পণ্যের কন্ডিশন</span>
                      <select
                        value={conditionFilter}
                        onChange={(e) => setConditionFilter(e.target.value)}
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2 px-3 text-xs font-bold text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <option value="all">যেকোনো কন্ডিশন</option>
                        <option value="like_new">নতুন এর মতো (Like New)</option>
                        <option value="good">ভালো (Good)</option>
                        <option value="fair">চলবে (Fair)</option>
                      </select>
                    </div>

                    {/* Verified Sellers Toggle */}
                    <div className="space-y-1.5 flex items-center pt-5">
                      <label className="relative flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-300">
                        <input 
                          type="checkbox"
                          checked={onlyVerified}
                          onChange={(e) => setOnlyVerified(e.target.checked)}
                          className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                        />
                        ভেরিফাইড বিক্রেতার পণ্য (✓)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Category Buttons Row */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 rounded-2xl px-5 py-3 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white hover:bg-gray-100 border border-gray-100 text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  সকল ক্যাটাগরি
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 rounded-2xl px-5 py-3 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white hover:bg-gray-100 border border-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid Panel */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">সদ্য যুক্ত হওয়া বিজ্ঞাপনসমূহ</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Explore Recent Listings</p>
                </div>
                <span className="text-xs text-gray-400 font-bold">
                  {sortedProducts.length} টি বিজ্ঞাপন পাওয়া গেছে
                </span>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/10 max-w-lg mx-auto px-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">কোনো পণ্য খুঁজে পাওয়া যায়নি!</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-normal mb-6">
                    আপনার সিলেক্ট করা ফিল্টারের সাথে মিলে এমন কোনো পণ্যের বিজ্ঞাপন আমাদের ডাটাবেজে এই মুহূর্তে নেই।
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-extrabold transition-all"
                  >
                    ফিল্টার রিসেট করুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedProducts.map((prod) => (
                    <ProductCard 
                      key={prod.id} 
                      product={prod} 
                      onClick={() => handleViewProduct(prod)} 
                      isSaved={currentUser?.savedProductIds?.includes(prod.id) || false}
                      onToggleSave={() => handleToggleSaveProduct(prod.id)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. PRODUCT DETAILS VIEW */}
        {currentView === 'details' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct}
            currentUser={currentUser}
            onBack={() => {
              setCurrentView('home');
              setSelectedProduct(null);
            }}
            onStartChat={handleStartChat}
            onBoostProduct={handleBoostProduct}
            onAddFunds={handleAddFunds}
            onOpenLogin={() => setShowLoginModal(true)}
            users={users}
            onAddReview={handleAddReview}
            onBuyProduct={(prod) => handleInitiatePayment({
              type: 'buy_product',
              amount: prod.price,
              productId: prod.id,
              productTitle: prod.title,
              recipientId: prod.sellerId,
              recipientName: prod.sellerName
            })}
          />
        )}

        {/* 3. UPLOAD LISTING VIEW */}
        {currentView === 'upload' && (
          <AddListing 
            currentUser={currentUser}
            onAddProduct={handleAddProduct}
            onNavigateHome={() => setCurrentView('home')}
          />
        )}

        {/* 4. CHAT SYSTEM VIEW */}
        {currentView === 'chat' && (
          <ChatSystem 
            currentUser={currentUser}
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={(chatId) => setActiveChatId(chatId)}
            onSendMessage={handleSendMessage}
            onViewProductDetails={(prodId) => {
              const matched = products.find(p => p.id === prodId);
              if (matched) {
                handleViewProduct(matched);
              }
            }}
            onAcceptOffer={handleAcceptOffer}
            onDeclineOffer={handleDeclineOffer}
            onBuyProduct={(productId, price, productTitle, sellerId, sellerName) => handleInitiatePayment({
              type: 'buy_product',
              amount: price,
              productId,
              productTitle,
              recipientId: sellerId,
              recipientName: sellerName
            })}
          />
        )}

        {/* 5. USER PROFILE VIEW */}
        {currentView === 'profile' && (
          <UserProfile 
            currentUser={currentUser}
            products={products}
            walletTransactions={walletTransactions}
            onAddFunds={handleAddFunds}
            onVerifySeller={handleVerifySeller}
            onDeleteProduct={handleDeleteProduct}
            onBoostProduct={handleBoostProduct}
            onNavigateUpload={() => setCurrentView('upload')}
            onNavigateDetails={(prod) => handleViewProduct(prod)}
            onToggleSave={handleToggleSaveProduct}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {/* 6. ADMIN PANEL VIEW */}
        {currentView === 'admin' && currentUser?.role === 'admin' && (
          <AdminPanel 
            products={products}
            users={users}
            onApproveProduct={handleApproveProduct}
            onRejectProduct={handleRejectProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleUserBan={handleToggleUserBan}
            onToggleUserVerify={handleToggleUserVerify}
            adminLogs={adminLogs}
            systemSettings={systemSettings}
            onUpdateSettings={setSystemSettings}
            isAdminVerified={isAdminVerified}
            onVerifyAdmin={(verified) => {
              setIsAdminVerified(verified);
              sessionStorage.setItem('aponbazar_admin_verified', verified ? 'true' : 'false');
            }}
            onClearLogs={() => setAdminLogs([])}
          />
        )}

      </main>

      {/* Footer Block */}
      <footer className="border-t border-gray-100 bg-white dark:border-gray-850 dark:bg-gray-900/60 transition-colors duration-300 mt-12">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-100 dark:border-gray-800">
            
            {/* Column 1: Brand & Bio */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-950 dark:text-white tracking-tight">আপন<span className="text-emerald-600 dark:text-emerald-400">বাজার</span></h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider -mt-0.5">Reliable Re-Commerce</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                আপনবাজার হচ্ছে বাংলাদেশের অন্যতম বিশ্বস্ত ও আধুনিক ব্যবহৃত পণ্য কেনাবেচার প্ল্যাটফর্ম। উন্নত প্রযুক্তি, প্রোফাইল ভেরিফিকেশন ও লাইভ চ্যাট ফিচারের মাধ্যমে নিরাপদ লেনদেন নিশ্চিত করাই আমাদের মূল লক্ষ্য।
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> শতভাগ নিরাপদ
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2.5 py-0.5">
                  <Award className="h-3.5 w-3.5" /> এনআইডি ভেরিফাইড
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
                দ্রুত নেভিগেশন
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <button 
                    onClick={() => { setCurrentView('home'); setSelectedProduct(null); }}
                    className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1.5"
                  >
                    🏠 হোম পেজ
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (currentUser) {
                        setCurrentView('upload');
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1.5"
                  >
                    ➕ বিজ্ঞাপন দিন
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (currentUser) {
                        setCurrentView('profile');
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1.5"
                  >
                    👤 আমার প্রোফাইল
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (currentUser) {
                        setCurrentView('chat');
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1.5"
                  >
                    💬 চ্যাট বক্স ও মেসেজ
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Security & Support */}
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
                নিরাপত্তা ও সহায়তা
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <button 
                    onClick={() => setShowSafetyTipsModal(true)}
                    className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left bg-transparent border-none p-0 inline-flex items-center gap-1.5"
                  >
                    🛡️ নিরাপদ লেনদেন নির্দেশিকা
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      alert('হেল্প সেন্টার এই মুহূর্তে সম্পূর্ণ সচল রয়েছে। যেকোনো সহায়তার জন্য আমাদের সাপোর্ট ইমেইল support@aponbazar.com-এ যোগাযোগ করুন। ধন্যবাদ!');
                    }}
                    className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left bg-transparent border-none p-0 inline-flex items-center gap-1.5"
                  >
                    🙋 হেল্প সেন্টার ও এফএকিউ (FAQ)
                  </button>
                </li>
                <li>
                  <div className="text-gray-450 dark:text-gray-500 flex items-center gap-1.5">
                    📞 হটলাইন: ০৯৬১২-আপনবাজার
                  </div>
                </li>
                <li>
                  <div className="text-gray-450 dark:text-gray-500 flex items-center gap-1.5">
                    ✉️ ইমেইল: info@aponbazar.com
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Payment Partners */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
                পেমেন্ট পার্টনারস
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                আমরা দেশের সকল শীর্ষস্থানীয় পেমেন্ট গেটওয়ের মাধ্যমে ওয়ালেটে ফান্ড যুক্ত ও বুস্টিং সুবিধা অফার করি:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-pink-100 text-pink-700 font-black text-[10px] tracking-wider border border-pink-200">bKash</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-850 font-black text-[10px] tracking-wider border border-amber-200">Nagad</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 font-black text-[10px] tracking-wider border border-purple-200">Rocket</span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 font-black text-[10px] tracking-wider border border-blue-200">Visa / Card</span>
              </div>
              <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-500" /> SSL 256-Bit এনক্রিপশন দ্বারা সম্পূর্ণ নিরাপদ
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
              আপনবাজার © ২০২৬ - ওল্ড প্রোডাক্ট কেনাবেচার নির্ভরযোগ্য ঠিকানা। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold max-w-md leading-normal sm:text-right">
              এটি একটি রিয়েল-টাইম কাস্টম ক্লায়েন্ট স্টোরেজ ডেমো মার্কেটপ্লেস। সমস্ত ব্যবহারকারী, চ্যাট ও প্রোডাক্ট লিস্টিং ডেটা আপনার ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত।
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
