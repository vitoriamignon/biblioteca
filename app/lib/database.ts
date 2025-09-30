// app/lib/database.ts
import { Book } from "./types";
import { prisma } from "./prisma";
import { BookStatus } from "@prisma/client";

// Implementação real usando Prisma + SQLite
class PrismaBookDatabase {
  
  // Converter enum do Prisma para string
  private convertBookStatus(status: BookStatus): Book['status'] {
    return status as Book['status'];
  }

  // Converter string para enum do Prisma
  private convertToBookStatus(status: Book['status']): BookStatus {
    return status as BookStatus;
  }

  // Converter Book do Prisma para Book da aplicação
  private convertPrismaBook(prismaBook: {
    id: string;
    title: string;
    author: string;
    genre: string;
    year: number;
    pages: number;
    rating: number;
    synopsis: string;
    cover: string;
    status: BookStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Book {
    return {
      id: prismaBook.id,
      title: prismaBook.title,
      author: prismaBook.author,
      genre: prismaBook.genre,
      year: prismaBook.year,
      pages: prismaBook.pages,
      rating: prismaBook.rating,
      synopsis: prismaBook.synopsis,
      cover: prismaBook.cover,
      status: this.convertBookStatus(prismaBook.status),
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

  // Criar novo livro
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
        status: this.convertToBookStatus(bookData.status),
      }
    });
    return this.convertPrismaBook(newBook);
  }

  // Atualizar livro
  async updateBook(id: string, bookData: Partial<Book>): Promise<Book | null> {
    try {
      const updateData: {
        title?: string;
        author?: string;
        genre?: string;
        year?: number;
        pages?: number;
        rating?: number;
        synopsis?: string;
        cover?: string;
        status?: BookStatus;
      } = {};
      
      if (bookData.title !== undefined) updateData.title = bookData.title;
      if (bookData.author !== undefined) updateData.author = bookData.author;
      if (bookData.genre !== undefined) updateData.genre = bookData.genre;
      if (bookData.year !== undefined) updateData.year = bookData.year;
      if (bookData.pages !== undefined) updateData.pages = bookData.pages;
      if (bookData.rating !== undefined) updateData.rating = bookData.rating;
      if (bookData.synopsis !== undefined) updateData.synopsis = bookData.synopsis;
      if (bookData.cover !== undefined) updateData.cover = bookData.cover;
      if (bookData.status !== undefined) updateData.status = this.convertToBookStatus(bookData.status);

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
          { title: { contains: searchTerm } },
          { author: { contains: searchTerm } },
          { genre: { contains: searchTerm } },
          { synopsis: { contains: searchTerm } },
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
      where: { status: this.convertToBookStatus(status) },
      orderBy: { createdAt: 'desc' }
    });
    return books.map(book => this.convertPrismaBook(book));
  }

  // Obter gêneros únicos (alias para compatibilidade)
  async getUniqueGenres(): Promise<string[]> {
    return this.getAllGenres();
  }

  // Obter gêneros únicos
  async getAllGenres(): Promise<string[]> {
    const result = await prisma.book.findMany({
      select: { genre: true },
      distinct: ['genre'],
      orderBy: { genre: 'asc' }
    });
    return result.map(item => item.genre);
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