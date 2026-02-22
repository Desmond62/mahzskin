// Fallback rates (used if API fails)
const FALLBACK_RATES: Record<string, number> = {
  NGN: 1,
  USD: 0.000747, // 1 USD = 1,338.55 NGN
  EUR: 0.00058, // 1 EUR = 1,723 NGN
  GBP: 0.000487, // 1 GBP = 2,054 NGN
  CHF: 0.000545, // 1 CHF = 1,835 NGN
}

// Cache key and duration (24 hours)
const CACHE_KEY = 'mahzskin_currency_rates';
const CACHE_TIMESTAMP_KEY = 'mahzskin_currency_rates_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Dynamic rates (will be updated from API)
let CURRENCY_RATES: Record<string, number> = { ...FALLBACK_RATES };

export const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
  CHF: "CHF",
}

// Fetch rates from ExchangeRate-API
async function fetchCurrencyRates(): Promise<Record<string, number> | null> {
  // Only run on client side
  if (typeof window === 'undefined') return null;
  
  try {
    // Using ExchangeRate-API free tier (no API key required for basic usage)
    // Base currency is NGN (Nigerian Naira)
    const response = await fetch('https://open.er-api.com/v6/latest/NGN', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch currency rates');
    }

    const data = await response.json();
    
    if (data.result === 'success' && data.rates) {
      return {
        NGN: 1,
        USD: data.rates.USD || FALLBACK_RATES.USD,
        EUR: data.rates.EUR || FALLBACK_RATES.EUR,
        GBP: data.rates.GBP || FALLBACK_RATES.GBP,
        CHF: data.rates.CHF || FALLBACK_RATES.CHF,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return null;
  }
}

// Load rates from cache or fetch new ones
export async function loadCurrencyRates(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Check if we have cached rates
    const cachedRates = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    const now = Date.now();
    const isCacheValid = cachedTimestamp && (now - parseInt(cachedTimestamp)) < CACHE_DURATION;

    if (cachedRates && isCacheValid) {
      // Use cached rates
      CURRENCY_RATES = JSON.parse(cachedRates);
      console.log('Using cached currency rates');
      return;
    }

    // Fetch new rates
    console.log('Fetching fresh currency rates...');
    const freshRates = await fetchCurrencyRates();

    if (freshRates) {
      CURRENCY_RATES = freshRates;
      // Cache the rates
      localStorage.setItem(CACHE_KEY, JSON.stringify(freshRates));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
      console.log('Currency rates updated successfully');
    } else {
      // Use fallback rates if fetch failed
      CURRENCY_RATES = { ...FALLBACK_RATES };
      console.log('Using fallback currency rates');
    }
  } catch (error) {
    console.error('Error loading currency rates:', error);
    CURRENCY_RATES = { ...FALLBACK_RATES };
  }
}

// Get current rates
export function getCurrencyRates(): Record<string, number> {
  return CURRENCY_RATES;
}

export function convertPrice(amount: number, fromCurrency: string, toCurrency: string): number {
  const rates = getCurrencyRates();
  const inNGN = amount / rates[fromCurrency];
  return inNGN * rates[toCurrency];
}

export function formatPrice(amount: number, currency: string): string {
  return `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function getCurrency(): string {
  if (typeof window === "undefined") return "NGN"
  return localStorage.getItem("mahzskin_currency") || "NGN"
}
