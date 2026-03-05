import { Direction } from "@angular/cdk/bidi";
import { DatePipe, SlicePipe } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
import { BehaviorSubject, lastValueFrom, Subscription, take } from "rxjs";
import { PrintConfig } from "shared/modules/dynamic-material-table/models/print-config.model";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  ITableEvent,
  RowEventType,
  TableEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { ITableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableColumn } from "state-management/models";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { DatasetsListService } from "shared/services/datasets-list.service";
import { TableConfigService } from "shared/services/table-config.service";
import { fetchProposalDatasetsAction } from "state-management/actions/proposals.actions";
import { selectViewProposalPageViewModel } from "state-management/selectors/proposals.selectors";
import { selectColumnsWithHasFetchedSettings } from "state-management/selectors/user.selectors";

export interface TableData {
  pid: string;
  name: string;
  sourceFolder: string;
  size: string;
  creationTime: string | null;
  owner: string;
  location: string;
}

@Component({
  selector: "app-proposal-datasets",
  templateUrl: "./proposal-datasets.component.html",
  styleUrls: ["./proposal-datasets.component.scss"],
  standalone: false,
})
export class ProposalDatasetsComponent implements OnInit, OnDestroy {
  proposalDatasets$ = this.store.select(selectViewProposalPageViewModel);

  subscription: Subscription;
  @Input() proposalId: string;

  appConfig = this.appConfigService.getConfig();
  selectColumnsWithFetchedSettings$ = this.store.select(
    selectColumnsWithHasFetchedSettings,
  );

  tableName = "proposalDatasetsTable";

  columns: TableField<any>[];

  direction: Direction = "ltr";

  showReloadData = true;

  rowHeight = 50;

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  showNoData = true;

  //dataSource: BehaviorSubject<TableData[]> = new BehaviorSubject<TableData[]>(
  //  [],
  //);
  dataSource: BehaviorSubject<OutputDatasetObsoleteDto[]> = new BehaviorSubject<
    OutputDatasetObsoleteDto[]
  >([]);

  pagination: TablePagination = {};

  stickyHeader = true;

  printConfig: PrintConfig = {};

  showProgress = true;

  rowSelectionMode: TableSelectionMode = "none";

  defaultPageSize = 10;

  tablesSettings: object;

  showGlobalTextSearch = false;

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    saveSettingMode: "none",
    settingList: [
      {
        visibleActionMenu: actionMenu,
        saveSettingMode: "none",
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  localization = "dataset";

  constructor(
    public appConfigService: AppConfigService,
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private slicePipe: SlicePipe,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private tableConfigService: TableConfigService,
    private datasetsListService: DatasetsListService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      fetchProposalDatasetsAction({
        proposalId: this.proposalId,
        skip: 0,
        limit: this.defaultPageSize,
      }),
    );

    this.subscription = this.proposalDatasets$.subscribe(async (data) => {
      console.log("ngOnInit data", data);
      //this.dataSource.next(this.formatTableData(data.datasets));
      this.dataSource.next(data.datasets);
      this.pending = false;

      const defaultTableColumns = await lastValueFrom(
        this.selectColumnsWithFetchedSettings$.pipe(take(1)),
      );

      const defaultConfigColumns =
        this.appConfig?.defaultDatasetsListSettings?.columns;

      const userTableConfigColumns =
        this.datasetsListService.convertSavedDatasetColumns(
          defaultTableColumns.columns,
        );

      this.tableDefaultSettingsConfig.settingList[0].columnSetting =
        this.datasetsListService.convertSavedDatasetColumns(
          defaultConfigColumns as TableColumn[],
        );

      const tableSettingsConfig =
        this.tableConfigService.getTableSettingsConfig(
          this.tableName,
          this.tableDefaultSettingsConfig,
          userTableConfigColumns,
        );
      const paginationConfig = {
        pageSizeOptions: [5, 10, 25, 100],
        pageIndex: data.currentPage || 0,
        pageSize: data.datasetsPerPage || this.defaultPageSize,
        length: data.datasetCount,
      };

      if (tableSettingsConfig?.settingList.length) {
        this.initTable(tableSettingsConfig, paginationConfig);
      }
    });
  }

  initTable(
    settingConfig: ITableSetting,
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
      tableData = datasets.map((dataset) => ({
        pid: dataset.pid,
        name: dataset.datasetName,
        sourceFolder:
          "..." + this.slicePipe.transform(dataset.sourceFolder, -14),
        size: this.filesizePipe.transform(dataset.size),
        creationTime: this.datePipe.transform(dataset.creationTime),
        owner: dataset.owner,
        location: dataset.creationLocation,
      }));
    }
    return tableData;
  }

  onPaginationChange(pagination: TablePagination) {
    this.pending = true;
    const queryParams: Record<string, string | number> = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    };
    const { sortColumn, sortDirection } = this.route.snapshot.queryParams;

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: "merge",
    });

    this.store.dispatch(
      fetchProposalDatasetsAction({
        proposalId: this.proposalId,
        limit: pagination.pageSize,
        skip: pagination.pageIndex * pagination.pageSize,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
      }),
    );
  }

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: sortColumn, direction: sortDirection } = sender as Sort;
      this.pending = true;
      this.router.navigate([], {
        queryParams: {
          pageIndex: 0,
          sortDirection: sortDirection || undefined,
          sortColumn: sortDirection ? sortColumn : undefined,
        },
        queryParamsHandling: "merge",
      });

      const queryParams = this.route.snapshot.queryParams;

      this.store.dispatch(
        fetchProposalDatasetsAction({
          proposalId: this.proposalId,
          limit: queryParams.pageSize || this.defaultPageSize,
          skip:
            queryParams.pageIndex *
            (queryParams.pageSize || this.defaultPageSize),
          sortColumn: sortColumn,
          sortDirection: sortDirection,
        }),
      );
    }
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
