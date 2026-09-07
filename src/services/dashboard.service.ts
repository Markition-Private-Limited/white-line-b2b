import apiClient from '@/lib/axios';

export interface DashboardData {
  active_requests: number;
  pending_requests: number;
  open_complaints: number;
  resolved_complaints: number;
  due_invoices: number;
  paid_invoices_amount: number;
  unpaid_invoices_amount: number;
  monthly_data?: Array<{ month: string; paid: number; unpaid: number }>;
}

const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await apiClient.get('/b2b/dashboard');
    return data.data ?? data;
  },
};

export default dashboardService;
