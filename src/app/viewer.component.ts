import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RowComponent } from './row.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
          <h1 class="text-3xl font-bold mb-3">{{ file.name }}</h1>
          <rf-row *cdkVirtualFor="let row of rows$ | async; templateCacheSize: 0" class="block h-[24px]" [content]="row"></rf-row>
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
  private parserWorker = new Worker(new URL('./parser.worker', import.meta.url));
  private isLoading = false;
  private chunkSizeInBytes = TWO_KB;

  file: File = this.route.snapshot.data['file'];

  rows$ = new BehaviorSubject<string[]>([]);

  constructor() {
    this.parserWorker.onmessage = ({ data: { rows, status } }) => {
      if (status === 'error') {
        this.router.navigate(['/']);
        return;
      }

      this.rows$.next(rows);
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
