export type MarketingPaymentMethod = "credits" | "flutterwave";

export const CREDIT_VALUE_NGN = 1000;

export const SERVICE_PRICING = {
  photography: {
    basic: { price: 50000, credits: 50 },
    standard: { price: 100000, credits: 100 },
    premium: { price: 150000, credits: 150 },
  },
  videography: {
    walkthrough: { price: 120000, credits: 150 },
    cinematic: { price: 200000, credits: 200 },
  },
  "3d-tour": {
    standard: { price: 200000, credits: 200 },
  },
} as const;

export const DIGITAL_ADS_MINIMUM = {
  price: 30000,
  credits: 30,
} as const;

export const computeAdCredits = (budget: number) =>
  Math.max(DIGITAL_ADS_MINIMUM.credits, Math.ceil(budget / CREDIT_VALUE_NGN));

