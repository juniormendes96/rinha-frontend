import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NodeComponent } from './node.component';

export interface JsonViewerState {
  fileName: string;
  jsonContent: object;
}

@Component({
  selector: 'rf-json-viewer',
  standalone: true,
  imports: [CommonModule, NodeComponent],
  template: `
    <div class="m-auto w-full max-w-5xl">
      <h1 class="text-3xl font-bold mb-3">{{ state.fileName }}</h1>
      <rf-node *ngFor="let entry of entries" [key]="entry[0]" [content]="entry[1]" [parentContent]="state.jsonContent"></rf-node>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonViewerComponent {
  private router = inject(Router);

  state = this.getState();

  entries = Object.entries(this.state.jsonContent);

  private getState(): JsonViewerState {
    const state = this.router.getCurrentNavigation()?.extras.state;

    if (state) {
      return state as JsonViewerState;
    }
    return { fileName: 'No file selected', jsonContent: {} };
  }
}
