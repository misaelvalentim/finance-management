"use client";

import { FaCog } from 'react-icons/fa';
import { useBalance } from '@/hooks/useBalance';
import { useEffect, useState } from 'react';
import { getMonthYear } from '@/utils/date';
import { formatBRL } from '@/utils/currency';
import { useData } from '@/contexts/DataContext';


interface BalanceProps {
  onOpenOrcamento: () => void;
}

const Balance = ({ onOpenOrcamento }: BalanceProps) => {
  const { 
    currentDate,
    transactions, 
    orcamentos,
    transactionsLoading, 
    orcamentosLoading 
  } = useData();

  const { available, progress, used, limit } = useBalance({ currentDate, transactions, orcamentos });
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loading = transactionsLoading || orcamentosLoading;

  useEffect(() => {
    if (!loading) {
      setHasLoadedOnce(true);
    }
  }, [loading]);


  if (loading && !hasLoadedOnce) {
    // Render a skeleton loader that mimics the component's structure
    return (
      <div className="bg-gray-700 text-white p-6 rounded-2xl shadow-lg animate-pulse mb-4 xl:mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          <div className="h-6 bg-gray-600 rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-gray-600 rounded w-1/2 mb-4"></div>
        <div className="w-full bg-gray-600 rounded-full h-2.5 mb-4"></div>
        <div className="flex justify-between items-center text-sm">
          <div className="w-1/3">
            <div className="h-4 bg-gray-600 rounded w-1/2 mb-1"></div>
            <div className="h-5 bg-gray-600 rounded w-3/4"></div>
          </div>
          <div className="w-1/3 text-right">
            <div className="h-4 bg-gray-600 rounded w-1/2 ml-auto mb-1"></div>
            <div className="h-5 bg-gray-600 rounded w-3/4 ml-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const hasBudget = limit > 0;
  const { month, year } = getMonthYear(currentDate);

  return (
    <div style={{background: 'linear-gradient(102deg, #0F0F0F 0%, #2D2D2D 100%)'}} className="text-white p-6 rounded-2xl shadow-lg mb-4 xl:mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-white uppercase">{month} / {year}</span>
        {hasBudget && (
          <button onClick={onOpenOrcamento}>
            <FaCog className="text-white" />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-300">Orçamento disponível</p>
      
      {hasBudget ? (
        <h2 className={`text-4xl font-bold mb-4 ${available < 0 ? 'text-red' : ''}`}>
          {formatBRL(available)}
        </h2>
      ) : (
        <div className="text-center my-4">
          <button onClick={onOpenOrcamento} className="bg-magenta text-white font-bold py-2 px-4 rounded-lg">
            Definir orçamento
          </button>
        </div>
      )}
      
      {hasBudget && (
        <div className="w-full bg-gray-600 rounded-full h-1.5 mb-4">
          <div className="bg-magenta h-1.5 rounded-full max-w-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="text-gray-300">Usado</span>
          <p className="font-bold">{formatBRL(used)}</p>
        </div>
        <div className="text-right">
          <span className="text-gray-300">Limite</span>
          <p className="font-bold">{hasBudget ? formatBRL(limit) : '∞'}</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;