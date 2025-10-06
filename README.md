# 📚 BookShelf - Sua Biblioteca Digital

Uma aplicação moderna e completa para gerenciar sua biblioteca pessoal de livros, construída com Next.js 15, React 19 e TypeScript.

## ✨ Funcionalidades

### 📖 Gerenciamento de Livros
- ✅ **Adicionar livros** com informações completas (título, autor, gênero, ano, páginas, avaliação, sinopse e capa)
- ✅ **Editar livros** existentes
- ✅ **Excluir livros** com confirmação
- ✅ **Visualizar detalhes** completos de cada livro
- ✅ **Status de leitura** (Quero Ler, Lendo, Lido, Pausado, Abandonado)

### 🔍 Busca e Filtros
- ✅ **Busca por texto** em título, autor, gênero ou sinopse
- ✅ **Filtro por gênero** dinamicamente atualizado
- ✅ **Filtros na URL** para compartilhamento
- ✅ **Limpeza de filtros** com um clique

### 📊 Dashboard
- ✅ **Estatísticas em tempo real** da biblioteca
- ✅ **Contadores por status** de leitura
- ✅ **Total de páginas lidas**
- ✅ **Avaliação média** dos livros

### 🎨 Sistema de Temas
- ✅ **Light Mode** (tema claro)
- ✅ **Dark Mode** (tema escuro) 
- ✅ **System Mode** (seguir preferência do sistema)
- ✅ **Persistência** da preferência no localStorage
- ✅ **Prevenção de FOUC** (Flash of Unstyled Content)
- ✅ **Transições suaves** entre temas

### 🚀 API REST Completa
- ✅ **GET /api/books** - Listar livros com filtros
- ✅ **POST /api/books** - Criar novo livro
- ✅ **GET /api/books/[id]** - Obter detalhes de um livro
- ✅ **PUT /api/books/[id]** - Atualizar livro
- ✅ **DELETE /api/books/[id]** - Excluir livro
- ✅ **GET /api/categories** - Listar gêneros
- ✅ **GET /api/stats** - Obter estatísticas

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI modernos

### Backend
- **Next.js API Routes** - APIs serverless
- **Server Actions** - Mutações no servidor
- **Server Components** - Renderização no servidor

### Arquitetura
- **App Router** - Novo sistema de roteamento do Next.js
- **Server Components** para data fetching
- **Client Components** para interatividade
- **Database abstraction** para fácil migração

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn ou pnpm

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/vitoriamignon/bookshelf.git
cd bookshelf
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure o Banco de Dados:**
```bash
# 1. Gerar cliente Prisma
npx prisma generate

# 2. Criar banco e tabelas
npx prisma migrate dev --name init

# 3. Migrar livros para o banco
node migrate-books.js

# 4. Migrar gêneros para o banco
node migrate-genres.js
```

4. **Execute em modo desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
# ou 
pnpm dev
```

5. **Abra o navegador:**
```
http://localhost:3000
```

### Build para produção

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Banco de dados
npx prisma studio          # Visualizar dados
npx prisma generate        # Atualizar cliente
npx prisma migrate dev     # Nova migração

```

## 🚀 Deploy

### Deploy na Vercel (Recomendado)

1. **Fazer push para GitHub:**
```bash
git add .
git commit -m "feat: implementação completa com SQLite + Prisma"
git push origin main
```

2. **Deploy na Vercel:**
- Acesse [vercel.com](https://vercel.com)
- Conecte seu repositório GitHub
- Configure as variáveis de ambiente
- Deploy automático! 🎉

### Variáveis de Ambiente para Produção:
```env
DATABASE_URL="file:./prod.db"
```

### Deploy em outras plataformas:
- **Railway:** Suporte nativo a SQLite
- **Render:** Migrar para PostgreSQL
- **Netlify:** Requires external database

Consulte [DEPLOY.md](./DEPLOY.md) para instruções detalhadas.

## 📁 Estrutura do Projeto

```
bookshelf/
├── app/
│   ├── api/                    # API Routes
│   │   ├── books/             # Endpoints de livros
│   │   ├── categories/        # Endpoints de categorias
│   │   └── stats/            # Endpoints de estatísticas
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes base
│   │   └── forms/           # Formulários
│   ├── lib/                 # Utilitários e lógica
│   │   ├── actions.ts       # Server Actions
│   │   ├── database.ts      # Camada de dados
│   │   ├── storage.ts       # Storage local (legado)
│   │   ├── types.ts         # Tipos TypeScript
│   │   └── data.ts          # Dados iniciais
│   ├── library/             # Páginas da biblioteca
│   │   ├── [bookId]/        # Páginas dinâmicas do livro
│   │   └── add/             # Página de adicionar
│   ├── dashboard/           # Dashboard
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página inicial
├── public/                  # Arquivos estáticos
├── API_TESTING.md          # Guia de teste da API
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```


