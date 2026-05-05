import { DatePipe } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import {
  DatasetClass,
  OutputDatasetObsoleteDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import {
  changeRelatedDatasetsPageAction,
  fetchRelatedDatasetsAction,
} from "state-management/actions/datasets.actions";
import {
  selectRelatedDatasetsCurrentPage,
  selectRelatedDatasetsPageViewModel,
  selectRelatedDatasetsPerPage,
} from "state-management/selectors/datasets.selectors";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { BehaviorSubject, Subscription } from "rxjs";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  RowEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { ITableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";

@Component({
  selector: "app-related-datasets",
  templateUrl: "./related-datasets.component.html",
  styleUrls: ["./related-datasets.component.scss"],
  standalone: false,
})
export class RelatedDatasetsComponent implements OnInit, OnDestroy {
  vm$ = this.store.select(selectRelatedDatasetsPageViewModel).pipe(
    map((vm) => ({
      ...vm,
      relatedDatasets: this.formatTableData(vm.relatedDatasets),
    })),
  );
  currentPage$ = this.store.select(selectRelatedDatasetsCurrentPage);
  datasetsPerPage$ = this.store.select(selectRelatedDatasetsPerPage);

  subscriptions: Subscription[] = [];

  tableColumns: TableField<any>[] = [
    {
      name: "name",
      header: "Name",
    },
    {
      name: "sourceFolder",
      header: "Source Folder",
    },
    {
      name: "size",
      header: "Size",
    },
    {
      name: "type",
      header: "Type",
    },
    {
      name: "creationTime",
      header: "Creation Time",
    },
    {
      name: "owner",
      header: "Owner",
    },
  ];

  setting: ITableSetting = {
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  dataSource: BehaviorSubject<OutputDatasetObsoleteDto[]> = new BehaviorSubject<
    OutputDatasetObsoleteDto[]
  >([]);

  paginationMode: TablePaginationMode = "server-side";

  pagination: TablePagination = {
    pageSizeOptions: [5, 10, 25, 50, 100],
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };

  rowSelectionMode: TableSelectionMode = "none";

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        this.dataSource.next(vm.relatedDatasets);
        this.pagination.length = vm.relatedDatasetsCount || 0;
      }),
    );

    this.subscriptions.push(
      this.datasetsPerPage$.subscribe((size) => {
        const pageSize = size || 25;
        this.pagination.pageSize = pageSize;
        if (!this.pagination.pageSizeOptions.includes(pageSize)) {
          this.pagination.pageSizeOptions = [
            ...this.pagination.pageSizeOptions,
            pageSize,
          ].sort((a, b) => a - b);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  formatTableData(
    datasets: OutputDatasetObsoleteDto[],
  ): OutputDatasetObsoleteDto[] {
    if (!datasets) {
      return [];
    }

    return datasets.map((dataset) => ({
      ...dataset,
      pid: dataset.pid,
      name: dataset.datasetName,
      sourceFolder: dataset.sourceFolder,
      size: dataset.size,
      type: dataset.type,
      creationTime: this.datePipe.transform(
        dataset.creationTime,
        "yyyy-MM-dd, hh:mm",
      ),
      owner: dataset.owner,
    }));
  }

  onPaginationChange({ pageIndex, pageSize }: TablePagination): void {
    this.store.dispatch(
      changeRelatedDatasetsPageAction({
        page: pageIndex,
        limit: pageSize,
      }),
    );
    this.store.dispatch(fetchRelatedDatasetsAction());
  }

  onRowEvent({ event, sender }: IRowEvent<OutputDatasetObsoleteDto>): void {
    if (event === RowEventType.RowClick) {
      const pid = encodeURIComponent(sender.row.pid);
      this.router.navigateByUrl("/datasets/" + pid);
    }
  }
}
