import useSWR from 'swr';

const fetcher = async (queryBuilder: any): Promise<any[]> => {
  const { data, error } = await queryBuilder;
  if (error) {
    throw error;
  }
  return data;
};

export function useSupabaseData<T>(
  key: string | null,
  queryBuilder: any | null
) {
  const { data, error, mutate } = useSWR<T[]>(key, queryBuilder ? () => fetcher(queryBuilder) : null);

  return {
    data: data ?? [],
    isLoading: !error && !data,
    isError: error,
    revalidate: mutate,
  };
}