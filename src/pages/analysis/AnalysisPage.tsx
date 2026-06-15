import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { creditAnalysisApi } from '../../api/creditAnalysisApi';
import type { CreditAnalysisResponse } from '../../types';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import ErrorMessage from '../../components/ErrorMessage';

export default function AnalysisPage() {
  const [analyses, setAnalyses] = useState<CreditAnalysisResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    creditAnalysisApi.list().then(setAnalyses).catch(setError).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Análises de Crédito"
        action={{ label: '+ Nova Análise', to: '/analysis/new' }}
      />

      {!!error && <ErrorMessage error={error} />}

      {loading ? (
        <p className="text-gray-500 text-sm">Carregando...</p>
      ) : analyses.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhuma análise encontrada.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Limite Aprovado</th>
                <th className="px-4 py-3 text-left">Saque</th>
                <th className="px-4 py-3 text-left">Juros a.a.</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analyses.map((a) => (
                <tr key={a.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{a.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">
                    <Link to={`/clients/${a.clientId}`} className="text-indigo-600 hover:underline font-mono text-xs">
                      {a.clientId.slice(0, 8)}…
                    </Link>
                  </td>
                  <td className="px-4 py-3"><StatusBadge value={a.approved} /></td>
                  <td className="px-4 py-3 font-medium">
                    {a.approved
                      ? `R$ ${Number(a.approvedLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.approved
                      ? `R$ ${Number(a.withdraw).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.annualInterest != null ? `${(Number(a.annualInterest) * 100).toFixed(0)}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(a.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.approved && (
                      <Link
                        to={`/card-holders/new?clientId=${a.clientId}&creditAnalysisId=${a.id}`}
                        className="text-xs text-indigo-600 hover:underline font-medium whitespace-nowrap"
                      >
                        Criar Card Holder
                      </Link>
                    )}
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
