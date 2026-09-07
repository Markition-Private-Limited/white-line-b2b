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

const contractsService = {
  async getActive(): Promise<Contract | null> {
    const { data } = await apiClient.get('/b2b/contract');
    return data.data ?? data;
  },
};

export default contractsService;
