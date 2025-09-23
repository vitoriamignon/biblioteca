// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { bookDatabase } from '@/lib/database';
import { Book } from '@/lib/types';

// GET /api/books - Listar todos os livros com filtros opcionais
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const status = searchParams.get('status') as Book['status'] | null;

    let books: Book[];

    if (search) {
      books = await bookDatabase.searchBooks(search);
    } else if (genre && genre !== 'all') {
      books = await bookDatabase.getBooksByGenre(genre);
    } else if (status) {
      books = await bookDatabase.getBooksByStatus(status);
    } else {
      books = await bookDatabase.getAllBooks();
    }

    return NextResponse.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch books' 
      },
      { status: 500 }
    );
  }
}

// POST /api/books - Criar novo livro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica dos campos obrigatórios
    const requiredFields = ['title', 'author', 'genre', 'year', 'pages'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validação de tipos
    if (typeof body.pages !== 'number' || body.pages <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Pages must be a positive number' 
        },
        { status: 400 }
      );
    }

    if (typeof body.year !== 'number' || body.year < 1000 || body.year > new Date().getFullYear() + 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Year must be a valid year' 
        },
        { status: 400 }
      );
    }

    if (body.rating !== undefined && (typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rating must be between 0 and 5' 
        },
        { status: 400 }
      );
    }

    const validStatuses: Book['status'][] = ['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Status must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const bookData: Omit<Book, 'id'> = {
      title: String(body.title).trim(),
      author: String(body.author).trim(),
      genre: String(body.genre).trim(),
      year: Number(body.year),
      pages: Number(body.pages),
      rating: Number(body.rating || 0),
      synopsis: String(body.synopsis || '').trim(),
      cover: String(body.cover || '').trim(),
      status: body.status || 'QUERO_LER'
    };

    const newBook = await bookDatabase.createBook(bookData);

    return NextResponse.json({
      success: true,
      data: newBook,
      message: 'Book created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create book' 
      },
      { status: 500 }
    );
  }
}