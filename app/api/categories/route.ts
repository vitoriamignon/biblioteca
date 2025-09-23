// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { bookDatabase } from '@/lib/database';

// GET /api/categories - Listar todas as categorias/gêneros
export async function GET() {
  try {
    const genres = await bookDatabase.getAllGenres();
    
    return NextResponse.json({
      success: true,
      data: genres,
      count: genres.length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories' 
      },
      { status: 500 }
    );
  }
}

// POST /api/categories - Adicionar novo gênero (via criação de livro)
// Esta rota é informativa, pois os gêneros são criados automaticamente
// quando novos livros são adicionados com novos gêneros
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.genre || typeof body.genre !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Genre name is required and must be a string' 
        },
        { status: 400 }
      );
    }

    const genreName = String(body.genre).trim();
    
    if (!genreName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Genre name cannot be empty' 
        },
        { status: 400 }
      );
    }

    const existingGenres = await bookDatabase.getAllGenres();
    
    if (existingGenres.includes(genreName)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Genre already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Genre can be added by creating a book with this genre',
      data: {
        genre: genreName,
        suggestion: 'Create a book with this genre to add it to the system'
      }
    });

  } catch (error) {
    console.error('Error processing genre:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process genre request' 
      },
      { status: 500 }
    );
  }
}