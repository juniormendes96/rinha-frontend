import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type NodeContent = object | any[] | string | number | null;

@Component({
  selector: 'rf-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <div [style.padding-left]="leftSpacing">
        <span class="text-[#4E9590]" [class.text-gray-300]="isInsideArray">{{ key }}</span>
        <span>:&nbsp;</span>
        <span class="text-[#F2CAB8] font-bold" *ngIf="contentEntries.length">
          <ng-container *ngIf="isArray">[</ng-container>
          <ng-container *ngIf="isObject">{{ '{' }}</ng-container>
        </span>
        <span *ngIf="!isArray && !isObject">{{ content | json }}</span>
      </div>
      <rf-node
        *ngFor="let entry of contentEntries"
        [key]="entry[0]"
        [content]="entry[1]"
        [level]="level + 1"
        [parentContent]="content"
      ></rf-node>
      <div *ngIf="contentEntries.length" [style.padding-left]="leftSpacing">
        <span class="text-[#F2CAB8] font-bold">
          <ng-container *ngIf="isArray">]</ng-container>
          <ng-container *ngIf="isObject">{{ '}' }}</ng-container>
        </span>
      </div>
      <span
        [style.left]="leftSpacing"
        class="absolute top-6 bottom-6 border-solid border-l border-gray-300"
        *ngIf="contentEntries.length"
      ></span>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent implements OnInit {
  @Input({ required: true }) key!: string;
  @Input({ required: true }) content!: NodeContent;
  @Input({ required: true }) parentContent!: NodeContent;
  @Input() level = 0;

  isArray = false;
  isObject = false;
  isInsideArray = false;
  leftSpacing = '';

  contentEntries: [string, NodeContent][] = [];

  ngOnInit(): void {
    this.isArray = Array.isArray(this.content);
    this.isObject = !this.isArray && typeof this.content === 'object' && this.content !== null;
    this.isInsideArray = Array.isArray(this.parentContent);
    this.contentEntries = this.isArray || this.isObject ? Object.entries(this.content as object | any[]) : [];
    this.leftSpacing = this.level * 16 + 'px';
  }
}
