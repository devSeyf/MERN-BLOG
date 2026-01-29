'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Container from '@/components/common/Container';

import authService from '@/services/authService';
import Button from '@/components/common/Button';

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
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="solid"
                  className="w-full py-3"
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
                </Button>
              </form>



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
