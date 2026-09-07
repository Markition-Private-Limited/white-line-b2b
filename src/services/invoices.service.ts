import apiClient from '@/lib/axios';

export interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  description?: string;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  status: string;
  paid_at?: string;
  b2b_client?: { company_name: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const invoicesService = {
  async list(page = 1): Promise<PaginatedResponse<Invoice>> {
    const { data } = await apiClient.get('/b2b/invoices', { params: { page } });
    return data.data ?? data;
  },

  async get(id: string): Promise<Invoice> {
    const { data } = await apiClient.get(`/b2b/invoices/${id}`);
    return data.data ?? data;
  },

  async pay(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.post(`/b2b/invoices/${id}/pay`);
    return data.data ?? data;
  },
};

export default invoicesService;
