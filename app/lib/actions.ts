// app/lib/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from './prisma'; // ⬅️ Importar Prisma
import { BookStatus } from '@prisma/client'; // ⬅️ Importar enum do Prisma

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
      status: (formData.get('status') as BookStatus) || 'QUERO_LER',
      // ⬇️ NOVOS CAMPOS
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

    // ⬇️ USANDO PRISMA - substituir bookDatabase.createBook()
    await prisma.book.create({
      data: bookData
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
    const updateData: Record<string, unknown> = {};

    // Campos existentes
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
    if (rating) updateData.rating = parseFloat(rating);

    const synopsis = formData.get('synopsis') as string;
    if (synopsis !== null) updateData.synopsis = synopsis;

    const cover = formData.get('cover') as string;
    if (cover !== null) updateData.cover = cover;

    const status = formData.get('status') as BookStatus;
    if (status) updateData.status = status;

    // ⬇️ NOVOS CAMPOS
    const currentPage = formData.get('currentPage') as string;
    if (currentPage) updateData.currentPage = parseInt(currentPage);

    const isbn = formData.get('isbn') as string;
    if (isbn !== null) updateData.isbn = isbn;

    const notes = formData.get('notes') as string;
    if (notes !== null) updateData.notes = notes;

    // ⬇️ USANDO PRISMA - substituir bookDatabase.updateBook()
    const updatedBook = await prisma.book.update({
      where: { id },
      data: updateData
    });

    if (!updatedBook) {
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
    // ⬇️ USANDO PRISMA - substituir bookDatabase.deleteBook()
    const deleted = await prisma.book.delete({
      where: { id }
    });

    if (!deleted) {
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
  status?: BookStatus;
}) {
  try {
    let where: any = {};

    if (searchParams?.search) {
      where.OR = [
        { title: { contains: searchParams.search, mode: 'insensitive' } },
        { author: { contains: searchParams.search, mode: 'insensitive' } },
        { synopsis: { contains: searchParams.search, mode: 'insensitive' } }
      ];
    }
    
    if (searchParams?.genre && searchParams.genre !== 'all') {
      where.genre = searchParams.genre;
    }
    
    if (searchParams?.status) {
      where.status = searchParams.status;
    }

    // ⬇️ USANDO PRISMA
    return await prisma.book.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return [];
  }
}

// Server Action para obter um livro por ID
export async function getBook(id: string) {
  try {
    // ⬇️ USANDO PRISMA
    return await prisma.book.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return null;
  }
}

// Server Action para obter estatísticas
export async function getStats() {
  try {
    // ⬇️ USANDO PRISMA - substituir bookDatabase.getStats()
    const [total, reading, read, wantToRead, paused, abandoned, pagesResult, ratingResult] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { status: 'LENDO' } }),
      prisma.book.count({ where: { status: 'LIDO' } }),
      prisma.book.count({ where: { status: 'QUERO_LER' } }),
      prisma.book.count({ where: { status: 'PAUSADO' } }),
      prisma.book.count({ where: { status: 'ABANDONADO' } }),
      prisma.book.aggregate({ _sum: { pages: true } }),
      prisma.book.aggregate({ _avg: { rating: true } })
    ]);

    return {
      total,
      reading,
      read,
      wantToRead: wantToRead,
      paused,
      abandoned,
      totalPages: pagesResult._sum.pages || 0,
      averageRating: ratingResult._avg.rating || 0
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
    // ⬇️ USANDO PRISMA
    return await prisma.genre.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    return [];
  }
}