import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { cardHolderApi } from '../../api/cardHolderApi';
import type { CardHolderResponse, CreditCardResponse } from '../../types';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import ErrorMessage from '../../components/ErrorMessage';

export default function CardHolderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [holder, setHolder] = useState<CardHolderResponse | null>(null);
  const [cards, setCards] = useState<CreditCardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const loadCards = () =>
    cardHolderApi.listCards(id!).then(setCards).catch(() => setCards([]));

  useEffect(() => {
    if (!id) return;
    Promise.all([cardHolderApi.getById(id), cardHolderApi.listCards(id)])
      .then(([h, c]) => { setHolder(h); setCards(c); })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  const totalUsed = cards.reduce((acc, c) => acc + Number(c.limit), 0);
  const available = holder ? Number(holder.creditLimit) - totalUsed : 0;

  if (loading) return <p className="text-gray-500 text-sm">Carregando...</p>;
  if (error) return <ErrorMessage error={error} />;
  if (!holder) return null;

  return (
    <div>
      <PageHeader title="Card Holder" backTo={{ label: 'Card Holders', to: '/card-holders' }} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <InfoCard label="Status" value={<StatusBadge value={holder.status} />} />
        <InfoCard
          label="Limite Total"
          value={`R$ ${Number(holder.creditLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        />
        <InfoCard
          label="Limite Disponível"
          value={`R$ ${available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          highlight={available <= 0}
        />
      </div>

      <div className="mb-3 text-xs font-mono text-gray-400">ID: {holder.id}</div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Cartões de Crédito</h2>
      </div>

      {holder.status === 'ACTIVE' && (
        <IssueCardForm
          holderId={holder.id}
          available={available}
          onSuccess={() => { loadCards(); toast.success('Cartão emitido!'); }}
        />
      )}

      {cards.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">Nenhum cartão emitido ainda.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {cards.map((card) => (
            <div key={card.cardId} className="bg-white rounded-xl shadow p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-lg tracking-widest text-gray-700">{card.cardNumber}</p>
                  <div className="flex gap-6 mt-2 text-sm text-gray-500">
                    <span>CVV: <strong className="text-gray-700">{card.cvv}</strong></span>
                    <span>Vence: <strong className="text-gray-700">{new Date(card.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</strong></span>
                    <span>
                      Limite:{' '}
                      <strong className="text-gray-700">
                        R$ {Number(card.limit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </strong>
                    </span>
                  </div>
                </div>
                {holder.status === 'ACTIVE' && (
                  <button
                    onClick={() => setEditingCardId(editingCardId === card.cardId ? null : card.cardId)}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    {editingCardId === card.cardId ? 'Cancelar' : 'Alterar limite'}
                  </button>
                )}
              </div>

              {editingCardId === card.cardId && (
                <UpdateLimitForm
                  holderId={holder.id}
                  cardId={card.cardId}
                  available={available + Number(card.limit)}
                  onSuccess={() => {
                    setEditingCardId(null);
                    loadCards();
                    toast.success('Limite atualizado!');
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-xl shadow p-4 ${highlight ? 'bg-red-50' : 'bg-white'}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-lg font-semibold text-gray-800">{value}</div>
    </div>
  );
}

const cardSchema = z.object({
  limit: z.coerce.number().positive('Valor deve ser positivo'),
});
type CardForm = z.infer<typeof cardSchema>;

function IssueCardForm({ holderId, available, onSuccess }: { holderId: string; available: number; onSuccess: () => void }) {
  const [err, setErr] = useState<unknown>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CardForm>({ resolver: zodResolver(cardSchema) as Resolver<CardForm> });

  const onSubmit = async (data: CardForm) => {
    setErr(null);
    try {
      await cardHolderApi.createCard(holderId, { cardHolderId: holderId, limit: data.limit });
      reset();
      onSuccess();
    } catch (e) { setErr(e); }
  };

  return (
    <div className="bg-indigo-50 rounded-xl p-4 mb-2">
      <p className="text-sm font-medium text-indigo-800 mb-3">
        Emitir novo cartão — disponível: R$ {available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
      {!!err && <div className="mb-3"><ErrorMessage error={err} /></div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs text-indigo-700 font-medium mb-1">Limite do cartão (R$)</label>
          <input
            {...register('limit')}
            type="number"
            step="0.01"
            className="w-full border border-indigo-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="1000.00"
          />
          {errors.limit && <p className="text-red-500 text-xs mt-1">{errors.limit.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Emitindo...' : 'Emitir'}
        </button>
      </form>
    </div>
  );
}

function UpdateLimitForm({ holderId, cardId, available, onSuccess }: {
  holderId: string; cardId: string; available: number; onSuccess: () => void;
}) {
  const [err, setErr] = useState<unknown>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CardForm>({ resolver: zodResolver(cardSchema) as Resolver<CardForm> });

  const onSubmit = async (data: CardForm) => {
    setErr(null);
    try {
      await cardHolderApi.updateCardLimit(holderId, cardId, { limit: data.limit });
      onSuccess();
    } catch (e) { setErr(e); }
  };

  return (
    <div className="mt-4 border-t pt-4">
      {!!err && <div className="mb-3"><ErrorMessage error={err} /></div>}
      <p className="text-xs text-gray-500 mb-2">
        Disponível para redistribuir: R$ {available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 font-medium mb-1">Novo limite (R$)</label>
          <input
            {...register('limit')}
            type="number"
            step="0.01"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="1500.00"
          />
          {errors.limit && <p className="text-red-500 text-xs mt-1">{errors.limit.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}
