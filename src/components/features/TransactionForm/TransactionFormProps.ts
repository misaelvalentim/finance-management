import { Lancamento } from '@/components/features/TransactionList/TransactionListProps';
import { User } from '@supabase/supabase-js';

export interface Categoria {
  id: number;
  nome: string;
}

export interface TransactionFormProps {
  onSuccess: () => void;
  onClose: () => void;
  categories: Categoria[];
  currentDate: Date;
  addTransaction: (transaction: Omit<Lancamento, 'id' | 'created_at' | 'categorias' | 'profiles'>) => Promise<void>;
  user: User | null;
}
