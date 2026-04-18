import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LiveOccupancyComponent } from './features/live-occupancy';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LiveOccupancyComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app');
}
