import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 border">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for subscribing. Your account has been upgraded and you
            now have access to all premium features.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">What&apos;s next?</p>
            <p className="text-gray-700">
              Start creating unlimited projects and collecting feedback from
              your users.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <Button className="w-full bg-black hover:bg-gray-800">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/payments">
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    </div>
  );
}
