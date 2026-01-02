"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MenuSection from '@/components/MenuSection';
import OrderModal from '@/components/OrderModal';
import Location from '@/components/Location';
import Feedback from '@/components/Feedback';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

// Kita buat komponen internal untuk menangkap logic URL
function WarungHaluContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCart, setCurrentCart] = useState<any>(null);
  
  // Ambil nomor meja dari URL (contoh: warunghalu.com/?table=5)
  const searchParams = useSearchParams();
  const tableNumberFromUrl = searchParams.get('table');

  const handleCheckout = (items: any[], total: number) => {
    setCurrentCart({ items, total });
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <Hero />
      
      {/* Jika ada nomor meja, kita bisa beri pesan selamat datang khusus */}
      {tableNumberFromUrl && (
        <div className="bg-yellow-100 text-yellow-800 text-center py-2 font-bold sticky top-[80px] z-50 shadow-sm">
          📍 Anda memesan dari Meja Nomor: {tableNumberFromUrl}
        </div>
      )}

      <MenuSection onCheckout={handleCheckout} />
      <Location />
      <Feedback />
      <Footer />
      <Chatbot />
      
      {isModalOpen && (
        <OrderModal 
          cartData={currentCart} 
          tableFromUrl={tableNumberFromUrl} // Kirim nomor meja ke Modal
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Suspense fallback={<div className="text-center py-20">Memuat Warung Halu...</div>}>
        <WarungHaluContent />
      </Suspense>
    </main>
  );
}