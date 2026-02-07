import { useMemo, useEffect } from 'react';
import { Categoria } from '@/components/features/TransactionForm/TransactionFormProps';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { useSupabaseData } from './useSupabaseData';

interface UseCategoriesProps {
  supabase: SupabaseClient;
  user: User | null;
  authLoading: boolean;
}

export function useCategories({ supabase, user, authLoading }: UseCategoriesProps) {
  const query = useMemo(() => {
    if (!user || authLoading) {
      return null;
    }
    return supabase.from('categorias').select('id, nome');
  }, [user, authLoading, supabase]);

  const key = query ? 'categorias' : null;

  const { data: categories, isLoading, revalidate } = useSupabaseData<Categoria>(key, query);

  useEffect(() => {
    if (authLoading || !query) return;

    const channel = supabase
      .channel('public:categorias')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categorias' },
        () => {
          revalidate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authLoading, supabase, query, revalidate]);

  return { categories, loading: isLoading, revalidate };
}