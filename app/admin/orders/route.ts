import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { orderItems: { include: { menu: true } }, table: true }
  });
  return NextResponse.json(orders);
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    // Jika order selesai, kembalikan status meja jadi Available
    if (status === "Selesai" && updatedOrder.tableId) {
      await prisma.table.update({
        where: { id: updatedOrder.tableId },
        data: { status: "Available" }
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}