export interface Profile {
  id: string;
  nome_completo: string;
  avatar_url: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'income' | 'expense';
  user_id: string;
  categoria_id: number;
  categorias: Categoria;
}

export interface Orcamento {
  id: number;
  mes: string;
  limite: number;
}