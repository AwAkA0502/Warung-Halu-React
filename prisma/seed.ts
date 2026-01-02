const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Memulai Seeding ---');

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.table.deleteMany({});

  console.log('✅ Data lama dibersihkan.');

  const catPedas = await prisma.category.create({ data: { name: 'Makanan Pedas' } });
  const catManis = await prisma.category.create({ data: { name: 'Makanan Manis' } });
  const catMinum = await prisma.category.create({ data: { name: 'Minuman' } });

  console.log('✅ Kategori berhasil dibuat.');

  const baseUrl = "https://warung-halu-react.vercel.app"; // Ganti dengan domain Vercel kamu
  const tables = [1, 2, 3, 4, 5];
  for (const n of tables) {
    await prisma.table.create({
      data: {
        number: n,
        status: "Available",
        qrUrl: `${baseUrl}/?table=${n}`
      }
    });
  }
  console.log('✅ Data Meja berhasil dibuat.');

  // 4. Buat Data Menu (Disesuaikan dengan ID Kategori)
  const menuData = [
    { 
      nama: 'Cibay Halu', 
      harga: 10000, 
      categoryId: catPedas.id, 
      gambar: 'Cibayyy.jpg',
    },
    { 
      nama: 'Cimset (Cimol Setan)', 
      harga: 12000, 
      categoryId: catPedas.id, 
      gambar: 'Cimset.jpg',
    },
    { 
      nama: 'Mie Ayam Halu', 
      harga: 15000, 
      categoryId: catPedas.id, 
      gambar: 'Mie_ayam.jpg',
    },
    { 
      nama: 'Mie Jebew Halu', 
      harga: 15000, 
      categoryId: catPedas.id, 
      gambar: 'Mie_jebew.jpg',
    },
    { 
      nama: 'Pangsit Chili Oil', 
      harga: 13000, 
      categoryId: catPedas.id, 
      gambar: 'Pangsit_chili_oil.jpg',
    },
    { 
      nama: 'Basreng Pedas', 
      harga: 8000, 
      categoryId: catPedas.id, 
      gambar: 'Basreng.png',
    },
    { 
      nama: 'Pisang Crispy Halu', 
      harga: 12000, 
      categoryId: catManis.id, 
      gambar: 'Pisang_crispy.jpg',
    },
    { 
      nama: 'Jasuke (Jagung Susu Keju)', 
      harga: 8000, 
      categoryId: catManis.id, 
      gambar: 'Jasuke.jpg',
    },
    { 
      nama: 'Es Teh Manis', 
      harga: 5000, 
      categoryId: catMinum.id, 
      gambar: 'es teh maniezz.png',
    }
  ];

  for (const item of menuData) {
    await prisma.menu.create({
      data: item,
    });
  }

  console.log('✅ Semua Menu berhasil dimasukkan.');
  console.log('--- Seeding Selesai! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });