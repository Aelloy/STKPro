import { DealType } from './desklog';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  purchaseDate: Date;
  purchasePrice: number;
  buyer: string;
  source: {
    location: string;
    subCategory: string;
  };
  stockNumber?: string;
  bluetoothDeviceId?: string;
  status?: 'Available' | `Sold - ${DealType}`;
}

export type VehicleFormData = Omit<Vehicle, 'id'>;

export interface StockNumberEntry {
  id: string;
  stockNumber: string;
  deviceId: string;
  createdAt: Date;
}