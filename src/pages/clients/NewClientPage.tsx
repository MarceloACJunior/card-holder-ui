import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { clientApi } from '../../api/clientApi';
import PageHeader from '../../components/PageHeader';
import ErrorMessage from '../../components/ErrorMessage';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  birthdate: z.string().optional(),
  houseNumber: z.coerce.number().int().positive('Número inválido'),
  complement: z.string().optional(),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP no formato 00000-000'),
});

type FormData = z.infer<typeof schema>;

export default function NewClientPage() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<unknown>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) as Resolver<FormData> });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      await clientApi.create({
        name: data.name,
        cpf: data.cpf.replace(/\D/g, ''),
        birthdate: data.birthdate || undefined,
        address: {
          houseNumber: data.houseNumber,
          complement: data.complement || undefined,
          cep: data.cep,
        },
      });
      toast.success('Cliente criado com sucesso!');
      navigate('/clients');
    } catch (err) {
      setSubmitError(err);
    }
  };

  return (
    <div className="max-w-xl">
      <PageHeader title="Novo Cliente" backTo={{ label: 'Clientes', to: '/clients' }} />

      {!!submitError && <div className="mb-4"><ErrorMessage error={submitError} /></div>}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <Field label="Nome completo" error={errors.name?.message}>
          <input {...register('name')} className={input} placeholder="João Silva" />
        </Field>

        <Field label="CPF" error={errors.cpf?.message}>
          <input {...register('cpf')} className={input} placeholder="000.000.000-00" />
        </Field>

        <Field label="Data de nascimento" error={errors.birthdate?.message}>
          <input {...register('birthdate')} type="date" className={input} />
        </Field>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Endereço</p>
          <div className="space-y-3">
            <Field label="CEP" error={errors.cep?.message}>
              <input {...register('cep')} className={input} placeholder="00000-000" />
            </Field>
            <Field label="Número" error={errors.houseNumber?.message}>
              <input {...register('houseNumber')} type="number" className={input} placeholder="123" />
            </Field>
            <Field label="Complemento" error={errors.complement?.message}>
              <input {...register('complement')} className={input} placeholder="Apto 42 (opcional)" />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Salvando...' : 'Criar Cliente'}
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
