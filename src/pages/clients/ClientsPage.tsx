import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientApi } from '../../api/clientApi';
import type { ClientResponse } from '../../types';
import PageHeader from '../../components/PageHeader';
import ErrorMessage from '../../components/ErrorMessage';

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [cpfFilter, setCpfFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = (cpf?: string) => {
    setLoading(true);
    setError(null);
    clientApi
      .list(cpf || undefined)
      .then(setClients)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(cpfFilter.replace(/\D/g, '') || undefined);
  };

  const formatCpf = (cpf: string) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  return (
    <div>
      <PageHeader title="Clientes" action={{ label: '+ Novo Cliente', to: '/clients/new' }} />

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar por CPF..."
          value={cpfFilter}
          onChange={(e) => setCpfFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
        >
          Buscar
        </button>
        {cpfFilter && (
          <button
            type="button"
            onClick={() => { setCpfFilter(''); load(); }}
            className="text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            Limpar
          </button>
        )}
      </form>

      {!!error && <ErrorMessage error={error} />}

      {loading ? (
        <p className="text-gray-500 text-sm">Carregando...</p>
      ) : clients.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum cliente encontrado.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">CPF</th>
                <th className="px-4 py-3 text-left">Endereço</th>
                <th className="px-4 py-3 text-left">Cadastrado em</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCpf(c.cpf)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.address.neighborhood && `${c.address.neighborhood}, `}{c.address.state}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/clients/${c.id}`}
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
