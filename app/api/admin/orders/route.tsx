import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Ambil semua order
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc', // Pesanan terbaru muncul di atas
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}

// Untuk update status (misal dari Pending ke Selesai)
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: status },
    });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}