import { Direction } from "@angular/cdk/bidi";
import { DatePipe, SlicePipe } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
import { BehaviorSubject, Subscription } from "rxjs";
import { PrintConfig } from "shared/modules/dynamic-material-table/models/print-config.model";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  RowEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { TableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  actionMenu,
  getTableSettingsConfig,
} from "shared/modules/dynamic-material-table/utilizes/default-table-config";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import {
  changeDatasetsPageAction,
  fetchProposalDatasetsAction,
} from "state-management/actions/proposals.actions";
import { selectViewProposalPageViewModel } from "state-management/selectors/proposals.selectors";

export interface TableData {
  pid: string;
  name: string;
  sourceFolder: string;
  size: string;
  creationTime: string | null;
  owner: string;
  location: string;
}

const tableDefaultSettingsConfig: TableSetting = {
  visibleActionMenu: actionMenu,
  saveSettingMode: "none",
  settingList: [
    {
      visibleActionMenu: actionMenu,
      saveSettingMode: "none",
      isDefaultSetting: true,
      isCurrentSetting: true,
      columnSetting: [
        {
          name: "name",
          header: "Name",
          icon: "portrait",
        },
        {
          name: "sourceFolder",
          icon: "explore",
          header: "Source folder",
        },
        {
          name: "size",
          icon: "save",
        },
        {
          name: "creationTime",
          header: "Creation time",
          icon: "calendar_today",
        },
        {
          name: "owner",
          icon: "face",
        },
        { name: "location", icon: "explore" },
      ],
    },
  ],
  rowStyle: {
    "border-bottom": "1px solid #d2d2d2",
  },
};

@Component({
  selector: "app-proposal-datasets",
  templateUrl: "./proposal-datasets.component.html",
  styleUrls: ["./proposal-datasets.component.scss"],
})
export class ProposalDatasetsComponent implements OnInit, OnDestroy {
  vm$ = this.store.select(selectViewProposalPageViewModel);

  subscription: Subscription;
  @Input() proposalId: string;

  tableName = "proposalDatasetsTable";

  columns: TableField<any>[];

  direction: Direction = "ltr";

  showReloadData = true;

  rowHeight = 50;

  pending = true;

  setting: TableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  showNoData = true;

  dataSource: BehaviorSubject<TableData[]> = new BehaviorSubject<TableData[]>(
    [],
  );

  pagination: TablePagination = {};

  stickyHeader = true;

  printConfig: PrintConfig = {};

  showProgress = true;

  rowSelectionMode: TableSelectionMode = "none";

  defaultPageSize = 10;

  tablesSettings: object;

  showGlobalTextSearch = false;

  constructor(
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private slicePipe: SlicePipe,
    private router: Router,
    private store: Store,
  ) {}

  ngOnInit(): void {
    // NOTE: Maybe we don't need to fetch datasets on every init here. Check this
    this.store.dispatch(
      fetchProposalDatasetsAction({ proposalId: this.proposalId }),
    );

    this.subscription = this.vm$.subscribe((data) => {
      this.dataSource.next(this.formatTableData(data.datasets));
      this.pending = false;

      const tableSettingsConfig = getTableSettingsConfig(
        this.tableName,
        tableDefaultSettingsConfig,
      );
      const pagginationConfig = {
        pageSizeOptions: [5, 10, 25, 100],
        pageIndex: data.currentPage || 0,
        pageSize: data.datasetsPerPage || this.defaultPageSize,
        length: data.datasetCount,
      };

      if (tableSettingsConfig?.settingList.length) {
        this.initTable(tableSettingsConfig, pagginationConfig);
      }
    });
  }

  initTable(
    settingConfig: TableSetting,
    paginationConfig: TablePagination,
  ): void {
    const currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    this.columns = currentColumnSetting;
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  formatTableData(datasets: OutputDatasetObsoleteDto[]): TableData[] {
    let tableData: TableData[] = [];
    if (datasets) {
      tableData = datasets.map((dataset: any) => ({
        pid: dataset.pid,
        name: dataset.datasetName,
        sourceFolder:
          "..." + this.slicePipe.transform(dataset.sourceFolder, -14),
        size: this.filesizePipe.transform(dataset.size),
        creationTime: this.datePipe.transform(
          dataset.creationTime,
          "yyyy-MM-dd HH:mm",
        ),
        owner: dataset.owner,
        location: dataset.creationLocation,
      }));
    }
    return tableData;
  }

  onPaginationChange(pagination: TablePagination) {
    this.store.dispatch(
      changeDatasetsPageAction({
        page: pagination.pageIndex,
        limit: pagination.pageSize,
      }),
    );
    this.store.dispatch(
      fetchProposalDatasetsAction({ proposalId: this.proposalId }),
    );
  }

  onRowClick(event: IRowEvent<OutputDatasetObsoleteDto>) {
    if (event.event === RowEventType.RowClick) {
      const pid = encodeURIComponent(event.sender.row.pid);
      this.router.navigateByUrl("/datasets/" + pid);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
