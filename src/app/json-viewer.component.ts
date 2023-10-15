import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rf-json-viewer',
  standalone: true,
  imports: [CommonModule],
  template: ` <div></div> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonViewerComponent {}
