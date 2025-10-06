import { createClient } from '@libsql/client'

const turso = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export async function getBooks() {
  const result = await turso.execute(`
    SELECT * FROM Book ORDER BY createdAt DESC
  `)
  
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    year: row.year,
    pages: row.pages,
    rating: row.rating,
    synopsis: row.synopsis,
    cover: row.cover,
    status: row.status,
    currentPage: row.currentPage,
    isbn: row.isbn,
    notes: row.notes,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }))
}

export async function getBookCount() {
  const result = await turso.execute('SELECT COUNT(*) as total FROM Book')
  return result.rows[0].total
}