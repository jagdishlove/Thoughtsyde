import React from "react";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import logo from "../assets/logo/feedloop.png";
import { Button } from "./ui/button";
import Link from "next/link";
import Menu from "./Menu";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border-b px-10 ">
      <Link href="/">
        <Image src={logo} alt="LOGO" height={50} width={80} />
      </Link>
      <div>
        <SignedOut>
          <div className="flex gap-4">
            <SignInButton>
              <Button className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white font-semibold py-2 px-6 rounded-m shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300">
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white font-semibold py-2 px-6 rounded-m shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-300">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </SignedOut>
        {/* <Menu /> */}
        <div className="flex items-center gap-3">
          <Menu />
          <SignedIn>
            <div className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer ">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
