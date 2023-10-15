import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonViewerComponent } from './json-viewer.component';

@Component({
  selector: 'rf-app',
  standalone: true,
  imports: [CommonModule, JsonViewerComponent],
  template: `
    <main class="h-full w-full p-5">
      <div *ngIf="!selectedFile; else viewer" class="flex flex-col items-center justify-center h-full">
        <h1 class="text-5xl font-bold mb-4 text-center">JSON Tree Viewer</h1>
        <p class="text-2xl mb-7 text-center">Simple JSON Viewer that runs completely on-client. No data exchange</p>
        <button
          type="button"
          class="bg-gray-200 border-solid border border-black py-2 px-4 rounded font-medium hover:brightness-95"
          (click)="selectedFile = 'any file'"
        >
          Load JSON
        </button>
        <p *ngIf="isJsonInvalid" class="text-red-600 mt-4">Invalid file. Please load a valid JSON file.</p>
      </div>
      <ng-template #viewer>
        <div class="m-auto w-full max-w-5xl">
          <h1 class="text-3xl font-bold">alltypes.json</h1>
          <rf-json-viewer></rf-json-viewer>
        </div>
      </ng-template>
    </main>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  selectedFile?: string;
  isJsonInvalid = false;
}
