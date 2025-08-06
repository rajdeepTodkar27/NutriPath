// components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
        
          <Link href="/" passHref>
            <span className="text-white text-2xl md:text-3xl font-bold cursor-pointer tracking-wide">
              NutriPath
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
