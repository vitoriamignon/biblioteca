# API Testing Guide

## Testando as API Routes do BookShelf

### Endpoints Disponíveis

#### 1. **GET /api/books** - Listar todos os livros
```bash
curl http://localhost:3000/api/books
```

Filtros opcionais:
- `?search=termo` - busca por título, autor, gênero ou sinopse
- `?genre=Fantasia` - filtra por gênero específico
- `?status=LENDO` - filtra por status

Exemplos:
```bash
curl "http://localhost:3000/api/books?search=harry"
curl "http://localhost:3000/api/books?genre=Fantasia"
curl "http://localhost:3000/api/books?status=LENDO"
```

#### 2. **POST /api/books** - Criar novo livro
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Novo Livro",
    "author": "Autor Teste",
    "genre": "Ficção",
    "year": 2023,
    "pages": 300,
    "rating": 4,
    "synopsis": "Uma sinopse interessante...",
    "cover": "https://example.com/cover.jpg",
    "status": "QUERO_LER"
  }'
```

#### 3. **GET /api/books/[id]** - Obter detalhes de um livro
```bash
curl http://localhost:3000/api/books/1
```

#### 4. **PUT /api/books/[id]** - Atualizar um livro
```bash
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título Atualizado",
    "rating": 5
  }'
```

#### 5. **DELETE /api/books/[id]** - Excluir um livro
```bash
curl -X DELETE http://localhost:3000/api/books/1
```

#### 6. **GET /api/categories** - Listar gêneros disponíveis
```bash
curl http://localhost:3000/api/categories
```

#### 7. **GET /api/stats** - Obter estatísticas da biblioteca
```bash
curl http://localhost:3000/api/stats
```

### Respostas da API

Todas as respostas seguem o padrão:

**Sucesso:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso" // opcional
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

### Validações

A API valida os seguintes campos ao criar/atualizar livros:

- **title**: Obrigatório, string não vazia
- **author**: Obrigatório, string não vazia  
- **genre**: Obrigatório, string não vazia
- **year**: Obrigatório, número entre 1000 e ano atual + 10
- **pages**: Obrigatório, número positivo
- **rating**: Opcional, número entre 0 e 5
- **synopsis**: Opcional, string
- **cover**: Opcional, string (URL)
- **status**: Opcional, um dos valores: QUERO_LER, LENDO, LIDO, PAUSADO, ABANDONADO

### Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **404**: Recurso não encontrado
- **409**: Conflito (ex: gênero já existe)
- **500**: Erro interno do servidor