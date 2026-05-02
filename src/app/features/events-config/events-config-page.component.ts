import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { EventsConfigFacade } from './events-config.facade';
import { AvailableDevicesListComponent } from './components/available-devices-list/available-devices-list.component';
import { LocationsBoardComponent } from './components/locations-board/locations-board.component';
import { ConfigDeviceDto } from '@guliver/shared-contracts';

@Component({
  selector: 'app-events-config-page',
  standalone: true,
  imports: [DragDropModule, AvailableDevicesListComponent, LocationsBoardComponent],
  templateUrl: './events-config-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsConfigPageComponent {
  public facade = inject(EventsConfigFacade);

  // Храним устройство, которое в данный момент перетаскивается
  public draggedDevice = signal<ConfigDeviceDto | null>(null);

  onDragStart(device: ConfigDeviceDto) {
    this.draggedDevice.set(device);
  }

  onDragEnd() {
    this.draggedDevice.set(null);
  }

  onDropToLocation(locationId: string) {
    const device = this.draggedDevice();
    if (device) {
      this.facade.assignDeviceToLocation([device], locationId);
      this.draggedDevice.set(null);
    }
  }

  onDropToAvailable() {
    const device = this.draggedDevice();
    if (device) {
      this.facade.unassignDevice(device.id);
      this.draggedDevice.set(null);
    }
  }
  
  onAssignFromDialog(event: { devices: ConfigDeviceDto[], locationId: string }) {
      this.facade.assignDeviceToLocation(event.devices, event.locationId);
  }
  
  onUnassign(deviceId: string) {
      this.facade.unassignDevice(deviceId);
  }
}
