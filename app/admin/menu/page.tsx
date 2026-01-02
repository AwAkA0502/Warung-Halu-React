"use client";
import { useEffect, useState } from 'react';

// Pastikan ada kata 'default' di baris ini
export default function AdminMenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        setMenus(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat Menu...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Kelola Menu</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Harga</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.nama}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    {item.category?.name || 'Tanpa Kategori'}
                  </span>
                </td>
                <td className="p-3">Rp {item.harga.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}