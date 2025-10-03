import { Lancamento } from '@/components/features/TransactionList/TransactionListProps';

export interface TransactionItemProps {
  transaction: Lancamento;
  onDelete: () => void;
}
