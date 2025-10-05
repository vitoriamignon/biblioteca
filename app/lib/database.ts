// app/lib/database.ts
import { Book } from "./types";
import { prisma } from "./prisma";
import { BookStatus } from "@prisma/client";

class PrismaBookDatabase {
  
  // Método simplificado de conversão
   private convertPrismaBook(prismaBook: Book): Book {
    return {
      id: prismaBook.id,
      title: prismaBook.title,
      author: prismaBook.author,
      genre: prismaBook.genre,
      year: prismaBook.year,
      pages: prismaBook.pages,
      rating: prismaBook.rating,
      synopsis: prismaBook.synopsis,
      cover: prismaBook.cover || '', // ⬅️ Garante que seja string
      status: prismaBook.status as Book['status'],
      createdAt: prismaBook.createdAt,
      updatedAt: prismaBook.updatedAt,
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

  // Criar novo livro - ATUALIZADO
  async createBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const newBook = await prisma.book.create({
      data: {
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        year: bookData.year,
        pages: bookData.pages,
        rating: bookData.rating,
        synopsis: bookData.synopsis,
        cover: bookData.cover,
        status: bookData.status as BookStatus,
        currentPage: 0, // Valor padrão
        isbn: '', // Valor padrão
        notes: '', // Valor padrão
      }
    });
    return this.convertPrismaBook(newBook);
  }

  // Atualizar livro - ATUALIZADO
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

  // Buscar livros por termo
 async searchBooks(searchTerm: string): Promise<Book[]> {
  const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm } },     // ✅ SEM mode
        { author: { contains: searchTerm } },    // ✅ SEM mode  
        { genre: { contains: searchTerm } },     // ✅ SEM mode
        { synopsis: { contains: searchTerm } },  // ✅ SEM mode
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
  return books.map(book => this.convertPrismaBook(book));
}

  // Obter livros por gênero
  async getBooksByGenre(genre: string): Promise<Book[]> {
    const books = await prisma.book.findMany({
      where: { genre },
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
      orderBy: { genre: 'asc' }
    });
    
    // Extrair gêneros únicos
    const uniqueGenres = [...new Set(books.map(book => book.genre))];
    return uniqueGenres;
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