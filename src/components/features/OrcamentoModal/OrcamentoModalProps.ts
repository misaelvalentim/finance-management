export interface Orcamento {
  id: number;
  mes: string;
  limite: number;
}

export interface OrcamentoModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentDate: Date;
  orcamentos: Orcamento[];
  orcamentosLoading: boolean;
  addOrcamento: (mes: string, limite: number) => Promise<void>;
  deleteOrcamento: (id: number) => Promise<void>;
}

export interface OrcamentoFormProps {
    onAdd: (mes: string, limite: number) => Promise<void>;
    currentDate: Date;
}

export interface OrcamentoListProps {
    orcamentos: Orcamento[];
    loading: boolean;
    onDelete: (id: number) => Promise<void>;
}
