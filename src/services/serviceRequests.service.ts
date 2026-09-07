import apiClient from '@/lib/axios';

export interface ServiceRequest {
  id: string;
  request_number: string;
  start_date: string;
  end_date: string;
  num_drivers_required: number;
  num_vehicles_required: number;
  vehicle_class_id: string;
  vehicle_class?: { id: string; name: string };
  special_instructions?: string;
  status: string;
  request_date: string;
  requested_by?: string;
}

export interface CreateServiceRequestPayload {
  start_date: string;
  end_date: string;
  num_drivers_required: number;
  num_vehicles_required: number;
  vehicle_class_id: string;
  special_instructions?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const serviceRequestsService = {
  async list(page = 1): Promise<PaginatedResponse<ServiceRequest>> {
    const { data } = await apiClient.get('/b2b/service-requests', { params: { page } });
    return data.data ?? data;
  },

  async get(id: string): Promise<ServiceRequest> {
    const { data } = await apiClient.get(`/b2b/service-requests/${id}`);
    return data.data ?? data;
  },

  async create(payload: CreateServiceRequestPayload): Promise<ServiceRequest> {
    const { data } = await apiClient.post('/b2b/service-requests', payload);
    return data.data ?? data;
  },

  async cancel(id: string): Promise<ServiceRequest> {
    const { data } = await apiClient.patch(`/b2b/service-requests/${id}/cancel`);
    return data.data ?? data;
  },
};

export default serviceRequestsService;
