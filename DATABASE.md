# 🗄️ Banco de Dados - SQLite + Prisma

O projeto BookShelf agora usa **SQLite** com **Prisma ORM** para persistência de dados real.

## 📊 **Configuração Atual:**
- **Banco:** SQLite (arquivo local)
- **ORM:** Prisma
- **Localização:** `prisma/dev.db`
- **Schema:** `prisma/schema.prisma`

## 🚀 **Comandos Úteis:**

### 📝 **Desenvolvimento:**
```bash
# Gerar cliente Prisma
npm run db:generate

# Criar nova migração
npm run db:migrate

# Popular banco com dados iniciais
npm run db:seed

# Abrir Prisma Studio (interface visual)
npm run db:studio

# Reset completo do banco
npm run db:reset
```

### 🔧 **Scripts Disponíveis:**
- `db:generate` - Gera o cliente Prisma
- `db:migrate` - Executa migrações pendentes
- `db:seed` - Popula banco com 18 livros de exemplo
- `db:studio` - Interface web para visualizar dados
- `db:reset` - Reseta banco e executa seed

## 📋 **Schema do Banco:**

```prisma
model Book {
  id        String     @id @default(cuid())
  title     String
  author    String
  genre     String
  year      Int
  pages     Int
  rating    Float
  synopsis  String
  cover     String
  status    BookStatus
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

enum BookStatus {
  QUERO_LER
  LENDO
  LIDO
  PAUSADO
  ABANDONADO
}
```

## ✅ **Vantagens da Implementação:**

### 🎯 **Persistência Real:**
- Os dados não são perdidos ao reiniciar o servidor
- Banco SQLite local (arquivo `dev.db`)
- Transações ACID garantidas

### 🔄 **Migrações:**
- Versionamento do schema
- Migrations automáticas
- Rollback quando necessário

### 🛠️ **Prisma Studio:**
- Interface visual para o banco
- CRUD direto no navegador
- Ideal para desenvolvimento

### 📈 **Performance:**
- Queries SQL otimizadas
- Connection pooling
- Lazy loading

## 🔄 **Migração Completa:**

A migração do banco em memória para SQLite foi **100% transparente**:

✅ Mesma interface da classe `BookDatabase`  
✅ Todas as APIs continuam funcionando  
✅ Frontend inalterado  
✅ Dados iniciais preservados  

## 🎮 **Como Usar:**

1. **Primeira vez:**
```bash
npm run db:seed
```

2. **Visualizar dados:**
```bash
npm run db:studio
```

3. **Reset para dados iniciais:**
```bash
npm run db:reset
```

## 📁 **Estrutura de Arquivos:**
```
biblioteca/
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   ├── dev.db            # Arquivo SQLite (gitignored)
│   └── migrations/       # Histórico de migrações
├── scripts/
│   └── seed.ts           # Script de população
└── app/lib/
    ├── prisma.ts         # Cliente Prisma
    ├── database.ts       # Implementação com Prisma
    └── database-memory.ts # Backup da implementação anterior
```

O projeto agora tem um banco de dados real e profissional! 🎉