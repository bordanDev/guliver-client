import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { TagModule } from 'primeng/tag';
import { ConfigDeviceDto } from '@guliver/shared-contracts';

@Component({
  selector: 'app-available-devices-list',
  standalone: true,
  imports: [DragDropModule, TagModule],
  templateUrl: './available-devices-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailableDevicesListComponent {
  public devices = input.required<ConfigDeviceDto[]>();
  public disabled = input<boolean>(false);
  public dragStart = output<ConfigDeviceDto>();
  public dragEnd = output<void>();

  onDragStart(device: ConfigDeviceDto) {
    this.dragStart.emit(device);
  }

  onDragEnd() {
    this.dragEnd.emit();
  }
}
