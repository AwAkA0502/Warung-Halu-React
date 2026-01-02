"use client";
import { useState } from 'react';

export default function OrderModal({ cartData, tableFromUrl, onClose }: any) {
  const [orderType, setOrderType] = useState(tableFromUrl ? 'Dine In' : 'Take Away');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [form, setForm] = useState({ 
    nama: '', 
    whatsapp: '', 
    alamat: '', 
    catatan: '',
    tableNumber: tableFromUrl || '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          orderType,
          items: cartData.items, 
          total: cartData.total 
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Baris setTimeout dihapus agar modal tidak menutup sendiri
      } else {
        alert("Gagal mengirim pesanan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- TAMPILAN SETELAH BERHASIL ORDER (STRUK DIGITAL) ---
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-black text-gray-800">PESANAN TERKIRIM!</h2>
            <p className="text-sm text-gray-500 mt-1">Silakan tunjukkan layar ini ke kasir</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border-2 border-dashed border-gray-200 mb-6">
            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Detail Pesanan</span>
              <span className="text-xs font-bold text-[#a52a2a]">{orderType} {form.tableNumber ? `#${form.tableNumber}` : ''}</span>
            </div>
            
            <div className="space-y-2 mb-4">
              {cartData.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm text-gray-700">
                  <span>{item.nama} <span className="text-gray-400">x{item.qty}</span></span>
                  <span className="font-semibold">Rp {(item.harga * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total Bayar</span>
              <span className="text-xl font-black text-[#a52a2a]">Rp {cartData.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-yellow-800 text-sm font-medium">
              📢 **Silakan ke Kasir** untuk melakukan pembayaran dan memproses pesanan Anda.
            </p>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-black transition"
          >
            Tutup & Selesai
          </button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN FORM (Sama seperti sebelumnya) ---
  return (
    <div className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Konfirmasi Pesanan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Ringkasan Item Sebelum Order */}
        <div className="mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="space-y-3">
            {cartData.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">{item.nama} x{item.qty}</span>
                <span className="font-bold text-gray-800">Rp {(item.harga * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-gray-300 mt-4 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-600">Subtotal</span>
            <span className="text-xl font-black text-[#a52a2a]">Rp {cartData.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Form Pilihan & Data Diri */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl">
          <button type="button" onClick={() => setOrderType('Dine In')} className={`flex-1 py-3 rounded-xl font-bold text-sm ${orderType === 'Dine In' ? 'bg-white shadow' : 'text-gray-500'}`}>🍽️ Dine In</button>
          <button type="button" onClick={() => setOrderType('Take Away')} className={`flex-1 py-3 rounded-xl font-bold text-sm ${orderType === 'Take Away' ? 'bg-white shadow' : 'text-gray-500'}`}>🛍️ Take Away</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {orderType === 'Dine In' && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <label className="block text-xs font-bold text-yellow-700 mb-1">NOMOR MEJA</label>
              {tableFromUrl ? (
                <p className="font-bold text-lg">MEJA {tableFromUrl}</p>
              ) : (
                <input type="number" placeholder="Input nomor meja..." className="w-full p-2 border-b-2 border-yellow-300 bg-transparent outline-none font-bold text-lg" onChange={e => setForm({...form, tableNumber: e.target.value})} required />
              )}
            </div>
          )}

          <input placeholder="Nama Lengkap" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#FFC107]" onChange={e => setForm({...form, nama: e.target.value})} required />
          <input type="tel" placeholder="No. WhatsApp" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#FFC107]" onChange={e => setForm({...form, whatsapp: e.target.value})} required />
          <input placeholder="Catatan tambahan (Opsional)" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#FFC107]" onChange={e => setForm({...form, catatan: e.target.value})} />

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg ${isSubmitting ? 'bg-gray-400' : 'bg-[#a52a2a] hover:bg-[#8c2323]'}`}
          >
            {isSubmitting ? 'Mengirim...' : 'PESAN SEKARANG'}
          </button>
        </form>
      </div>
    </div>
  );
}