"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "../common/Container";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import Button from "../common/Button";
import authService from "@/services/authService";

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();
      setUser(currentUser);
      setIsAuthenticated(authenticated);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F9F5F0]/80 backdrop-blur-md dark:bg-stone-900 border-b border-gray-400 dark:border-gray-600">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Logo />
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-stone-700 dark:text-stone-300 
        hover:text-emerald-700 dark:hover:text-emerald-500 
        transition-colors duration-200
        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 
        after:bg-emerald-700 dark:after:bg-emerald-500 
        after:transition-all after:duration-300
        hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* My Blogs - Icon Only */}
                <Link href="/my-blogs">
                  <button
                    className="p-2 rounded-lg 
            text-primary-700 dark:text-stone-300 
            hover:bg-stone-200 dark:hover:bg-stone-800 
            hover:text-primary-800 dark:hover:text-stone-100
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label="My Blogs"
                    title="My Blogs"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </button>
                </Link>

                {/* Create Post - Icon + Text (Primary Action) */}
                <Link href="/create">
                  <Button
                    variant="solid"
                    size="sm"
                    className="bg-emerald-600 dark:bg-emerald-700 
            text-white 
            hover:bg-emerald-700 dark:hover:bg-emerald-600 
            border-0 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create
                  </Button>
                </Link>

                {/* User Section */}
                <div className="flex items-center gap-3 pl-3 
        border-l border-stone-300 dark:border-stone-700">
                  <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full 
            bg-emerald-600 dark:bg-emerald-700 
            flex items-center justify-center 
            text-white text-sm font-semibold 
            ring-2 ring-emerald-200 dark:ring-emerald-900">
                      {user?.username?.charAt(0).toUpperCase() || 'N'}
                    </div>
                    <span className="text-sm font-medium 
            text-primary-700 dark:text-stone-300 
            max-w-[100px] truncate">
                      {user?.username}
                    </span>
                  </div>

                  {/* Logout Icon Only */}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg 
            border border-stone-300 dark:border-stone-600 
            text-primary-700 dark:text-stone-300 
            hover:bg-red-50 dark:hover:bg-red-900/20 
            hover:text-red-600 dark:hover:text-red-400 
            hover:border-red-300 dark:hover:border-red-700
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login */}
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-700 dark:text-stone-300 
            hover:bg-stone-200 dark:hover:bg-stone-800 
            hover:text-primary-800 dark:hover:text-stone-100"
                  >
                    Login
                  </Button>
                </Link>

                {/* Get Started */}
                <Link href="/register">
                  <Button
                    variant="solid"
                    size="sm"
                    className="bg-emerald-600 dark:bg-emerald-700 
            text-white 
            hover:bg-emerald-700 dark:hover:bg-emerald-600 
            border-0"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>


          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg 
      text-primary-700 dark:text-stone-300 
      hover:bg-stone-200 dark:hover:bg-stone-800 
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
      active:scale-95"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6 transition-transform duration-200 rotate-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 animate-fade-in">
            <nav className="flex flex-col gap-2 px-4">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-base font-medium 
            text-primary-700 dark:text-stone-300 
            hover:text-emerald-700 dark:hover:text-emerald-500 
            hover:bg-white dark:hover:bg-stone-800 
            rounded-lg transition-colors duration-200
            active:scale-98"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth Section */}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-stone-200 dark:border-stone-800">
                {isAuthenticated ? (
                  <>
                    {/* User Greeting with Avatar */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-stone-800 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 dark:bg-emerald-700 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-emerald-200 dark:ring-emerald-900">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-stone-500 dark:text-stone-400">Welcome back</p>
                        <p className="text-sm font-semibold text-primary-700 dark:text-stone-200 truncate">
                          {user?.username}
                        </p>
                      </div>
                    </div>

                    {/* My Blogs - with icon */}
                    <Link
                      href="/my-blogs"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button className="w-full px-4 py-3 flex items-center gap-3 text-base font-medium text-primary-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800 rounded-lg transition-colors duration-200">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        My Blogs
                      </button>
                    </Link>

                    {/* Create Post - Primary Action */}
                    <Link
                      href="/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="solid"
                        size="md"
                        fullWidth
                        className="bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 border-0 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Post
                      </Button>
                    </Link>

                    {/* Logout - Warning Style */}
                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="border-stone-300 dark:border-stone-600 text-primary-700 dark:text-stone-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Login */}
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="md"
                        fullWidth
                        className="text-primary-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800"
                      >
                        Login
                      </Button>
                    </Link>

                    {/* Get Started - Primary Action */}
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="solid"
                        size="md"
                        fullWidth
                        className="bg-emerald-600 dark:bg-emerald-700 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 border-0"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}

      </Container>
    </header>
  );
}
