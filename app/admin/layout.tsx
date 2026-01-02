"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Home } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Kelola Menu', href: '/admin/menu', icon: <UtensilsCrossed size={20} /> },
    { name: 'Transaksi', href: '/admin/transactions', icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <h1 className="text-xl font-black text-gray-800 tracking-tighter text-center">
            WARUNG <span className="text-[#a52a2a]">HALU</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
                pathname === item.href 
                ? 'bg-[#a52a2a] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 font-bold hover:text-black transition">
            <Home size={20} /> Kembali ke Web
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}