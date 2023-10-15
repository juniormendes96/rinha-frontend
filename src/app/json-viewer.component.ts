import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface JsonViewerState {
  fileName: string;
  jsonContent: object;
}

@Component({
  selector: 'rf-json-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="m-auto w-full max-w-5xl">
      <h1 class="text-3xl font-bold mb-3">{{ state.fileName }}</h1>
      <pre>{{ state.jsonContent | json }}</pre>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonViewerComponent {
  private router = inject(Router);

  state = this.getState();

  private getState(): JsonViewerState {
    const state = this.router.getCurrentNavigation()?.extras.state;

    if (state) {
      return state as JsonViewerState;
    }
    return { fileName: 'No file selected', jsonContent: {} };
  }
}
