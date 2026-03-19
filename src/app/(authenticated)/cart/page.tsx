"use client";

import { useCartStore } from "@/stores/cart-store";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, toggleSubscription, subtotal, subscriptionSavings, total, clearCart, error, clearError } =
    useCartStore();
  const [checkoutClicked, setCheckoutClicked] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-warm-white mb-8">Shopping Cart</h1>
        <Card className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-warm-white-muted/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-warm-white mb-2">Your cart is empty</h2>
          <p className="text-warm-white-muted text-sm mb-6">
            Browse our curated collection of menstrual wellness products
          </p>
          <Link href="/products">
            <Button>
              Browse Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-warm-white">
          Shopping Cart ({items.length} items)
        </h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          <Trash2 className="w-4 h-4 mr-1" />
          Clear Cart
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-crimson/10 border border-crimson/30 text-crimson text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-crimson/60 hover:text-crimson ml-4">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id} className="flex gap-4">
              {/* Product image */}
              <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Package className="w-8 h-8 text-warm-white-muted/20" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-warm-white text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-warm-white-muted mt-0.5">{item.product.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1 text-warm-white-muted hover:text-crimson transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-warm-white-muted hover:text-warm-white hover:border-white/20 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium text-warm-white w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-warm-white-muted hover:text-warm-white hover:border-white/20 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-warm-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    {item.isSubscription && item.product.isSubscriptionAvailable && (
                      <Badge variant="gold" className="mt-1">
                        -{item.product.subscriptionDiscount}% subscription
                      </Badge>
                    )}
                  </div>
                </div>

                {item.product.isSubscriptionAvailable && (
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isSubscription}
                      onChange={() => toggleSubscription(item.product.id)}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-dark-card text-crimson focus:ring-crimson accent-crimson"
                    />
                    <span className="text-xs text-warm-white-muted">
                      Subscribe & save {item.product.subscriptionDiscount}%
                    </span>
                  </label>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-24">
            <h2 className="text-lg font-display font-semibold text-warm-white mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-white-muted">Subtotal</span>
                <span className="text-warm-white">${subtotal().toFixed(2)}</span>
              </div>

              {subscriptionSavings() > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Subscription Savings</span>
                  <span>-${subscriptionSavings().toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-warm-white-muted">Shipping</span>
                <span className="text-gold">Free</span>
              </div>

              <div className="border-t border-white/5 pt-3 flex justify-between">
                <span className="font-semibold text-warm-white">Total</span>
                <span className="font-bold text-lg text-warm-white">${total().toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={() => {
                setCheckoutClicked(true);
                setTimeout(() => setCheckoutClicked(false), 3000);
              }}
            >
              Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {checkoutClicked && (
              <p className="text-xs text-gold text-center mt-2 animate-pulse">
                Checkout coming soon!
              </p>
            )}

            <Link href="/products">
              <Button variant="ghost" className="w-full mt-2" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
