import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  template: `
    <div
      class="flex-1 flex align-items-center justify-content-center h-full surface-0 border-round shadow-1 p-4"
    >
      <div class="text-center">
        <div class="mb-4">
          <i class="pi pi-wrench text-900" style="font-size: 5rem"></i>
        </div>
        <h2 class="text-900 mb-3 font-bold text-4xl">В разработке</h2>
        <p class="text-600 m-0 text-xl max-w-20rem mx-auto line-height-3">
          Эта страница еще не готова, но мы уже активно работаем над ней!
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnderConstructionComponent {}
