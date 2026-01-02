"use client";
import { useState, useEffect } from 'react';

export default function MenuSection({ onCheckout }: { onCheckout: (cart: any[], total: number) => void }) {
  const [menus, setMenus] = useState<any[]>([]);
  const [filter, setFilter] = useState("semua");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari MySQL via API Next.js
  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenus(data);
        setLoading(false);
      });
  }, []);

  const addToCart = (item: any) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const filteredMenus = filter === "semua" 
    ? menus 
    : menus.filter(m => m.kategori === filter);

  if (loading) return <p className="text-center py-20 text-xl font-bold">Sedang memuat menu lezat...</p>;

  return (
    <section id="menu-page" className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 italic">Menu Halu</h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {["semua", "makanan-pedas", "makanan-manis", "minuman"].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              filter === cat ? 'bg-[#FFC107] text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMenus.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            <img src={`/images/${item.gambar}`} alt={item.nama} className="w-full h-52 object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800">{item.nama}</h3>
              {item.level > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Level {item.level}</span>}
              <p className="text-[#a52a2a] text-xl font-black mt-2">Rp {item.harga.toLocaleString()}</p>
              <button 
                onClick={() => addToCart(item)}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl transition"
              >
                + Tambah Ke Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Tombol Melayang untuk Lihat Keranjang jika cart tidak kosong */}
      {cart.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <button 
                onClick={() => onCheckout(cart, cart.reduce((a, b) => a + (b.harga * b.qty), 0))}
                className="w-full bg-[#a52a2a] text-white py-4 rounded-2xl shadow-2xl font-bold text-lg animate-bounce"
            >
                🛒 Checkout Pesanan (Rp {cart.reduce((a, b) => a + (b.harga * b.qty), 0).toLocaleString()})
            </button>
        </div>
      )}
    </section>
  );
}