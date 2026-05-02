import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MenuModule, ToolbarModule, BreadcrumbModule, ButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  public menuItems: MenuItem[] = [];
  public breadcrumbItems = signal<MenuItem[]>([]);
  public home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  public isDarkMode = signal<boolean>(false);

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

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

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbItems.set(this.createBreadcrumbs(this.activatedRoute.root));
    });
    
    // Установка при первой загрузке
    this.breadcrumbItems.set(this.createBreadcrumbs(this.activatedRoute.root));
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (child.snapshot.url.length > 0) {
        for (const segment of child.snapshot.url) {
          const path = segment.path;
          url += `/${path}`;
          const label = this.capitalize(path);
          breadcrumbs.push({ label, routerLink: url });
        }
      }
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

  private capitalize(s: string): string {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  public toggleTheme(): void {
    const element = document.documentElement;
    element.classList.toggle('app-dark');
    this.isDarkMode.update(v => !v);
  }
}
