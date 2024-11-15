import { openDB } from 'idb';
import type { User, Source, Location } from '../types/user';
import type { Vehicle, StockNumberEntry } from '../types/inventory';
import type { DesklogEntry } from '../types/desklog';

const DB_NAME = 'vehicleInventoryDB';
const DB_VERSION = 3;

// Initialize database
const initDB = () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('sources')) {
        db.createObjectStore('sources', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('vehicles')) {
        db.createObjectStore('vehicles', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('stockEntries')) {
        db.createObjectStore('stockEntries', { keyPath: 'id' });
      }
      if (oldVersion < 2 && !db.objectStoreNames.contains('locations')) {
        db.createObjectStore('locations', { keyPath: 'id' });
      }
      if (oldVersion < 3 && !db.objectStoreNames.contains('desklog')) {
        const desklogStore = db.createObjectStore('desklog', { keyPath: 'id' });
        desklogStore.createIndex('stockNumber', 'stockNumber');
        desklogStore.createIndex('date', 'date');
        desklogStore.createIndex('dealStatus', 'dealStatus');
      }
    },
  });
};

let dbPromise = initDB();

// Users
export async function getAllUsers(): Promise<User[]> {
  const db = await dbPromise;
  return db.getAll('users');
}

export async function addUser(user: User): Promise<string> {
  const db = await dbPromise;
  await db.add('users', user);
  return user.id;
}

export async function updateUser(_id: string, user: User): Promise<void> {
  const db = await dbPromise;
  await db.put('users', user);
}

export async function deleteUser(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete('users', id);
}

// Sources
export async function getAllSources(): Promise<Source[]> {
  const db = await dbPromise;
  return db.getAll('sources');
}

export async function addSource(source: Source): Promise<string> {
  const db = await dbPromise;
  await db.add('sources', source);
  return source.id;
}

// Locations
export async function getAllLocations(): Promise<Location[]> {
  const db = await dbPromise;
  return db.getAll('locations');
}

export async function addLocation(location: Location): Promise<string> {
  const db = await dbPromise;
  await db.add('locations', location);
  return location.id;
}

export async function updateLocation(_id: string, location: Location): Promise<void> {
  const db = await dbPromise;
  await db.put('locations', location);
}

export async function deleteLocation(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete('locations', id);
}

// Vehicles
export async function getAllVehicles(): Promise<Vehicle[]> {
  const db = await dbPromise;
  return db.getAll('vehicles');
}

export async function addVehicle(vehicle: Vehicle): Promise<string> {
  const db = await dbPromise;
  await db.add('vehicles', vehicle);
  return vehicle.id;
}

export async function updateVehicle(_id: string, vehicle: Vehicle): Promise<void> {
  const db = await dbPromise;
  await db.put('vehicles', vehicle);
}

export async function deleteVehicle(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete('vehicles', id);
}

// Stock Entries
export async function getAllStockEntries(): Promise<StockNumberEntry[]> {
  const db = await dbPromise;
  return db.getAll('stockEntries');
}

export async function addStockEntry(entry: StockNumberEntry): Promise<string> {
  const db = await dbPromise;
  await db.add('stockEntries', entry);
  return entry.id;
}

// Desklog
export async function getAllDesklogEntries(): Promise<DesklogEntry[]> {
  const db = await dbPromise;
  return db.getAll('desklog');
}

export async function getDesklogEntriesByStatus(status: string): Promise<DesklogEntry[]> {
  const db = await dbPromise;
  const index = db.transaction('desklog').store.index('dealStatus');
  return index.getAll(status);
}

export async function getDesklogEntriesByDateRange(startDate: Date, endDate: Date): Promise<DesklogEntry[]> {
  const db = await dbPromise;
  const index = db.transaction('desklog').store.index('date');
  return index.getAll(IDBKeyRange.bound(startDate, endDate));
}

export async function addDesklogEntry(entry: DesklogEntry): Promise<string> {
  const db = await dbPromise;
  await db.add('desklog', entry);
  return entry.id;
}

export async function updateDesklogEntry(_id: string, entry: DesklogEntry): Promise<void> {
  const db = await dbPromise;
  await db.put('desklog', entry);
}

export async function deleteDesklogEntry(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete('desklog', id);
}