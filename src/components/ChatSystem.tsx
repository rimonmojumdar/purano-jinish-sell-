import React from 'react';
import { Send, Eye, ShoppingCart, ShieldCheck, Phone, CheckCheck } from 'lucide-react';
import { Chat, ChatMessage, Product, User } from '../types';
import { getBotResponse, getFallbackImage } from '../data';

interface ChatSystemProps {
  currentUser: User | null;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onSendMessage: (chatId: string, text: string) => void;
  onViewProductDetails: (productId: string) => void;
  onAcceptOffer?: (chatId: string) => void;
  onDeclineOffer?: (chatId: string) => void;
  onBuyProduct?: (productId: string, price: number, productTitle: string, sellerId: string, sellerName: string) => void;
}

export default function ChatSystem({
  currentUser,
  chats,
  activeChatId,
  onSelectChat,
  onSendMessage,
  onViewProductDetails,
  onAcceptOffer,
  onDeclineOffer,
  onBuyProduct
}: ChatSystemProps) {
  const [inputText, setInputText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const userText = inputText;
    setInputText('');

    // Send buyer message
    onSendMessage(activeChat.id, userText);

    // Trigger simulated seller auto-response typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Auto reply from seller based on keywords
      const response = getBotResponse(activeChat.sellerName, userText);
      
      // Build simulated seller message
      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        senderId: activeChat.sellerId,
        text: response,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      // Add to active chat
      activeChat.messages.push(botMsg);
      activeChat.updatedAt = new Date().toISOString();
    }, 1200);
  };

  if (chats.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 mb-4">
          <Send className="h-6 w-6 rotate-45" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">কোনো চ্যাট নেই</h3>
        <p className="text-xs text-gray-500 leading-normal max-w-xs mx-auto">
          হোম পেজের যেকোনো প্রোডাক্ট ডিটেইলসে গিয়ে "Chat with Seller" বাটনে ক্লিক করে সরাসরি বিক্রেতার সাথে চ্যাট শুরু করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 overflow-hidden h-[75vh]">
        
        {/* Left Column: Conversations List */}
        <div className="md:col-span-4 border-r border-gray-100 dark:border-gray-800 flex flex-col h-full bg-gray-50/30">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h2 className="text-base font-black text-gray-900 dark:text-white">চ্যাট মেসেজসমূহ</h2>
            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-bold">Inbox & Negotiations</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
            {chats.map((chat) => {
              const isActive = chat.id === activeChat?.id;
              const lastMsg = chat.messages[chat.messages.length - 1];
              const isSeller = currentUser?.id === chat.sellerId;
              const counterpartName = isSeller ? chat.buyerName : chat.sellerName;
              const counterpartAvatar = isSeller ? chat.buyerAvatar : chat.sellerAvatar;

              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-50/40 border-l-4 border-emerald-500' 
                      : 'hover:bg-gray-50 bg-white dark:bg-gray-900'
                  }`}
                >
                  <img src={counterpartAvatar} alt={counterpartName} className="h-10 w-10 rounded-full object-cover" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                        {counterpartName}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {chat.messages.length > 0 ? lastMsg.timestamp : ''}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1 leading-tight">
                      {lastMsg ? lastMsg.text : 'চ্যাট শুরু করুন...'}
                    </p>

                    {/* Linked product thumbnail */}
                    <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 p-1.5 dark:bg-gray-800">
                      <img 
                        src={chat.productImage} 
                        alt={chat.productTitle} 
                        className="h-5 w-6 rounded-md object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = getFallbackImage('other');
                        }}
                      />
                      <span className="text-[10px] text-gray-400 truncate max-w-[120px] font-semibold">
                        {chat.productTitle}
                      </span>
                      <span className="text-[10px] font-black text-emerald-600 ml-auto">
                        ৳{chat.productPrice}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread Panel */}
        <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-gray-900">
          
          {/* Thread Header */}
          {activeChat && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <img 
                  src={currentUser?.id === activeChat.sellerId ? activeChat.buyerAvatar : activeChat.sellerAvatar} 
                  alt="active-counterpart" 
                  className="h-10 w-10 rounded-full object-cover" 
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
                    {currentUser?.id === activeChat.sellerId ? activeChat.buyerName : activeChat.sellerName}
                    {currentUser?.id !== activeChat.sellerId && (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white font-black">
                        ✓
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 font-semibold">
                    <CheckCheck className="h-3 w-3 text-emerald-500" />
                    সরাসরি অনলাইনে সচল
                  </span>
                </div>
              </div>

              {/* Linked Product Header Block */}
              <button
                onClick={() => onViewProductDetails(activeChat.productId)}
                className="flex items-center gap-2 rounded-xl bg-gray-50 hover:bg-gray-100 p-2 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 text-left transition-all max-w-[200px]"
              >
                <img 
                  src={activeChat.productImage} 
                  alt={activeChat.productTitle} 
                  className="h-8 w-10 rounded-lg object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = getFallbackImage('other');
                  }}
                />
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate leading-snug">
                    {activeChat.productTitle}
                  </span>
                  <span className="block text-[10px] font-black text-emerald-600 leading-none">
                    ৳{activeChat.productPrice}
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Bargaining / Offer Negotiation Banner */}
          {activeChat && activeChat.offerPrice && (
            <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border-b border-gray-100 dark:border-gray-800 p-3 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">🏷️</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                      দর কষাকষি অফার (Bargain Offer)
                    </span>
                    {activeChat.offerStatus === 'pending' && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 px-2 py-0.5 rounded-full animate-pulse">পেন্ডিং</span>
                    )}
                    {activeChat.offerStatus === 'accepted' && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">গৃহীত (Accepted)</span>
                    )}
                    {activeChat.offerStatus === 'declined' && (
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 px-2 py-0.5 rounded-full">প্রত্যাখ্যাত</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                    {currentUser?.id === activeChat.sellerId ? (
                      <>
                        ক্রেতা <b>{activeChat.buyerName}</b> এই পণ্যটি <b>৳{activeChat.offerPrice.toLocaleString('bn-BD')}</b> টাকায় কিনতে চাচ্ছেন।
                      </>
                    ) : (
                      <>
                        আপনার অফার করা মূল্য: <b>৳{activeChat.offerPrice.toLocaleString('bn-BD')}</b> (মূল মূল্য: ৳{activeChat.productPrice.toLocaleString('bn-BD')})
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                {activeChat.offerStatus === 'pending' && currentUser?.id === activeChat.sellerId && (
                  <>
                    <button
                      onClick={() => onAcceptOffer && onAcceptOffer(activeChat.id)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      অফার গ্রহণ করুন (Accept) ✅
                    </button>
                    <button
                      onClick={() => onDeclineOffer && onDeclineOffer(activeChat.id)}
                      className="rounded-xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-red-600 dark:text-red-400 px-3 py-1.5 text-xs font-bold cursor-pointer transition-all active:scale-95"
                    >
                      প্রত্যাখ্যান (Decline) ❌
                    </button>
                  </>
                )}

                {activeChat.offerStatus === 'accepted' && currentUser?.id === activeChat.buyerId && (
                  <button
                    onClick={() => onBuyProduct && onBuyProduct(
                      activeChat.productId,
                      activeChat.offerPrice!,
                      activeChat.productTitle,
                      activeChat.sellerId,
                      activeChat.sellerName
                    )}
                    className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-3.5 py-1.5 text-xs font-black cursor-pointer transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    ৳{activeChat.offerPrice.toLocaleString('bn-BD')} টাকায় সরাসরি কিনুন 🚀
                  </button>
                )}

                {activeChat.offerStatus === 'declined' && currentUser?.id === activeChat.buyerId && (
                  <span className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-md">
                    দুঃখিত, এই অফারটি বিক্রেতা প্রত্যাখ্যান করেছেন।
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Messages Loop Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/20">
            {activeChat?.messages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                    isMe 
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-500/10' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className={`block text-[8px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Simulated typing dot effect */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2.5 bg-white dark:bg-gray-900">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="দাম বা কন্ডিশন জানতে এখানে টাইপ করুন (যেমন: দাম কত?)..."
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 py-3 px-4 text-xs font-semibold text-gray-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-2xl bg-emerald-600 p-3.5 text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
