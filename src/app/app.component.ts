import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonViewerComponent } from './json-viewer.component';
import { BehaviorSubject, Observable, Subject, filter, map, shareReplay, switchMap } from 'rxjs';
import { FileService } from './file.service';

interface ContentData {
  valid: boolean;
  content?: object;
}

@Component({
  selector: 'rf-app',
  standalone: true,
  imports: [CommonModule, JsonViewerComponent],
  template: `
    <main class="h-full w-full p-5">
      <div class="m-auto w-full max-w-5xl" *ngIf="content$ | async as content; else noFile">
        <h1 class="text-3xl font-bold">{{ fileName$ | async }}</h1>
        <rf-json-viewer [content]="content"></rf-json-viewer>
      </div>
      <ng-template #noFile>
        <div class="flex flex-col items-center justify-center h-full">
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
        </div>
      </ng-template>
    </main>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private fileSubject = new BehaviorSubject<File | null>(null);
  private fileService = inject(FileService);

  private file$ = this.fileSubject.pipe(filter(Boolean));

  private contentData$: Observable<ContentData> = this.file$.pipe(
    switchMap(file => this.fileService.readFileContent(file)),
    map(content => this.parseJson(content)),
    shareReplay(1)
  );

  content$ = this.contentData$.pipe(
    filter(data => data.valid),
    map(data => data.content)
  );

  invalidJson$ = this.contentData$.pipe(map(data => !data.valid));

  fileName$ = this.file$.pipe(map(file => file.name));

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    const file = files && files[0];

    if (file) {
      this.fileSubject.next(file);
    }
  }

  private parseJson(content: string): ContentData {
    try {
      const object = JSON.parse(content);
      return { valid: true, content: object };
    } catch (error) {
      return { valid: false };
    }
  }
}
