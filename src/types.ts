export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  isVerified: boolean; // Blue Tick badge status
  isBanned: boolean;
  role: 'admin' | 'user';
  createdAt: string;
  balance: number; // Simulated wallet balance for boosting products
  savedProductIds?: string[]; // Wishlist items
  sellerReviews?: Review[]; // Ratings and feedback left for this user as a seller
  address?: string; // Verification physical address
  nidNumber?: string; // NID Card Number
  nidImageFront?: string; // NID Front photo url or data uri
  nidImageBack?: string; // NID Back photo url or data uri
  verificationRequestStatus?: 'none' | 'pending' | 'verified' | 'rejected'; // Request flow
  profileCompletion?: number; // Calculation of profile security/completion
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  condition: 'like_new' | 'good' | 'fair';
  usedDuration: string; // e.g., "৩ মাস", "১ বছর"
  description: string;
  location: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  isSellerVerified: boolean;
  imageUrls: string[];
  isApproved: boolean; // Admin moderation
  isFeatured: boolean; // Boosted/Promoted product
  createdAt: string;
  views: number;
  isSold?: boolean; // Whether the product is sold out
  buyerId?: string; // ID of the buyer if sold
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  messages: ChatMessage[];
  updatedAt: string;
  offerPrice?: number; // Active offer price for bargaining
  offerStatus?: 'pending' | 'accepted' | 'declined'; // Offer status
}

export interface WalletTransaction {
  id: string;
  amount: number;
  description: string;
  timestamp: string;
  type: 'credit' | 'debit';
}

export type ViewType = 'home' | 'details' | 'upload' | 'admin' | 'chat' | 'profile';
