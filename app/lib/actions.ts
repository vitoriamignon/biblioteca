// app/lib/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { bookDatabase } from './database';
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
      rating: parseInt(formData.get('rating') as string) || 0,
      synopsis: formData.get('synopsis') as string || '',
      cover: formData.get('cover') as string || '',
      status: (formData.get('status') as Book['status']) || 'QUERO_LER'
    };

    // Validação básica
    if (!bookData.title || !bookData.author || !bookData.genre) {
      throw new Error('Título, autor e gênero são obrigatórios');
    }

    if (!bookData.year || !bookData.pages) {
      throw new Error('Ano e número de páginas são obrigatórios');
    }

    await bookDatabase.createBook(bookData);

    // Revalidar as páginas que mostram livros
    revalidatePath('/library');
    revalidatePath('/dashboard');

  } catch (error) {
    console.error('Erro ao criar livro:', error);
    throw error;
  }

  // Redirecionar para a biblioteca após criar o livro
  redirect('/library');
}

// Server Action para atualizar um livro
export async function updateBook(id: string, formData: FormData) {
  try {
    const updateData: Partial<Book> = {};

    // Apenas incluir campos que foram preenchidos
    const title = formData.get('title') as string;
    if (title) updateData.title = title;

    const author = formData.get('author') as string;
    if (author) updateData.author = author;

    const genre = formData.get('genre') as string;
    if (genre) updateData.genre = genre;

    const year = formData.get('year') as string;
    if (year) updateData.year = parseInt(year);

    const pages = formData.get('pages') as string;
    if (pages) updateData.pages = parseInt(pages);

    const rating = formData.get('rating') as string;
    if (rating) updateData.rating = parseInt(rating);

    const synopsis = formData.get('synopsis') as string;
    if (synopsis !== null) updateData.synopsis = synopsis;

    const cover = formData.get('cover') as string;
    if (cover !== null) updateData.cover = cover;

    const status = formData.get('status') as Book['status'];
    if (status) updateData.status = status;

    const updatedBook = await bookDatabase.updateBook(id, updateData);

    if (!updatedBook) {
      throw new Error('Livro não encontrado');
    }

    // Revalidar as páginas que mostram livros
    revalidatePath('/library');
    revalidatePath('/dashboard');
    revalidatePath(`/library/${id}`);

  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    throw error;
  }

  // Redirecionar para a página do livro após atualizar
  redirect(`/library/${id}`);
}

// Server Action para excluir um livro
export async function deleteBook(id: string) {
  try {
    const deleted = await bookDatabase.deleteBook(id);

    if (!deleted) {
      throw new Error('Livro não encontrado');
    }

    // Revalidar as páginas que mostram livros
    revalidatePath('/library');
    revalidatePath('/dashboard');

  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    throw error;
  }

  // Redirecionar para a biblioteca após excluir
  redirect('/library');
}

// Server Action para buscar livros (usado em Server Components)
export async function getBooks(searchParams?: {
  search?: string;
  genre?: string;
  status?: Book['status'];
}) {
  try {
    if (searchParams?.search) {
      return await bookDatabase.searchBooks(searchParams.search);
    }
    
    if (searchParams?.genre && searchParams.genre !== 'all') {
      return await bookDatabase.getBooksByGenre(searchParams.genre);
    }
    
    if (searchParams?.status) {
      return await bookDatabase.getBooksByStatus(searchParams.status);
    }

    return await bookDatabase.getAllBooks();
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return [];
  }
}

// Server Action para obter um livro por ID
export async function getBook(id: string) {
  try {
    return await bookDatabase.getBookById(id);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return null;
  }
}

// Server Action para obter estatísticas
export async function getStats() {
  try {
    return await bookDatabase.getStats();
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
    return await bookDatabase.getAllGenres();
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    return [];
  }
}