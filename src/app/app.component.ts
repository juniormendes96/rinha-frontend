import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonViewerComponent } from './json-viewer.component';

@Component({
  selector: 'rf-app',
  standalone: true,
  imports: [CommonModule, JsonViewerComponent],
  template: `
    <main class="h-full w-full p-5">
      <div *ngIf="!isValidJson; else viewer" class="flex flex-col items-center justify-center h-full">
        <h1 class="text-5xl font-bold mb-4 text-center">JSON Tree Viewer</h1>
        <p class="text-2xl mb-7 text-center">Simple JSON Viewer that runs completely on-client. No data exchange</p>
        <input type="file" class="hidden" #fileInput (change)="onFileSelected($event)" />
        <button
          type="button"
          class="bg-gray-200 border-solid border border-black py-2 px-4 rounded font-medium hover:brightness-95"
          (click)="fileInput.click()"
        >
          Load JSON
        </button>
        <p *ngIf="hasTypeError" class="text-red-600 mt-4">Invalid file. Please load a valid JSON file.</p>
      </div>
      <ng-template #viewer>
        <div class="m-auto w-full max-w-5xl">
          <h1 class="text-3xl font-bold">{{ selectedFile?.name }}</h1>
          <rf-json-viewer></rf-json-viewer>
        </div>
      </ng-template>
    </main>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  selectedFile: File | null = null;

  get isValidJson(): boolean {
    return !!this.selectedFile && !this.hasTypeError;
  }

  get hasTypeError(): boolean {
    return !!this.selectedFile && this.selectedFile.type !== 'application/json';
  }

  onFileSelected(event: Event): void {
    this.selectedFile = this.extractFile(event);
  }

  private extractFile(event: Event): File | null {
    const files = (event.target as HTMLInputElement)?.files;
    return files ? files[0] : null;
  }
}
