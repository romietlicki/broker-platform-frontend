export interface BrokerResponse {
  id: number;
  uuid: string;
  email: string;
  fullName: string;
  cpf?: string;
  susepCode?: string;
  phone?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt?: string;
  createdAt: string;
  roles: string[];
}
