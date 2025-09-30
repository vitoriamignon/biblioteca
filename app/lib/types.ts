export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  rating: number; // 1-5 estrelas
  synopsis: string;
  cover: string; // URL da capa
  status: 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';
  createdAt?: Date;
  updatedAt?: Date;
};