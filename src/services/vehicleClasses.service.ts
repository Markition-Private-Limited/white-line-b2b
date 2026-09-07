import apiClient from '@/lib/axios';

export interface VehicleClass {
  id: string;
  name: string;
  description?: string;
}

const vehicleClassesService = {
  async list(): Promise<VehicleClass[]> {
    const { data } = await apiClient.get('/b2b/vehicle-classes');
    return data.data ?? data;
  },
};

export default vehicleClassesService;
