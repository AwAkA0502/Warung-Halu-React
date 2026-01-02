"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data dari API
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Gagal load orders");
    } finally {
      setLoading(false);
    }
  };

  // Update Status Pesanan
  const updateStatus = async (id: number, newStatus: string) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchOrders(); // Refresh data
  };

  useEffect(() => {
    fetchOrders();
    // Auto refresh setiap 10 detik agar kasir tau ada order baru
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat Pesanan...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter">
            WARUNG HALU <span className="text-[#a52a2a]">DASHBOARD</span>
          </h1>
          <button 
            onClick={fetchOrders}
            className="bg-white px-4 py-2 rounded-lg shadow text-sm font-bold hover:bg-gray-50"
          >
            🔄 Refresh Manual
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order: any) => (
            <div key={order.id} className={`bg-white rounded-3xl p-6 shadow-sm border-t-8 ${order.status === 'Selesai' ? 'border-green-500' : 'border-yellow-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {order.orderType} {order.tableNumber ? `• Meja ${order.tableNumber}` : ''}
                  </p>
                  <h2 className="text-xl font-bold text-gray-800">{order.customerName}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* LIST ITEM */}
              <div className="space-y-2 mb-6 bg-gray-50 p-3 rounded-xl">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.nama} <span className="text-gray-400">x{item.qty}</span></span>
                    <span className="font-bold">Rp {(item.harga * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-black text-[#a52a2a]">
                  <span>TOTAL</span>
                  <span>Rp {order.total.toLocaleString()}</span>
                </div>
              </div>

              {/* CATATAN */}
              {order.notes && (
                <div className="mb-6 text-sm italic text-gray-500 bg-blue-50 p-2 rounded-lg border-l-4 border-blue-300">
                  "{order.notes}"
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2">
                {order.status !== 'Selesai' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'Selesai')}
                    className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-green-700 transition"
                  >
                    Tandai Selesai
                  </button>
                )}
                <button 
                  onClick={() => window.open(`https://wa.me/${order.whatsapp}`)}
                  className="px-4 bg-gray-100 text-gray-600 py-2 rounded-xl font-bold text-sm"
                >
                  WA
                </button>
              </div>
              <p className="text-[10px] text-gray-300 mt-4 text-center">
                Dipesan pada: {new Date(order.createdAt).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Belum ada pesanan masuk...</p>
          </div>
        )}
      </div>
    </div>
  );
}