import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newMenu = await prisma.menu.create({
      data: {
        nama: body.nama,
        harga: parseInt(body.harga),
        kategori: body.kategori,
        gambar: body.gambar || 'default.jpg',
        level: parseInt(body.level || 0),
        deskripsi: body.deskripsi,
        isReady: true
      }
    });
    return NextResponse.json(newMenu);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah menu" }, { status: 500 });
  }
}