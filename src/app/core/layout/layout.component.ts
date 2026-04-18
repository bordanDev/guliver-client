import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MenuModule, ToolbarModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  public menuItems: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Monitoring',
        items: [
          {
            label: 'Live Occupancy',
            icon: 'pi pi-users',
            routerLink: '/live',
          },
          {
            label: 'Facility Status',
            icon: 'pi pi-building',
            routerLink: '/facility',
          },
        ],
      },
      {
        label: 'Analytics',
        items: [
          {
            label: 'Traffic Chart',
            icon: 'pi pi-chart-line',
            routerLink: '/analytics/traffic',
          },
          {
            label: 'Conversion',
            icon: 'pi pi-dollar',
            routerLink: '/analytics/conversion',
          },
        ],
      },
      {
        label: 'System & Logs',
        items: [
          {
            label: 'Passage Logs',
            icon: 'pi pi-list',
            routerLink: '/logs/passage',
          },
          {
            label: 'Hardware Status',
            icon: 'pi pi-server',
            routerLink: '/logs/hardware',
          },
          {
            label: 'Compliance Settings',
            icon: 'pi pi-sliders-h',
            routerLink: '/config/compliance',
          },
          {
            label: 'Node Calibration',
            icon: 'pi pi-compass',
            routerLink: '/config/calibration',
          },
        ],
      },
    ];
  }
}
