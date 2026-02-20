"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates";
import Link from "next/link";
import { Button, Loader } from "./ui";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";

export function CartDrawer() {
  const { 
    isOpen, 
    isVisible, 
    cart, 
    isCheckingOut, 
    isViewingCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    updateQuantity,
    removeItem,
    setIsCheckingOut,
    setIsViewingCart
  } = useCartStore();

  const [currency, setCurrency] = useState("NGN");

  useEffect(() => {
    const handleToggle = () => toggleDrawer();
    const handleOpen = () => {
      if (!isOpen) openDrawer();
    };

    window.addEventListener("toggleCart", handleToggle);
    window.addEventListener("openCartDrawer", handleOpen);
    
    return () => {
      window.removeEventListener("toggleCart", handleToggle);
      window.removeEventListener("openCartDrawer", handleOpen);
    };
  }, [isOpen, openDrawer, toggleDrawer]);

  useEffect(() => {
    const handleCurrencyChange = () => setCurrency(getCurrency());
    window.addEventListener("currencyChange", handleCurrencyChange);
    return () =>
      window.removeEventListener("currencyChange", handleCurrencyChange);
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    const price = convertPrice(item.product.price, "NGN", currency);
    return sum + price * item.quantity;
  }, 0);

  const shipping = 4000;
  const shippingConverted = convertPrice(shipping, "NGN", currency);
  const total = subtotal + shippingConverted;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      closeDrawer();
      setIsCheckingOut(false);
    }, 500);
  };

  const handleViewCart = () => {
    setIsViewingCart(true);
    setTimeout(() => {
      closeDrawer();
      setIsViewingCart(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-70 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-card z-70 shadow-2xl transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={closeDrawer}
              className="hover:text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => {
                  const price = convertPrice(
                    item.product.price,
                    "NGN",
                    currency
                  );
                  return (
                    <div key={item.product.id} className="flex gap-4">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                        width={80}
                        height={80}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(price, currency)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-accent"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="h-6 w-6 rounded border border-border flex items-center justify-center hover:bg-accent"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal: {cart.length} items
                  </span>
                  <span className="font-medium">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {formatPrice(shippingConverted, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Nationwide Shipping Available
              </p>

              <div className="space-y-2">
                <Button 
                  asChild 
                  className="w-full flex items-center justify-center gap-2" 
                  size="lg"
                  disabled={isCheckingOut || isViewingCart}
                >
                  <Link href="/checkout" onClick={handleCheckout}>
                    {isCheckingOut && <Loader className="h-5 w-5" />}
                    {isCheckingOut ? "PROCESSING..." : "CHECKOUT"}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent flex items-center justify-center gap-2"
                  size="lg"
                  disabled={isCheckingOut || isViewingCart}
                >
                  <Link href="/cart" onClick={handleViewCart}>
                    {isViewingCart && <Loader className="h-5 w-5" />}
                    {isViewingCart ? "LOADING..." : "VIEW CART"}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
