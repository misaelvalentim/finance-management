"use client";

import { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaRegBookmark } from 'react-icons/fa';
import CurrencyInput from 'react-currency-input-field';
import { getInitialDateForForm } from '@/utils/date';
import { TransactionFormProps } from './TransactionFormProps';

const TransactionForm = ({ onSuccess, onClose, categories, currentDate, addTransaction, user }: TransactionFormProps) => {
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [valor, setValor] = useState<string | undefined>(undefined);
  const [data, setData] = useState(getInitialDateForForm(currentDate));
  const [tipo, setTipo] = useState<'income' | 'expense'>('expense');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage('You must be logged in to add a transaction.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await addTransaction({
        descricao,
        valor: parseFloat(valor || '0'),
        data,
        tipo,
        user_id: user.id,
        categoria_id: parseInt(categoriaId),
      });
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-700">NOVO LANÇAMENTO</h2>
        <button onClick={onClose} className="text-2xl text-gray-400">&times;</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título da transação"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          className="w-full p-4 bg-gray-200 rounded-lg border-none focus:ring-2 focus:ring-magenta"
        />
        <div className="relative">
          <FaRegBookmark className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="w-full p-4 pl-12 bg-gray-200 rounded-lg appearance-none border-none focus:ring-2 focus:ring-magenta"
          >
            <option value="" disabled>Categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-4">
          <CurrencyInput
            id="valor"
            name="valor"
            placeholder="R$ 0,00"
            decimalsLimit={2}
            onValueChange={(value) => setValor(value)}
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            required
            className="w-1/2 p-4 bg-gray-200 rounded-lg border-none focus:ring-2 focus:ring-magenta"
          />
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            className="w-1/2 p-4 bg-gray-200 rounded-lg border-none focus:ring-2 focus:ring-magenta"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setTipo('income')}
            className={`w-1/2 p-4 rounded-lg font-bold flex items-center justify-center border ${tipo === 'income' ? 'bg-green text-white border-green' : 'bg-white text-gray-500 border-gray-300'}`}
          >
            <FaArrowUp className="mr-2" /> Entrada
          </button>
          <button
            type="button"
            onClick={() => setTipo('expense')}
            className={`w-1/2 p-4 rounded-lg font-bold flex items-center justify-center border ${tipo === 'expense' ? 'bg-red text-white border-red' : 'bg-white text-gray-500 border-gray-300'}`}
          >
            <FaArrowDown className="mr-2" /> Saída
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-magenta text-white font-bold rounded-lg"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        {message && <p className="text-red-500 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default TransactionForm;