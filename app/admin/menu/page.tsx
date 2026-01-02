import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(menus || []); 
  } catch (error) {
    console.error("API Menu Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}