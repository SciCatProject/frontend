import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Dataset } from 'state-management/models';

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
  @Input() public datasets: Dataset[] = [];
  @Input() public selectedSets: Dataset[] = [];
  @Input() public totalNumber: number = 0;
  @Input() public currentPage: number = 0;
  @Input() public datasetsPerPage: number = 30;
  @Input() public showSelect: boolean = false;
  @Input() public rowClassifier?: (dataset: Dataset) => string;
  @Input() public disabledColumns: string[] = [];

  @Output() private onClick: EventEmitter<Dataset> = new EventEmitter();
  @Output() private onSelect: EventEmitter<Dataset> = new EventEmitter();
  @Output() private onDeselect: EventEmitter<Dataset> = new EventEmitter();
  @Output() private onPageChange: EventEmitter<PageChangeEvent> = new EventEmitter();
  @Output() private onSortChange: EventEmitter<SortChangeEvent> = new EventEmitter();

  private pageSizeOptions: number[] = [30, 1000];
  private displayedColumns: string[] = [
    'select',
    'pid',
    'sourceFolder',
    'size',
    'creationTime',
    'type',
    'proposalId',
    'ownerGroup',
    'archiveStatus',
    'retrieveStatus'
  ];

  private getDisplayedColumns(): string[] {
    return this.displayedColumns.filter(column => this.disabledColumns.indexOf(column) === -1);
  }

  private getArchiveStatus(dataset: Dataset) {
    const lc = dataset.datasetlifecycle;
    return lc ? lc.archiveStatusMessage : '';
  }

  private getRetrieveStatus(dataset: Dataset) {
    const lc = dataset.datasetlifecycle;
    return lc ? lc.retrieveStatusMessage : '';
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
    return this.datasets.length > 0 && this.selectedSets.length === this.datasets.length;
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
