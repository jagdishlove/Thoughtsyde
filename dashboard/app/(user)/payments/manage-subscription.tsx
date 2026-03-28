"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Settings, CreditCard, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ManageSubscription = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToCustomerPortal = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const data = await response.json();
      
      if (data.url?.url) {
        router.push(data.url.url);
      } else {
        throw new Error("Invalid portal URL received");
      }
    } catch (err) {
      console.error("Portal error:", err);
      setError("Failed to open billing portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
        <Button 
          onClick={() => setError(null)} 
          variant="outline" 
          size="sm"
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-indigo-200 hover:bg-indigo-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Manage Subscription
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Billing Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={redirectToCustomerPortal} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Update Payment Method</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={redirectToCustomerPortal} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>View Invoices</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={redirectToCustomerPortal} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <span>Cancel Subscription</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ManageSubscription;