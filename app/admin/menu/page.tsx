"use client";
import { useEffect, useState } from 'react';

export default function ManageMenuPage() {
  const [menus, setMenus] = useState([]);
  
  const fetchMenus = async () => {
    const res = await fetch('/api/menu');
    const data = await res.json();
    setMenus(data);
  };

  useEffect(() => { fetchMenus(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Daftar Menu Tersedia</h2>
        <button className="bg-[#a52a2a] text-white px-6 py-2 rounded-xl font-bold">+ Menu Baru</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold text-gray-600">Menu</th>
              <th className="p-4 font-bold text-gray-600">Kategori</th>
              <th className="p-4 font-bold text-gray-600">Harga</th>
              <th className="p-4 font-bold text-gray-600">Status</th>
              <th className="p-4 font-bold text-gray-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((item: any) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={`/images/${item.gambar}`} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    <span className="font-bold text-gray-800">{item.nama}</span>
                  </div>
                </td>
                <td className="p-4 capitalize">{item.kategori.replace('-', ' ')}</td>
                <td className="p-4 font-bold">Rp {item.harga.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.isReady ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.isReady ? 'Ready' : 'Habis'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-blue-600 font-bold text-sm mr-3">Edit</button>
                  <button className="text-red-500 font-bold text-sm">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}