// test-deploy.js
const { getBooks, getGenres } = require('./lib/actions');

async function testDeploy() {
  console.log('🧪 Teste final para deploy...\n');
  
  try {
    // Teste básico
    const books = await getBooks();
    console.log(`✅ getBooks(): ${books.length} livros`);
    
    const genres = await getGenres();
    console.log(`✅ getGenres(): ${genres.length} gêneros`);
    
    // Teste com filtros
    const filteredBooks = await getBooks({ search: 'Harry' });
    console.log(`✅ getBooks({search: "Harry"}): ${filteredBooks.length} livros`);
    
    console.log('\n🎉 Todos os testes passaram! Pronto para deploy.');
    
  } catch (error) {
    console.error('❌ Teste falhou:', error);
    process.exit(1);
  }
}

testDeploy();