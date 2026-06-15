import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { cardHolderApi } from '../../api/cardHolderApi';
import PageHeader from '../../components/PageHeader';
import ErrorMessage from '../../components/ErrorMessage';

const schema = z.object({
  clientId: z.string().uuid('UUID inválido'),
  creditAnalysisId: z.string().uuid('UUID inválido'),
  account: z.string().regex(/^\d{8}-\d$/, 'Formato: 00000000-0'),
  agency: z.string().regex(/^\d{4}$/, 'Agência: 4 dígitos'),
  bankCode: z.string().regex(/^\d{3}$/, 'Código do banco: 3 dígitos'),
});

type FormData = z.infer<typeof schema>;

export default function NewCardHolderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitError, setSubmitError] = useState<unknown>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      clientId: searchParams.get('clientId') ?? '',
      creditAnalysisId: searchParams.get('creditAnalysisId') ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const holder = await cardHolderApi.create({
        clientId: data.clientId,
        creditAnalysisId: data.creditAnalysisId,
        bankAccount: {
          account: data.account,
          agency: data.agency,
          bankCode: data.bankCode,
        },
      });
      toast.success('Card Holder criado com sucesso!');
      navigate(`/card-holders/${holder.id}`);
    } catch (err) {
      setSubmitError(err);
    }
  };

  return (
    <div className="max-w-xl">
      <PageHeader title="Novo Card Holder" backTo={{ label: 'Card Holders', to: '/card-holders' }} />

      {!!submitError && <div className="mb-4"><ErrorMessage error={submitError} /></div>}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <Field label="ID do Cliente (UUID)" error={errors.clientId?.message}>
          <input {...register('clientId')} className={input} placeholder="550e8400-..." />
        </Field>

        <Field label="ID da Análise de Crédito (UUID)" error={errors.creditAnalysisId?.message}>
          <input {...register('creditAnalysisId')} className={input} placeholder="550e8400-..." />
        </Field>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Conta Bancária</p>
          <div className="space-y-3">
            <Field label="Número da conta (XXXXXXXX-X)" error={errors.account?.message}>
              <input {...register('account')} className={input} placeholder="12345678-9" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Agência (4 dígitos)" error={errors.agency?.message}>
                <input {...register('agency')} className={input} placeholder="0001" maxLength={4} />
              </Field>
              <Field label="Cód. Banco (3 dígitos)" error={errors.bankCode?.message}>
                <input {...register('bankCode')} className={input} placeholder="341" maxLength={3} />
              </Field>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Criando...' : 'Criar Card Holder'}
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
