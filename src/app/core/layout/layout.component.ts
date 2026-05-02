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
        ],
      },
      {
        label: 'Configuration',
        items: [
          {
            label: 'Events Matrix',
            icon: 'pi pi-sitemap',
            routerLink: '/config/events',
          },
        ],
      },
    ];
  }
}
