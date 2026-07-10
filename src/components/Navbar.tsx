import React from 'react';
import { 
  Smartphone, Laptop, Tv, IceCream, Armchair, Bike, Dumbbell, Grid, 
  Search, MapPin, User, PlusCircle, MessageSquare, Settings, 
  ShieldAlert, Bell, LogOut, CheckCircle2, Wallet, Menu, X, Sun, Moon
} from 'lucide-react';
import { User as UserType, ViewType } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  onNavigate: (view: ViewType) => void;
  currentView: ViewType;
  onLogout: () => void;
  onOpenLogin: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  notifications: any[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
}

export default function Navbar({ 
  currentUser, 
  onNavigate, 
  currentView, 
  onLogout, 
  onOpenLogin,
  isDark,
  onToggleTheme,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = React.useState(false);
  const [showMobileNotif, setShowMobileNotif] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getLinkClass = (view: ViewType) => {
    return `relative py-2 text-sm font-medium transition-colors duration-200 ${
      currentView === view 
        ? 'text-emerald-600 dark:text-emerald-400' 
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-left focus:outline-hidden"
              id="nav-logo"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                <Smartphone className="h-5 w-5 rotate-12" />
              </div>
              <div>
                <span className="block text-lg font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                  আপন<span className="text-emerald-600">বাজার</span>
                </span>
                <span className="hidden sm:block text-[9px] tracking-wider text-gray-400 uppercase font-bold">
                  Old Product Marketplace
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className={getLinkClass('home')} id="nav-btn-home">
              হোম পেজ
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-emerald-500" />
              )}
            </button>

            {currentUser && (
              <>
                <button onClick={() => onNavigate('chat')} className={getLinkClass('chat')} id="nav-btn-chat">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    চ্যাট বক্স
                  </span>
                  {currentView === 'chat' && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-emerald-500" />
                  )}
                </button>

                {currentUser.role === 'admin' && (
                  <button onClick={() => onNavigate('admin')} className={getLinkClass('admin')} id="nav-btn-admin">
                    <span className="flex items-center gap-1 text-red-500 dark:text-red-400 font-bold">
                      <ShieldAlert className="h-4 w-4 animate-pulse" />
                      অ্যাডমিন প্যানেল
                    </span>
                    {currentView === 'admin' && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-red-500" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          {/* User Section & Upload Button */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="rounded-xl p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-all cursor-pointer"
              title={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* Notification Bell with Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative rounded-xl p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center"
                  title="নোটিফিকেশন সেন্টার"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-950 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-2 mb-3">
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase">বিজ্ঞপ্তি সমূহ ({unreadCount})</span>
                      {notifications.length > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearAllNotifications();
                          }}
                          className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer bg-transparent border-none"
                        >
                          সব মুছুন
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400 font-semibold">কোনো নতুন বিজ্ঞপ্তি নেই</div>
                      ) : (
                        notifications.map((notif) => (
                          <button 
                            key={notif.id}
                            onClick={() => {
                              onMarkNotificationRead(notif.id);
                              if (notif.linkToView) {
                                onNavigate(notif.linkToView);
                              }
                              setShowNotifDropdown(false);
                            }}
                            className={`w-full p-2.5 rounded-xl border transition-all text-left block text-xs cursor-pointer ${
                              notif.isRead 
                                ? 'bg-white border-gray-100 text-gray-500 dark:bg-gray-950 dark:border-gray-800/60' 
                                : 'bg-emerald-50/30 border-emerald-500/10 text-gray-800 dark:text-gray-200 dark:bg-emerald-950/10'
                            } hover:bg-gray-50 dark:hover:bg-gray-900`}
                          >
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="font-bold block truncate max-w-[180px] text-gray-800 dark:text-gray-100">
                                {notif.title}
                              </span>
                              <span className="text-[8px] text-gray-400 shrink-0 font-mono">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium">{notif.message}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentUser ? (
              <div className="flex items-center gap-4">
                {/* Simulated Wallet Balance */}
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <Wallet className="h-3.5 w-3.5" />
                  <span>৳{currentUser.balance}</span>
                </div>

                {/* Profile Link */}
                <button 
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-all"
                  id="nav-btn-profile"
                >
                  <div className="relative">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover" 
                    />
                    {currentUser.isVerified && (
                      <span className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white font-bold border-2 border-white dark:border-gray-900">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="max-w-[120px] truncate">
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-gray-400 leading-none truncate">
                      {currentUser.email}
                    </div>
                  </div>
                </button>

                {/* Sell Button */}
                <button 
                  onClick={() => onNavigate('upload')}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
                  id="nav-btn-upload"
                >
                  <PlusCircle className="h-4 w-4" />
                  বিজ্ঞাপন দিন
                </button>

                {/* Logout Button */}
                <button 
                  onClick={onLogout}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors cursor-pointer"
                  title="লগআউট করুন"
                  id="nav-btn-logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="flex items-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 px-5 py-2.5 text-sm font-semibold shadow-xs transition-all cursor-pointer"
                id="nav-btn-login-trigger"
              >
                <User className="h-4 w-4" />
                লগইন / সাইন-আপ
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="rounded-xl p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300"
              title={isDark ? "লাইট মোড" : "ডার্ক মোড"}
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </button>

            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowMobileNotif(!showMobileNotif)}
                  className="relative rounded-xl p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300 flex items-center justify-center cursor-pointer"
                  title="বিজ্ঞপ্তি সমূহ"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>

                {showMobileNotif && (
                  <div className="absolute right-[-40px] mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xl dark:border-gray-800 dark:bg-gray-950 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-2 mb-2">
                      <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase">বিজ্ঞপ্তি সমূহ ({unreadCount})</span>
                      {notifications.length > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearAllNotifications();
                          }}
                          className="text-[9px] font-bold text-red-500 hover:underline cursor-pointer bg-transparent border-none"
                        >
                          সব মুছুন
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-[10px] text-gray-400 font-semibold">কোনো নতুন বিজ্ঞপ্তি নেই</div>
                      ) : (
                        notifications.map((notif) => (
                          <button 
                            key={notif.id}
                            onClick={() => {
                              onMarkNotificationRead(notif.id);
                              if (notif.linkToView) {
                                onNavigate(notif.linkToView);
                              }
                              setShowMobileNotif(false);
                            }}
                            className={`w-full p-2 rounded-lg border transition-all text-left block text-[10px] cursor-pointer ${
                              notif.isRead 
                                ? 'bg-white border-gray-100 text-gray-500 dark:bg-gray-950 dark:border-gray-800/50' 
                                : 'bg-emerald-50/20 border-emerald-500/10 text-gray-800 dark:text-gray-200 dark:bg-emerald-950/5'
                            } hover:bg-gray-50 dark:hover:bg-gray-900`}
                          >
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="font-bold block truncate max-w-[140px] text-gray-800 dark:text-gray-100">
                                {notif.title}
                              </span>
                              <span className="text-[7px] text-gray-400 shrink-0 font-mono">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">{notif.message}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentUser && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Wallet className="h-3 w-3" />
                <span>৳{currentUser.balance}</span>
              </div>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-hidden"
              id="nav-mobile-toggle"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 pt-2 pb-3">
            <button
              onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
              className={`flex w-full items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                currentView === 'home' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              হোম পেজ
            </button>
            {currentUser && (
              <>
                <button
                  onClick={() => { onNavigate('chat'); setIsMobileMenuOpen(false); }}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    currentView === 'chat' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
                  চ্যাট বক্স
                </button>
                <button
                  onClick={() => { onNavigate('upload'); setIsMobileMenuOpen(false); }}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    currentView === 'upload' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <PlusCircle className="mr-2 h-5 w-5 text-gray-500" />
                  বিজ্ঞাপন দিন
                </button>
                <button
                  onClick={() => { onNavigate('profile'); setIsMobileMenuOpen(false); }}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    currentView === 'profile' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <User className="mr-2 h-5 w-5 text-gray-500" />
                  প্রোফাইল সেটিংস
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
                    className={`flex w-full items-center rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                      currentView === 'admin' 
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400' 
                        : 'text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/10'
                    }`}
                  >
                    <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
                    অ্যাডমিন প্যানেল
                  </button>
                )}
              </>
            )}
          </div>
          
          <div className="border-t border-gray-100 pt-4 pb-2 dark:border-gray-800">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 px-3">
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <div className="text-base font-bold text-gray-800 dark:text-gray-200">{currentUser.name}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                    <Wallet className="h-3.5 w-3.5" />
                    <span>৳{currentUser.balance}</span>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  লগআউট করুন
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenLogin(); setIsMobileMenuOpen(false); }}
                className="flex w-full items-center justify-center rounded-xl bg-gray-950 hover:bg-gray-900 py-3 text-center text-sm font-semibold text-white shadow-xs dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100 transition-colors"
              >
                লগইন / সাইন-আপ করুন
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
