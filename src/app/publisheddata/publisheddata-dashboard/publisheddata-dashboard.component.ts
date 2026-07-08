import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { PublishedData } from "@scicatproject/scicat-sdk-ts-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { selectPublishedDataDashboardPageViewModel } from "state-management/selectors/published-data.selectors";
import { BehaviorSubject, Subscription, take } from "rxjs";
import { AppConfigService } from "app-config.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { ExportExcelService } from "shared/services/export-excel.service";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  ITableSetting,
  TableSettingEventType,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { SciCatDataSource } from "shared/services/scicat.datasource";
import {
  IRowEvent,
  RowEventType,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { TableConfigService } from "shared/services/table-config.service";
import { updateUserSettingsAction } from "state-management/actions/user.actions";

@Component({
  selector: "app-publisheddata-dashboard",
  templateUrl: "./publisheddata-dashboard.component.html",
  styleUrls: ["./publisheddata-dashboard.component.scss"],
  standalone: false,
})
export class PublisheddataDashboardComponent implements OnInit, OnDestroy {
  public vm$ = this.store.select(selectPublishedDataDashboardPageViewModel);

  columns: TableField<any>[] = [];
  setting: ITableSetting = {};

  tableName = "publishedDataTable";
  rowSelectionMode: "single" | "multi" | "none" = "none";
  paginationMode: TablePaginationMode = "server-side";
  pending = false;
  globalTextSearch = "";

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [
          { name: "doi", header: "DOI", index: 0 },
          { name: "title", header: "Title", index: 1 },
          { name: "creator", header: "Creator", index: 2 },
          { name: "status", header: "Status", index: 3 },
          { name: "createdBy", header: "Created by", index: 4 },
          { name: "createdAt", header: "Created at", index: 5 },
        ],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  pagination: TablePagination = {
    pageSize: 5,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 100],
    length: 0,
  };

  tableDefinition = {
    collection: "publishedData",
    columns: this.columns,
    apiVersion: "v4",
  };

  dataSource: BehaviorSubject<PublishedData[]> = new BehaviorSubject<
    PublishedData[]
  >([]);
  scicatDataSource: SciCatDataSource;

  subscriptions: Subscription[] = [];
  currentFilters: any = {};

  constructor(
    private router: Router,
    private store: Store,
    private appConfigService: AppConfigService,
    private dataService: ScicatDataService,
    private exportService: ExportExcelService,
    private tableConfigService: TableConfigService,
    private route: ActivatedRoute,
  ) {
    this.scicatDataSource = new SciCatDataSource(
      this.appConfigService,
      this.dataService,
      this.exportService,
      this.tableDefinition,
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.vm$.pipe(take(1)).subscribe((vm) => {
        this.currentFilters = vm.filters;

        const tableSettingsConfig =
          this.tableConfigService.getTableSettingsConfig(
            this.tableName,
            this.tableDefaultSettingsConfig,
            vm.tablesSettings?.columns || [],
          );

        const currentColumnSetting = tableSettingsConfig.settingList.find(
          (s) => s.isCurrentSetting,
        )?.columnSetting;

        this.columns = currentColumnSetting;
        this.setting = tableSettingsConfig;

        this.pagination = {
          ...this.pagination,
          length: vm.count,
        };
      }),
    );

    this.subscriptions.push(
      this.scicatDataSource.loading$.subscribe((loading) => {
        this.pagination = { ...this.pagination, isLoading: loading };
      }),
    );

    this.subscriptions.push(
      this.route.queryParams.subscribe((queryParams) => {
        const pageIndex = +queryParams.pageIndex || 0;
        const pageSize = +queryParams.pageSize || this.pagination.pageSize;
        const globalSearch = queryParams.textSearch || undefined;

        const filters = {
          ...this.currentFilters,
          skip: pageIndex * pageSize,
          limit: pageSize,
          globalSearch,
        };
        this.currentFilters = filters;
        this.globalTextSearch = globalSearch || "";
        this.pagination = { ...this.pagination, pageIndex, pageSize };

        this.loadData(filters, pageIndex, pageSize);
      }),
    );

    this.subscriptions.push(
      this.scicatDataSource.connect().subscribe((data) => {
        this.dataSource.next(data);
      }),
    );

    this.subscriptions.push(
      this.scicatDataSource.count$.subscribe((count) => {
        this.pagination = { ...this.pagination, length: count };
      }),
    );
  }

  onRowEvent(event: IRowEvent<PublishedData>) {
    if (event?.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.doi);
      this.router.navigateByUrl("/publishedDatasets/" + id);
    }
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

  saveTableSettings(setting: ITableSetting) {
    const columnsSetting = setting.columnSetting.map((column, index) => {
      const { name, display, width } = column;

      return { name, display, order: index, width };
    });

    this.store.dispatch(
      updateUserSettingsAction({
        property: { fe_publisheddata_table_columns: columnsSetting },
      }),
    );
  }

  onSettingChange(event: {
    type: TableSettingEventType;
    setting: ITableSetting;
  }) {
    if (
      event.type === TableSettingEventType.save ||
      event.type === TableSettingEventType.create
    ) {
      this.saveTableSettings(event.setting);
    }
  }

  onGlobalTextSearchChange(text: string) {
    this.globalTextSearch = text;
  }

  onGlobalTextSearchAction() {
    this.router.navigate([], {
      queryParams: {
        textSearch: this.globalTextSearch || undefined,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
  }

  getSort(filters: any) {
    const sortField = filters?.sortField;
    return sortField ? sortField.split(" ") : ["", "asc"];
  }

  loadData(filters: any, pageIndex: number, pageSize: number) {
    const [field, direction] = this.getSort(filters);
    this.scicatDataSource.loadAllData(
      filters,
      field,
      direction,
      pageIndex,
      pageSize,
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
