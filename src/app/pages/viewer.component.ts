import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RowComponent } from '../components/row.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ParserWorker, ParserWorkerResult } from '../workers/parser.worker.types';

export interface ViewerState {
  file?: File;
}

const TWO_KB = 1024 * 2;

@Component({
  selector: 'rf-viewer',
  standalone: true,
  imports: [CommonModule, RowComponent, InfiniteScrollModule, ScrollingModule],
  template: `
    <div class="h-full flex flex-col">
      <cdk-virtual-scroll-viewport
        itemSize="24"
        class="h-full block"
        infinite-scroll
        infiniteScrollContainer=".cdk-virtual-scrollable"
        [fromRoot]="true"
        [infiniteScrollDistance]="1"
        [infiniteScrollThrottle]="300"
        (scrolled)="loadNextChunk()"
      >
        <div class="m-auto w-full max-w-5xl p-6">
          <h1 class="w-full mb-3 text-3xl font-bold">{{ file.name }}</h1>
          <ul class="w-full">
            <rf-row *cdkVirtualFor="let row of rows$ | async; templateCacheSize: 0" class="block h-[24px]" [content]="row"></rf-row>
          </ul>
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private parserWorker: ParserWorker = new Worker(new URL('../workers/parser.worker', import.meta.url));
  private isLoading = false;
  private isFullyLoaded = false;
  private chunkSizeInBytes = TWO_KB;

  file: File = this.route.snapshot.data['file'];

  rows$ = new BehaviorSubject<string[]>([]);

  constructor() {
    this.parserWorker.onmessage = ({ data: { status, rows } }: MessageEvent<ParserWorkerResult>) => {
      if (status === 'error') {
        this.router.navigate(['/']);
        return;
      }

      this.rows$.next(rows);
      this.isFullyLoaded = this.chunkSizeInBytes >= this.file.size;
      this.chunkSizeInBytes += TWO_KB;
      this.isLoading = false;
    };
  }

  ngOnInit(): void {
    this.loadNextChunk();
  }

  loadNextChunk(): void {
    if (this.isLoading || !this.file || this.isFullyLoaded) return;

    this.isLoading = true;

    this.parserWorker.postMessage({ file: this.file, chunkSizeInBytes: this.chunkSizeInBytes });
  }
}
