// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { bookDatabase } from '@/lib/database';

// GET /api/stats - Obter estatísticas da biblioteca
export async function GET() {
  try {
    const stats = await bookDatabase.getStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stats' 
      },
      { status: 500 }
    );
  }
}