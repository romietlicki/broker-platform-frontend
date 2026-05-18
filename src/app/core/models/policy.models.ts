export interface PolicyResponse {
  id: number;
  externalProposalId: string;
  insuredName: string;
  insuredCpf?: string;
  status: PolicyStatus;
  startDate: string;
  endDate?: string;
  dueDates: string[];
  coverageDescription?: string;
  insuredCapital?: number;
  premiumTotal?: number;
  paymentPeriodicity?: string;
  insurer: string;
  productName?: string;
  gracePeriodDays?: number;
  cancellationDate?: string;
  lastSyncedAt: string;
}

export type PolicyStatus = 'VIGENTE' | 'PENDENTE' | 'CANCELADA' | 'APROVADA' | 'EXPIRADA';

export interface DelinquencyResponse {
  policyId: number;
  externalProposalId: string;
  insuredName: string;
  insuredCpf?: string;
  premiumTotal?: number;
  overdueDate?: string;
  insuredCapital?: number;
  insurer: string;
  productName?: string;
  status: string;
}

export interface CommissionResponse {
  externalProposalId: string;
  insuredName: string;
  insurer: string;
  productName?: string;
  commissionAmount: number;
  commissionPercentage: number;
  referenceMonth: string;
  status: string;
  paymentDate?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface PolicyFilter {
  status?: string;
  insuredName?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}
