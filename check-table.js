// check-table.js
const { createClient } = require('@libsql/client');

const client = createClient({
  url: "libsql://minha-biblioteca-torimarques.aws-us-east-2.turso.io", // COLE SUA URL AQUI
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTk3MTI1MDUsImlkIjoiYjFjMTY4MDAtMjBlNy00ZmEyLTgyYWMtMGU3MGNhZDlkMzM2IiwicmlkIjoiMmIwMzVlM2EtY2JhNS00ZmE3LTkyYWUtODRhNWUxNTZjNjUwIn0.ejz5aSrXlAKNoPbbKpYvWPWX6owImLPIuZDnz56tfMfDzy9_lx4kPQ2g1tQJbsFCBduwTA8mvtZM8W8u5iSgAg" // COLE SEU TOKEN AQUI
});

async function checkTable() {
  try {
    console.log('🔍 Verificando estrutura da tabela Book...');
    
    const result = await client.execute(`
      PRAGMA table_info(Book)
    `);
    
    console.log('📋 Estrutura da tabela Book:');
    result.rows.forEach(row => {
      console.log(`   - ${row.name} (${row.type})`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    client.close();
  }
}

checkTable();