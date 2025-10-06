// app/lib/database.ts - CONVERTIDO PARA TURSO
import { getStats } from "@/lib/actions"
import { Book } from "./types";
import { getTursoClient } from "./turso";

class TursoBookDatabase {
  
  // Método de conversão do Turso para Book
  private convertTursoBook(tursoBook: any): Book {
    return {
      id: tursoBook.id as string,
      title: tursoBook.title as string,
      author: tursoBook.author as string,
      genre: tursoBook.genre as string || 'Sem gênero',
      year: tursoBook.year as number,
      pages: tursoBook.pages as number,
      rating: tursoBook.rating as number,
      synopsis: tursoBook.synopsis as string,
      cover: tursoBook.cover as string || '',
      status: tursoBook.status as Book['status'],
      currentPage: tursoBook.currentPage as number || 0,
      isbn: tursoBook.isbn as string || '',
      notes: tursoBook.notes as string || '',
      createdAt: tursoBook.createdAt as string,
      updatedAt: tursoBook.updatedAt as string,
    };
  }

  // Obter todos os livros
  async getAllBooks(): Promise<Book[]> {
    const client = getTursoClient();
    if (!client) return [];
    
    const result = await client.execute('SELECT * FROM Book ORDER BY createdAt DESC');
    return result.rows.map(row => this.convertTursoBook(row));
  }

  // Obter livro por ID
  async getBookById(id: string): Promise<Book | null> {
    const client = getTursoClient();
    if (!client) return null;
    
    const result = await client.execute({
      sql: 'SELECT * FROM Book WHERE id = ?',
      args: [id]
    });
    
    return result.rows.length > 0 ? this.convertTursoBook(result.rows[0]) : null;
  }

  // Criar novo livro
  async createBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const client = getTursoClient();
    if (!client) throw new Error('Database not available');
    
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const now = new Date().toISOString();
    
    await client.execute({
      sql: `INSERT INTO Book (
        id, title, author, genre, year, pages, rating, synopsis, 
        cover, status, currentPage, isbn, notes, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        bookData.title,
        bookData.author,
        bookData.genre || '',
        bookData.year,
        bookData.pages,
        bookData.rating,
        bookData.synopsis,
        bookData.cover || '',
        bookData.status,
        bookData.currentPage || 0,
        bookData.isbn || '',
        bookData.notes || '',
        now,
        now
      ]
    });
    
    return {
      id,
      ...bookData,
      createdAt: now,
      updatedAt: now
    };
  }

  // Atualizar livro
  async updateBook(id: string, bookData: Partial<Book>): Promise<Book | null> {
    const client = getTursoClient();
    if (!client) return null;
    
    try {
      const updates: string[] = [];
      const args: any[] = [];
      
      // Construir query dinamicamente
      Object.entries(bookData).forEach(([key, value]) => {
        if (key !== 'id' && value !== undefined) {
          updates.push(`${key} = ?`);
          args.push(value);
        }
      });
      
      if (updates.length === 0) return null;
      
      updates.push('updatedAt = ?');
      args.push(new Date().toISOString());
      args.push(id); // WHERE id = ?
      
      await client.execute({
        sql: `UPDATE Book SET ${updates.join(', ')} WHERE id = ?`,
        args
      });
      
      return this.getBookById(id);
    } catch (error) {
      console.error('Error updating book:', error);
      return null;
    }
  }

  // Excluir livro
  async deleteBook(id: string): Promise<boolean> {
    const client = getTursoClient();
    if (!client) return false;
    
    try {
      await client.execute({
        sql: 'DELETE FROM Book WHERE id = ?',
        args: [id]
      });
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      return false;
    }
  }

  // Buscar livros por termo
  async searchBooks(searchTerm: string): Promise<Book[]> {
    const client = getTursoClient();
    if (!client) return [];
    
    const result = await client.execute({
      sql: `SELECT * FROM Book 
            WHERE title LIKE ? OR author LIKE ? OR synopsis LIKE ? OR genre LIKE ?
            ORDER BY createdAt DESC`,
      args: [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    });
    
    return result.rows.map(row => this.convertTursoBook(row));
  }

  // Obter livros por gênero
  async getBooksByGenre(genre: string): Promise<Book[]> {
    const client = getTursoClient();
    if (!client) return [];
    
    const result = await client.execute({
      sql: 'SELECT * FROM Book WHERE genre = ? ORDER BY createdAt DESC',
      args: [genre]
    });
    
    return result.rows.map(row => this.convertTursoBook(row));
  }

  // Obter livros por status
  async getBooksByStatus(status: Book['status']): Promise<Book[]> {
    const client = getTursoClient();
    if (!client) return [];
    
    const result = await client.execute({
      sql: 'SELECT * FROM Book WHERE status = ? ORDER BY createdAt DESC',
      args: [status]
    });
    
    return result.rows.map(row => this.convertTursoBook(row));
  }

  // Obter gêneros únicos
  async getAllGenres(): Promise<string[]> {
    const client = getTursoClient();
    if (!client) return [];
    
    const result = await client.execute(`
      SELECT DISTINCT genre 
      FROM Book 
      WHERE genre IS NOT NULL AND genre != '' 
      ORDER BY genre
    `);
    
    return result.rows.map(row => row.genre as string);
  }

  // Para compatibilidade
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
    const client = getTursoClient();
    if (!client) {
      return {
        total: 0,
        reading: 0,
        read: 0,
        wantToRead: 0,
        paused: 0,
        dropped: 0,
        totalPages: 0,
        averageRating: 0,
      };
    }
    
    try {
      const [totalResult, statusResult, pagesResult, ratingResult] = await Promise.all([
        client.execute('SELECT COUNT(*) as total FROM Book'),
        client.execute('SELECT status, COUNT(*) as count FROM Book GROUP BY status'),
        client.execute('SELECT SUM(pages) as total FROM Book WHERE status = "LIDO"'),
        client.execute('SELECT AVG(rating) as average FROM Book WHERE rating > 0')
      ]);
      
      const statusCounts: Record<string, number> = {};
      statusResult.rows.forEach(row => {
        statusCounts[row.status as string] = row.count as number;
      });
      
      return {
        total: totalResult.rows[0].total as number,
        reading: statusCounts['LENDO'] || 0,
        read: statusCounts['LIDO'] || 0,
        wantToRead: statusCounts['QUERO_LER'] || 0,
        paused: statusCounts['PAUSADO'] || 0,
        dropped: statusCounts['ABANDONADO'] || 0,
        totalPages: pagesResult.rows[0].total as number || 0,
        averageRating: ratingResult.rows[0].average as number || 0,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        total: 0,
        reading: 0,
        read: 0,
        wantToRead: 0,
        paused: 0,
        dropped: 0,
        totalPages: 0,
        averageRating: 0,
      };
    }
  }
}

export const bookDatabase = new TursoBookDatabase();