import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rf-json-viewer',
  standalone: true,
  imports: [CommonModule],
  template: ` <pre>{{ content | json }}</pre> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonViewerComponent {
  @Input({ required: true }) content!: object;
}
