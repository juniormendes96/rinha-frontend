import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LineComponent } from './line.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject } from 'rxjs';

export interface JsonViewerState {
  file?: File;
}

const TWO_KB = 1024 * 2;

@Component({
  selector: 'rf-json-viewer',
  standalone: true,
  imports: [CommonModule, LineComponent, InfiniteScrollModule],
  template: `
    <div
      class="m-auto w-full max-w-5xl"
      infinite-scroll
      [infiniteScrollDistance]="1"
      [infiniteScrollThrottle]="300"
      (scrolled)="loadNextChunk()"
    >
      <h1 class="text-3xl font-bold mb-3">{{ file.name }}</h1>
      <rf-line *ngFor="let line of lines$ | async" [content]="line"></rf-line>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonViewerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private parserWorker = new Worker(new URL('./json-parser.worker', import.meta.url));
  private isLoading = false;
  private chunkSizeInBytes = TWO_KB;

  file: File = this.route.snapshot.data['file'];

  lines$ = new BehaviorSubject<string[]>([]);

  constructor() {
    this.parserWorker.onmessage = ({ data }) => {
      this.lines$.next(data);
      this.chunkSizeInBytes += TWO_KB;
      this.isLoading = false;
    };
  }

  ngOnInit(): void {
    this.loadNextChunk();
  }

  loadNextChunk(): void {
    if (this.isLoading || !this.file) return;

    this.isLoading = true;

    this.parserWorker.postMessage({ file: this.file, chunkSizeInBytes: this.chunkSizeInBytes });
  }
}
