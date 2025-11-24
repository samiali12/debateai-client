"use client";

import Image from "next/image";
import Logo from "@/assets/logo/debate-ai-logo-half-transparent.png";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useLazyLogoutUserQuery } from "@/redux/features/auth/authApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth" });
};

const navlinks = [
  {
    id: 12,
    title: "Debates",
    href: "/debates",
    onClick: () => scrollToSection("debates"),
  },
  {
    id: 1,
    title: "Features",
    href: "#features",
    onClick: () => scrollToSection("features"),
  },
  {
    id: 2,
    title: "How It Works",
    href: "#how-it-works",
    onClick: () => scrollToSection("how-it-works"),
  },
  {
    id: 3,
    title: "Roles",
    href: "#roles",
    onClick: () => scrollToSection("roles"),
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [triggerLogout] = useLazyLogoutUserQuery();

  const handleLogout = async () => {
    try {
      await triggerLogout({}).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10 bg-gradient-to-b from-[#3E1E68]/95 to-[#3E1E68]/80">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={Logo}
              alt="Debate ai logo"
              className=""
              height={50}
              width={50}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent">
              AI Debate
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {navlinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {
                  (user && link.id === 12) ? (
                    "Debates"
                  ) : (
                    link.title
                  )
                }
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    className="relative h-8 w-8 rounded-full ml-4"
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-500 text-sm font-medium text-white">
                      {user.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/5 backdrop-blur" align="end" forceMount>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition-all duration-300 border border-white/20"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-lg text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-[#FFACAC] transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-white/10 pt-4">
            <nav className="">
              {navlinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
            <div className="space-y-2 pt-4 border-t border-white/10">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="block w-full px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition-all duration-300 border border-white/20 text-center"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 bg-red-600 rounded-lg text-white font-semibold text-center shadow-lg hover:bg-red-700"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition-all duration-300 border border-white/20 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full px-4 py-2 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-lg text-white font-semibold text-center shadow-lg shadow-[#E45A92]/50"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
