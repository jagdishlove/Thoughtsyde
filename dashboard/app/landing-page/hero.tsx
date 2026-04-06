import { Button } from "@/components/ui/button";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Zap,
  BarChart3,
} from "lucide-react";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient - static for better performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />

      {/* Subtle floating shapes for visual interest */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl -z-10 animate-float" />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10 animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left animate-fade-in-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6 
                          hover:scale-105 transition-transform duration-300 cursor-default"
            >
              <Sparkles className="w-4 h-4 animate-pulse-soft" />
              <span>Collect feedback effortlessly</span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 
                          bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent
                          animate-fade-in"
            >
              Collect Customer Feedback Seamlessly
            </h1>

            <p
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Easily integrate our widget and start collecting valuable feedback
              from your users today. Understand your customers and build better
              products.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <SignedOut>
                <SignUpButton>
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl 
                                            shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300
                                            transition-all duration-300 hover:-translate-y-1"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignUpButton>
                <p className="text-sm text-gray-500">No credit card required</p>
              </SignedOut>

              <SignedIn>
                <Button
                  asChild
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl 
                                              shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300
                                              transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </SignedIn>
            </div>

            {/* Trust badges */}
            <div
              className="mt-12 pt-8 border-t border-gray-200 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <p className="text-sm text-gray-500 mb-4">
                Trusted by developers worldwide
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-8 text-gray-400">
                <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium">3 Free Projects</span>
                </div>
                <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Unlimited Users</span>
                </div>
                <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">
                    Real-time Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image/Demo */}
          <div
            className="flex-1 max-w-xl w-full animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative group">
              <div
                className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-20 
                            group-hover:opacity-30 transition-opacity duration-500"
              />
              <div
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 
                            hover:shadow-3xl transition-shadow duration-500 "
              >
                <Image
                  src={"/demo.gif"}
                  alt="Demo of feedback widget"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
