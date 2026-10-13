import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { PublishedData } from "@scicatproject/scicat-sdk-ts-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { selectPublishedDataDashboardPageViewModel } from "state-management/selectors/published-data.selectors";
import { BehaviorSubject, Subscription, filter, take } from "rxjs";
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
import {
  IRowEvent,
  RowEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { TableConfigService } from "shared/services/table-config.service";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import {
  changePageAction,
  setTextFilterAction,
} from "state-management/actions/published-data.actions";

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
  rowSelectionMode: TableSelectionMode = "none";
  paginationMode: TablePaginationMode = "server-side";
  pending = true;
  globalTextSearch = "";

  defaultPageSize = 5;

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
    pageSize: this.defaultPageSize,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 100],
    length: 0,
  };

  dataSource: BehaviorSubject<PublishedData[]> = new BehaviorSubject<
    PublishedData[]
  >([]);

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private tableConfigService: TableConfigService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.vm$
        .pipe(
          filter((vm) => vm.hasFetchedSettings),
          take(1),
        )
        .subscribe((vm) => {
          const tableSettingsConfig =
            this.tableConfigService.getTableSettingsConfig(
              this.tableName,
              this.tableDefaultSettingsConfig,
              vm.tablesSettings?.columns || [],
            );

          this.columns =
            tableSettingsConfig.settingList.find((s) => s.isCurrentSetting)
              ?.columnSetting ?? [];
          this.setting = tableSettingsConfig;
        }),
    );

    this.subscriptions.push(
      this.vm$.subscribe(({ publishedData, count, filters, isLoading }) => {
        this.dataSource.next(publishedData);
        this.pending = false;
        this.pagination = {
          ...this.pagination,
          pageIndex: filters.skip / filters.limit,
          pageSize: filters.limit,
          length: count,
          isLoading,
        };
      }),
    );

    // The URL is the source of truth for paging and text search
    this.subscriptions.push(
      this.route.queryParams.subscribe((queryParams) => {
        const pageIndex = +queryParams.pageIndex || 0;
        const pageSize = +queryParams.pageSize || this.defaultPageSize;
        const text = queryParams.textSearch || "";

        this.globalTextSearch = text;
        this.store.dispatch(setTextFilterAction({ text }));
        this.store.dispatch(
          changePageAction({ page: pageIndex, limit: pageSize }),
        );
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
