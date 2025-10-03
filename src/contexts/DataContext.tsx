"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useOrcamentos } from '@/hooks/useOrcamentos';
import { useCategories } from '@/hooks/useCategories';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { Lancamento } from '@/components/features/TransactionList/TransactionListProps';
import { Orcamento } from '@/components/features/OrcamentoModal/OrcamentoModalProps';
import { Categoria } from '@/components/features/TransactionForm/TransactionFormProps';
import { Profile, HeaderProps } from '@/components/shared/Header/HeaderProps';
import { getToday } from '@/utils/date';

// Define the shape of the context data
interface DataContextType extends Omit<HeaderProps, 'profile'> {
  // Auth
  supabase: SupabaseClient;
  user: User | null;
  profile: Profile | null;
  authLoading: boolean;
  familyMemberIds: string[];

  // Transactions
  transactions: Lancamento[];
  transactionsLoading: boolean;
  deleteTransaction: (id: number) => Promise<void>;
  addTransaction: (transaction: Omit<Lancamento, 'id' | 'created_at' | 'categorias' | 'profiles'>) => Promise<void>;
  revalidateTransactions: () => void;

  // Orcamentos
  orcamentos: Orcamento[];
  orcamentosLoading: boolean;
  addOrcamento: (mes: string, limite: number) => Promise<void>;
  deleteOrcamento: (id: number) => Promise<void>;
  revalidateOrcamentos: () => void;

  // Categories
  categories: Categoria[];
  categoriesLoading: boolean;
  revalidateCategories: () => void;
  
  // Global state
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create the provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState(getToday());

  const { supabase, user, profile, loading: authLoading, signOut, uploadAvatar, familyMemberIds } = useAuth();
  
  const { transactions, loading: transactionsLoading, deleteTransaction, addTransaction, revalidate: revalidateTransactions } = useTransactions({
    currentDate,
    user,
    supabase,
    familyMemberIds,
    authLoading,
  });

  const { orcamentos, loading: orcamentosLoading, addOrcamento, deleteOrcamento, revalidate: revalidateOrcamentos } = useOrcamentos({
    user,
    supabase,
    familyMemberIds,
    authLoading,
  });

  const { categories, loading: categoriesLoading, revalidate: revalidateCategories } = useCategories({
    supabase,
    user,
    authLoading,
  });

  const value = {
    supabase,
    user,
    profile,
    authLoading,
    signOut,
    uploadAvatar,
    familyMemberIds,
    transactions,
    transactionsLoading,
    deleteTransaction,
    addTransaction,
    revalidateTransactions,
    orcamentos,
    orcamentosLoading,
    addOrcamento,
    deleteOrcamento,
    revalidateOrcamentos,
    categories,
    categoriesLoading,
    revalidateCategories,
    currentDate,
    setCurrentDate,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};