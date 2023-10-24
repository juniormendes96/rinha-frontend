import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rf-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <li class="flex">
      <span *ngFor="let tab of tabs" class="w-4 shadow-[1px_0_0_0_#d1d5db_inset]"></span>
      <span class="whitespace-nowrap" [innerHTML]="content"></span>
    </li>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent implements OnInit {
  @Input({ required: true }) content!: string;

  tabs: number[] = [];

  ngOnInit(): void {
    const leadingWhiteSpacesCount = (this.content.match(/^ */) || [])[0]?.length ?? 0;

    if (leadingWhiteSpacesCount) {
      this.tabs = Array.from({ length: leadingWhiteSpacesCount / 3 });
    }
  }
}
