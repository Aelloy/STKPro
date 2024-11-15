export type DealStatus = 'Pending' | 'Delivered' | 'Cancelled' | 'Unwound';
export type DealType = 'Retail' | 'Lease' | 'Fleet' | 'Wholesale';
export type VehicleType = 'New' | 'Used' | 'Demo' | 'Program';

export interface DesklogEntry {
  id: string;
  dealStatus: DealStatus;
  dealType: DealType;
  vehicleType: VehicleType;
  rdr: string;
  dealNumber: string;
  date: Date;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  stockNumber: string;
  salesperson: string;
  salesManager: string;
  fiManager: string;
  frontGross: number;
  backGross: number;
  totalGross: number;
  acv: number;
  allowance: number;
  delta: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}