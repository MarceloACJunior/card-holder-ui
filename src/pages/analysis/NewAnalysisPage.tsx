import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { creditAnalysisApi } from '../../api/creditAnalysisApi';
import type { CreditAnalysisResponse } from '../../types';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import ErrorMessage from '../../components/ErrorMessage';

const schema = z.object({
  clientId: z.string().uuid('UUID inválido'),
  monthlyIncome: z.coerce.number().positive('Valor deve ser positivo'),
  requestedAmount: z.coerce.number().positive('Valor deve ser positivo'),
});

type FormData = z.infer<typeof schema>;

export default function NewAnalysisPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [result, setResult] = useState<CreditAnalysisResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { clientId: searchParams.get('clientId') ?? '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const res = await creditAnalysisApi.create(data);
      setResult(res);
      toast.success('Análise concluída!');
    } catch (err) {
      setSubmitError(err);
    }
  };

  if (result) {
    return (
      <div className="max-w-md">
        <PageHeader title="Resultado da Análise" backTo={{ label: 'Análises', to: '/analysis' }} />
        <div className={`rounded-xl shadow p-6 ${result.approved ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge value={result.approved} />
            <span className="text-lg font-semibold text-gray-800">
              {result.approved ? 'Crédito Aprovado!' : 'Crédito Reprovado'}
            </span>
          </div>
          {result.approved && (
            <dl className="space-y-2 text-sm mb-5">
              <Row label="Limite aprovado" value={`R$ ${Number(result.approvedLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Row label="Limite de saque" value={`R$ ${Number(result.withdraw).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Row label="Juros anuais" value={`${(Number(result.annualInterest) * 100).toFixed(0)}%`} />
            </dl>
          )}
          <div className="flex gap-3 flex-wrap">
            {result.approved && (
              <Link
                to={`/card-holders/new?clientId=${result.clientId}&creditAnalysisId=${result.id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Criar Card Holder
              </Link>
            )}
            <button
              onClick={() => navigate('/analysis')}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Ver todas as análises
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <PageHeader title="Nova Análise de Crédito" backTo={{ label: 'Análises', to: '/analysis' }} />

      {!!submitError && <div className="mb-4"><ErrorMessage error={submitError} /></div>}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <Field label="ID do Cliente (UUID)" error={errors.clientId?.message}>
          <input
            {...register('clientId')}
            className={input}
            placeholder="550e8400-e29b-41d4-a716-446655440000"
          />
        </Field>

        <Field label="Renda mensal (R$)" error={errors.monthlyIncome?.message}>
          <input
            {...register('monthlyIncome')}
            type="number"
            step="0.01"
            className={input}
            placeholder="5000.00"
          />
        </Field>

        <Field label="Valor solicitado (R$)" error={errors.requestedAmount?.message}>
          <input
            {...register('requestedAmount')}
            type="number"
            step="0.01"
            className={input}
            placeholder="3000.00"
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Analisando...' : 'Solicitar Análise'}
        </button>
      </form>
    </div>
  );
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-600">{label}</dt>
      <dd className="font-semibold text-gray-800">{value}</dd>
    </div>
  );
}
