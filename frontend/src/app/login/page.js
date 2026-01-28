"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/common/Container";
import authService from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess("Registration successful! Please sign in with your account.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      router.push("/");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen py-16 bg-beige-100 dark:bg-primary-700 transition-colors duration-300 flex items-center">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary-700 dark:text-white mb-2">
                Welcome back
              </h1>
              <p className="text-primary-700 dark:text-white/80">
                Sign in to your account to continue
              </p>
            </div>

            <div className="card p-8">
              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg">
                  <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                    {success}
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-primary-700 dark:text-white mb-2"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-primary-700 dark:text-white mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full px-4 py-3 pr-12 bg-white dark:bg-transparent border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700 dark:focus:ring-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-700 dark:text-white/60 hover:text-primary-800 dark:hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 border-2 border-primary-700 dark:border-white rounded accent-primary-700 dark:accent-white cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-primary-700 dark:text-white">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-700 dark:text-white hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#0f766e] text-white hover:bg-[#115e59] dark:bg-[#0f766e] dark:text-white dark:hover:bg-[#115e59]"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-primary-700 dark:text-white/80 mt-6">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary-700 dark:text-white hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
