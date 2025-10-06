// migrate-genres.js
//const { PrismaClient } = require('@prisma/client');
//const prisma = new PrismaClient();

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

async function migrateToTurso() {
  try {
    console.log('🚀 Migrando livros para Turso...');
    // Seu código de migração aqui
    await prisma.$disconnect();
    console.log('✅ Migração concluída!');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

migrateToTurso();