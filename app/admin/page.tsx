"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);

  const fetchData = async () => {
    try {
      const [resOrders, resTables] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/tables')
      ]);
      setOrders(await resOrders.json());
      setTables(await resTables.json());
    } catch (err) {
      console.error("Gagal ambil data", err);
    }
  };

  // FUNGSI UNTUK FIX ERROR 'updateStatus'
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchData(); // Refresh data setelah update
    } catch (err) {
      alert("Gagal update status");
    }
  };

  useEffect(() => {
    fetchData();
    const inv = setInterval(fetchData, 5000); // Auto-refresh setiap 5 detik
    return () => clearInterval(inv);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Warung Halu Admin Dashboard</h1>

      {/* PETA MEJA DENGAN QR LINK */}
      <h2 className="font-bold mb-3 text-gray-700">Status & QR Meja</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {tables.map((t: any) => (
          <div key={t.id} className={`p-4 rounded-2xl border-2 transition-all ${
            t.status === 'Occupied' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <p className="text-xs font-bold text-gray-500 uppercase">Meja {t.number}</p>
            <p className={`font-black text-lg ${t.status === 'Occupied' ? 'text-red-600' : 'text-green-600'}`}>
              {t.status}
            </p>
            
            {/* Tampilkan link QR jika ada */}
            {t.qrUrl && (
              <a 
                href={t.qrUrl} 
                target="_blank" 
                className="text-[10px] text-blue-500 underline mt-2 block truncate"
              >
                Buka Link QR
              </a>
            )}
          </div>
        ))}
      </div>

      {/* DAFTAR PESANAN TERBARU */}
      <h2 className="font-bold mb-3 text-gray-700">Pesanan Masuk</h2>
      <div className="grid gap-4">
        {orders.length === 0 && <p className="text-gray-400">Belum ada pesanan.</p>}
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${order.status === 'Pending' ? 'bg-yellow-400' : 'bg-blue-500'}`}></span>
                <p className="font-bold text-gray-800">{order.customerName}</p>
              </div>
              <p className="text-sm text-gray-500">
                {order.orderType} 
                {order.table?.number ? ` • Meja ${order.table.number}` : ''}
              </p>
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id}>{item.qty}x {item.menu.nama}</div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-bold text-blue-600 text-lg">Rp {order.total.toLocaleString()}</p>
              {order.status === "Pending" ? (
                 <button 
                  onClick={() => updateStatus(order.id, "Selesai")} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  Selesaikan
                </button>
              ) : (
                <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">✓ Selesai</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}