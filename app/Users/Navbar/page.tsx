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
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Vitals", href: "/Users/Vitals" },
    { label: "Activities", href: "/Users/Activities" },
    { label: "Medication", href: "/Users/Medication" },
    { label: "Entertainment", href: "/Users/Entertainment" },
    { label: "Assistant", href: "/Users/Assistant" },
    { label: "Camera", href: "/Users/Camera" },
    { label: "HomeAutomation", href: "/Users/HomeAutomation" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const updateTestimonialsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", updateTestimonialsPerPage);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateTestimonialsPerPage);
    };
  }, [menuRef]);

  return (
    <nav className="bg-gray-800 py-4 shadow-lg absolute top-0 left-0 w-full z-50">
      <div className="max-w-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" passHref>
            <span className="text-white text-lg font-bold cursor-pointer">
              Swatantra
            </span>
          </Link>
        </div>

        {/* Hamburger menu */}
        <div className="flex lg:hidden">
          {!isMenuOpen && (
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none focus:bg-gray-700 px-2 scale-150"
            >
              <IoMenu />
            </button>
          )}
          {isMenuOpen && (
            <button className="text-white focus:outline-none focus:bg-gray-700 px-2 scale-150">
              <IoMenu />
            </button>
          )}
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              passHref
              className={`${
                link.href === currentPath ? "text-red-500" : "text-white"
              } hover:text-red-500 font-semibold mx-5 my-2 rounded-lg transition duration-300 ease-in-out group relative`}
            >
              {link.label}
              <span
              className={`${
                link.href === currentPath
                  ? "absolute left-0 bottom-[-3px] w-full h-[3px] bg-red-500 rounded-full scale-x-100"
                  : ""
              } absolute left-0 bottom-[-3px] w-full h-[3px] bg-red-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
            ></span>
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute mt-96 right-0 bg-gray-800 text-white  shadow-lg w-40 rounded-bl-3xl"
          >
            <ul className="py-2">
              {links.map((link) => (
                <li key={link.href} className="my-1">
                  <Link href={link.href} passHref>
                    <span
                      className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={closeMenu} // Close menu on link click
                    >
                      {link.label}
                    </span>
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