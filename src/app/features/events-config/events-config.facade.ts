import { computed, Injectable, signal } from '@angular/core';
import { ConfigDeviceDto, SystemProvisioningStateDto } from '@guliver/shared-contracts';

@Injectable({
  providedIn: 'root',
})
export class EventsConfigFacade {
  private readonly _state = signal<SystemProvisioningStateDto>({
    globalAvailableDevices: [
      { id: 'd1', macAddress: 'AA:BB:CC:DD:EE:11', deviceName: 'ESP32-Entrance', status: 'UNASSIGNED' },
      { id: 'd2', macAddress: 'AA:BB:CC:DD:EE:22', deviceName: 'ESP32-Backdoor', status: 'UNASSIGNED' },
      { id: 'd3', macAddress: '11:22:33:44:55:66', deviceName: 'ToF-Sensor-VIP', status: 'UNASSIGNED' },
      { id: 'd4', macAddress: 'FF:FF:FF:FF:FF:FF', deviceName: 'ToF-Sensor-Hall', status: 'UNASSIGNED' }
    ],
    events: [
      {
        eventId: 'evt-1',
        eventName: 'Web Summit 2026',
        locations: [
          { id: 'loc-1', name: 'Main Entrance', devices: [] },
          { id: 'loc-2', name: 'VIP Lounge', devices: [] },
        ],
      },
      {
        eventId: 'evt-2',
        eventName: 'Tech Conference',
        locations: [],
      }
    ]
  });

  public readonly selectedEventId = signal<string | null>('evt-1');

  public readonly availableDevices = computed(() => this._state().globalAvailableDevices);
  public readonly events = computed(() => this._state().events);
  
  public readonly selectedEvent = computed(() => {
    const id = this.selectedEventId();
    return this.events().find(e => e.eventId === id) || null;
  });

  public readonly locations = computed(() => {
    const evt = this.selectedEvent();
    return evt ? evt.locations : [];
  });

  public selectEvent(eventId: string): void {
    this.selectedEventId.set(eventId);
  }

  public createEvent(eventName: string): void {
    if (!eventName.trim()) return;
    const newEvent = {
      eventId: `evt-${Date.now()}`,
      eventName,
      locations: []
    };
    this._state.update(state => ({
      ...state,
      events: [...state.events, newEvent]
    }));
    this.selectedEventId.set(newEvent.eventId);
  }

  public assignDeviceToLocation(devices: ConfigDeviceDto[], locationId: string): void {
    const eventId = this.selectedEventId();
    if (!eventId) return;

    this._state.update((state) => {
      const idsToAssign = devices.map(d => d.id);
      
      const newAvailable = state.globalAvailableDevices.filter((d) => !idsToAssign.includes(d.id));

      const newEvents = state.events.map(evt => {
        if (evt.eventId !== eventId) return evt;

        const cleanLocations = evt.locations.map((loc) => ({
          ...loc,
          devices: loc.devices.filter((d) => !idsToAssign.includes(d.id))
        }));

        const updatedLocations = cleanLocations.map((loc) => {
          if (loc.id === locationId) {
             const newOnlineDevices = devices.map(d => ({ ...d, status: 'ONLINE' as const }));
             return { ...loc, devices: [...loc.devices, ...newOnlineDevices] };
          }
          return loc;
        });

        return { ...evt, locations: updatedLocations };
      });

      return {
        ...state,
        globalAvailableDevices: newAvailable,
        events: newEvents,
      };
    });
  }

  public unassignDevice(deviceId: string): void {
    const eventId = this.selectedEventId();
    if (!eventId) return;

    this._state.update((state) => {
      let foundDevice: ConfigDeviceDto | undefined;

      const newEvents = state.events.map(evt => {
        if (evt.eventId !== eventId) return evt;

        const updatedLocations = evt.locations.map((loc) => {
          const dev = loc.devices.find((d) => d.id === deviceId);
          if (dev) {
            foundDevice = { ...dev, status: 'UNASSIGNED' };
            return { ...loc, devices: loc.devices.filter((d) => d.id !== deviceId) };
          }
          return loc;
        });

        return { ...evt, locations: updatedLocations };
      });

      if (foundDevice) {
        return {
          ...state,
          globalAvailableDevices: [...state.globalAvailableDevices, foundDevice],
          events: newEvents,
        };
      }
      return state;
    });
  }

  public createLocation(name: string): void {
    const eventId = this.selectedEventId();
    if (!name.trim() || !eventId) return;

    this._state.update((state) => {
       const newEvents = state.events.map(evt => {
           if (evt.eventId === eventId) {
               return {
                   ...evt,
                   locations: [...evt.locations, { id: `loc-${Date.now()}`, name, devices: [] }]
               };
           }
           return evt;
       });
       return { ...state, events: newEvents };
    });
  }

  public renameLocation(locationId: string, newName: string): void {
    const eventId = this.selectedEventId();
    if (!newName.trim() || !eventId) return;

    this._state.update((state) => {
       const newEvents = state.events.map(evt => {
           if (evt.eventId === eventId) {
               const updatedLocations = evt.locations.map(loc => 
                   loc.id === locationId ? { ...loc, name: newName } : loc
               );
               return { ...evt, locations: updatedLocations };
           }
           return evt;
       });
       return { ...state, events: newEvents };
    });
  }

  public clearAllDevicesFromLocations(): void {
    const eventId = this.selectedEventId();
    if (!eventId) return;

    this._state.update((state) => {
      let unassignedDevices: ConfigDeviceDto[] = [];
      
      const newEvents = state.events.map(evt => {
        if (evt.eventId !== eventId) return evt;
        
        const updatedLocations = evt.locations.map(loc => {
           unassignedDevices.push(...loc.devices.map(d => ({...d, status: 'UNASSIGNED' as const})));
           return { ...loc, devices: [] };
        });
        
        return { ...evt, locations: updatedLocations };
      });
      
      return {
        ...state,
        globalAvailableDevices: [...state.globalAvailableDevices, ...unassignedDevices],
        events: newEvents
      };
    });
  }

  public deleteAllLocations(): void {
    const eventId = this.selectedEventId();
    if (!eventId) return;

    this._state.update((state) => {
      let unassignedDevices: ConfigDeviceDto[] = [];
      
      const newEvents = state.events.map(evt => {
        if (evt.eventId !== eventId) return evt;
        
        evt.locations.forEach(loc => {
           unassignedDevices.push(...loc.devices.map(d => ({...d, status: 'UNASSIGNED' as const})));
        });
        
        return { ...evt, locations: [] };
      });
      
      return {
        ...state,
        globalAvailableDevices: [...state.globalAvailableDevices, ...unassignedDevices],
        events: newEvents
      };
    });
  }

  public deleteLocation(locationId: string): void {
    const eventId = this.selectedEventId();
    if (!eventId) return;

    this._state.update((state) => {
      let unassignedDevices: ConfigDeviceDto[] = [];
      
      const newEvents = state.events.map(evt => {
        if (evt.eventId !== eventId) return evt;
        
        const targetLocation = evt.locations.find(l => l.id === locationId);
        if (targetLocation) {
             unassignedDevices.push(...targetLocation.devices.map(d => ({...d, status: 'UNASSIGNED' as const})));
        }
        
        return { 
           ...evt, 
           locations: evt.locations.filter(l => l.id !== locationId) 
        };
      });
      
      return {
        ...state,
        globalAvailableDevices: [...state.globalAvailableDevices, ...unassignedDevices],
        events: newEvents
      };
    });
  }
}
