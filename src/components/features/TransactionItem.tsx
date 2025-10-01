import React from 'react';
import { Lancamento } from '@/types';
import { 
  FaTrash, 
  FaShoppingBasket, 
  FaHome, 
  FaMoneyBillWave, 
  FaArrowDown,
  FaArrowUp,
  FaBriefcaseMedical,
  FaUniversity,
  FaUtensils,
  FaEllipsisH
} from 'react-icons/fa';
import { formatBRL } from '@/utils/currency';

interface TransactionItemProps {
  transaction: Lancamento;
  onDelete: () => void;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  'mercado': <FaShoppingBasket className="text-gray-700" />,
  'moradia': <FaHome className="text-gray-700" />,
  'restaurante': <FaUtensils className="text-gray-700" />,
  'saude': <FaBriefcaseMedical className="text-gray-700" />,
  'faculdade': <FaUniversity className="text-gray-700" />, 
  'salario': <FaMoneyBillWave className="text-gray-700" />, 
  'outro': <FaEllipsisH className="text-gray-700" />,
};

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { descricao, valor, tipo, categorias, profiles } = transaction;

  const categoryName = categorias ? categorias.nome.toLowerCase() : 'outro';
  const icon = categoryIcons[categoryName] || <FaEllipsisH className="text-gray-700" />;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between gap-2">
      <div className="flex items-center">
        <div className="p-3 rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400">Autor - {profiles?.nome_completo}</p>
          <p className="font-bold text-gray-700">{descricao}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className={`flex items-center font-bold mr-4 ${tipo === 'income' ? 'text-green' : 'text-red font-bold'}`}>
          <span className='w-max'>{formatBRL(valor)}</span>
          {tipo === 'income' ? <FaArrowUp className="ml-1" /> : <FaArrowDown className="ml-1" />}
        </div>
        <button onClick={onDelete} className="text-gray-400 hover:text-red font-bold">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
