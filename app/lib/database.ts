// app/lib/database.ts
import { Book } from "./types";
import { prisma } from "./prisma";
import { BookStatus } from "@prisma/client";

class PrismaBookDatabase {
  
  // Método simplificado de conversão - CORRIGIDO
  private convertPrismaBook(prismaBook: any): Book {
    return {
      id: prismaBook.id,
      title: prismaBook.title,
      author: prismaBook.author,
      genre: prismaBook.genre || 'Sem gênero', // ⬅️ Usar genre direto
      year: prismaBook.year,
      pages: prismaBook.pages,
      rating: prismaBook.rating,
      synopsis: prismaBook.synopsis,
      cover: prismaBook.cover || '',
      status: prismaBook.status,
      currentPage: prismaBook.currentPage || 0,
      isbn: prismaBook.isbn || null,
      notes: prismaBook.notes || null,
      createdAt: prismaBook.createdAt,
      updatedAt: prismaBook.updatedAt,
      // ⬅️ REMOVER genreId completamente
    };
  }

  // Obter todos os livros
  async getAllBooks(): Promise<Book[]> {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return books.map(book => this.convertPrismaBook(book));
  }

  // Obter livro por ID
  async getBookById(id: string): Promise<Book | null> {
    const book = await prisma.book.findUnique({
      where: { id }
    });
    return book ? this.convertPrismaBook(book) : null;
  }

  // Criar novo livro - CORRIGIDO (SEM genreRef)
  async createBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const newBook = await prisma.book.create({
      data: {
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre, // ⬅️ Usar genre direto
        year: bookData.year,
        pages: bookData.pages,
        rating: bookData.rating,
        synopsis: bookData.synopsis,
        cover: bookData.cover,
        status: bookData.status as BookStatus,
        currentPage: bookData.currentPage || 0,
        isbn: bookData.isbn || '',
        notes: bookData.notes || '',
        // ⬅️ REMOVER genreId completamente
      }
      // ⬅️ REMOVER include genreRef
    });
    return this.convertPrismaBook(newBook);
  }

  // Atualizar livro - CORRIGIDO
  async updateBook(id: string, bookData: Partial<Book>): Promise<Book | null> {
    try {
      const updateData: Record<string, unknown> = {};
      
      // Mapear campos simples
      if (bookData.title !== undefined) updateData.title = bookData.title;
      if (bookData.author !== undefined) updateData.author = bookData.author;
      if (bookData.genre !== undefined) updateData.genre = bookData.genre;
      if (bookData.year !== undefined) updateData.year = bookData.year;
      if (bookData.pages !== undefined) updateData.pages = bookData.pages;
      if (bookData.rating !== undefined) updateData.rating = bookData.rating;
      if (bookData.synopsis !== undefined) updateData.synopsis = bookData.synopsis;
      if (bookData.cover !== undefined) updateData.cover = bookData.cover;
      if (bookData.status !== undefined) updateData.status = bookData.status;
      if (bookData.currentPage !== undefined) updateData.currentPage = bookData.currentPage;
      if (bookData.isbn !== undefined) updateData.isbn = bookData.isbn;
      if (bookData.notes !== undefined) updateData.notes = bookData.notes;

      const updatedBook = await prisma.book.update({
        where: { id },
        data: updateData
      });
      
      return this.convertPrismaBook(updatedBook);
    } catch (error) {
      console.error('Error updating book:', error);
      return null;
    }
  }

  // Excluir livro
  async deleteBook(id: string): Promise<boolean> {
    try {
      await prisma.book.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  }

  // Buscar livros por termo - CORRIGIDO (SEM genreRef)
  async searchBooks(searchTerm: string): Promise<Book[]> {
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { author: { contains: searchTerm } },
          { synopsis: { contains: searchTerm } },
          { genre: { contains: searchTerm } } // ⬅️ Buscar por genre direto
        ]
      },
      // ⬅️ REMOVER include genreRef
      orderBy: { createdAt: 'desc' }
    });
    
    return books.map(book => this.convertPrismaBook(book));
  }

  // Obter livros por gênero - CORRIGIDO (SEM genreRef)
  async getBooksByGenre(genre: string): Promise<Book[]> {
    const books = await prisma.book.findMany({
      where: { genre }, // ⬅️ Usar genre direto
      orderBy: { createdAt: 'desc' }
    });
    return books.map(book => this.convertPrismaBook(book));
  }

  // Obter livros por status
  async getBooksByStatus(status: Book['status']): Promise<Book[]> {
    const books = await prisma.book.findMany({
      where: { status: status as BookStatus },
      orderBy: { createdAt: 'desc' }
    });
    return books.map(book => this.convertPrismaBook(book));
  }

  // ⬇️ MÉTODO CORRIGIDO - Gêneros como strings
  async getAllGenres(): Promise<string[]> {
    const books = await prisma.book.findMany({
      select: { genre: true },
      where: { genre: { not: null } },
    });
    
    const uniqueGenres = [...new Set(books.map(book => book.genre).filter(Boolean))] as string[];
    return uniqueGenres.sort();
  }

  // ⬇️ Para compatibilidade
  async getUniqueGenres(): Promise<string[]> {
    return this.getAllGenres();
  }

  // Obter estatísticas
  async getStats(): Promise<{
    total: number;
    reading: number;
    read: number;
    wantToRead: number;
    paused: number;
    dropped: number;
    totalPages: number;
    averageRating: number;
  }> {
    const [total, reading, read, wantToRead, paused, dropped, pagesResult, ratingResult] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { status: 'LENDO' } }),
      prisma.book.count({ where: { status: 'LIDO' } }),
      prisma.book.count({ where: { status: 'QUERO_LER' } }),
      prisma.book.count({ where: { status: 'PAUSADO' } }),
      prisma.book.count({ where: { status: 'ABANDONADO' } }),
      prisma.book.aggregate({
        where: { status: 'LIDO' },
        _sum: { pages: true }
      }),
      prisma.book.aggregate({
        _avg: { rating: true }
      })
    ]);

    return {
      total,
      reading,
      read,
      wantToRead,
      paused,
      dropped,
      totalPages: pagesResult._sum.pages || 0,
      averageRating: ratingResult._avg.rating || 0,
    };
  }
}

export const bookDatabase = new PrismaBookDatabase();