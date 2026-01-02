import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-[1001] flex items-center justify-between bg-[#FFC107] px-6 py-4 shadow-md">
      <div className="flex items-center gap-4">
        <img src="images/LOGOO.png" alt="Logo" className="h-12 w-auto" />
        <span className="text-2xl font-bold text-white drop-shadow-sm">Warung Halu</span>
      </div>
      <nav>
        <ul className="hidden md:flex gap-6 text-white font-bold">
          <li><Link href="#beranda" className="hover:text-gray-800 transition">Beranda</Link></li>
          <li><Link href="#menu-page" className="hover:text-gray-800 transition">Menu</Link></li>
          <li><Link href="#lokasi-kami" className="hover:text-gray-800 transition">Lokasi</Link></li>
        </ul>
      </nav>
    </header>
  );
}