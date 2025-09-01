export const planDetails = {
  basic: {
    name: "Basic Plan",
    description: "Suitable plan for starter business",
    monthly: 9.99,
    yearly: (9.99 * 12 * 0.8), // 20% off yearly
    features: [
      "5 Social Accounts",
      "100 Scheduled Posts/month",
      "Basic Analytics (90 days)",
      "2 Team Members",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  professional: {
    name: "Professional Plan",
    description: "Best plan for growing businesses",
    monthly: 14.99,
    yearly: (14.99 * 12 * 0.8), // 20% off yearly
    features: [
      "15 Social Accounts",
      "Unlimited Scheduled Posts",
      "Advanced Analytics (1 year)",
      "10 Team Members",
      "GoHighLevel Integration",
      "API Access",
      "Priority Support",
    ],
    buttonText: "Get Started",
    popular: true,
  },
  enterprise: {
    name: "Enterprise Plan",
    description: "Comprehensive solution for large enterprises",
    monthly: 19.99,
    yearly: (19.99 * 12 * 0.8), // 20% off yearly
    features: [
      "Unlimited Social Accounts",
      "Unlimited Scheduled Posts",
      "Advanced Analytics (Unlimited)",
      "Unlimited Team Members",
      "GoHighLevel Integration",
      "API Access",
      "White Label",
      "Dedicated Support",
    ],
    buttonText: "Get Started",
    popular: false,
  },
};

export type PlanName = keyof typeof planDetails;

export interface Plan {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  features: string[];
  buttonText: string;
  popular: boolean;
}
