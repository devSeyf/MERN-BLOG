import Link from 'next/link';
export default function Logo() {
  return (
    <Link href="/" 
      className="text-xl font-bold text-primary-700 dark:text-stone-50 
        hover:text-emerald-700 dark:hover:text-emerald-500 
        transition-colors duration-200"
    >
      Blog
    </Link>
  );
}
