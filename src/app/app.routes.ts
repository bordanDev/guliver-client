import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core').then(m => m.LayoutComponent),
    children: [
      {
        path: 'live',
        loadComponent: () => import('./features/live-occupancy').then(m => m.LiveOccupancyComponent)
      },
      {
        path: '',
        redirectTo: 'live',
        pathMatch: 'full'
      }
    ]
  }
];
