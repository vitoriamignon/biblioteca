// migrate-genres.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extrair gêneros únicos dos seus livros
const uniqueGenres = [
  'Ficção Científica',
  'Fantasia', 
  'Sátira Política',
  'Infantil',
  'Boas Práticas',
  'Carreira e Prática',
  'Arquitetura de Software',
  'Padrões de Projeto',
  'Algoritmos e Estrutura de Dados'
];

async function migrateGenres() {
  try {
    console.log('📚 Adicionando gêneros...');
    
    for (const genreName of uniqueGenres) {
      await prisma.genre.create({
        data: {
          name: genreName
        }
      });
      console.log(`✅ Gênero: ${genreName}`);
    }
    
    console.log(`🎉 ${uniqueGenres.length} gêneros criados!`);
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateGenres();