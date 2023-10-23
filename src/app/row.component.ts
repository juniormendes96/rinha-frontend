import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rf-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex">
      <span
        *ngFor="let value of whiteSpaces; let first = first; let last = last"
        [ngClass]="{
          'h-full border-solid border-gray-300 invisible': true,
          'border-l': first,
          'border-r': !first,
          '!visible': first || (value % 3 === 0 && !last)
        }"
      >
        &nbsp;
      </span>
      <span class="whitespace-nowrap" [innerHTML]="content"></span>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent implements OnInit {
  @Input({ required: true }) content!: string;

  whiteSpaces: number[] = [];

  ngOnInit(): void {
    const leadingWhiteSpacesCount = (this.content.match(/^ */) || [])[0]?.length ?? 0;
    this.whiteSpaces = Array.from({ length: leadingWhiteSpacesCount }, (_, i) => i + 1);
  }
}
