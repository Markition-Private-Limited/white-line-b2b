import apiClient from '@/lib/axios';

export interface Contract {
  id: string;
  contract_number: string;
  primary_email: string;
  main_contact_phone: string;
  contract_start_date: string;
  contract_end_date: string;
  contract_amount: number;
  pricing_terms: Record<string, unknown>;
  vehicle_types_allowed: unknown[];
  contract_doc_url?: string;
  status: string;
  b2b_client?: { company_name: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const contractsService = {
  async list(page = 1): Promise<PaginatedResponse<Contract>> {
    const { data } = await apiClient.get('/b2b/contracts', { params: { page } });
    return data.data ?? data;
  },

  async get(id: string): Promise<Contract> {
    const { data } = await apiClient.get(`/b2b/contracts/${id}`);
    return data.data ?? data;
  },
};

export default contractsService;
