// app/api/pages/route.ts

import { NextResponse } from 'next/server';
import DatabaseService from '@/lib/server/database-service';

export async function GET() {
  try {
    const pages = await DatabaseService.getUserPages();
    return NextResponse.json({ pages });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
