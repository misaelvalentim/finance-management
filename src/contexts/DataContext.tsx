
"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useOrcamentos } from '@/hooks/useOrcamentos';
import { useCategories } from '@/hooks/useCategories';
import { User } from '@supabase/supabase-js';
import { Lancamento, Orcamento, Categoria, Profile } from '@/types';

// Define the shape of the context data
interface DataContextType {
  // Auth
  user: User | null;
  profile: Profile | null;
  authLoading: boolean;
  signOut: () => Promise<void>;
  getFamilyMemberIds: () => Promise<string[]>;

  // Transactions
  transactions: Lancamento[];
  transactionsLoading: boolean;
  deleteTransaction: (id: number) => Promise<void>;
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
  const [currentDate, setCurrentDate] = useState(new Date());

  const { user, profile, loading: authLoading, signOut, getFamilyMemberIds } = useAuth();
  const { transactions, loading: transactionsLoading, deleteTransaction, revalidate: revalidateTransactions } = useTransactions(currentDate);
  const { orcamentos, loading: orcamentosLoading, addOrcamento, deleteOrcamento, revalidate: revalidateOrcamentos } = useOrcamentos();
  const { categories, loading: categoriesLoading, revalidate: revalidateCategories } = useCategories();

  const value = {
    user,
    profile,
    authLoading,
    signOut,
    getFamilyMemberIds,
    transactions,
    transactionsLoading,
    deleteTransaction,
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
