'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';

import authService from '@/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [e.target.name]: '',
      submit: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.register({
        username: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      // Success - redirect to login
      router.push('/login?registered=true');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen py-16 bg-beige-100 dark:bg-primary-700 transition-colors duration-300 flex items-center">
        <Container>
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary-700 dark:text-white mb-2">
                Create an account
              </h1>
              <p className="text-primary-700 dark:text-white/80">
                Join our community of writers and readers
              </p>
            </div>

            {/* Register Card */}
            <div className="card p-8">
              {/* Register Form */}
              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-primary-700 dark:text-white mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={`w-full px-4 py-3 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${errors.fullName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                      }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
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
                    className={`w-full px-4 py-3 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                      }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-primary-700 dark:text-white mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      className={`w-full px-4 py-3 pr-12 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${errors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-700 dark:text-white/60 hover:text-primary-800 dark:hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-primary-700 dark:text-white mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      className={`w-full px-4 py-3 pr-12 bg-white dark:bg-transparent border-2 rounded-lg text-primary-700 dark:text-white placeholder-primary-700/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-primary-700 dark:border-white focus:ring-primary-700 dark:focus:ring-white'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-700 dark:text-white/60 hover:text-primary-800 dark:hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        setErrors({ ...errors, terms: '' });
                      }}
                      className="w-4 h-4 mt-1 border-2 border-primary-700 dark:border-white rounded accent-primary-700 dark:accent-white cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-primary-700 dark:text-white">
                      I agree to the{' '}
                      <Link href="/terms" className="font-semibold hover:underline">
                        Terms and Conditions
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="font-semibold hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
                  )}
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-primary-700 dark:bg-white text-white dark:text-primary-700 font-semibold rounded-lg hover:bg-primary-800 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-700/20 dark:border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-transparent text-primary-700 dark:text-white/60">
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Social Register */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="px-4 py-3 border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white font-medium hover:bg-primary-700/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button className="px-4 py-3 border-2 border-primary-700 dark:border-white rounded-lg text-primary-700 dark:text-white font-medium hover:bg-primary-700/10 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-primary-700 dark:text-white/80">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-primary-700 dark:text-white hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
