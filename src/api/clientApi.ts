import axios from 'axios';
import type { ClientResponse, ClientRequest } from '../types';

const http = axios.create({ baseURL: import.meta.env.VITE_CLIENT_API_URL });

export const clientApi = {
  list: (cpf?: string) =>
    http.get<ClientResponse[]>('/v1.0/clients', { params: cpf ? { cpf } : {} }).then((r) => r.data),

  getById: (id: string) =>
    http.get<ClientResponse>(`/v1.0/clients/${id}`).then((r) => r.data),

  create: (body: ClientRequest) =>
    http.post<ClientResponse>('/v1.0/clients', body).then((r) => r.data),
};
