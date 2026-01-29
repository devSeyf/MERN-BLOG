'use client';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '@/redux/slices/themeSlice';
export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const handleToggle = () => {
    dispatch(toggleTheme());
  };
  const isDark = mode === 'dark';
  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-stone-200 dark:bg-stone-700 
        hover:bg-stone-300 dark:hover:bg-stone-600 
        transition-all duration-200 
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 
        dark:focus:ring-offset-stone-900"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <svg 
          className="w-5 h-5 text-yellow-500 dark:text-yellow-300 transition-transform duration-300 rotate-0 hover:rotate-180" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg 
          className="w-5 h-5 text-stone-700 dark:text-stone-300 transition-transform duration-300 rotate-0 hover:-rotate-12" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
