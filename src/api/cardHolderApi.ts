import axios from 'axios';
import type {
  CardHolderResponse,
  CardHolderRequest,
  CreditCardResponse,
  CreditCardRequest,
  LimitUpdateRequest,
  LimitUpdateResponse,
} from '../types';

const http = axios.create({ baseURL: import.meta.env.VITE_CARD_HOLDER_API_URL });

export const cardHolderApi = {
  list: (status?: 'ACTIVE' | 'INACTIVE') =>
    http
      .get<CardHolderResponse[]>('/v1.0/card-holders', { params: status ? { status } : {} })
      .then((r) => r.data),

  getById: (id: string) =>
    http.get<CardHolderResponse>(`/v1.0/card-holders/${id}`).then((r) => r.data),

  create: (body: CardHolderRequest) =>
    http.post<CardHolderResponse>('/v1.0/card-holders', body).then((r) => r.data),

  listCards: (cardHolderId: string) =>
    http
      .get<CreditCardResponse[]>(`/v1.0/card-holders/${cardHolderId}/cards`)
      .then((r) => r.data),

  createCard: (cardHolderId: string, body: CreditCardRequest) =>
    http
      .post<CreditCardResponse>(`/v1.0/card-holders/${cardHolderId}/cards`, body)
      .then((r) => r.data),

  updateCardLimit: (cardHolderId: string, cardId: string, body: LimitUpdateRequest) =>
    http
      .patch<LimitUpdateResponse>(
        `/v1.0/card-holders/${cardHolderId}/cards/${cardId}`,
        body,
      )
      .then((r) => r.data),
};
