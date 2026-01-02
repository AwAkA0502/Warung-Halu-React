import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi sederhana
    if (!body.nama || !body.whatsapp || !body.items) {
      return NextResponse.json(
        { error: "Data tidak lengkap" }, 
        { status: 400 }
      );
    }

    // Simpan ke database MySQL menggunakan Prisma
    const newOrder = await prisma.order.create({
      data: {
        customerName: body.nama,
        whatsapp: body.whatsapp,
        address: body.alamat,
        orderType: body.orderType || "Dine In", 
        tableNumber: body.tableNumber ? parseInt(body.tableNumber) : null,
        notes: body.catatan || "",
        total: parseFloat(body.total), // Pastikan angka
        items: body.items, // Prisma otomatis mengurus array/object untuk tipe Json
        status: "Pending"
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Pesanan berhasil dibuat",
      data: newOrder 
    });

  } catch (error) {
    console.error("Gagal simpan order:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesanan ke database" }, 
      { status: 500 }
    );
  }
}

// Tambahkan ini jika kamu ingin mencegah error 405 saat iseng buka via browser (GET)
export async function GET() {
    return NextResponse.json(
        { message: "API ini hanya menerima POST request untuk pesanan" },
        { status: 405 }
    );
}