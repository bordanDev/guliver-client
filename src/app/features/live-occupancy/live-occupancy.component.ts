import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { MeterGroupModule } from 'primeng/metergroup';
import { Observable, timer } from 'rxjs';
import { map, scan, shareReplay } from 'rxjs/operators';
import { FacilityCompliance, OccupancyEvent } from '../../shared/models/occupancy.model';

@Component({
  selector: 'app-live-occupancy',
  standalone: true,
  imports: [CardModule, MeterGroupModule, BadgeModule, AsyncPipe],
  templateUrl: './live-occupancy.component.html',
  styleUrl: './live-occupancy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveOccupancyComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  public occupancyData$!: Observable<FacilityCompliance>;
  public meterItems$!: Observable<any[]>;

  private readonly MAX_CAPACITY = 100;

  ngOnInit() {
    // Имитация высокочастотного потока WebSocket от ESP32/PostgreSQL (CDC) без использования setInterval
    // timer выдает события в бесконечно рекурсивном потоке без блокирования UI (RxJS OnPush loop)
    const eventStream$: Observable<OccupancyEvent> = timer(0, 1500).pipe(
      map(
        (i) =>
          ({
            timestamp: new Date().toISOString(),
            flow: Math.random() > 0.4 ? 'IN' : 'OUT', // Чаще заходят
            sensorId: `ESP32-ZONE-${Math.floor(Math.random() * 3) + 1}`,
            totalCount: 0, // Вычисляется ниже через scan
          }) as OccupancyEvent,
      ),
      takeUntilDestroyed(this.destroyRef), // Автоматическая отписка, защита от memory leak
    );

    this.occupancyData$ = eventStream$.pipe(
      scan(
        (acc, curr) => {
          let newCount = acc.currentOccupancy;
          if (curr.flow === 'IN') newCount++;
          else if (newCount > 0) newCount--;

          let status: 'NORMAL' | 'WARNING' | 'DANGER' = 'NORMAL';
          const occupancyRatio = newCount / this.MAX_CAPACITY;
          if (occupancyRatio >= 0.9) status = 'DANGER';
          else if (occupancyRatio >= 0.75) status = 'WARNING';

          return {
            maxCapacity: this.MAX_CAPACITY,
            currentOccupancy: newCount,
            status,
          };
        },
        {
          maxCapacity: this.MAX_CAPACITY,
          currentOccupancy: 45,
          status: 'NORMAL',
        } as FacilityCompliance,
      ),
      shareReplay(1),
    );

    this.meterItems$ = this.occupancyData$.pipe(
      map((data) => {
        const percentage = Math.min((data.currentOccupancy / data.maxCapacity) * 100, 100);
        let color = '#34d399'; // green (NORMAL)
        if (data.status === 'WARNING') color = '#fbbf24'; // yellow
        if (data.status === 'DANGER') color = '#ef4444'; // red

        return [
          { label: 'Occupied', color, value: percentage },
          { label: 'Available', color: '#e2e8f0', value: 100 - percentage },
        ];
      }),
    );
  }

  // Методы для стилизации вместо ngClass
  public getStatusTextColor(status: string): string {
    if (status === 'NORMAL') return 'text-green-500';
    if (status === 'WARNING') return 'text-yellow-500';
    return 'text-red-500';
  }

  public getStatusContainerClass(status: string): string {
    const base = 'flex align-items-center gap-2 p-3 border-round w-full justify-content-center transition-colors transition-duration-300 border-1 ';
    if (status === 'NORMAL') return base + 'surface-green-100 border-green-500 text-green-700';
    if (status === 'WARNING') return base + 'surface-yellow-100 border-yellow-500 text-yellow-700';
    return base + 'surface-red-100 border-red-500 text-red-700';
  }

  public getStatusIcon(status: string): string {
    const base = 'pi ';
    if (status === 'NORMAL') return base + 'pi-check-circle';
    if (status === 'WARNING') return base + 'pi-exclamation-triangle';
    return base + 'pi-shield';
  }
}
