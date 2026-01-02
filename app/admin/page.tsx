"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  // Pastikan default state adalah array kosong [] agar .map tidak error di awal
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resOrders, resTables] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/tables')
      ]);

      const dataOrders = await resOrders.json();
      const dataTables = await resTables.json();

      // SAFETY CHECK: Hanya set data jika formatnya adalah Array
      setOrders(Array.isArray(dataOrders) ? dataOrders : []);
      setTables(Array.isArray(dataTables) ? dataTables : []);
    } catch (err) {
      console.error("Gagal ambil data", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchData(); 
    } catch (err) {
      alert("Gagal update status");
    }
  };

  useEffect(() => {
    fetchData();
    const inv = setInterval(fetchData, 5000); 
    return () => clearInterval(inv);
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat data admin...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Warung Halu Admin Dashboard</h1>

      {/* --- PETA MEJA --- */}
      <h2 className="font-bold mb-3 text-gray-600 uppercase text-sm tracking-widest">Status & QR Meja</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {tables.length > 0 ? tables.map((t: any) => (
          <div key={t.id} className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
            t.status === 'Occupied' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <p className="text-xs font-bold text-gray-400 uppercase">Meja {t.number}</p>
            <p className={`font-black text-lg ${t.status === 'Occupied' ? 'text-red-600' : 'text-green-600'}`}>
              {t.status}
            </p>
            {t.qrUrl && (
              <a href={t.qrUrl} target="_blank" className="text-[10px] text-blue-500 underline mt-2 block truncate">
                Link QR Meja
              </a>
            )}
          </div>
        )) : <p className="text-gray-400 text-sm">Belum ada data meja.</p>}
      </div>

      {/* --- DAFTAR PESANAN --- */}
      <h2 className="font-bold mb-3 text-gray-600 uppercase text-sm tracking-widest">Pesanan Masuk</h2>
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400">
            Belum ada pesanan masuk hari ini.
          </div>
        ) : orders.map((order: any) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 animate-in fade-in duration-500">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-3 h-3 rounded-full ${order.status === 'Pending' ? 'bg-yellow-400' : 'bg-blue-500'}`}></span>
                <p className="font-bold text-gray-800 text-lg">{order.customerName}</p>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {order.orderType} 
                {order.table?.number ? ` • Meja ${order.table.number}` : ''}
              </p>
              
              {/* Detail Item dengan pengecekan relasi */}
              <div className="mt-3 space-y-1">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id} className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg inline-block mr-2">
                    <span className="font-bold text-blue-600">{item.qty}x</span> {item.menu?.nama || 'Menu dihapus'}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold">Total Tagihan</p>
                <p className="font-black text-blue-600 text-xl">Rp {order.total.toLocaleString()}</p>
              </div>
              
              {order.status === "Pending" ? (
                 <button 
                  onClick={() => updateStatus(order.id, "Selesai")} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                  Selesaikan
                </button>
              ) : (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  LUNAS
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}