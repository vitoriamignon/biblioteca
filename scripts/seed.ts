// scripts/seed.ts
import { PrismaClient } from '@prisma/client'
import { initialBooks } from '../app/lib/data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')
  
  // Limpar dados existentes
  await prisma.book.deleteMany()
  console.log('🗑️ Dados antigos removidos')
  
  // Inserir livros iniciais
  for (const book of initialBooks) {
    await prisma.book.create({
      data: {
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        pages: book.pages,
        rating: book.rating,
        synopsis: book.synopsis,
        cover: book.cover,
        status: book.status as any, // Converter para enum do Prisma
      }
    })
  }
  
  console.log(`✅ ${initialBooks.length} livros inseridos com sucesso!`)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })