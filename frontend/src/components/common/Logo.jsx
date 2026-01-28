import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      {/* Icon with gradient background */}
      <div className="relative">
      </div>
      
      {/* Text logo */}
      <div className="flex flex-col">
        <span className="text-xl font-bold text-stone-900 dark:text-stone-50 leading-tight">
          Blog
        </span>
 
      </div>
    </Link>
  );
}
