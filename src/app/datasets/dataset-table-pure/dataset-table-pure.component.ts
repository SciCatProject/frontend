import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Dataset } from 'state-management/models';

import * as filesize from 'filesize';
import { DatePipe } from '@angular/common';
import { MatCheckboxChange } from '@angular/material';

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
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

  private displayedColumns: string[] = [
    'select',
    'pid',
    'sourceFolder',
    'size',
    'creationTime',
    'type',
    'proposalId',
  ];

  private getFormattedSize(size) {
    return size ? filesize(size) : 'n/a';
  }

  private getRowClass(dataset) {
    if (this.rowClassifier) {
      const cls = this.rowClassifier(dataset);
      return {[cls]: true};
    } else {
      return {};
    }
  }

  private isChecked(dataset) {
    return !! this.selectedSets.find(selectedSet => selectedSet.pid === dataset.pid);
  }

  private allAreSelected() {
    return this.selectedSets.length === this.datasets.length;
  }

  private handleClick(dataset) {
    this.onClick.emit(dataset);
  }

  private handleSelect(event: MatCheckboxChange, dataset: Dataset) {
    if (event.checked) {
      this.onSelect.emit(dataset);
    } else {
      this.onDeselect.emit(dataset);
    }
  }

  private handleSelectAll(event: MatCheckboxChange) {
    this.datasets.forEach(dataset => this.handleSelect(event, dataset));
  }

  private handlePageChange(event: PageChangeEvent) {
    this.onPageChange.emit(event);
  }

  /*
  calculateRowClasses(row) {
    if (row.datasetlifecycle && this.mode === 'archive'
      && (this.archiveable.indexOf(row.datasetlifecycle.archiveStatusMessage) !== -1) && row.size !== 0) {
      return {
        'row-archiveable': true
      };
    } else if (row.datasetlifecycle && this.mode === 'retrieve'
      && this.retrievable.indexOf(row.datasetlifecycle.archiveStatusMessage) !== -1 && row.size !== 0) {
      return {
        'row-retrievable': true
      };
    } else if (row.size === 0) {
      return {
        'row-empty': true
      };
    } else {
      return {
        'row-generic': true
      };
    }
  }
  */

  /*

  get (row, field) value:

  if (field === 'datasetlifecycle.archiveStatusMessage') {
    const val = row.datasetlifecycle ? row.datasetlifecycle.archiveStatusMessage : '';
    return config.datasetStatusMessages[val] || val;
  }

  if (field === 'datasetlifecycle.retrieveStatusMessage') {
    const val = row.datasetlifecycle ? row.datasetlifecycle.retrieveStatusMessage : '';
    return config.datasetStatusMessages[val] || val;
  }
  return value;
  */
}
