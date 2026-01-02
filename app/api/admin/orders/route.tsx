import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        table: true,      
        orderItems: {     
          include: {
            menu: true   
          }
        }
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}

// 2. UPDATE STATUS PESANAN & BEBASKAN MEJA
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    // Update status order dan ambil data tableId-nya
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: status },
    });

    // LOGIKA OTOMATIS: Jika status diset 'Selesai', bebaskan meja terkait
    if (status === "Selesai" && updatedOrder.tableId) {
      await prisma.table.update({
        where: { id: updatedOrder.tableId },
        data: { status: "Available" }
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error patching order:", error);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}