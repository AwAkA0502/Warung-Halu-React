import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Mengambil semua data meja untuk ditampilkan di Dashboard Admin
export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: {
        number: 'asc', // Urutkan dari meja 1, 2, 3...
      },
    });
    
    return NextResponse.json(tables);
  } catch (error) {
    console.error("GET Tables Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data meja" }, { status: 500 });
  }
}