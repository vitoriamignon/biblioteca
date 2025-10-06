// test-turso-completo.js
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function testCompleto() {
  console.log('🔍 Teste completo do Turso...');
  
  // Verifica estrutura
  const structure = await client.execute("PRAGMA table_info(Book)");
  console.log('📋 Estrutura da tabela Book:');
  structure.rows.forEach(col => {
    console.log(`   - ${col.name} (${col.type})`);
  });
  
  // Verifica livros
  const books = await client.execute("SELECT id, title, author, status FROM Book");
  console.log(`\n📚 Total de livros: ${books.rows.length}`);
  books.rows.forEach(book => {
    console.log(`   - "${book.title}" por ${book.author} (${book.status})`);
  });
}

testCompleto();