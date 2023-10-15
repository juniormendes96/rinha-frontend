import { JsonService } from './json.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, map, tap } from 'rxjs';
import { FileService } from './file.service';
import { Router } from '@angular/router';
import { JsonViewerState } from './json-viewer.component';

@Component({
  selector: 'rf-home',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-5xl font-bold mb-4 text-center">JSON Tree Viewer</h1>
    <p class="text-2xl mb-7 text-center">Simple JSON Viewer that runs completely on-client. No data exchange</p>
    <input type="file" class="hidden" accept="application/json" #fileInput (change)="onFileSelected($event)" />
    <button
      type="button"
      class="bg-gray-200 border-solid border border-black py-2 px-4 rounded font-medium hover:brightness-95"
      (click)="fileInput.click()"
    >
      Load JSON
    </button>
    <p *ngIf="invalidJson$ | async" class="text-red-600 mt-4">Invalid file. Please load a valid JSON file.</p>
  </div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private fileService = inject(FileService);
  private jsonService = inject(JsonService);
  private router = inject(Router);

  invalidJson$ = new BehaviorSubject(false);

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    const file = files && files[0];

    if (!file) return;

    this.fileService
      .readFileContent(file)
      .pipe(
        map(content => this.jsonService.parse(content)),
        tap(({ valid }) => this.invalidJson$.next(!valid))
      )
      .subscribe(({ content, valid }) => {
        if (!valid) return;

        const state: JsonViewerState = {
          fileName: file.name,
          jsonContent: content!
        };

        this.router.navigate(['/viewer'], { state });
      });
  }
}
