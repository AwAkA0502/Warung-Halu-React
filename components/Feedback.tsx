export default function Feedback() {
    return (
      <section id="kritik-saran" className="max-w-3xl mx-auto py-16 px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-4">Kritik & Saran</h2>
          <p className="text-center text-gray-500 mb-8">Bantu kami menjadi lebih baik.</p>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nama Anda" className="border rounded-lg p-3" />
              <input type="email" placeholder="Email Anda" className="border rounded-lg p-3" required />
            </div>
            <textarea placeholder="Pesan Anda..." className="w-full border rounded-lg p-3" rows={5} required></textarea>
            <button className="w-full bg-[#a52a2a] text-white font-bold py-3 rounded-lg hover:bg-[#8c2323]">
              Kirim Masukan
            </button>
          </form>
        </div>
      </section>
    );
  }