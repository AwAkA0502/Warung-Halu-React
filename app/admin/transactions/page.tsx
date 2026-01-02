"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  // Gunakan <any[]> untuk menghindari error TypeScript 'never'
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data Orders dan Tables secara bersamaan
  const fetchData = async () => {
    try {
      const [resOrders, resTables] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/tables')
      ]);
      
      const dataOrders = await resOrders.json();
      const dataTables = await resTables.json();

      setOrders(Array.isArray(dataOrders) ? dataOrders : []);
      setTables(Array.isArray(dataTables) ? dataTables : []);
    } catch (error) {
      console.error("Gagal load data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchData(); // Refresh data untuk update status meja & pesanan
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Menghubungkan ke Database Aiven...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter">
            WARUNG HALU <span className="text-[#a52a2a]">LIVE DASHBOARD</span>
          </h1>
          <button 
            onClick={fetchData}
            className="bg-white border border-gray-200 px-6 py-2 rounded-2xl shadow-sm text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
          >
            🔄 Perbarui Data
          </button>
        </div>

        {/* PETA STATUS MEJA (REAL-TIME) */}
        <div className="mb-10">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Status Meja Saat Ini</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {tables.map((t) => (
              <div key={t.id} className={`p-4 rounded-3xl border-2 transition-all ${
                t.status === 'Occupied' ? 'bg-red-50 border-red-200 shadow-inner' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-400">MEJA</span>
                  <div className={`w-2 h-2 rounded-full ${t.status === 'Occupied' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                </div>
                <p className="text-2xl font-black text-gray-800">{t.number}</p>
                <p className={`text-[10px] font-bold uppercase ${t.status === 'Occupied' ? 'text-red-600' : 'text-green-600'}`}>
                  {t.status === 'Occupied' ? 'Terisi' : 'Kosong'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GRID PESANAN */}
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Antrean Pesanan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${order.orderType === 'Dine In' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                        {order.orderType.toUpperCase()}
                      </span>
                      {order.table?.number && (
                        <span className="text-[10px] font-black text-gray-400">MEJA {order.table.number}</span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-gray-800 leading-tight">{order.customerName}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </div>

                {/* LIST ITEM (RELASIONAL) */}
                <div className="space-y-3 mb-6">
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                      <span className="text-gray-600 font-medium">
                        <span className="text-blue-600 font-bold mr-2">{item.qty}x</span> 
                        {item.menu?.nama}
                      </span>
                      <span className="font-bold text-gray-400 text-xs">Rp {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-black text-xl text-gray-800">
                    <span className="text-sm self-center text-gray-400">TOTAL</span>
                    <span>Rp {order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* CATATAN */}
                {order.notes && (
                  <div className="mb-6 text-xs italic text-blue-600 bg-blue-50 p-3 rounded-2xl">
                    " {order.notes} "
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="mt-auto">
                <div className="flex gap-2">
                  {order.status !== 'Selesai' ? (
                    <button 
                      onClick={() => updateStatus(order.id, 'Selesai')}
                      className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                    >
                      Selesaikan Pesanan
                    </button>
                  ) : (
                    <div className="flex-1 bg-green-50 text-green-600 py-4 rounded-2xl font-bold text-sm text-center border border-green-100">
                      ✓ TRANSAKSI SELESAI
                    </div>
                  )}
                  <button 
                    onClick={() => window.open(`https://wa.me/${order.whatsapp}`)}
                    className="px-5 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition"
                  >
                    WA
                  </button>
                </div>
                <p className="text-[10px] text-gray-300 mt-4 text-center font-bold">
                  {new Date(order.createdAt).toLocaleTimeString('id-ID')} • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">😴</div>
            <p className="text-gray-400 font-bold">Belum ada pesanan yang masuk...</p>
          </div>
        )}
      </div>
    </div>
  );
}