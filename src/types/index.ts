// ─── client-api ───────────────────────────────────────────────
export interface AddressResponse {
  id: string;
  street: string;
  neighborhood: string;
  state: string;
  houseNumber: number;
  complement?: string;
  cep: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientResponse {
  id: string;
  name: string;
  cpf: string;
  birthdate?: string;
  address: AddressResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRequest {
  name: string;
  cpf: string;
  birthdate?: string;
  address: {
    houseNumber: number;
    complement?: string;
    cep: string;
  };
}

// ─── credit-analysis-api ──────────────────────────────────────
export interface CreditAnalysisResponse {
  id: string;
  approved: boolean;
  approvedLimit: number;
  withdraw: number;
  annualInterest: number;
  clientId: string;
  date: string;
}

export interface CreditAnalysisRequest {
  clientId: string;
  monthlyIncome: number;
  requestedAmount: number;
}

// ─── card-holder-api ──────────────────────────────────────────
export interface CardHolderResponse {
  id: string;
  status: 'ACTIVE' | 'INACTIVE';
  creditLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardHolderRequest {
  clientId: string;
  creditAnalysisId: string;
  bankAccount: {
    account: string;
    agency: string;
    bankCode: string;
  };
}

export interface CreditCardResponse {
  cardId: string;
  limit: number;
  cardNumber: string;
  cvv: number;
  dueDate: string;
}

export interface CreditCardRequest {
  cardHolderId: string;
  limit: number;
}

export interface LimitUpdateRequest {
  limit: number;
}

export interface LimitUpdateResponse {
  cardId: string;
  updatedLimit: number;
}
