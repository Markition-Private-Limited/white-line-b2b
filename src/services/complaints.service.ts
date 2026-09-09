import apiClient from '@/lib/axios';

export interface Complaint {
  id: string;
  complaint_number: string;
  subject: string;
  description: string;
  status: string;
  priority?: string;
  created_at: string;
  booking_id?: string;
  booking_ref?: string;
  booking_reference?: string;
  contract_number?: string;
  contract_id?: string;
  contract_ref?: string;
  booking?: { id?: string; booking_number?: string; reference_number?: string };
  contract?: { id?: string; contract_number?: string; reference_number?: string };
  b2b_contract?: { id?: string; contract_number?: string };
  service_request?: { id?: string; request_number?: string };
  service_request_id?: string;
  submitted_by?: string;
  created_by?: { full_name?: string; name?: string };
  spoc_user?: { full_name?: string; name?: string };
  user?: { full_name?: string; name?: string };
  phone?: string;
  contact_number?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ComplaintListParams {
  page?: number;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

const complaintsService = {
  async list(params: ComplaintListParams | number = 1): Promise<PaginatedResponse<Complaint>> {
    const queryParams = typeof params === 'number' ? { page: params } : params;
    const { data } = await apiClient.get('/b2b/complaints', { params: queryParams });
    return data.data ?? data;
  },

  async create(payload: {
    subject: string;
    description: string;
    booking_id?: string;
    contract_number?: string;
    booking_ref?: string;
  }): Promise<Complaint> {
    const { data } = await apiClient.post('/b2b/complaints', payload);
    return data.data ?? data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/b2b/complaints/${id}`);
    return data.data ?? data;
  },
};

export default complaintsService;
