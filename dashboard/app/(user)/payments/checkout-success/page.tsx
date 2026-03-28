import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";

export default function CheckoutSuccessPage() {
  return (
    <div className="section-container py-20 min-h-[80vh] flex items-center justify-center">
      <AnimatedSection animation="scale-in" className="max-w-md w-full mx-auto text-center px-4">
        <Card className="card-hover p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />
          
          <CardContent className="p-0 pt-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse-soft">
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

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <p className="text-sm font-medium text-gray-900">What&apos;s next?</p>
              </div>
              <p className="text-gray-700 text-sm">
                Start creating unlimited projects and collecting feedback from
                your users.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard">
                <Button className="btn-primary w-full group">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/payments">
                <Button variant="outline" className="btn-secondary w-full">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-500 mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          A confirmation email has been sent to your email address.
        </p>
      </AnimatedSection>
    </div>
  );
}
