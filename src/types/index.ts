export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  age?: number;
  cycleLength: number;
  periodDuration: number;
  lastPeriodDate: string; // ISO date string
  onboardingComplete: boolean;
}

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface CycleDay {
  date: Date;
  dayOfCycle: number;
  phase: CyclePhase;
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface CyclePhaseInfo {
  phase: CyclePhase;
  name: string;
  dayRange: string;
  description: string;
  tips: string[];
  color: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  amazonUrl: string;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isSubscriptionAvailable: boolean;
  subscriptionDiscount: number;
  tags: string[];
}

export type ProductCategory =
  | "pads"
  | "tampons"
  | "cups"
  | "pain-relievers"
  | "mood-enhancers"
  | "heating-pads"
  | "skincare";

export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "cycle" | "supply" | "wellness" | "promo";
  read: boolean;
  createdAt: string; // ISO date string
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  text: string;
  rating: number;
}
