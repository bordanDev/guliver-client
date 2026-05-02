import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigDeviceDto, ConfigLocationDto } from '@guliver/shared-contracts';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { ListboxModule } from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-locations-board',
  standalone: true,
  imports: [DragDropModule, ButtonModule, DialogModule, ListboxModule, FormsModule, InputTextModule],
  templateUrl: './locations-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsBoardComponent {
  public locations = input.required<ConfigLocationDto[]>();
  public availableDevices = input.required<ConfigDeviceDto[]>();

  public dragStart = output<ConfigDeviceDto>();
  public dragEnd = output<void>();
  public dropped = output<string>(); // ID локации
  public assignFromDialog = output<{ devices: ConfigDeviceDto[]; locationId: string }>();
  public unassign = output<string>();
  
  public createLocation = output<string>();
  public renameLocation = output<{ locationId: string, name: string }>();

  // Модальное окно (сигналы) назначения девайсов
  public displayDialog = signal(false);
  public activeLocationForDialog = signal<string | null>(null);
  public selectedDevicesForDialog = signal<ConfigDeviceDto[]>([]);

  // Создание локации
  public displayCreateLocationDialog = signal(false);
  public newLocationName = signal('');

  // Инлайн редактирование локации
  public editingLocationId = signal<string | null>(null);
  public editingLocationName = signal('');

  // Подсветка при перетаскивании
  public dragHoverLocation = signal<string | null>(null);

  onDragStart(device: ConfigDeviceDto) {
    this.dragStart.emit(device);
  }
  onDragEnd() {
    this.dragEnd.emit();
  }
  onDragEnter(locationId: string) {
    this.dragHoverLocation.set(locationId);
  }
  onDragLeave() {
    this.dragHoverLocation.set(null);
  }
  onDrop(locationId: string) {
    this.dragHoverLocation.set(null);
    this.dropped.emit(locationId);
  }

  openAssignDialog(locationId: string) {
    this.activeLocationForDialog.set(locationId);
    this.selectedDevicesForDialog.set([]);
    this.displayDialog.set(true);
  }

  confirmDialogAssignment() {
    const locId = this.activeLocationForDialog();
    const devs = this.selectedDevicesForDialog();
    if (locId && devs && devs.length > 0) {
      this.assignFromDialog.emit({ devices: devs, locationId: locId });
      this.displayDialog.set(false);
    }
  }

  onUnassign(deviceId: string) {
    this.unassign.emit(deviceId);
  }

  confirmCreateLocation() {
    if (this.newLocationName().trim()) {
      this.createLocation.emit(this.newLocationName());
      this.displayCreateLocationDialog.set(false);
      this.newLocationName.set('');
    }
  }

  startEditingLocation(location: ConfigLocationDto) {
    this.editingLocationId.set(location.id);
    this.editingLocationName.set(location.name);
  }

  saveLocationName(locationId: string) {
    const name = this.editingLocationName();
    if (name.trim()) {
      this.renameLocation.emit({ locationId, name });
    }
    this.editingLocationId.set(null);
  }

  cancelEditingLocation() {
    this.editingLocationId.set(null);
  }
}
