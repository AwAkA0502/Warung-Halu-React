"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
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

      // Pastikan selalu array agar .map() tidak error
      setOrders(Array.isArray(dataOrders) ? dataOrders : []);
      setTables(Array.isArray(dataTables) ? dataTables : []);
    } catch (error) {
      console.error("Gagal load data admin:", error);
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
      alert("Gagal memperbarui status");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-gray-400 animate-pulse">Sinkronisasi Database Aiven...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">
            Warung Halu <span className="text-[#a52a2a]">Admin</span>
          </h1>
          <button 
            onClick={fetchData}
            className="bg-white border border-gray-200 px-6 py-2 rounded-2xl shadow-sm text-sm font-bold hover:bg-gray-100 transition-all active:scale-95"
          >
            🔄 Refresh Dashboard
          </button>
        </div>

        {/* PETA STATUS MEJA */}
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Monitoring Meja</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
          {tables.length > 0 ? tables.map((t) => (
            <div key={t.id} className={`p-4 rounded-3xl border-2 transition-all ${
              t.status === 'Occupied' ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 shadow-sm'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-gray-400">#0{t.number}</span>
                <div className={`w-2 h-2 rounded-full ${t.status === 'Occupied' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              </div>
              <p className={`text-sm font-black ${t.status === 'Occupied' ? 'text-red-600' : 'text-green-600'}`}>
                {t.status === 'Occupied' ? 'TERISI' : 'KOSONG'}
              </p>
            </div>
          )) : <p className="text-gray-400 text-xs">Meja belum dikonfigurasi.</p>}
        </div>

        {/* GRID PESANAN ANTRIAN */}
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pesanan Aktif</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black text-white ${order.orderType === 'Dine In' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                        {order.orderType?.toUpperCase() || 'ORDER'}
                      </span>
                      {/* Safety check: hanya tampilkan meja jika ada (Dine In) */}
                      {order.table?.number && (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Meja {order.table.number}</span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-gray-800">{order.customerName}</h2>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'}`}>
                    {order.status?.toUpperCase()}
                  </div>
                </div>

                {/* RELATIONAL ITEMS LIST */}
                <div className="space-y-2 mb-4">
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                      <span className="text-gray-600">
                        <span className="font-bold text-gray-900">{item.qty}x</span> {item.menu?.nama || 'Menu'}
                      </span>
                      <span className="text-gray-400 font-medium">Rp {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* CATATAN */}
                {order.notes && (
                  <div className="bg-gray-50 p-3 rounded-2xl text-[11px] text-gray-500 italic mb-4">
                    "{order.notes}"
                  </div>
                )}
              </div>

              {/* FOOTER CARD */}
              <div className="mt-auto pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Tagihan</span>
                  <span className="text-xl font-black text-[#a52a2a]">Rp {(order.total || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex gap-2">
                  {order.status !== 'Selesai' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'Selesai')}
                      className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-green-700 transition-all shadow-md active:scale-95"
                    >
                      Selesaikan
                    </button>
                  )}
                  <button 
                    onClick={() => window.open(`https://wa.me/${order.whatsapp}`)}
                    className="px-4 bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold text-sm hover:bg-gray-200 transition"
                  >
                    WA
                  </button>
                </div>
                <p className="text-[9px] text-gray-300 mt-4 text-center font-medium uppercase tracking-widest">
                  Masuk: {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('id-ID') : '--:--'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Belum Ada Pesanan Masuk</p>
          </div>
        )}
      </div>
    </div>
  );
}