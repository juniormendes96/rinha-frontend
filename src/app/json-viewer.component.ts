import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NodeComponent, NodeContent } from './node.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject } from 'rxjs';

export interface JsonViewerState {
  file?: File;
}

const TWO_KB = 1024 * 2;

@Component({
  selector: 'rf-json-viewer',
  standalone: true,
  imports: [CommonModule, NodeComponent, InfiniteScrollModule],
  template: `
    <div
      class="m-auto w-full max-w-5xl"
      infinite-scroll
      [infiniteScrollDistance]="1"
      [infiniteScrollThrottle]="300"
      (scrolled)="loadNextChunk()"
    >
      <h1 class="text-3xl font-bold mb-3">{{ file.name }}</h1>
      <rf-node *ngFor="let entry of entries$ | async" [key]="entry[0]" [content]="entry[1]" [parentContent]="parentContent"></rf-node>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonViewerComponent implements OnInit {
  private route = inject(ActivatedRoute);

  private worker = new Worker(new URL('./json-loader.worker', import.meta.url));

  private isLoading = false;

  private chunkSizeInBytes = TWO_KB;

  file: File = this.route.snapshot.data['file'];

  parentContent: NodeContent = null;

  entries$ = new BehaviorSubject<[string, NodeContent][]>([]);

  constructor() {
    this.worker.onmessage = ({ data }) => {
      const entries = Object.entries<NodeContent>(data);
      this.entries$.next(entries);
      this.parentContent = data;
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

    this.worker.postMessage({ file: this.file, chunkSizeInBytes: this.chunkSizeInBytes });
  }
}
