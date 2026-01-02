import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newMenu = await prisma.menu.create({
      data: {
        nama: body.nama,
        harga: parseInt(body.harga),
        categoryId: parseInt(body.categoryId),
        gambar: body.gambar || 'default.jpg',
        deskripsi: body.deskripsi,
      }
    });
    return NextResponse.json(newMenu);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah menu" }, { status: 500 });
  }
}