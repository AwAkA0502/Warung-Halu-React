import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const tables = await prisma.table.findMany({
    orderBy: { number: 'asc' }
  });
  return NextResponse.json(tables);
}