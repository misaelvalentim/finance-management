import { Categoria } from '@/components/features/TransactionForm/TransactionFormProps';

export interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'income' | 'expense';
  user_id: string;
  categoria_id: number;
  categorias: Categoria;
  profiles: {
    nome_completo: string;
  };
}

export interface TransactionListProps {
  transactions: Lancamento[];
  onDelete: (id: number) => void;
}
