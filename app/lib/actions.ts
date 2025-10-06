// lib/actions.ts - VERSÃO FINAL PARA DEPLOY
import { createClient } from '@libsql/client';

// Configuração segura do Turso
function getTursoClient() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url || !authToken) {
    console.warn('⚠️ Variáveis do Turso não configuradas');
    return null;
  }
  
  try {
    return createClient({ url, authToken });
  } catch (error) {
    console.error('❌ Erro ao criar cliente Turso:', error);
    return null;
  }
}

export async function getStats() {
  const client = getTursoClient();
  
  if (!client) {
    console.warn('⚠️ Retornando stats vazios (Turso não configurado)');
    return {
      totalBooks: 0,
      booksByStatus: {
        QUERO_LER: 0,
        LENDO: 0,
        LIDO: 0,
        PAUSADO: 0,
        ABANDONADO: 0
      },
      totalPages: 0,
      favoriteGenre: 'Nenhum'
    };
  }

  try {
    // Busca estatísticas dos livros
    const totalBooksResult = await client.execute('SELECT COUNT(*) as total FROM Book');
    const totalBooks = totalBooksResult.rows[0].total as number;

    // Livros por status
    const statusResult = await client.execute(`
      SELECT status, COUNT(*) as count 
      FROM Book 
      GROUP BY status
    `);

    const booksByStatus = {
      QUERO_LER: 0,
      LENDO: 0,
      LIDO: 0,
      PAUSADO: 0,
      ABANDONADO: 0
    };

    statusResult.rows.forEach(row => {
      const status = row.status as keyof typeof booksByStatus;
      const count = row.count as number;
      if (status in booksByStatus) {
        booksByStatus[status] = count;
      }
    });

    // Total de páginas
    const pagesResult = await client.execute('SELECT SUM(pages) as total FROM Book WHERE status = "LIDO"');
    const totalPages = pagesResult.rows[0].total as number || 0;

    // Gênero favorito
    const genreResult = await client.execute(`
      SELECT genre, COUNT(*) as count 
      FROM Book 
      WHERE genre IS NOT NULL AND genre != '' 
      GROUP BY genre 
      ORDER BY count DESC 
      LIMIT 1
    `);

    const favoriteGenre = genreResult.rows.length > 0 
      ? (genreResult.rows[0].genre as string) 
      : 'Nenhum';

    return {
      totalBooks,
      booksByStatus,
      totalPages,
      favoriteGenre
    };

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return {
      totalBooks: 0,
      booksByStatus: {
        QUERO_LER: 0,
        LENDO: 0,
        LIDO: 0,
        PAUSADO: 0,
        ABANDONADO: 0
      },
      totalPages: 0,
      favoriteGenre: 'Nenhum'
    };
  }
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  year: number;
  pages: number;
  rating: number;
  synopsis: string;
  cover?: string;
  status: 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';
  currentPage: number;
  isbn?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
}

export async function getBooks(filters?: {
  search?: string;
  genre?: string;
  status?: string;
}): Promise<Book[]> {
  const client = getTursoClient();
  
  if (!client) {
    console.warn('📚 Retornando array vazio (Turso não configurado)');
    return [];
  }

  try {
    let sql = `SELECT * FROM Book WHERE 1=1`;
    const args: any[] = [];

    if (filters?.search) {
      sql += ` AND (title LIKE ? OR author LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      args.push(searchTerm, searchTerm);
    }

    if (filters?.genre && filters.genre !== 'all') {
      sql += ` AND genre = ?`;
      args.push(filters.genre);
    }

    if (filters?.status) {
      sql += ` AND status = ?`;
      args.push(filters.status);
    }

    sql += ` ORDER BY title ASC`;

    const result = await client.execute({ sql, args });
    
    return result.rows.map(row => ({
      id: row.id as string,
      title: row.title as string,
      author: row.author as string,
      genre: row.genre as string,
      year: row.year as number,
      pages: row.pages as number,
      rating: row.rating as number,
      synopsis: row.synopsis as string,
      cover: row.cover as string,
      status: row.status as any,
      currentPage: row.currentPage as number,
      isbn: row.isbn as string,
      notes: row.notes as string,
      createdAt: row.createdAt as string,
      updatedAt: row.updatedAt as string,
    }));

  } catch (error) {
    console.error('❌ Erro ao buscar livros do Turso:', error);
    return [];
  }
}

export async function getGenres(): Promise<Genre[]> {
  const client = getTursoClient();
  
  if (!client) {
    return [];
  }

  try {
    const result = await client.execute(`
      SELECT DISTINCT genre as name 
      FROM Book 
      WHERE genre IS NOT NULL AND genre != ''
      ORDER BY genre ASC
    `);

    return result.rows.map(row => ({
      id: row.name as string,
      name: row.name as string,
    }));

  } catch (error) {
    console.error('❌ Erro ao buscar gêneros:', error);
    return [];
  }
}