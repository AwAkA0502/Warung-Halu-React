import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newOrder = await prisma.order.create({
      data: {
        customerName: body.nama,
        whatsapp: body.whatsapp,
        orderType: body.orderType,
        total: parseFloat(body.total),
        // Hubungkan ke Meja jika Dine In
        table: body.tableNumber ? {
          connect: { number: parseInt(body.tableNumber) }
        } : undefined,
        // Simpan Detail Item (Relasi OrderItem)
        orderItems: {
          create: body.items.map((item: any) => ({
            qty: item.qty,
            price: item.harga,
            menuId: item.id
          }))
        }
      },
    });

    // Jika Dine In, ubah status Meja jadi Occupied
    if (body.orderType === "Dine In" && body.tableNumber) {
      await prisma.table.update({
        where: { number: parseInt(body.tableNumber) },
        data: { status: "Occupied" }
      });
    }

    return NextResponse.json({ success: true, data: newOrder });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal simpan" }, { status: 500 });
  }
}