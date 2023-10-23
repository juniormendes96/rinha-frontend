import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'rf-app',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="h-full w-full">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
