// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Sedang membersihkan data lama...');
  await prisma.menu.deleteMany({}); // Opsional: Hapus data lama agar tidak duplikat saat seed ulang

  console.log('Sedang mengisi data menu Warung Halu...');

  const menuData = [
    // --- MAKANAN PEDAS ---
    { 
      nama: 'Cibay Halu', 
      harga: 10000, 
      kategori: 'makanan-pedas', 
      gambar: 'Cibayyy.jpg', // Sesuaikan: Cibayyy.jpg (3 huruf y)
      level: 0, 
      deskripsi: 'Aci ngambay gurih dengan chili oil' 
    },
    { 
      nama: 'Cimset (Cimol Setan)', 
      harga: 12000, 
      kategori: 'makanan-pedas', 
      gambar: 'Cimset.jpg', // Sesuaikan: Huruf C kapital
      level: 0, 
      deskripsi: 'Cimol kenyal pedas nampol' 
    },
    { 
      nama: 'Mie Ayam Halu', 
      harga: 15000, 
      kategori: 'makanan-pedas', 
      gambar: 'Mie_ayam.jpg', // Sesuaikan: M kapital dan underscore
      level: 0, 
      deskripsi: 'Mie ayam dengan bumbu rahasia' 
    },
    { 
      nama: 'Mie Jebew Halu', 
      harga: 15000, 
      kategori: 'makanan-pedas', 
      gambar: 'Mie_jebew.jpg', // Gunakan file yang ada di folder
      level: 2, 
      deskripsi: 'Mie pedas khas Garut yang bikin bibir dower' 
    },
    { 
      nama: 'Pangsit Chili Oil', 
      harga: 13000, 
      kategori: 'makanan-pedas', 
      gambar: 'Pangsit_chili_oil.jpg', // Gunakan file yang ada
      level: 1, 
      deskripsi: 'Pangsit lembut dengan bumbu chili oil pedas gurih' 
    },
    { 
      nama: 'Basreng Pedas', 
      harga: 8000, 
      kategori: 'makanan-pedas', 
      gambar: 'Basreng.png', // Gunakan file yang ada (.png)
      level: 0, 
      deskripsi: 'Bakso goreng garing bumbu pedas daun jeruk' 
    },

    // --- MAKANAN MANIS ---
    { 
      nama: 'Pisang Crispy Halu', 
      harga: 12000, 
      kategori: 'makanan-manis', 
      gambar: 'Pisang_crispy.jpg', // Sesuaikan nama file
      level: 0, 
      deskripsi: 'Pisang goreng topping keju melimpah' 
    },
    { 
      nama: 'Jasuke (Jagung Susu Keju)', 
      harga: 8000, 
      kategori: 'makanan-manis', 
      gambar: 'Jasuke.jpg', // Huruf J kapital
      level: 0, 
      deskripsi: 'Jagung manis susu kental manis' 
    },

    // --- MINUMAN ---
    { 
      nama: 'Es Teh Manis', 
      harga: 5000, 
      kategori: 'minuman', 
      gambar: 'es teh maniezz.png', // Sesuaikan: Ada spasi dan .png
      level: 0, 
      deskripsi: 'Teh manis segar' 
    }
  ];

  for (const item of menuData) {
    await prisma.menu.create({
      data: item,
    });
  }

  console.log('Seed database berhasil! Semua menu telah dimasukkan.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });