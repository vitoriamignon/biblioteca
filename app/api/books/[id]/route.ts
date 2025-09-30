// app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { bookDatabase } from '@/lib/database';
import { Book } from '@/lib/types';

// GET /api/books/[id] - Obter detalhes de um livro
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Book ID is required' 
        },
        { status: 400 }
      );
    }

    const book = await bookDatabase.getBookById(id);

    if (!book) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Book not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: book
    });

  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch book' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - Atualizar livro existente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Book ID is required' 
        },
        { status: 400 }
      );
    }

    // Verificar se o livro existe
    const existingBook = await bookDatabase.getBookById(id);
    if (!existingBook) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Book not found' 
        },
        { status: 404 }
      );
    }

    // Validações opcionais (apenas se os campos estiverem presentes)
    if (body.pages !== undefined && (typeof body.pages !== 'number' || body.pages <= 0)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Pages must be a positive number' 
        },
        { status: 400 }
      );
    }

    if (body.year !== undefined && (typeof body.year !== 'number' || body.year < 1000 || body.year > new Date().getFullYear() + 10)) {
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

    // Preparar dados de atualização (apenas campos não vazios)
    const updateData: Partial<Book> = {};
    
    if (body.title !== undefined && body.title.trim()) updateData.title = String(body.title).trim();
    if (body.author !== undefined && body.author.trim()) updateData.author = String(body.author).trim();
    if (body.genre !== undefined && body.genre.trim()) updateData.genre = String(body.genre).trim();
    if (body.year !== undefined) updateData.year = Number(body.year);
    if (body.pages !== undefined) updateData.pages = Number(body.pages);
    if (body.rating !== undefined) updateData.rating = Number(body.rating);
    if (body.synopsis !== undefined) updateData.synopsis = String(body.synopsis).trim();
    if (body.cover !== undefined) updateData.cover = String(body.cover).trim();
    if (body.status !== undefined) updateData.status = body.status;

    const updatedBook = await bookDatabase.updateBook(id, updateData);

    if (!updatedBook) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update book' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: 'Book updated successfully'
    });

  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update book' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - Remover livro
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Book ID is required' 
        },
        { status: 400 }
      );
    }

    // Verificar se o livro existe
    const existingBook = await bookDatabase.getBookById(id);
    if (!existingBook) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Book not found' 
        },
        { status: 404 }
      );
    }

    const deleted = await bookDatabase.deleteBook(id);

    if (!deleted) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete book' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete book' 
      },
      { status: 500 }
    );
  }
}