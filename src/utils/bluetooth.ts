import { BluetoothDevice } from '../types/bluetooth';

export const getPlatformInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform;
  
  const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(userAgent);
  const isChrome = /chrome/.test(userAgent) && !/edge|edg/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/chrome|chromium|edg/.test(userAgent);
  
  return {
    isIOS,
    isAndroid,
    isChrome,
    isSafari,
    isMobile: isIOS || isAndroid
  };
};

export const getBluetoothAvailability = async () => {
  const platform = getPlatformInfo();
  
  if (!navigator.bluetooth) {
    if (platform.isIOS && !platform.isSafari) {
      return { available: false, error: 'Please use Safari on iOS for Bluetooth functionality' };
    }
    if (platform.isAndroid && !platform.isChrome) {
      return { available: false, error: 'Please use Chrome on Android for Bluetooth functionality' };
    }
    return { available: false, error: 'Bluetooth is not supported in this browser' };
  }

  try {
    const available = await navigator.bluetooth.getAvailability();
    if (!available) {
      return { available: false, error: 'Please enable Bluetooth on your device' };
    }
    return { available: true, error: null };
  } catch {
    return { available: false, error: 'Unable to detect Bluetooth capability' };
  }
};

export async function requestBluetoothDevice(): Promise<BluetoothDevice> {
  const { available, error } = await getBluetoothAvailability();
  if (!available) {
    throw new Error(error || 'Bluetooth is not available');
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '00001800-0000-1000-8000-00805f9b34fb', // Generic Access
        '00001801-0000-1000-8000-00805f9b34fb', // Generic Attribute
        '0000180a-0000-1000-8000-00805f9b34fb', // Device Information
        '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
        '00001812-0000-1000-8000-00805f9b34fb'  // Human Interface Device
      ]
    });

    if (!device) {
      throw new Error('No device selected');
    }

    // Attempt to connect to the device to verify it's working
    try {
      const server = await device.gatt?.connect();
      // Disconnect after successful connection test
      if (server) {
        server.disconnect();
      }
    } catch (error) {
      throw new Error('Unable to connect to the selected device. Please try again.');
    }

    return {
      id: device.id,
      name: device.name || `Device ${Date.now().toString(36)}`
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('User cancelled')) {
        throw new Error('Device selection was cancelled');
      }
      throw error;
    }
    throw new Error('Failed to scan for devices');
  }
}