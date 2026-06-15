import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientApi } from '../../api/clientApi';
import { creditAnalysisApi } from '../../api/creditAnalysisApi';
import type { ClientResponse, CreditAnalysisResponse } from '../../types';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import ErrorMessage from '../../components/ErrorMessage';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [analyses, setAnalyses] = useState<CreditAnalysisResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([clientApi.getById(id), creditAnalysisApi.listByClientId(id)])
      .then(([c, a]) => { setClient(c); setAnalyses(a); })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500 text-sm">Carregando...</p>;
  if (error) return <ErrorMessage error={error} />;
  if (!client) return null;

  const formatCpf = (cpf: string) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  return (
    <div>
      <PageHeader
        title={client.name}
        backTo={{ label: 'Clientes', to: '/clients' }}
        action={{ label: '+ Solicitar Análise', to: `/analysis/new?clientId=${id}` }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3">Dados do Cliente</h2>
          <dl className="space-y-2 text-sm">
            <Row label="ID" value={client.id} mono />
            <Row label="CPF" value={formatCpf(client.cpf)} />
            {client.birthdate && <Row label="Nascimento" value={new Date(client.birthdate).toLocaleDateString('pt-BR')} />}
            <Row label="Cadastrado" value={new Date(client.createdAt).toLocaleString('pt-BR')} />
          </dl>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3">Endereço</h2>
          <dl className="space-y-2 text-sm">
            <Row label="CEP" value={client.address.cep} />
            <Row label="Rua" value={client.address.street} />
            <Row label="Número" value={String(client.address.houseNumber)} />
            {client.address.complement && <Row label="Complemento" value={client.address.complement} />}
            <Row label="Bairro" value={client.address.neighborhood} />
            <Row label="Estado" value={client.address.state} />
          </dl>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Análises de Crédito</h2>
        <Link
          to={`/analysis/new?clientId=${id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          + Nova análise
        </Link>
      </div>

      {analyses.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma análise encontrada para este cliente.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Limite Aprovado</th>
                <th className="px-4 py-3 text-left">Solicitado</th>
                <th className="px-4 py-3 text-left">Juros a.a.</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analyses.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3"><StatusBadge value={a.approved} /></td>
                  <td className="px-4 py-3 font-medium">
                    {a.approved ? `R$ ${Number(a.approvedLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {/* requestedAmount is not in the response, show approvedLimit */}
                    {a.approved ? 'Aprovado' : 'Reprovado'}
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
                        to={`/card-holders/new?clientId=${id}&creditAnalysisId=${a.id}`}
                        className="text-xs text-indigo-600 hover:underline font-medium"
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

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className={`text-gray-800 text-right ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  );
}
