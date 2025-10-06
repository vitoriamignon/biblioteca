// create-tables.js
const { createClient } = require('@libsql/client')
require('dotenv').config()

const turso = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function createTables() {
  try {
    console.log('🗄️ Criando tabelas no Turso...')
    
    // SQL para criar a tabela Book
    const createBookTable = `
      CREATE TABLE IF NOT EXISTS Book (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        genre TEXT,
        year INTEGER NOT NULL,
        pages INTEGER NOT NULL,
        rating REAL NOT NULL,
        synopsis TEXT NOT NULL,
        cover TEXT,
        status TEXT NOT NULL DEFAULT 'QUERO_LER',
        currentPage INTEGER DEFAULT 0,
        isbn TEXT,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `
    
    await turso.execute(createBookTable)
    console.log('✅ Tabela Book criada!')
    
    // Verificar se a tabela foi criada
    const tables = await turso.execute(`
      SELECT name FROM sqlite_master WHERE type='table'
    `)
    
    console.log('📊 Tabelas no banco:')
    tables.rows.forEach(row => {
      console.log(`   - ${row.name}`)
    })
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message)
  }
}

createTables()