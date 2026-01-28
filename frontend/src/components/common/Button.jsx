export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) {
  const baseClasses = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#0f766e]text-white hover:bg-primary-800 focus:ring-primary-500 dark:bg-white dark:text-primary-700 dark:hover:bg-gray-100',
   solid: 'bg-[#0f766e] text-white hover:bg-[#115e59] focus:ring-[#0f766e] dark:bg-[#0f766e] dark:text-white dark:hover:bg-[#115e59]',

    secondary: 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-stone-600',
    outline: 'bg-transparent text-emerald-700 dark:text-emerald-500 border border-emerald-700 dark:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900',
    ghost: 'bg-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}
