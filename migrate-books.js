// migrate-books.js
import { PrismaClient } from '@prisma/client';

// Dados diretamente do seu data.ts (copie e cole aqui)
const initialBooks = [
  {
    id: '1',
    title: 'O Guia do Mochileiro das Galáxias',
    author: 'Douglas Adams',
    genre: 'Ficção Científica',
    year: 2020,
    pages: 208,
    rating: 5,
    synopsis: 'A saga de Arthur Dent, um humano que é salvo da destruição da Terra por seu amigo Ford Prefect, um pesquisador para o Guia do Mochileiro das Galáxias.',
    cover: 'https://m.media-amazon.com/images/I/51B7vacPfEL._SY445_SX342_.jpg',
    status: 'LIDO',
  },
  {
    id: '2',
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien', 
    genre: 'Fantasia',
    year: 2019,
    pages: 310,
    rating: 5,
    synopsis: 'A jornada inesperada de Bilbo Bolseiro, um hobbit pacato que se vê em uma aventura épica para reclamar um tesouro guardado pelo dragão Smaug.',
    cover: 'https://m.media-amazon.com/images/I/511+-lOOtsL._SY445_SX342_.jpg',
    status: 'LENDO',
  },
  {
    id: '3',
    title: 'Duna',
    author: 'Frank Herbert',
    genre: 'Ficção Científica',
    year: 2017,
    pages: 688,
    rating: 5,
    synopsis:
      'A jornada de Paul Atreides no planeta desértico de Arrakis, onde ele se envolve em uma teia de política, religião e poder para controlar a substância mais valiosa do universo.',
    cover: 'https://m.media-amazon.com/images/I/81zN7udGRUL._SY385_.jpg',
    status: 'QUERO_LER',
  },
  {
    id: '4',
    title: 'A Revolução dos Bichos',
    author: 'George Orwell',
    genre: 'Sátira Política',
    year: 2007,
    pages: 152,
    rating: 4,
    synopsis:
      'Uma fábula sobre um grupo de animais de fazenda que se rebelam contra seu dono humano, na esperança de criar uma sociedade igualitária, apenas para ver a rebelião traída.',
    cover: 'https://m.media-amazon.com/images/I/91BsZhxCRjL._SY425_.jpg',
    status: 'LIDO',
  },
  {
    id: '5',
    title: 'O Nome do Vento',
    author: 'Patrick Rothfuss',
    genre: 'Fantasia',
    year: 2021,
    pages: 656,
    rating: 5,
    synopsis:
      'A história de Kvothe, um músico e mago lendário, que narra sua vida desde a infância em uma trupe de artistas viajantes até sua busca por vingança contra uma força misteriosa.',
    cover: 'https://m.media-amazon.com/images/I/91iE-Pu3v+L._SY385_.jpg',
    status: 'QUERO_LER',
  },
  {
    id: '6',
    title: 'Luni: A Menina Que Brilhava Sem Saber',
    author: 'Paula Azevêdo',
    genre: 'Infantil',
    year: 2025,
    pages: 40,
    rating: 5,
    synopsis:
      'Luni é um conto mágico e poético sobre solidão, amor verdadeiro e a descoberta da própria luz.',
    cover: 'https://m.media-amazon.com/images/I/71K893LkHzL._SY425_.jpg',
    status: 'QUERO_LER',
  },
  {
    id: '7',
    title: 'Harry Potter e a Pedra Filosofal',
    author: 'J.K. Rowling',
    genre: 'Fantasia',
    year: 1997,
    pages: 264,
    rating: 5,
    synopsis:
      'Harry Potter descobre em seu aniversário de 11 anos que é um bruxo e foi convidado para estudar na Escola de Magia e Bruxaria de Hogwarts. Ele embarca na aventura da sua vida.',
    cover: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L._SL1500_.jpg',
    status: 'LIDO',
  },
  {
    id: '8',
    title: 'Harry Potter e a Câmara Secreta',
    author: 'J.K. Rowling',
    genre: 'Fantasia',
    year: 1998,
    pages: 288,
    rating: 5,
    synopsis:
      'Harry retorna a Hogwarts para seu segundo ano, mas uma série de ataques misteriosos e uma sinistra profecia sobre a Câmara Secreta ameaçam a segurança da escola.',
    cover: 'https://m.media-amazon.com/images/I/61nl1sNi04L._SY425_.jpg',
    status: 'LIDO',
  },
  {
    id: '9',
    title: 'Harry Potter e o Prisioneiro de Azkaban',
    author: 'J.K. Rowling',
    genre: 'Fantasia',
    year: 1999,
    pages: 348,
    rating: 5,
    synopsis:
      'No terceiro ano em Hogwarts, Harry se depara com a notícia de que Sirius Black, um perigoso prisioneiro de Azkaban e suposto aliado de Voldemort, escapou e está à sua procura.',
    cover: 'https://m.media-amazon.com/images/I/81Q+2zleuwL._AC_UY218_.jpg',
    status: 'LIDO',
  },
  {
    id: '10',
    title: 'Harry Potter e o Cálice de Fogo',
    author: 'J.K. Rowling',
    genre: 'Fantasia',
    year: 2000,
    pages: 584,
    rating: 5,
    synopsis:
      'Hogwarts sedia o Torneio Tribruxo, uma competição mágica interescolar. Harry é selecionado para competir, enfrentando desafios mortais e o retorno de Lord Voldemort.',
    cover: 'https://m.media-amazon.com/images/I/81sbuHsj8PL._AC_UY218_.jpg',
    status: 'LIDO',
  },
  {
    id: '11',
    title: 'Harry Potter e a Ordem da Fênix',
    author: 'J.K. Rowling',
    genre: 'Fantasia',
    year: 2003,
    pages: 704,
    rating: 5,
    synopsis:
      'Com o retorno de Voldemort negado pelo Ministério da Magia, Harry e seus amigos formam a "Armada de Dumbledore" para se prepararem para a batalha que se aproxima.',
    cover: 'https://m.media-amazon.com/images/I/7138qIqoRFL._AC_UY218_.jpg',
    status: 'LIDO',
  },
  {
    id: '12',
    title: 'Harry Potter e o Enigma do Príncipe',
    author: 'J.K. Rowling',
    genre: 'Fantasia',
    year: 2005,
    pages: 432,
    rating: 5,
    synopsis:
      'Enquanto a guerra contra Voldemort se intensifica, Harry e Dumbledore mergulham no passado do Lorde das Trevas para descobrir o segredo de sua imortalidade: as Horcruxes.',
    cover: 'https://m.media-amazon.com/images/I/81yFIh1yoZL._AC_UY218_.jpg',
    status: 'LIDO',
  },
  {
    id: '13',
    title: 'Harry Potter e as Relíquias da Morte',
    author: 'J.K. Rowling',
    genre: 'Fantasia',
    year: 2007,
    pages: 552,
    rating: 5,
    synopsis:
      'Fora de Hogwarts, Harry, Rony e Hermione embarcam em uma perigosa missão para encontrar e destruir as Horcruxes restantes.',
    cover: 'https://m.media-amazon.com/images/I/51nqfHDw2aL._SY445_SX342_.jpg',
    status: 'LENDO',
  },
  {
    id: '14',
    title: 'Código Limpo: Habilidades Práticas do Agile Software',
    author: 'Robert C. Martin (Uncle Bob)',
    genre: 'Boas Práticas',
    year: 2008,
    pages: 464,
    rating: 5,
    synopsis:
      'Um livro essencial que ensina a escrever código legível, manutenível e de alta qualidade.',
    cover: 'https://m.media-amazon.com/images/I/41aHzYSXZkL._SY445_SX342_.jpg',
    status: 'QUERO_LER',
  },
  {
    id: '15',
    title: 'O Programador Pragmático: De Aprendiz a Mestre',
    author: 'Andrew Hunt, David Thomas',
    genre: 'Carreira e Prática',
    year: 1999,
    pages: 352,
    rating: 5,
    synopsis:
      'Um guia com dicas práticas e processos para aumentar a produtividade e a qualidade do seu trabalho como desenvolvedor.',
    cover: 'https://m.media-amazon.com/images/I/61hewOW+8zL._AC_UY218_.jpg',
    status: 'QUERO_LER',
  },
  {
    id: '16',
    title: 'Arquitetura Limpa: O Guia do Artesão para Estrutura e Design de Software',
    author: 'Robert C. Martin (Uncle Bob)',
    genre: 'Arquitetura de Software',
    year: 2017,
    pages: 432,
    rating: 5,
    synopsis:
      'Ensina os princípios universais de arquitetura de software que ajudam a construir sistemas robustos e flexíveis.',
    cover: 'https://m.media-amazon.com/images/I/815d9tE7jSL._AC_UY218_.jpg',
    status: 'QUERO_LER',
  },
  {
    id: '17',
    title: 'Padrões de Projeto: Soluções Reutilizáveis de Software Orientado a Objetos',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides (Gang of Four)',
    genre: 'Padrões de Projeto',
    year: 1994,
    pages: 416,
    rating: 5,
    synopsis:
      'O livro clássico que introduziu o conceito de "Design Patterns", apresentando 23 padrões testados e aprovados.',
    cover: 'https://m.media-amazon.com/images/I/9169z5-CtML._AC_UY218_.jpg',
    status: 'QUERO_LER',
  },
  {
    id: '18',
    title: 'Entendendo Algoritmos: Um Guia Ilustrado Para Programadores e Outros Curiosos',
    author: 'Aditya Y. Bhargava',
    genre: 'Algoritmos e Estrutura de Dados',
    year: 2016,
    pages: 264,
    rating: 5,
    synopsis:
      'Uma abordagem visual e amigável para aprender algoritmos, ideal para quem quer construir uma base sólida.',
    cover: 'https://m.media-amazon.com/images/I/91z0+pX2AkL._AC_UY218_.jpg',
    status: 'QUERO_LER',
  },
];

const prisma = new PrismaClient();

async function migrateBooks() {
  try {
    console.log('📚 Iniciando migração de livros...');
    
    for (const book of initialBooks) {
      console.log(`📖 Migrando: ${book.title}`);
      
      await prisma.book.create({
        data: {
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          year: book.year,
          pages: book.pages,
          rating: book.rating,
          synopsis: book.synopsis,
          cover: book.cover || '',
          status: book.status, // Já tem status no seu data.ts!
          currentPage: 0,      // Novo campo
          isbn: '',           // Novo campo (opcional)
          notes: '',          // Novo campo (opcional)
        }
      });
    }
    
    console.log(`✅ Migração concluída! ${initialBooks.length} livros adicionados.`);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateBooks();