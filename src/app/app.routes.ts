import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'live',
        loadComponent: () =>
          import('./features/live-occupancy').then((m) => m.LiveOccupancyComponent),
      },
      {
        path: 'config/events',
        loadComponent: () => import('./features/events-config').then((m) => m.EventsConfigPageComponent)
      },
      {
        path: '',
        redirectTo: 'live',
        pathMatch: 'full',
      },
    ],
  },
];
