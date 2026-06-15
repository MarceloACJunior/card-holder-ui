import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cardHolderApi } from '../../api/cardHolderApi';
import type { CardHolderResponse } from '../../types';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import ErrorMessage from '../../components/ErrorMessage';

type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function CardHoldersPage() {
  const [holders, setHolders] = useState<CardHolderResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = (status: StatusFilter) => {
    setLoading(true);
    setError(null);
    cardHolderApi
      .list(status === 'ALL' ? undefined : status)
      .then(setHolders)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load('ALL'); }, []);

  const handleFilter = (s: StatusFilter) => {
    setStatusFilter(s);
    load(s);
  };

  return (
    <div>
      <PageHeader
        title="Card Holders"
        action={{ label: '+ Novo Card Holder', to: '/card-holders/new' }}
      />

      <div className="flex gap-2 mb-6">
        {(['ALL', 'ACTIVE', 'INACTIVE'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s === 'ALL' ? 'Todos' : s === 'ACTIVE' ? 'Ativos' : 'Inativos'}
          </button>
        ))}
      </div>

      {!!error && <ErrorMessage error={error} />}

      {loading ? (
        <p className="text-gray-500 text-sm">Carregando...</p>
      ) : holders.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum card holder encontrado.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Limite de Crédito</th>
                <th className="px-4 py-3 text-left">Criado em</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {holders.map((h) => (
                <tr key={h.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{h.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3"><StatusBadge value={h.status} /></td>
                  <td className="px-4 py-3 font-medium">
                    R$ {Number(h.creditLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(h.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/card-holders/${h.id}`}
                      className="text-indigo-600 hover:underline text-xs font-medium"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
