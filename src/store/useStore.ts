import { create } from 'zustand';
import { User, Source, Location } from '../types/user';
import { Vehicle, StockNumberEntry } from '../types/inventory';
import { DesklogEntry } from '../types/desklog';
import { generateStockNumber } from '../utils/stockNumber';
import * as db from '../utils/db';

interface Store {
  users: User[];
  sources: Source[];
  locations: Location[];
  vehicles: Vehicle[];
  stockEntries: StockNumberEntry[];
  desklogEntries: DesklogEntry[];
  currentUser: User | null;
  initialized: boolean;
  initializeStore: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'permissions'>) => Promise<void>;
  updateUser: (id: string, userData: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addSource: (source: Omit<Source, 'id'>) => Promise<void>;
  addLocation: (location: Omit<Location, 'id'>) => Promise<void>;
  updateLocation: (id: string, location: Location) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'stockNumber'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addStockEntry: (entry: Omit<StockNumberEntry, 'id' | 'createdAt'>) => Promise<void>;
  addDesklogEntry: (entry: Omit<DesklogEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDesklogEntry: (id: string, entry: Omit<DesklogEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteDesklogEntry: (id: string) => Promise<void>;
  updateVehicleStatus: (stockNumber: string, status: Vehicle['status']) => Promise<void>;
  setCurrentUser: (user: User) => void;
}

// Default admin user
const defaultAdmin: User = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  permissions: {
    editVehicles: true,
    deleteVehicles: true,
    viewDeals: true,
    editDeals: true,
    deleteDeals: true
  }
};

export const useStore = create<Store>((set, get) => ({
  users: [],
  sources: [],
  locations: [],
  vehicles: [],
  stockEntries: [],
  desklogEntries: [],
  currentUser: null,
  initialized: false,

  initializeStore: async () => {
    if (get().initialized) return;

    const [users, sources, locations, vehicles, stockEntries, desklogEntries] = await Promise.all([
      db.getAllUsers(),
      db.getAllSources(),
      db.getAllLocations(),
      db.getAllVehicles(),
      db.getAllStockEntries(),
      db.getAllDesklogEntries(),
    ]);

    // Add default admin if no users exist
    if (users.length === 0) {
      await db.addUser(defaultAdmin);
      users.push(defaultAdmin);
    }

    set({
      users,
      sources,
      locations,
      vehicles,
      stockEntries,
      desklogEntries,
      initialized: true,
      currentUser: users.find(u => u.id === defaultAdmin.id) || users[0]
    });
  },

  addUser: async (userData) => {
    const user: User = {
      ...userData,
      id: crypto.randomUUID(),
      permissions: {
        editVehicles: userData.role === 'admin',
        deleteVehicles: userData.role === 'admin',
        viewDeals: userData.role === 'admin',
        editDeals: userData.role === 'admin',
        deleteDeals: userData.role === 'admin'
      }
    };

    await db.addUser(user);
    set((state) => ({ users: [...state.users, user] }));
  },

  updateUser: async (id, userData) => {
    const updatedUser: User = {
      ...userData,
      id
    };

    await db.updateUser(id, updatedUser);
    set((state) => ({
      users: state.users.map(u => u.id === id ? updatedUser : u)
    }));
  },

  deleteUser: async (id) => {
    await db.deleteUser(id);
    set((state) => ({
      users: state.users.filter(user => user.id !== id)
    }));
  },

  addSource: async (sourceData) => {
    const source = { ...sourceData, id: crypto.randomUUID() };
    await db.addSource(source);
    set((state) => ({ sources: [...state.sources, source] }));
  },

  addLocation: async (locationData) => {
    const location = { ...locationData, id: crypto.randomUUID() };
    await db.addLocation(location);
    set((state) => ({ locations: [...state.locations, location] }));
  },

  updateLocation: async (id, location) => {
    await db.updateLocation(id, location);
    set((state) => ({
      locations: state.locations.map(loc => loc.id === id ? location : loc)
    }));
  },

  deleteLocation: async (id) => {
    await db.deleteLocation(id);
    set((state) => ({
      locations: state.locations.filter(location => location.id !== id)
    }));
  },

  addVehicle: async (vehicleData) => {
    const { vehicles } = get();
    const lastVehicle = [...vehicles].sort((a, b) => 
      (b.stockNumber || '').localeCompare(a.stockNumber || '')
    )[0];
    
    const vehicle = {
      ...vehicleData,
      id: crypto.randomUUID(),
      stockNumber: generateStockNumber(lastVehicle?.stockNumber)
    };

    await db.addVehicle(vehicle);
    set((state) => ({ vehicles: [...state.vehicles, vehicle] }));
  },

  updateVehicle: async (id, vehicleData) => {
    const { vehicles } = get();
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;

    const updatedVehicle = { ...vehicle, ...vehicleData };
    await db.updateVehicle(id, updatedVehicle);
    
    set((state) => ({
      vehicles: state.vehicles.map(v => v.id === id ? updatedVehicle : v)
    }));
  },

  deleteVehicle: async (id) => {
    await db.deleteVehicle(id);
    set((state) => ({
      vehicles: state.vehicles.filter(vehicle => vehicle.id !== id)
    }));
  },

  addStockEntry: async (entryData) => {
    const entry = {
      ...entryData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    await db.addStockEntry(entry);
    set((state) => ({
      stockEntries: [...state.stockEntries, entry]
    }));
  },

  addDesklogEntry: async (entryData) => {
    const entry: DesklogEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.addDesklogEntry(entry);
    set((state) => ({
      desklogEntries: [...state.desklogEntries, entry]
    }));
  },

  updateDesklogEntry: async (id, entryData) => {
    const entry: DesklogEntry = {
      ...entryData,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.updateDesklogEntry(id, entry);
    set((state) => ({
      desklogEntries: state.desklogEntries.map(e => e.id === id ? entry : e)
    }));
  },

  deleteDesklogEntry: async (id) => {
    await db.deleteDesklogEntry(id);
    set((state) => ({
      desklogEntries: state.desklogEntries.filter(entry => entry.id !== id)
    }));
  },

  updateVehicleStatus: async (stockNumber: string, status: Vehicle['status']) => {
    const vehicle = get().vehicles.find(v => v.stockNumber === stockNumber);
    if (vehicle) {
      const updatedVehicle = { ...vehicle, status };
      await db.updateVehicle(vehicle.id, updatedVehicle);
      set((state) => ({
        vehicles: state.vehicles.map(v => v.stockNumber === stockNumber ? updatedVehicle : v)
      }));
    }
  },

  setCurrentUser: (user) => set({ currentUser: user })
}));