"use client";

import { useState, useEffect } from "react";
import { formatPrice, convertPrice, getCurrency } from "@/lib/currency-rates";
import {
  Button,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
} from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
import { useSupabaseCart } from "@/hooks/use-supabase-cart";
import { Loader } from "@/components/ui/loader";

export default function CheckoutPage() {
  const { cart, loading } = useSupabaseCart();
  const [currency, setCurrency] = useState("NGN");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Lagos");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("ship");
  const [shippingMethod, setShippingMethod] = useState("central-lagos");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [saveInfo, setSaveInfo] = useState(false);
  const [sameAddress, setSameAddress] = useState(true);
  const [emailOffers, setEmailOffers] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  useEffect(() => {
    setCurrency(getCurrency());
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    const price = convertPrice(item.price, "NGN", currency);
    return sum + price * item.quantity;
  }, 0);

  const shippingCost =
    shippingMethod === "central-lagos"
      ? 4000
      : shippingMethod === "extended-mainland"
      ? 4000
      : shippingMethod === "inner-mainland"
      ? 4000
      : 6000;
  const shippingConverted = convertPrice(shippingCost, "NGN", currency);
  const total = subtotal + shippingConverted;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Order Summary Toggle - Only visible on mobile */}
          <div className="lg:hidden mb-4 bg-accent/30 p-4 rounded-lg">
            {loading ? (
              <div className="text-center py-4">
                <Loader className="h-6 w-6 mx-auto" />
              </div>
            ) : (
              <button
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-primary">
                  <svg
                    className={`h-4 w-4 transition-transform ${showOrderSummary ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="text-sm font-medium">
                    {showOrderSummary ? 'Hide' : 'Show'} order summary
                  </span>
                </div>
                <span className="text-lg font-bold">{formatPrice(total, currency)}</span>
              </button>
            )}

            {/* Collapsible Order Summary */}
            {showOrderSummary && (
              <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                {/* Cart items */}
                {cart.map((item) => {
                  const price = convertPrice(item.price, "NGN", currency);
                  return (
                    <div key={item.cartItemId} className="flex gap-3">
                      <div className="relative shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border border-border"
                          width={64}
                          height={64}
                        />
                        <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        {formatPrice(price * item.quantity, currency)}
                      </p>
                    </div>
                  );
                })}

                {/* Discount code */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}
                    className="text-sm"
                  />
                  <Button variant="outline" className="text-sm bg-transparent">Apply</Button>
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal · {cart.length} items</span>
                    <span className="font-medium">{formatPrice(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="font-medium">{formatPrice(shippingConverted, currency)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground font-normal mr-2">{currency}</span>
                      <span>{formatPrice(total, currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left side - Form */}
            <div className="space-y-6 sm:space-y-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pr-4">
              {/* Logo */}
              <Link href="/" className="inline-block">
                <div className="text-xl sm:text-2xl font-bold tracking-tight">
                  MAHZ
                  <span className="block text-xs font-normal tracking-wider">
                    MAHZ-SKIN
                  </span>
                </div>
              </Link>

              {/* Contact */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold">
                    Contact
                  </h2>
                  <Link
                    href="/auth/login"
                    className="text-xs sm:text-sm text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
                <Input
                  type="email"
                  placeholder="Email or mobile phone number"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="text-xs sm:text-base"
                />
                <div className="flex items-center gap-2 mt-2 sm:mt-3">
                  <Checkbox
                    id="email-offers"
                    checked={emailOffers}
                    onCheckedChange={(checked: boolean) =>
                      setEmailOffers(checked)
                    }
                  />
                  <Label
                    htmlFor="email-offers"
                    className="text-xs sm:text-sm cursor-pointer"
                  >
                    Email me with news and offers
                  </Label>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  Delivery
                </h2>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={setDeliveryMethod}
                  className="space-y-2 sm:space-y-3"
                >
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="ship" id="ship" />
                      <Label
                        htmlFor="ship"
                        className="cursor-pointer text-xs sm:text-base"
                      >
                        Ship
                      </Label>
                    </div>
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label
                        htmlFor="pickup"
                        className="cursor-pointer text-xs sm:text-base"
                      >
                        Pick up
                      </Label>
                    </div>
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </RadioGroup>

                <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Input
                      placeholder="First name"
                      value={firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFirstName(e.target.value)
                      }
                      className="text-xs sm:text-base"
                    />
                    <Input
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLastName(e.target.value)
                      }
                      className="text-xs sm:text-base"
                    />
                  </div>
                  <Input
                    placeholder="Address"
                    value={address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAddress(e.target.value)
                    }
                    className="text-xs sm:text-base"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCity(e.target.value)
                      }
                      className="text-xs sm:text-base"
                    />
                    <select
                      value={state}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setState(e.target.value)
                      }
                      className="px-2 sm:px-4 py-2 bg-input border border-border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>Lagos</option>
                      <option>Abuja</option>
                      <option>Port Harcourt</option>
                    </select>
                    <Input
                      placeholder="Postal code"
                      value={postalCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPostalCode(e.target.value)
                      }
                      className="text-xs sm:text-base"
                    />
                  </div>
                  <Input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPhone(e.target.value)
                    }
                    className="text-xs sm:text-base"
                  />
                </div>

                <div className="flex items-center gap-2 mt-3 sm:mt-4">
                  <Checkbox
                    id="save-info"
                    checked={saveInfo}
                    onCheckedChange={(checked: boolean) => setSaveInfo(checked)}
                  />
                  <Label
                    htmlFor="save-info"
                    className="text-xs sm:text-sm cursor-pointer"
                  >
                    Save this information for next time
                  </Label>
                </div>
              </div>

              {/* Shipping method */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  Shipping method
                </h2>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                  className="space-y-2 sm:space-y-3"
                >
                  <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-primary rounded-lg bg-primary/5">
                    <div className="flex items-center gap-3 flex-1">
                      <RadioGroupItem
                        value="central-lagos"
                        id="central-lagos"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="central-lagos"
                          className="cursor-pointer font-medium text-xs sm:text-sm"
                        >
                          Central Lagos Island
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Same Day Delivery
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-xs sm:text-base">
                      {formatPrice(
                        convertPrice(4000, "NGN", currency),
                        currency
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <RadioGroupItem
                        value="extended-mainland"
                        id="extended-mainland"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="extended-mainland"
                          className="cursor-pointer font-medium text-xs sm:text-sm"
                        >
                          Extended Mainland/Island
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Next Day Delivery
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-xs sm:text-base">
                      {formatPrice(
                        convertPrice(4000, "NGN", currency),
                        currency
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <RadioGroupItem
                        value="inner-mainland"
                        id="inner-mainland"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="inner-mainland"
                          className="cursor-pointer font-medium text-xs sm:text-sm"
                        >
                          Inner Mainland & Mid-Island
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Same Day/Next Day
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-xs sm:text-base">
                      {formatPrice(
                        convertPrice(4000, "NGN", currency),
                        currency
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <RadioGroupItem value="outer-lagos" id="outer-lagos" />
                      <div className="flex-1">
                        <Label
                          htmlFor="outer-lagos"
                          className="cursor-pointer font-medium text-xs sm:text-sm"
                        >
                          Outer Lagos
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          1-3 Days
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-xs sm:text-base">
                      {formatPrice(
                        convertPrice(6000, "NGN", currency),
                        currency
                      )}
                    </span>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-2">
                  Payment
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  All transactions are secure and encrypted.
                </p>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-primary/5 border-b border-border">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="paystack" id="paystack" />
                        <Label
                          htmlFor="paystack"
                          className="cursor-pointer font-medium text-xs sm:text-base"
                        >
                          Paystack
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                       <Image 
  src="/african-woman-with-glowing-skin.jpg" 
  alt="Mastercard" 
  width={100} 
  height={40} 
  className="h-5 sm:h-6 w-auto" 
/>
                       <Image 
  src="/african-woman-with-glowing-skin.jpg" 
  alt="Mastercard" 
  width={100} 
  height={40} 
  className="h-5 sm:h-6 w-auto" 
/>
                       <Image 
  src="/african-woman-with-glowing-skin.jpg" 
  alt="Mastercard" 
  width={100} 
  height={40} 
  className="h-5 sm:h-6 w-auto" 
/>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-accent/30 text-center">
                      <svg
                        className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 sm:mb-3 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        After clicking &quot;Pay now&quot;, you will be
                        redirected to Paystack to complete your purchase
                        securely.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="bank-transfer"
                        id="bank-transfer"
                      />
                      <Label
                        htmlFor="bank-transfer"
                        className="cursor-pointer font-medium text-xs sm:text-base"
                      >
                        Direct Bank Transfer
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Billing address */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  Billing address
                </h2>
                <RadioGroup
                  value={sameAddress ? "same" : "different"}
                  onValueChange={(val: string) =>
                    setSameAddress(val === "same")
                  }
                  className="space-y-2 sm:space-y-3"
                >
                  <div className="flex items-center justify-between p-3 sm:p-4 border-2 border-primary rounded-lg bg-primary/5">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="same" id="same-address" />
                      <Label
                        htmlFor="same-address"
                        className="cursor-pointer font-medium text-xs sm:text-base"
                      >
                        Same as shipping address
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="different"
                        id="different-address"
                      />
                      <Label
                        htmlFor="different-address"
                        className="cursor-pointer font-medium text-xs sm:text-base"
                      >
                        Use a different billing address
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button size="lg" className="w-full text-xs sm:text-base">
                Pay now
              </Button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <Link href="/shipping" className="hover:underline">
                  Shipping
                </Link>
                <Link href="/privacy" className="hover:underline">
                  Privacy policy
                </Link>
              </div>
            </div>

            {/* Right side - Order summary - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block bg-accent/30 p-4 sm:p-6 lg:p-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto rounded-lg lg:rounded-none">
              <div className="space-y-4 sm:space-y-6">
                {/* Cart items */}
                {cart.map((item) => {
                  const price = convertPrice(
                    item.price,
                    "NGN",
                    currency
                  );
                  return (
                    <div key={item.cartItemId} className="flex gap-3 sm:gap-4">
                      <div className="relative shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border border-border"
                          width={100}
                          height={100}
                        />
                        <span className="absolute -top-2 -right-2 bg-muted text-muted-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-medium line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.category}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold shrink-0">
                        {formatPrice(price * item.quantity, currency)}
                      </p>
                    </div>
                  );
                })}

                {/* Discount code */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDiscountCode(e.target.value)
                    }
                    className="text-xs sm:text-base"
                  />
                  <Button
                    variant="outline"
                    className="text-xs sm:text-base bg-transparent"
                  >
                    Apply
                  </Button>
                </div>

                {/* Totals */}
                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-border">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Subtotal: {cart.length} items</span>
                    <span className="font-medium">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <span>Shipping</span>
                      <svg
                        className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">
                      {formatPrice(shippingConverted, currency)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base sm:text-lg font-semibold pt-2 sm:pt-3 border-t border-border">
                    <span>Total</span>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground font-normal mr-2">
                        {currency}
                      </span>
                      <span>{formatPrice(total, currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
