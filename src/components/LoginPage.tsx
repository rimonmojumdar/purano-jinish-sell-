import React from 'react';
import { Smartphone, Check, ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
}

export default function LoginPage({ onLoginSuccess, onCancel }: LoginPageProps) {
  const [authMode, setAuthMode] = React.useState<'select' | 'google' | 'phone' | 'otp'>('select');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [otpCode, setOtpCode] = React.useState(['', '', '', '', '', '']);
  const [timer, setTimer] = React.useState(60);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [googleEmail, setGoogleEmail] = React.useState('rimonmajumder67@gmail.com');
  const [googleName, setGoogleName] = React.useState('রিমন্ড মজুমদার');
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for OTP
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authMode === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg('দয়া করে একটি সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন');
      return;
    }
    setErrorMsg('');
    setAuthMode('otp');
    setTimer(60);
    // Auto fill first box
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.substring(value.length - 1);
    setOtpCode(newOtp);
    setErrorMsg('');

    // Focus next box
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      setErrorMsg('দয়া করে ৬ ডিজিটের ওটিপি কোড সম্পূর্ণ করুন');
      return;
    }

    // Custom simulated OTP: "123456" is verified
    if (fullCode === '123456' || fullCode === '654321' || phoneNumber.endsWith('77')) {
      const isRimonAdmin = phoneNumber === '01711122233';
      const mockUser: User = {
        id: `user-phone-${Date.now()}`,
        name: isRimonAdmin ? 'রিমন্ড মজুমদার (Admin)' : `ব্যবহারকারী ${phoneNumber.slice(-4)}`,
        email: isRimonAdmin ? 'rimonmajumder67@gmail.com' : `${phoneNumber}@market.bd`,
        phone: phoneNumber,
        avatar: isRimonAdmin 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'
          : `https://api.dicebear.com/7.x/adventurer/svg?seed=${phoneNumber}`,
        isVerified: isRimonAdmin,
        isBanned: false,
        role: isRimonAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        balance: isRimonAdmin ? 5000 : 500,
      };
      onLoginSuccess(mockUser);
    } else {
      setErrorMsg('ভুল ওটিপি কোড। ডেমো কোডটি হলো: ১২৩৪৫৬');
    }
  };

  const handleGoogleSignIn = (emailAddress: string, nameInput: string) => {
    if (!emailAddress) {
      setErrorMsg('দয়া করে সঠিক ইমেইল আইডি লিখুন');
      return;
    }
    const isAdminEmail = emailAddress.toLowerCase().trim() === 'rimonmajumder67@gmail.com';
    const mockUser: User = {
      id: isAdminEmail ? 'user-1' : `user-google-${Date.now()}`,
      name: nameInput || 'গুগল ব্যবহারকারী',
      email: emailAddress.toLowerCase().trim(),
      phone: isAdminEmail ? '01711122233' : '01700000000',
      avatar: isAdminEmail 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'
        : `https://api.dicebear.com/7.x/lorelei/svg?seed=${emailAddress}`,
      isVerified: isAdminEmail,
      isBanned: false,
      role: isAdminEmail ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      balance: isAdminEmail ? 5000 : 800,
    };
    onLoginSuccess(mockUser);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 md:p-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <Smartphone className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">
            আপনবাজারে স্বাগতম
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            আপনার পুরনো জিনিস নিরাপদে বিক্রি ও কিনুন সহজে
          </p>
        </div>

        {/* Error Messaging */}
        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-center text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Mode 1: Select Authentication Method */}
        {authMode === 'select' && (
          <div className="mt-6 space-y-4">
            <button 
              onClick={() => setAuthMode('google')}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/50 transition-all active:scale-98 cursor-pointer"
              id="google-login-btn"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.74 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 6.84 8.78 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.61-.21-2.38H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.65 2.83c2.14-1.98 3.38-4.89 3.38-8.54z" />
                <path fill="#FBBC05" d="M5.1 14.7c-.24-.7-.38-1.45-.38-2.2s.14-1.5.38-2.2L1.5 7.5C.54 9.4 0 11.5 0 13.8s.54 4.4 1.5 6.3l3.6-2.8c-.24-.7-.38-1.45-.38-2.2z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.65-2.83c-1.01.68-2.3 1.09-4.31 1.09-3.22 0-5.99-1.8-6.99-4.76l-3.6 2.8C3.4 20.35 7.35 23 12 23z" />
              </svg>
              Google অ্যাকাউন্ট দিয়ে লগইন করুন
            </button>

            <button 
              onClick={() => setAuthMode('phone')}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/50 transition-all active:scale-98 cursor-pointer"
              id="phone-login-btn"
            >
              <Smartphone className="h-5 w-5 text-emerald-500" />
              মোবাইল নাম্বার ও OTP দিয়ে লগইন
            </button>

            {/* Quick Demo Pre-populate Admin accounts */}
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/40 p-4 border border-gray-100 dark:border-gray-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2">
                ডেমো অ্যাক্সেস (দ্রুত পরীক্ষা করতে ক্লিক করুন)
              </span>
              <div className="space-y-2">
                <button 
                  onClick={() => handleGoogleSignIn('rimonmajumder67@gmail.com', 'রিমন্ড মজুমদার')}
                  className="flex w-full items-center justify-between text-left rounded-xl bg-white dark:bg-gray-800 border border-gray-100 hover:border-emerald-300 dark:border-gray-700 p-2 text-xs transition-all active:scale-98 cursor-pointer"
                >
                  <div>
                    <span className="block font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                      রিমন্ড মজুমদার <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                    </span>
                    <span className="block text-gray-400">rimonmajumder67@gmail.com</span>
                  </div>
                  <span className="rounded-md bg-emerald-50 text-emerald-700 px-2 py-1 font-bold text-[10px]">
                    ADMIN ROLE
                  </span>
                </button>

                <button 
                  onClick={() => handleGoogleSignIn('sajib@bazar.com', 'সজীব রহমান')}
                  className="flex w-full items-center justify-between text-left rounded-xl bg-white dark:bg-gray-800 border border-gray-100 hover:border-emerald-300 dark:border-gray-700 p-2 text-xs transition-all active:scale-98 cursor-pointer"
                >
                  <div>
                    <span className="block font-bold text-gray-800 dark:text-gray-200">সজীব রহমান</span>
                    <span className="block text-gray-400">sajib@bazar.com</span>
                  </div>
                  <span className="rounded-md bg-blue-50 text-blue-700 px-2 py-1 font-bold text-[10px]">
                    BUYER/SELLER
                  </span>
                </button>
              </div>
            </div>

            <button 
              onClick={onCancel}
              className="block w-full py-2 text-center text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              ফিরে যান
            </button>
          </div>
        )}

        {/* Mode 2: Google custom sign-in entry */}
        {authMode === 'google' && (
          <form 
            onSubmit={(e) => { e.preventDefault(); handleGoogleSignIn(googleEmail, googleName); }} 
            className="mt-6 space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">ইমেইল ঠিকানা</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input 
                  type="email" 
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="যেমন: rimonmajumder67@gmail.com"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400">
                অ্যাডমিন ড্যাশবোর্ড পরীক্ষা করতে ইমেইলটি <b>rimonmajumder67@gmail.com</b> রাখুন।
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">আপনার নাম</label>
              <input 
                type="text" 
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="যেমন: রিমন্ড মজুমদার"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setAuthMode('select')}
                className="flex items-center justify-center rounded-2xl border border-gray-200 px-4 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button 
                type="submit"
                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer"
              >
                Google দিয়ে ওয়ান-ক্লিক লগইন
              </button>
            </div>
          </form>
        )}

        {/* Mode 3: Phone Number input */}
        {authMode === 'phone' && (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">মোবাইল নাম্বার</label>
              <div className="flex rounded-2xl border border-gray-200 bg-gray-50 focus-within:border-emerald-500 focus-within:bg-white dark:border-gray-700 dark:bg-gray-800 transition-all">
                <span className="flex items-center px-4 text-sm font-bold text-gray-400 border-r border-gray-200 dark:border-gray-700">
                  +৮৮
                </span>
                <input 
                  type="tel" 
                  maxLength={11}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border-none py-3 px-4 text-sm font-bold text-gray-800 focus:outline-hidden dark:text-white bg-transparent"
                  placeholder="যেমন: 01711122233"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400">
                অ্যাডমিন ড্যাশবোর্ডের জন্য নাম্বারটি <b>01711122233</b> দিতে পারেন।
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setAuthMode('select')}
                className="flex items-center justify-center rounded-2xl border border-gray-200 px-4 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button 
                type="submit"
                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer"
              >
                ওটিপি কোড পাঠান
              </button>
            </div>
          </form>
        )}

        {/* Mode 4: OTP Verification Code */}
        {authMode === 'otp' && (
          <div className="mt-6 space-y-5">
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                <KeyRound className="h-5 w-5 animate-bounce" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                আমরা <b>+৮৮ {phoneNumber}</b> নাম্বারে ৬ ডিজিটের একটি কোড পাঠিয়েছি।
              </p>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
                [ ডেমো কোড: ১২৩৪৫৬ ]
              </span>
            </div>

            {/* OTP Slots */}
            <div className="flex justify-between gap-2 px-1">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-12 rounded-xl border border-gray-200 bg-gray-50 text-center text-lg font-bold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              ))}
            </div>

            {/* Countdown or Resend */}
            <div className="text-center text-xs">
              {timer > 0 ? (
                <span className="text-gray-400">
                  পুনরায় পাঠান কোড ({timer} সেকেন্ড পর)
                </span>
              ) : (
                <button 
                  onClick={() => { setTimer(60); setOtpCode(['','','','','','']); }}
                  className="font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  কোড আবার পাঠান
                </button>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button 
                type="button"
                onClick={() => setAuthMode('phone')}
                className="flex items-center justify-center rounded-2xl border border-gray-200 px-4 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={verifyOtp}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer"
              >
                ওটিপি যাচাই করুন
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
