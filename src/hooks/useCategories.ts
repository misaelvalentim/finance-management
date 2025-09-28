import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Categoria } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const isInitialLoad = useRef(true);

  const fetchCategories = useCallback(async () => {
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
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const revalidate = () => {
    isInitialLoad.current = true;
    fetchCategories();
  };

  return { categories, loading, revalidate };
}