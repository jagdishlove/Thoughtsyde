import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeaderMenu from "@/components/header-menu";
import feedloopLogo from "@/assets/logo/feedloop.png";

const PageHeader = () => {
  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
            <Image 
              src={feedloopLogo} 
              alt="Feedloop" 
              width={120} 
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/#features" 
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/#pricing" 
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <HeaderMenu />
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;