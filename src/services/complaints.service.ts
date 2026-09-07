import apiClient from '@/lib/axios';

export interface Complaint {
  id: string;
  complaint_number: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  booking_id?: string;
  submitted_by?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const complaintsService = {
  async list(page = 1): Promise<PaginatedResponse<Complaint>> {
    const { data } = await apiClient.get('/b2b/complaints', { params: { page } });
    return data.data ?? data;
  },

  async create(payload: { subject: string; description: string; booking_id?: string }): Promise<Complaint> {
    const { data } = await apiClient.post('/b2b/complaints', payload);
    return data.data ?? data;
  },
};

export default complaintsService;
