import { Lancamento } from '@/components/features/TransactionList/TransactionListProps';
import { Orcamento } from '@/components/features/OrcamentoModal/OrcamentoModal.types';

export interface BalanceProps {
  currentDate: Date;
  onOpenOrcamento: () => void;
  transactions: Lancamento[];
  orcamentos: Orcamento[];
  loading: boolean;
}
