import apiClient from '@/lib/axios';

export interface Notification {
  id: string;
  notification_type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  booking_id?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  unread: Notification[];
  read: Notification[];
  read_page: number;
  read_limit: number;
  read_total: number;
  has_more_read: boolean;
}

const notificationsService = {
  async list(page = 1): Promise<NotificationsResponse> {
    const { data } = await apiClient.get('/b2b/notifications', { params: { page } });
    return data.data ?? data;
  },

  async markRead(id: string): Promise<{ id: string; is_read: boolean }> {
    const { data } = await apiClient.patch(`/b2b/notifications/${id}/read`);
    return data.data ?? data;
  },

  async markAllRead(): Promise<{ message: string }> {
    const { data } = await apiClient.patch('/b2b/notifications/read-all');
    return data.data ?? data;
  },
};

export default notificationsService;
