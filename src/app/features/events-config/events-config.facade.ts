import { computed, Injectable, signal } from '@angular/core';
import { ConfigDeviceDto, EventProvisioningStateDto } from '@guliver/shared-contracts';

@Injectable({
  providedIn: 'root',
})
export class EventsConfigFacade {
  // Основной стейт - Single Source of Truth
  private readonly _state = signal<EventProvisioningStateDto>({
    eventId: 'evt-1',
    eventName: 'Web Summit 2026',
    availableDevices: [
      {
        id: 'd1',
        macAddress: 'AA:BB:CC:DD:EE:11',
        deviceName: 'ESP32-Entrance',
        status: 'UNASSIGNED',
      },
      {
        id: 'd2',
        macAddress: 'AA:BB:CC:DD:EE:22',
        deviceName: 'ESP32-Backdoor',
        status: 'UNASSIGNED',
      },
      {
        id: 'd3',
        macAddress: '11:22:33:44:55:66',
        deviceName: 'ToF-Sensor-VIP',
        status: 'UNASSIGNED',
      },
    ],
    locations: [
      { id: 'loc-1', name: 'Main Entrance', devices: [] },
      { id: 'loc-2', name: 'VIP Lounge', devices: [] },
    ],
  });

  // Публичные Computed Сигналы
  public readonly eventName = computed(() => this._state().eventName);
  public readonly availableDevices = computed(() => this._state().availableDevices);
  public readonly locations = computed(() => this._state().locations);

  /**
   * Перенос устройства (или нескольких) из Available в конкретную Location
   */
  public assignDeviceToLocation(devices: ConfigDeviceDto[], locationId: string): void {
    this._state.update((state) => {
      const idsToAssign = devices.map((d) => d.id);

      // 1. Убираем из доступных
      const newAvailable = state.availableDevices.filter((d) => !idsToAssign.includes(d.id));

      // 2. Ищем откуда могли забрать (если перетащили из другой локации)
      const cleanLocations = state.locations.map((loc) => ({
        ...loc,
        devices: loc.devices.filter((d) => !idsToAssign.includes(d.id)),
      }));

      // 3. Добавляем в целевую локацию
      const updatedLocations = cleanLocations.map((loc) => {
        if (loc.id === locationId) {
          const newOnlineDevices = devices.map((d) => ({ ...d, status: 'ONLINE' as const }));
          return { ...loc, devices: [...loc.devices, ...newOnlineDevices] };
        }
        return loc;
      });

      return {
        ...state,
        availableDevices: newAvailable,
        locations: updatedLocations,
      };
    });
  }

  /**
   * Возврат устройства из Location обратно в Available
   */
  public unassignDevice(deviceId: string): void {
    this._state.update((state) => {
      let foundDevice: ConfigDeviceDto | undefined;

      const updatedLocations = state.locations.map((loc) => {
        const dev = loc.devices.find((d) => d.id === deviceId);
        if (dev) {
          foundDevice = { ...dev, status: 'UNASSIGNED' };
          return { ...loc, devices: loc.devices.filter((d) => d.id !== deviceId) };
        }
        return loc;
      });

      if (foundDevice) {
        return {
          ...state,
          availableDevices: [...state.availableDevices, foundDevice],
          locations: updatedLocations,
        };
      }
      return state;
    });
  }

  /**
   * Создать новую локацию
   */
  public createLocation(name: string): void {
    if (!name.trim()) return;
    this._state.update((state) => ({
      ...state,
      locations: [...state.locations, { id: `loc-${Date.now()}`, name, devices: [] }],
    }));
  }
}
