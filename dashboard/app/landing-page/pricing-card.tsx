"use client";
import { PricingPlan } from "./pricing-section";
import { Check, Crown, ArrowDown, Loader2, CreditCard, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { useState } from "react";
import { getStripe } from "@/lib/stripe-client";
import { monthlyPlanId, yearlyPlanId } from "@/lib/payments";

type PricingCardProps = PricingPlan & {
  isAuthenticated?: boolean;
  isCurrentPlan?: boolean;
  hasActiveSubscription?: boolean;
  onManageSubscription?: () => void;
};

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular,
  planKey,
  isAuthenticated = false,
  isCurrentPlan,
  hasActiveSubscription,
  onManageSubscription,
}: PricingCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isCurrentPlan) return;
    if (!isAuthenticated) return;

    setIsLoading(true);

    // Free plan with active subscription = cancel/downgrade
    if (planKey === "free" && hasActiveSubscription) {
      // Open customer portal to cancel
      if (onManageSubscription) {
        onManageSubscription();
      } else {
        // Navigate to portal directly
        try {
          const response = await fetch("/api/stripe/create-portal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          if (data.url?.url) {
            router.push(data.url.url);
          }
        } catch (error) {
          console.error("Failed to open portal:", error);
        }
      }
      setIsLoading(false);
      return;
    }

    // Direct Stripe checkout for paid plans - NO intermediate page
    if (planKey === "monthly" || planKey === "yearly") {
      try {
        const priceId = planKey === "monthly" ? monthlyPlanId : yearlyPlanId;
        
        const response = await fetch("/api/stripe/checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price: priceId }),
        });

        const { sessionId, error } = await response.json();

        if (error) {
          console.error("Checkout error:", error);
          setIsLoading(false);
          return;
        }

        const stripe = await getStripe();
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        }
      } catch (error) {
        console.error("Failed to create checkout session:", error);
      }
      setIsLoading(false);
      return;
    }

    // Free plan - just navigate to dashboard
    router.push("/dashboard");
  };

  // Determine button text and state
  const getButtonConfig = () => {
    if (!isAuthenticated) {
      return {
        text: "Get Started",
        icon: <Sparkles className="w-4 h-4 mr-2" />,
        disabled: false,
        variant: "default" as const,
        className: "bg-gray-900 hover:bg-gray-800",
      };
    }

    if (isCurrentPlan) {
      return {
        text: "Current Plan",
        icon: <Crown className="w-4 h-4 mr-2" />,
        disabled: true,
        variant: "default" as const,
        className: "bg-green-600 hover:bg-green-600 cursor-default",
      };
    }

    if (planKey === "free" && hasActiveSubscription) {
      return {
        text: isLoading ? "Opening Portal..." : "Downgrade to Free",
        icon: <ArrowDown className="w-4 h-4 mr-2" />,
        disabled: isLoading,
        variant: "outline" as const,
        className: "border-gray-400 hover:bg-gray-100",
      };
    }

    if (hasActiveSubscription) {
      return {
        text: isLoading ? "Processing..." : `Switch to ${title}`,
        icon: <CreditCard className="w-4 h-4 mr-2" />,
        disabled: isLoading,
        variant: "default" as const,
        className: "bg-gray-900 hover:bg-gray-800",
      };
    }

    if (planKey === "monthly" || planKey === "yearly") {
      return {
        text: isLoading ? "Loading..." : `Subscribe Now`,
        icon: <CreditCard className="w-4 h-4 mr-2" />,
        disabled: isLoading,
        variant: "default" as const,
        className: "bg-gray-900 hover:bg-gray-800",
      };
    }

    return {
      text: "Get Started Free",
      icon: <Sparkles className="w-4 h-4 mr-2" />,
      disabled: false,
      variant: "outline" as const,
      className: "border-gray-400 hover:bg-gray-100",
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div
      className={`border flex flex-col justify-between rounded-xl h-full p-6 transition-all duration-500 text-left relative
        hover:shadow-2xl hover:-translate-y-2 cursor-default
        ${isCurrentPlan 
          ? "bg-gradient-to-b from-green-50 to-white border-green-500 border-2 shadow-xl scale-[1.02]" 
          : "bg-white hover:shadow-xl"
        }`}
    >
      {/* Plan badges */}
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 
                      rounded-full text-sm font-medium shadow-md flex items-center gap-1
                      animate-pulse-soft">
          <Crown className="w-3 h-3" />
          Current Plan
        </div>
      )}
      
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-3 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium 
                      shadow-md animate-fade-in">
          Popular
        </div>
      )}

      {/* Price */}
      <div className="mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">$</span>
          <span className="font-extrabold text-4xl transition-all duration-300 hover:scale-105">{price}</span>
          {price > 0 && (
            <span className="text-gray-500 text-sm">
              /{planKey === "yearly" ? "year" : "month"}
            </span>
          )}
        </div>
        
        <h2 className="font-bold text-xl mt-3">{title}</h2>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        
        <div className="border-t border-gray-200 my-4"></div>
        
        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-700 group/item"
            >
              <div
                className={`rounded-full flex items-center justify-center w-5 h-5 flex-shrink-0 mt-0.5 
                          transition-all duration-300 group-hover/item:scale-110
                          ${isCurrentPlan ? "bg-green-600" : "bg-gray-900"}`}
              >
                <Check className="text-white" width={12} height={12} strokeWidth={3} />
              </div>
              <span className="text-sm group-hover/item:text-gray-900 transition-colors">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      <div className="mt-6">
        {!isAuthenticated ? (
          <SignUpButton mode="modal">
            <Button
              variant={buttonConfig.variant}
              className={`w-full py-3 font-medium transition-all duration-300 
                hover:scale-[1.02] active:scale-[0.98]
                ${buttonConfig.className}`}
            >
              {buttonConfig.icon}
              {buttonConfig.text}
            </Button>
          </SignUpButton>
        ) : (
          <Button
            onClick={handleClick}
            disabled={buttonConfig.disabled}
            variant={buttonConfig.variant}
            className={`w-full py-3 font-medium transition-all duration-300 
              hover:scale-[1.02] active:scale-[0.98]
              ${buttonConfig.className}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {buttonConfig.text}
              </>
            ) : (
              <>
                {buttonConfig.icon}
                {buttonConfig.text}
              </>
            )}
          </Button>
        )}
        
        {/* Helper text */}
        {!isAuthenticated && (
          <p className="text-xs text-gray-500 text-center mt-2 animate-fade-in">
            Free signup, no credit card required
          </p>
        )}
        {isAuthenticated && planKey === "free" && hasActiveSubscription && !isCurrentPlan && (
          <p className="text-xs text-gray-500 text-center mt-2 animate-fade-in">
            Opens billing portal to cancel subscription
          </p>
        )}
        
        {isAuthenticated && (planKey === "monthly" || planKey === "yearly") && !hasActiveSubscription && (
          <p className="text-xs text-gray-500 text-center mt-2 animate-fade-in">
            Direct checkout with Stripe
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
