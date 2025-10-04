import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleBooks = [
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Literatura Brasileira",
    year: 1899,
    pages: 256,
    rating: 4.5,
    synopsis: "Um dos maiores clássicos da literatura brasileira, narrado por Bento Santiago que relembra sua juventude e seu amor por Capitu.",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    status: "LIDO"
  },
  {
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    genre: "Realismo",
    year: 1890,
    pages: 304,
    rating: 4.0,
    synopsis: "Romance naturalista que retrata a vida em um cortiço no Rio de Janeiro do século XIX.",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    status: "LENDO"
  },
  {
    title: "Iracema",
    author: "José de Alencar",
    genre: "Romantismo",
    year: 1865,
    pages: 112,
    rating: 3.8,
    synopsis: "Lenda do Ceará sobre o amor entre a índia Iracema e o português Martim.",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    status: "QUERO_LER"
  },
  {
    title: "O Guarani",
    author: "José de Alencar",
    genre: "Romantismo",
    year: 1857,
    pages: 432,
    rating: 4.2,
    synopsis: "Romance indianista que narra a história de amor entre Ceci e Peri.",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    status: "PAUSADO"
  },
  {
    title: "A Moreninha",
    author: "Joaquim Manuel de Macedo",
    genre: "Romantismo",
    year: 1844,
    pages: 208,
    rating: 3.5,
    synopsis: "Primeiro romance brasileiro de sucesso, conta a história de amor entre Augusto e Carolina.",
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    status: "LIDO"
  }
]

async function main() {
  console.log('🌱 Adicionando livros de exemplo...')
  
  // Limpar dados existentes
  await prisma.book.deleteMany()
  console.log('🗑️ Dados antigos removidos')
  
  // Inserir livros de exemplo
  for (const book of sampleBooks) {
    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        pages: book.pages,
        rating: book.rating,
        synopsis: book.synopsis,
        cover: book.cover,
        status: book.status,
      }
    })
  }
  
  console.log(`✅ ${sampleBooks.length} livros adicionados com sucesso!`)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })