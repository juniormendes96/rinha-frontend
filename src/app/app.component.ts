import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rf-app',
  standalone: true,
  imports: [CommonModule],
  template: `<p>app works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
