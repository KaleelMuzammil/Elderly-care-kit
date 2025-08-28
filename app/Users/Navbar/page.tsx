"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMenu } from "react-icons/io5";

interface NavLink {
  label: string;
  href: string;
}

const NavBar: React.FC = () => {
  const pathname = usePathname() || "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Use lowercase, file-system-safe routes
  const links: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Vitals", href: "/Users/Vitals" },
  { label: "Activities", href: "/Users/Activities" },
  { label: "Medication", href: "/Users/Medication" },
  { label: "Entertainment", href: "/Users/Entertainment" },
  { label: "Assistant", href: "/Users/Assistant" },
  { label: "Camera", href: "/Users/Camera" },
  { label: "HomeAutomation", href: "/Users/HomeAutomation" },
   { label: "Login", href: "/Users/Login" },
];

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  // Active if exact match OR current path starts with href (for nested pages)
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="bg-gray-800 py-4 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-full mx-auto px-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center">
          <Link href="/" className="text-white text-lg font-bold">
            Swatantra
          </Link>
        </div>

        {/* Hamburger (mobile) */}
        <div className="flex lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:bg-gray-700 px-2 scale-150"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <IoMenu />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                isActive(link.href) ? "text-red-500" : "text-white"
              } hover:text-red-500 font-semibold mx-5 my-2 rounded-lg transition duration-300 ease-in-out group relative`}
              onClick={closeMenu}
            >
              {link.label}
              <span
                className={`absolute left-0 bottom-[-3px] w-full h-[3px] bg-red-500 rounded-full transition-transform duration-300 origin-left ${
                  isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            id="mobile-menu"
            className="absolute top-full right-0 mt-2 bg-gray-800 text-white shadow-lg w-48 rounded-bl-3xl border border-gray-700"
          >
            <ul className="py-2">
              {links.map((link) => (
                <li key={link.href} className="my-1">
                  <Link
                    href={link.href}
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
