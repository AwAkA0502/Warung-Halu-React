export default function Location() {
    return (
      <section id="lokasi-kami" className="max-w-4xl mx-auto py-16 px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Lokasi Warung Halu</h2>
          <p className="mb-6 text-gray-600">Kunjungi kami di:</p>
          
          <address className="not-italic font-semibold text-lg text-gray-700 mb-8">
            Prempu 1 belakang Balai Desa, Eretan Wetan, Kandanghaur<br />
            Indramayu, Jawa Barat 45254
          </address>
  
          <div className="rounded-xl overflow-hidden shadow-inner h-80 border">
            <iframe
              src="https://www.google.com/maps/embed?..." // Ganti dengan link embed asli
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    );
  }