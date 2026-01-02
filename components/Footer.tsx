export default function Footer() {
    return (
      <footer className="bg-[#222] text-gray-300 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-gray-700 pb-12">
          {/* About */}
          <div>
            <h3 className="text-[#a52a2a] text-3xl font-bold mb-4">Warung Halu</h3>
            <p className="leading-relaxed">
              Kedai kuliner kekinian yang menyajikan berbagai makanan manis dan pedas khas anak muda dengan sentuhan chili oil yang menggoda.
            </p>
          </div>
  
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[#FFC107] font-bold mb-2">Jam Operasional:</h4>
              <p>Buka sesuai mood UPI</p>
            </div>
            <div>
              <h4 className="text-[#FFC107] font-bold mb-2">Info Kontak:</h4>
              <p>WhatsApp: <a href="https://wa.me/6282128747493" className="hover:text-white">+62 821-2874-7493</a></p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          © 2025 Warung Halu. All rights reserved.
        </div>
      </footer>
    );
  }