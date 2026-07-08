import React from 'react';
import { MapPin, Eye, Calendar, Sparkles, Check, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onClick: () => void;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onClick, isSaved = false, onToggleSave }: ProductCardProps) {
  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case 'like_new':
        return { text: 'নতুন এর মতো', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'good':
        return { text: 'ভালো', bg: 'bg-blue-50 text-blue-700 border-blue-100' };
      case 'fair':
        return { text: 'চলবে (Fair)', bg: 'bg-amber-50 text-amber-700 border-amber-100' };
      default:
        return { text: 'ব্যবহৃত', bg: 'bg-gray-50 text-gray-700 border-gray-100' };
    }
  };

  const conditionStyle = getConditionLabel(product.condition);

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-lg hover:border-emerald-100/50 transition-all duration-300 cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-50">
        <img 
          src={product.imageUrls[0]} 
          alt={product.title} 
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${product.isSold ? 'brightness-50' : ''}`}
          referrerPolicy="no-referrer"
        />
        
        {/* Promoted / Boosted Badge */}
        {product.isFeatured && !product.isSold && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-xs">
            <Sparkles className="h-3 w-3" />
            FEATURED
          </span>
        )}

        {/* SOLD OUT Badge Overlay */}
        {product.isSold && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white font-black text-xs px-4 py-2 rounded-full shadow-lg border border-red-500 tracking-wider rotate-[-12deg] transform scale-110">
              বিক্রিত (SOLD OUT) 🚨
            </span>
          </div>
        )}

        {/* Condition Badge */}
        {!product.isSold && (
          <span className={`absolute top-3 right-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${conditionStyle.bg}`}>
            {conditionStyle.text}
          </span>
        )}

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 rounded-xl bg-gray-900/80 backdrop-blur-xs px-3 py-1.5 text-xs font-black text-white">
          ৳{product.price.toLocaleString('bn-BD')}
        </div>

        {/* Wishlist Toggle Button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(e);
            }}
            className="absolute bottom-3 right-3 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xs p-2 text-gray-500 hover:text-red-500 transition-all shadow-xs cursor-pointer active:scale-95 z-10"
            title="পছন্দের তালিকায় রাখুন"
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isSaved ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'
              }`} 
            />
          </button>
        )}
      </div>

      {/* Details Panel */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Views */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
          <span>{product.category}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {product.views} বার দেখা হয়েছে
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-600 transition-colors">
          {product.title}
        </h3>

        {/* Meta Info */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1 truncate max-w-[120px]">
            <MapPin className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            <span>{product.usedDuration} ব্যবহৃত</span>
          </div>
        </div>

        {/* Seller Status */}
        <div className="mt-3 flex items-center gap-2 border-t border-gray-50/70 pt-2.5">
          <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
            {product.sellerName[0]}
          </div>
          <span className="text-[11px] font-semibold text-gray-600 truncate max-w-[130px]">
            {product.sellerName}
          </span>
          {product.isSellerVerified && (
            <span 
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[8px] text-white font-black"
              title="ভেরিফাইড বিক্রেতা"
            >
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
