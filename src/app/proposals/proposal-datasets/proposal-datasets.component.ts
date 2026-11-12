import { Direction } from "@angular/cdk/bidi";
import { DatePipe, SlicePipe } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { PartialOutputDatasetDto } from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  lastValueFrom,
  map,
  Subscription,
  take,
} from "rxjs";
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
import {
  selectColumnsWithHasFetchedSettings,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";
import { EventsService } from "shared/events.service";

// what the table shows: the page, the page size and the sort, as the url says
interface TableQuery {
  pageIndex: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

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
  // what the table shows now, as the url says
  private tableQuery: TableQuery;

  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  proposalDatasets$ = this.store.select(selectViewProposalPageViewModel);
  latestUpdatedId$ = this.eventsService.latestUpdatedId$;

  subscriptions: Subscription[] = [];
  @Input() proposalId: string;

  appConfig = this.appConfigService.getConfig();
  selectColumnsWithFetchedSettings$ = this.store.select(
    selectColumnsWithHasFetchedSettings,
  );

  realTimeEnabled = false;

  tableName = "proposalDatasetsTable";

  columns: TableField<any>[];

  direction: Direction = "ltr";

  showReloadData = true;

  rowHeight = 50;

  pending = true;

  setting: ITableSetting = {};

  // the sort of the url, shown by the table header
  tableSort: ITableSetting["tableSort"];

  paginationMode: TablePaginationMode = "server-side";

  showNoData = true;

  dataSource: BehaviorSubject<PartialOutputDatasetDto[]> = new BehaviorSubject<
    PartialOutputDatasetDto[]
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
    private eventsService: EventsService,
  ) {
    this.tableQuery = this.toTableQuery({});
  }

  // no (or an invalid) value in the url means the default one
  private toTableQuery(params: Params): TableQuery {
    const pageIndex = Number(params.pageIndex);
    const pageSize = Number(params.pageSize);
    const hasSort =
      !!params.sortColumn &&
      (params.sortDirection === "asc" || params.sortDirection === "desc");

    const sortDirection: "asc" | "desc" = hasSort
      ? params.sortDirection
      : "desc";

    return {
      pageIndex: Number.isInteger(pageIndex) && pageIndex >= 0 ? pageIndex : 0,
      pageSize:
        Number.isInteger(pageSize) && pageSize > 0
          ? pageSize
          : this.defaultPageSize,
      sortColumn: hasSort ? params.sortColumn : "creationTime",
      sortDirection,
    };
  }

  // fetches what the table shows, in the order it is sorted in
  private fetchDatasets() {
    const { pageIndex, pageSize, sortColumn, sortDirection } = this.tableQuery;
    this.pending = true;
    this.store.dispatch(
      fetchProposalDatasetsAction({
        proposalId: this.proposalId,
        skip: pageIndex * pageSize,
        limit: pageSize,
        sortColumn,
        sortDirection,
      }),
    );
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.eventsService.message$
        .pipe(
          filter((payload) => {
            return payload.type === "Dataset.created";
          }),
        )
        .subscribe((payload: Record<string, any>) => {
          if (!payload.data.proposalIds.includes(this.proposalId)) return;
          this.fetchDatasets();
        }),
    );

    // the url is the only state of the table, sorting and paging only change it
    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          map((params) => this.toTableQuery(params)),
          distinctUntilChanged(
            (a, b) =>
              a.pageIndex === b.pageIndex &&
              a.pageSize === b.pageSize &&
              a.sortColumn === b.sortColumn &&
              a.sortDirection === b.sortDirection,
          ),
        )
        .subscribe((query) => {
          this.tableQuery = query;
          this.tableSort = {
            sortColumn: query.sortColumn,
            sortDirection: query.sortDirection,
          };
          // the table reads it when it is created, before the settings are there
          this.setting = { ...this.setting, tableSort: this.tableSort };
          this.fetchDatasets();
        }),
    );

    this.subscriptions.push(
      this.proposalDatasets$.subscribe(async (data) => {
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
            this.tableSort,
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
      }),
    );
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

  onRealTimeToggle(enabled: boolean) {
    this.realTimeEnabled = enabled;
    if (enabled) {
      this.eventsService.connect();
      this.fetchDatasets();
    } else {
      this.eventsService.disconnect();
    }
  }

  formatTableData(datasets: PartialOutputDatasetDto[]): TableData[] {
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
    this.router.navigate([], {
      queryParams: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      queryParamsHandling: "merge",
    });
  }

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: sortColumn, direction: sortDirection } = sender as Sort;
      this.router.navigate([], {
        queryParams: {
          pageIndex: 0,
          sortColumn: sortDirection ? sortColumn : undefined,
          sortDirection: sortDirection || undefined,
        },
        queryParamsHandling: "merge",
      });
    }
  }

  onRowClick(event: IRowEvent<PartialOutputDatasetDto>) {
    if (event.event === RowEventType.RowClick) {
      const pid = encodeURIComponent(event.sender.row.pid);
      this.router.navigateByUrl("/datasets/" + pid);
    }
  }

  ngOnDestroy() {
    this.eventsService.disconnect();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
