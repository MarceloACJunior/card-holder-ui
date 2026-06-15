import axios from 'axios';
import type { CreditAnalysisResponse, CreditAnalysisRequest } from '../types';

const http = axios.create({ baseURL: import.meta.env.VITE_CREDIT_ANALYSIS_API_URL });

export const creditAnalysisApi = {
  list: () =>
    http.get<CreditAnalysisResponse[]>('/credit/analysis').then((r) => r.data),

  getById: (id: string) =>
    http.get<CreditAnalysisResponse>(`/credit/analysis/${id}`).then((r) => r.data),

  listByClientId: (clientId: string) =>
    http
      .get<CreditAnalysisResponse[]>(`/credit/analysis/findBy-clientId/${clientId}`)
      .then((r) => r.data),

  listByCpf: (cpf: string) =>
    http
      .get<CreditAnalysisResponse[]>('/credit/analysis/findBy-clientCPF', { params: { cpf } })
      .then((r) => r.data),

  create: (body: CreditAnalysisRequest) =>
    http.post<CreditAnalysisResponse>('/credit/analysis', body).then((r) => r.data),
};
