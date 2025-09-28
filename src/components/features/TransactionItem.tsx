import React from 'react';
import { Lancamento } from '@/types';
import { 
  FaTrash, 
  FaShoppingBasket, 
  FaGift, 
  FaHome, 
  FaMoneyBillWave, 
  FaArrowDown,
  FaArrowUp,
  FaBriefcaseMedical,
  FaUniversity
} from 'react-icons/fa';
import { formatBRL } from '@/utils/currency';
import { formatShortDate } from '@/utils/date';


interface TransactionItemProps {
  transaction: Lancamento;
  onDelete: () => void;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  'compras': <FaShoppingBasket className="text-white" />,
  'aluguel': <FaHome className="text-white" />,
  'besteiras': <FaGift className="text-white" />,
  'remedios': <FaBriefcaseMedical className="text-white" />,
  'faculdade': <FaUniversity className="text-white" />,
  'outros': <FaMoneyBillWave className="text-white" />,
  'salario': <FaMoneyBillWave className="text-white" />,
};

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { descricao, valor, data, tipo, categorias } = transaction;

  const categoryName = categorias ? categorias.nome.toLowerCase() : 'outros';
  const icon = categoryIcons[categoryName] || <FaMoneyBillWave className="text-white" />;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <div style={{background: 'linear-gradient(102deg, #0F0F0F 0%, #2D2D2D 100%)'}} className="p-3 rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <p className="font-bold text-gray-700">{descricao}</p>
          <p className="text-sm text-gray-500">{formatShortDate(data)}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className={`flex items-center font-bold mr-4 ${tipo === 'income' ? 'text-green' : 'text-red font-bold'}`}>
          <span>{formatBRL(valor)}</span>
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
