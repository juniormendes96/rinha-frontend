import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rf-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="h-full w-full flex flex-col items-center justify-center p-5">
      <h1 class="text-5xl font-bold mb-4 text-center">JSON Tree Viewer</h1>
      <p class="text-2xl mb-7 text-center">Simple JSON Viewer that runs completely on-client. No data exchange</p>
      <button
        type="button"
        class="bg-gray-200 border-solid border border-black py-2 px-4 rounded font-medium hover:brightness-95"
        (click)="isJsonInvalid = true"
      >
        Load JSON
      </button>
      <p *ngIf="isJsonInvalid" class="text-red-600 mt-4">Invalid file. Please load a valid JSON file.</p>
    </main>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  isJsonInvalid = false;
}
