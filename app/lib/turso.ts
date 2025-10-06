// lib/turso.ts
import { createClient } from '@libsql/client';

// Configuração segura do Turso
export function getTursoClient() {
  const url = process.env.DATABASE_URL; // ✅ CORRIGIDO
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url || !authToken) {
    console.warn('⚠️ Variáveis do Turso não configuradas');
    return null;
  }
  
  try {
    return createClient({ url, authToken });
  } catch (error) {
    console.error('❌ Erro ao criar cliente Turso:', error);
    return null;
  }
}