export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'buyer';
  permissions: {
    editVehicles: boolean;
    deleteVehicles: boolean;
    viewDeals: boolean;
    editDeals: boolean;
    deleteDeals: boolean;
  };
}

export interface Source {
  id: string;
  location: string;
  subCategories: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}