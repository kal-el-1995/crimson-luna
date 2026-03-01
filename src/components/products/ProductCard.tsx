"use client";

import { Product } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/stores/cart-store";
import { Star, ShoppingCart, ExternalLink, Package } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isSubscription, setIsSubscription] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addItem(product, isSubscription);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const discountedPrice = isSubscription && product.isSubscriptionAvailable
    ? product.price * (1 - product.subscriptionDiscount / 100)
    : product.price;

  return (
    <Card hover className="flex flex-col">
      {/* Product image - links to Amazon */}
      <a
        href={product.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${product.name} on Amazon`}
        className="block aspect-square rounded-lg bg-white mb-4 overflow-hidden relative group"
      >
        {!imgError ? (
          <img
            src={`/api/image-proxy?url=${encodeURIComponent(product.amazonUrl)}`}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-card">
            <Package aria-hidden="true" className="w-12 h-12 text-warm-white-muted/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-dark/80 text-warm-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
            View on Amazon <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </a>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {product.tags.map((tag) => (
          <Badge key={tag} variant={tag === "bestseller" ? "crimson" : tag === "new" ? "gold" : "default"}>
            {tag}
          </Badge>
        ))}
      </div>

      {/* Name - links to Amazon */}
      <a
        href={product.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-warm-white text-sm mb-1 hover:text-crimson transition-colors"
      >
        {product.name}
      </a>
      <p className="text-xs text-warm-white-muted mb-3 line-clamp-2">{product.description}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <Star className="w-3.5 h-3.5 text-gold fill-gold" />
        <span className="text-xs text-warm-white">{product.rating}</span>
        <span className="text-xs text-warm-white-muted">({product.reviewCount})</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-lg font-bold text-warm-white">${discountedPrice.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-sm text-warm-white-muted line-through">${product.originalPrice.toFixed(2)}</span>
        )}
        {isSubscription && product.isSubscriptionAvailable && (
          <Badge variant="gold">-{product.subscriptionDiscount}%</Badge>
        )}
      </div>

      {/* Subscription toggle */}
      {product.isSubscriptionAvailable && (
        <label className="flex items-center gap-2 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSubscription}
            onChange={() => setIsSubscription(!isSubscription)}
            className="w-4 h-4 rounded border-white/20 bg-dark-card text-crimson focus:ring-crimson accent-crimson"
          />
          <span className="text-xs text-warm-white-muted">
            Subscribe & save {product.subscriptionDiscount}%
          </span>
        </label>
      )}

      {/* Add to cart */}
      <div className="mt-auto">
        <Button
          onClick={handleAdd}
          variant={added ? "secondary" : "primary"}
          size="sm"
          className="w-full"
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-1.5" />
          {added ? "Added!" : product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Card>
  );
}
