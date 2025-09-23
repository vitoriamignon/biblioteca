// app/lib/database.ts
import { Book } from "./types";
import { initialBooks } from "./data";

// Simulação de um banco de dados em memória
// Em produção, isso seria substituído por um banco de dados real
class BookDatabase {
  private books: Book[] = [...initialBooks];

  // Obter todos os livros
  async getAllBooks(): Promise<Book[]> {
    return [...this.books];
  }

  // Obter livro por ID
  async getBookById(id: string): Promise<Book | null> {
    const book = this.books.find(b => b.id === id);
    return book ? { ...book } : null;
  }

  // Criar novo livro
  async createBook(bookData: Omit<Book, 'id'>): Promise<Book> {
    const newBook: Book = {
      id: this.generateId(),
      ...bookData
    };
    this.books.unshift(newBook);
    return { ...newBook };
  }

  // Atualizar livro
  async updateBook(id: string, bookData: Partial<Book>): Promise<Book | null> {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) {
      return null;
    }

    const updatedBook = {
      ...this.books[index],
      ...bookData,
      id // Garantir que o ID não seja alterado
    };

    this.books[index] = updatedBook;
    return { ...updatedBook };
  }

  // Excluir livro
  async deleteBook(id: string): Promise<boolean> {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }

    this.books.splice(index, 1);
    return true;
  }

  // Obter todas as categorias/gêneros
  async getAllGenres(): Promise<string[]> {
    const genres = new Set(this.books.map(book => book.genre));
    return Array.from(genres).sort();
  }

  // Buscar livros por termo
  async searchBooks(term: string): Promise<Book[]> {
    const lowerTerm = term.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(lowerTerm) ||
      book.author.toLowerCase().includes(lowerTerm) ||
      book.genre.toLowerCase().includes(lowerTerm) ||
      book.synopsis.toLowerCase().includes(lowerTerm)
    );
  }

  // Filtrar livros por gênero
  async getBooksByGenre(genre: string): Promise<Book[]> {
    return this.books.filter(book => book.genre === genre);
  }

  // Filtrar livros por status
  async getBooksByStatus(status: Book['status']): Promise<Book[]> {
    return this.books.filter(book => book.status === status);
  }

  // Gerador de ID simples (em produção, use UUID ou similar)
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }

  // Obter estatísticas
  async getStats() {
    const books = await this.getAllBooks();
    return {
      total: books.length,
      reading: books.filter(b => b.status === 'LENDO').length,
      read: books.filter(b => b.status === 'LIDO').length,
      wantToRead: books.filter(b => b.status === 'QUERO_LER').length,
      paused: books.filter(b => b.status === 'PAUSADO').length,
      abandoned: books.filter(b => b.status === 'ABANDONADO').length,
      totalPages: books.reduce((sum, b) => sum + b.pages, 0),
      averageRating: books.length > 0 
        ? books.reduce((sum, b) => sum + b.rating, 0) / books.length 
        : 0
    };
  }
}

// Instância singleton do banco de dados
export const bookDatabase = new BookDatabase();