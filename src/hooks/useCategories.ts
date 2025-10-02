import { useState, useEffect, useRef, useCallback } from 'react';
import { Categoria } from '@/types';
import { SupabaseClient, User } from '@supabase/supabase-js';

interface UseCategoriesProps {
  supabase: SupabaseClient;
  user: User | null;
  authLoading: boolean;
}

export function useCategories({ supabase, user, authLoading }: UseCategoriesProps) {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef(true);

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    if (isInitialLoad.current) {
      setLoading(true);
    }

    const { data: categoriesData, error } = await supabase
      .from('categorias')
      .select('id, nome');
    
    if (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } else {
      setCategories(categoriesData);
    }

    if (isInitialLoad.current) {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, [supabase, user]);

  useEffect(() => {
    if (authLoading) return;
    fetchCategories();

    const channel = supabase
      .channel('public:categorias')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categorias' },
        (_payload) => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authLoading, supabase, fetchCategories]);

  const revalidate = () => {
    isInitialLoad.current = true;
    fetchCategories();
  };

  return { categories, loading, revalidate };
}