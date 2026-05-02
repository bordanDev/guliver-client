import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { EventsConfigFacade } from './events-config.facade';
import { AvailableDevicesListComponent } from './components/available-devices-list/available-devices-list.component';
import { LocationsBoardComponent } from './components/locations-board/locations-board.component';
import { ConfigDeviceDto, EventProvisioningStateDto } from '@guliver/shared-contracts';

@Component({
  selector: 'app-events-config-page',
  standalone: true,
  imports: [DragDropModule, ToolbarModule, SelectModule, ButtonModule, DialogModule, InputTextModule, FormsModule, AvailableDevicesListComponent, LocationsBoardComponent],
  templateUrl: './events-config-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsConfigPageComponent {
  public facade = inject(EventsConfigFacade);

  public draggedDevice = signal<ConfigDeviceDto | null>(null);

  // Окно создания ивента
  public displayCreateEventDialog = signal(false);
  public newEventName = signal('');

  onEventChange(event: { value: EventProvisioningStateDto }) {
    this.facade.selectEvent(event.value.eventId);
  }

  createNewEvent() {
    this.facade.createEvent(this.newEventName());
    this.displayCreateEventDialog.set(false);
    this.newEventName.set('');
  }

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

  onCreateLocation(name: string) {
      this.facade.createLocation(name);
  }

  onRenameLocation(event: { locationId: string, name: string }) {
      this.facade.renameLocation(event.locationId, event.name);
  }
}
