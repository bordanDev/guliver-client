import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  public theme: WritableSignal<ThemeMode> = signal<ThemeMode>('app-light');
}

type ThemeMode = 'app-light' | 'app-dark';
