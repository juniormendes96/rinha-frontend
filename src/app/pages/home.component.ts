import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ViewerState } from './viewer.component';
import { ValidatorWorker, ValidatorWorkerResult } from '../workers/validator.worker.types';

@Component({
  selector: 'rf-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-col items-center justify-center h-full p-4"
      *ngIf="{ isLoading: loading$ | async, hasInvalidJson: invalidJson$ | async } as vm"
    >
      <h1 class="text-5xl font-bold mb-4 text-center">JSON Tree Viewer</h1>
      <p class="text-2xl mb-7 text-center">Simple JSON Viewer that runs completely on-client. No data exchange</p>
      <input type="file" class="hidden" accept="application/json" #fileInput (change)="onFileSelected($event)" />
      <button
        type="button"
        class="bg-gray-200 border-solid border border-black py-2 px-4 rounded font-medium w-32 enabled:hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
        [disabled]="vm.isLoading"
        (click)="fileInput.click()"
      >
        {{ vm.isLoading ? 'Loading...' : 'Load JSON' }}
      </button>
      <p class="text-red-600 mt-4" [class.invisible]="!vm.hasInvalidJson">Invalid file. Please load a valid JSON file.</p>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private router = inject(Router);
  private validatorWorker: ValidatorWorker = new Worker(new URL('../workers/validator.worker', import.meta.url));
  private file?: File;

  loading$ = new BehaviorSubject(false);
  invalidJson$ = new BehaviorSubject(false);

  constructor() {
    this.validatorWorker.onmessage = ({ data: isValid }: MessageEvent<ValidatorWorkerResult>) => {
      this.invalidJson$.next(!isValid);
      this.loading$.next(false);

      if (!isValid) return;

      const state: ViewerState = { file: this.file };
      this.router.navigate(['/viewer'], { state });
    };
  }

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    const file = files && files[0];

    if (!file) return;

    this.loading$.next(true);
    this.file = file;
    this.validatorWorker.postMessage({ file });
  }
}
