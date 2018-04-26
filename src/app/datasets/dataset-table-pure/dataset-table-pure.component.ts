import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCheckboxChange, MatSort } from '@angular/material';

import { Dataset } from 'state-management/models';

import * as filesize from 'filesize';

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: keyof Dataset;
  direction: 'asc' | 'desc' | '';
}

@Component({
  selector: 'dataset-table-pure',
  templateUrl: './dataset-table-pure.component.html',
  styleUrls: ['./dataset-table-pure.component.scss']
})
export class DatasetTablePureComponent {
  @Input() private datasets: Dataset[];
  @Input() private selectedSets: Dataset[];
  @Input() private totalNumber: number;
  @Input() private currentPage: number;
  @Input() private showSelect: boolean = false;
  @Input() private rowClassifier?: (dataset: Dataset) => string;

  @Output() private onClick: EventEmitter<Dataset> = new EventEmitter();
  @Output() private onSelect: EventEmitter<Dataset> = new EventEmitter();
  @Output() private onDeselect: EventEmitter<Dataset> = new EventEmitter();
  @Output() private onPageChange: EventEmitter<PageChangeEvent> = new EventEmitter();
  @Output() private onSortChange: EventEmitter<SortChangeEvent> = new EventEmitter();

  private displayedColumns: string[] = [
    'select',
    'pid',
    'sourceFolder',
    'size',
    'creationTime',
    'type',
    'proposalId',
  ];

  private getFormattedSize(size): string {
    return size ? filesize(size) : 'n/a';
  }

  private getRowClass(dataset): {[key: string]: boolean} {
    if (this.rowClassifier) {
      const cls = this.rowClassifier(dataset);
      return {[cls]: true};
    } else {
      return {};
    }
  }

  private isChecked(dataset): boolean {
    return !! this.selectedSets.find(selectedSet => selectedSet.pid === dataset.pid);
  }

  private allAreSelected(): boolean {
    return this.selectedSets.length === this.datasets.length;
  }

  private handleClick(dataset): void {
    this.onClick.emit(dataset);
  }

  private handleSelect(event: MatCheckboxChange, dataset: Dataset): void {
    if (event.checked) {
      this.onSelect.emit(dataset);
    } else {
      this.onDeselect.emit(dataset);
    }
  }

  private handleSelectAll(event: MatCheckboxChange): void {
    this.datasets.forEach(dataset => this.handleSelect(event, dataset));
  }

  private handlePageChange(event: PageChangeEvent): void {
    this.onPageChange.emit(event);
  }

  private handleSortChange(event: SortChangeEvent): void {
    this.onSortChange.emit(event);
  }
}
