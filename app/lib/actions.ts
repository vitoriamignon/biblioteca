// lib/actions.ts - VERSÃO COMPLETA COM TURSO
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getTursoClient } from './turso';
import { Book } from './types';

// Server Action para criar um novo livro
export async function createBook(formData: FormData) {
  try {
    const bookData = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      genre: formData.get('genre') as string,
      year: parseInt(formData.get('year') as string),
      pages: parseInt(formData.get('pages') as string),
      rating: parseFloat(formData.get('rating') as string) || 0,
      synopsis: formData.get('synopsis') as string || '',
      cover: formData.get('cover') as string || '',
      status: (formData.get('status') as Book['status']) || 'QUERO_LER',
      currentPage: parseInt(formData.get('currentPage') as string) || 0,
      isbn: formData.get('isbn') as string || '',
      notes: formData.get('notes') as string || '',
    };

    // Validação básica
    if (!bookData.title || !bookData.author || !bookData.genre) {
      throw new Error('Título, autor e gênero são obrigatórios');
    }

    if (!bookData.year || !bookData.pages) {
      throw new Error('Ano e número de páginas são obrigatórios');
    }

    const client = getTursoClient();
    if (!client) {
      throw new Error('Banco de dados não configurado');
    }

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
        bookData.genre,
        bookData.year,
        bookData.pages,
        bookData.rating,
        bookData.synopsis,
        bookData.cover,
        bookData.status,
        bookData.currentPage,
        bookData.isbn,
        bookData.notes,
        now,
        now
      ]
    });

    // Revalidar as páginas que mostram livros
    revalidatePath('/library');
    revalidatePath('/dashboard');

  } catch (error) {
    console.error('Erro ao criar livro:', error);
    throw error;
  }

  redirect('/library');
}

// Server Action para atualizar um livro
export async function updateBook(id: string, formData: FormData) {
  try {
    const client = getTursoClient();
    if (!client) {
      throw new Error('Banco de dados não configurado');
    }

    const updates: string[] = [];
    const args: any[] = [];

    // Campos que podem ser atualizados
    const fields = [
      'title', 'author', 'genre', 'year', 'pages', 'rating', 
      'synopsis', 'cover', 'status', 'currentPage', 'isbn', 'notes'
    ];

    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null && value !== '') {
        updates.push(`${field} = ?`);
        
        // Converter tipos numéricos
        if (field === 'year' || field === 'pages' || field === 'currentPage') {
          args.push(parseInt(value as string));
        } else if (field === 'rating') {
          args.push(parseFloat(value as string));
        } else {
          args.push(value);
        }
      }
    });

    if (updates.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }

    // Adicionar updatedAt e bookId
    updates.push('updatedAt = ?');
    args.push(new Date().toISOString());
    args.push(id);

    const result = await client.execute({
      sql: `UPDATE Book SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    if (result.rowsAffected === 0) {
      throw new Error('Livro não encontrado');
    }

    revalidatePath('/library');
    revalidatePath('/dashboard');
    revalidatePath(`/library/${id}`);

  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    throw error;
  }

  redirect(`/library/${id}`);
}

// Server Action para excluir um livro
export async function deleteBook(id: string) {
  try {
    const client = getTursoClient();
    if (!client) {
      throw new Error('Banco de dados não configurado');
    }

    const result = await client.execute({
      sql: 'DELETE FROM Book WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      throw new Error('Livro não encontrado');
    }

    revalidatePath('/library');
    revalidatePath('/dashboard');

  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    throw error;
  }

  redirect('/library');
}

// Server Action para buscar livros
export async function getBooks(searchParams?: {
  search?: string;
  genre?: string;
  status?: Book['status'];
}) {
  try {
    const client = getTursoClient();
    if (!client) {
      return [];
    }

    let sql = `SELECT * FROM Book WHERE 1=1`;
    const args: any[] = [];

    if (searchParams?.search) {
      sql += ` AND (title LIKE ? OR author LIKE ? OR synopsis LIKE ?)`;
      const searchTerm = `%${searchParams.search}%`;
      args.push(searchTerm, searchTerm, searchTerm);
    }

    if (searchParams?.genre && searchParams.genre !== 'all') {
      sql += ` AND genre = ?`;
      args.push(searchParams.genre);
    }

    if (searchParams?.status) {
      sql += ` AND status = ?`;
      args.push(searchParams.status);
    }

    sql += ` ORDER BY createdAt DESC`;

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
      status: row.status as Book['status'],
      currentPage: row.currentPage as number,
      isbn: row.isbn as string,
      notes: row.notes as string,
      createdAt: row.createdAt as string,
      updatedAt: row.updatedAt as string,
    }));

  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return [];
  }
}

// Server Action para obter um livro por ID
export async function getBook(id: string) {
  try {
    const client = getTursoClient();
    if (!client) {
      return null;
    }

    const result = await client.execute({
      sql: 'SELECT * FROM Book WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as string,
      title: row.title as string,
      author: row.author as string,
      genre: row.genre as string,
      year: row.year as number,
      pages: row.pages as number,
      rating: row.rating as number,
      synopsis: row.synopsis as string,
      cover: row.cover as string,
      status: row.status as Book['status'],
      currentPage: row.currentPage as number,
      isbn: row.isbn as string,
      notes: row.notes as string,
      createdAt: row.createdAt as string,
      updatedAt: row.updatedAt as string,
    };

  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return null;
  }
}

// Server Action para obter estatísticas - VERSÃO COMPATÍVEL
export async function getStats() {
  try {
    const client = getTursoClient();
    if (!client) {
      return {
        total: 0,
        reading: 0,
        read: 0,
        wantToRead: 0,
        paused: 0,
        abandoned: 0,
        totalPages: 0,
        averageRating: 0
      };
    }

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
      abandoned: statusCounts['ABANDONADO'] || 0,
      totalPages: pagesResult.rows[0].total as number || 0,
      averageRating: ratingResult.rows[0].average as number || 0,
    };

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      total: 0,
      reading: 0,
      read: 0,
      wantToRead: 0,
      paused: 0,
      abandoned: 0,
      totalPages: 0,
      averageRating: 0
    };
  }
}

// Server Action para obter gêneros
export async function getGenres() {
  try {
    const client = getTursoClient();
    if (!client) {
      return [];
    }

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
    console.error('Erro ao buscar gêneros:', error);
    return [];
  }
}