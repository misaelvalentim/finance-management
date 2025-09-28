"use client";

import { useState, useEffect } from 'react';
import { useOrcamentos } from '@/hooks/useOrcamentos';
import CurrencyInput from 'react-currency-input-field';
import { FaCalendarAlt, FaTrash } from 'react-icons/fa';
import { Orcamento } from '@/types';
import { getFirstDayOfMonth, getMonthYear, toYYYYMMDD } from '@/utils/date';
import { formatBRL } from '@/utils/currency';


// Form Component
const OrcamentoForm = ({ onAdd, currentDate }: { onAdd: (mes: string, limite: number) => Promise<void>, currentDate: Date }) => {
  const getInitialDate = () => {
    const now = new Date();
    const isSameMonth =
      now.getFullYear() === currentDate.getFullYear() &&
      now.getMonth() === currentDate.getMonth();

    if (isSameMonth) {
      return toYYYYMMDD(now);
    } else {
      return getFirstDayOfMonth(currentDate);
    }
  };

  const [mes, setMes] = useState(getInitialDate());
  const [limite, setLimite] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mes || !limite) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onAdd(mes, parseFloat(limite));
      setMes(getInitialDate());
      setLimite(undefined);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Novo Orçamento</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="date"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            required
            className="w-1/2 p-4 bg-gray-200 rounded-lg border-none focus:ring-2 focus:ring-magenta"
          />
          <CurrencyInput
            placeholder="R$ 0,00"
            value={limite}
            onValueChange={(value) => setLimite(value)}
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            required
            className="w-1/2 p-4 bg-gray-200 rounded-lg border-none focus:ring-2 focus:ring-magenta"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full p-4 bg-magenta text-white font-bold rounded-lg">
          {loading ? 'Adicionando...' : 'Adicionar'}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

// List Component
const OrcamentoList = ({ orcamentos, loading, onDelete }: { orcamentos: Orcamento[], loading: boolean, onDelete: (id: number) => Promise<void> }) => {
  if (loading) return <p>Carregando orçamentos...</p>;

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Orçamentos Cadastrados</h3>
      <div className="space-y-2">
        {orcamentos.map((orcamento) => {
          const date = new Date(orcamento.mes + 'T00:00:00');
          const { month, year } = getMonthYear(date);

          return (
            <div key={orcamento.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-100 p-3 rounded-lg mr-4">
                  <FaCalendarAlt className="text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 capitalize">{month} {year}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-gray-700 mr-4">
                  {formatBRL(orcamento.limite)}
                </span>
                <button onClick={() => onDelete(orcamento.id)} className="text-gray-400 hover:text-red">
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Modal Component
const OrcamentoModal = ({ onClose, onSuccess, currentDate }: { onClose: () => void, onSuccess: () => void, currentDate: Date }) => {
  const { orcamentos, loading, addOrcamento, deleteOrcamento } = useOrcamentos();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!loading) {
      setHasLoadedOnce(true);
    }
  }, [loading]);

  const handleAdd = async (mes: string, limite: number) => {
    await addOrcamento(mes, limite);
    onSuccess(); // Trigger refresh on the main page
  };

  const handleDelete = async (id: number) => {
    await deleteOrcamento(id);
    onSuccess(); // Trigger refresh on the main page
  };

  return (
    <div className="p-4 bg-gray-100 h-full overflow-y-auto">
      <div className="flex items-center mb-8">
        <button onClick={onClose} className="text-2xl text-gray-500 mr-4">&larr;</button>
        <div>
          <h2 className="text-lg font-bold text-gray-800">ORÇAMENTOS MENSAIS</h2>
          <p className="text-sm text-gray-500">Organize seus limites de gastos por mês</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <OrcamentoForm onAdd={handleAdd} currentDate={currentDate} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <OrcamentoList orcamentos={orcamentos} loading={loading && !hasLoadedOnce} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default OrcamentoModal;