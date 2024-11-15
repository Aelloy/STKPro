import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BluetoothDevice } from '../types/bluetooth';
import { requestBluetoothDevice, getBluetoothAvailability, getPlatformInfo } from '../utils/bluetooth';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { stockNumber: string; deviceId: string }) => void;
}

export function StockModal({ isOpen, onClose, onSave }: StockModalProps) {
  const [stockNumber, setStockNumber] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);

  useEffect(() => {
    const checkBluetooth = async () => {
      const { available, error } = await getBluetoothAvailability();
      setIsBluetoothAvailable(available);
      if (!available) {
        setError(error || 'Bluetooth is not available');
      }
    };

    checkBluetooth();
  }, []);

  const scanDevices = async () => {
    try {
      setIsScanning(true);
      setError(null);

      const device = await requestBluetoothDevice();
      setDevices(prev => {
        const filteredDevices = prev.filter(d => d.id !== device.id);
        return [...filteredDevices, device];
      });
      setSelectedDevice(device.id);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to scan for devices');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ stockNumber, deviceId: selectedDevice });
    setStockNumber('');
    setSelectedDevice('');
    onClose();
  };

  const platform = getPlatformInfo();
  const showPlatformGuidance = !isBluetoothAvailable && (platform.isIOS || platform.isAndroid);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                      Add New Stock Number
                    </Dialog.Title>

                    {showPlatformGuidance && (
                      <div className="mt-2 rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-4">
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                          {error}
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="stockNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Stock Number
                        </label>
                        <input
                          type="text"
                          id="stockNumber"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          value={stockNumber}
                          onChange={(e) => setStockNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Bluetooth Device
                          </label>
                          <button
                            type="button"
                            onClick={scanDevices}
                            disabled={isScanning || !isBluetoothAvailable}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isScanning ? 'Scanning...' : 'Scan for Devices'}
                          </button>
                        </div>
                        {error && !showPlatformGuidance && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {error}
                          </p>
                        )}
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          value={selectedDevice}
                          onChange={(e) => setSelectedDevice(e.target.value)}
                          required
                        >
                          <option value="">Select a device</option>
                          {devices.map((device) => (
                            <option key={device.id} value={device.id}>
                              {device.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}