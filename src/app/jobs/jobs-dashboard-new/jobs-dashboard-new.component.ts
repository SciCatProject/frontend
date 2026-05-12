import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { OutputJobV3Dto } from "@scicatproject/scicat-sdk-ts-angular";
import { BehaviorSubject, Subscription, take, filter } from "rxjs";
import { AppConfigService } from "app-config.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { ExportExcelService } from "shared/services/export-excel.service";
import { SciCatDataSource } from "shared/services/scicat.datasource";
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
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { TableConfigService } from "shared/services/table-config.service";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { selectJobsDashboardPageViewModel } from "state-management/selectors/jobs.selectors";

@Component({
  selector: "app-jobs-new-dashboard",
  templateUrl: "./jobs-dashboard-new.component.html",
  styleUrls: ["./jobs-dashboard-new.component.scss"],
  standalone: false,
})
export class JobsDashboardNewComponent implements OnInit, OnDestroy {
  public vm$ = this.store.select(selectJobsDashboardPageViewModel);

  columns: TableField<any>[] = [];
  setting: ITableSetting = {};

  tableName = "jobsTable";
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
          { name: "jobId", header: "ID", index: 0 },
          { name: "emailJobInitiator", header: "Initiator", index: 1 },
          { name: "type", header: "Type", index: 2 },
          {
            name: "creationTime",
            header: "Created at local time",
            index: 3,
            type: "date",
            format: "medium",
          },
          {
            name: "jobParams",
            header: "Parameters",
            index: 4,
            customRender: (_, row) => JSON.stringify(row.jobParams),
          },
          { name: "jobStatusMessage", header: "Status", index: 5 },
          {
            name: "datasetList",
            header: "Datasets",
            index: 6,
            customRender: (_, row) => JSON.stringify(row.datasetList),
          },
          {
            name: "jobResultObject",
            header: "Result",
            index: 7,
            customRender: (_, row) => JSON.stringify(row.jobResultObject),
          },
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
    collection: "Jobs",
    columns: this.columns,
  };

  dataSource: BehaviorSubject<OutputJobV3Dto[]> = new BehaviorSubject<
    OutputJobV3Dto[]
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
      this.vm$
        .pipe(
          filter((vm) => vm.hasFetchedSettings),
          take(1),
        )
        .subscribe((vm) => {
          this.currentFilters = vm.filters;
          const { skip, limit } = vm.filters;
          const pageIndex = skip / limit;

          this.loadData(vm.filters, pageIndex, limit);

          const tableSettingsConfig =
            this.tableConfigService.getTableSettingsConfig(
              this.tableName,
              this.tableDefaultSettingsConfig,
              vm.tableSettings?.columns || [],
            );

          const currentColumnSetting = tableSettingsConfig.settingList.find(
            (s) => s.isCurrentSetting,
          )?.columnSetting;

          this.columns = currentColumnSetting;
          this.setting = tableSettingsConfig;

          this.pagination = {
            ...this.pagination,
            length: vm.count,
            pageIndex,
            pageSize: limit,
          };
        }),
    );

    this.subscriptions.push(
      this.scicatDataSource.connect().subscribe((data) => {
        const mapped = data.map((job) => ({
          ...job,
          jobId: job.id,
        }));
        this.dataSource.next(mapped);
      }),
    );

    this.subscriptions.push(
      this.scicatDataSource.count$.subscribe((count) => {
        this.pagination = { ...this.pagination, length: count };
      }),
    );
  }

  onRowEvent(event: IRowEvent<OutputJobV3Dto>) {
    if (event?.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.id);
      this.router.navigateByUrl("/user/jobs/" + id);
    }
  }

  onPaginationChange(pagination: TablePagination) {
    const pageIndex = pagination.pageIndex;
    const pageSize = pagination.pageSize;
    const newFilters = {
      ...this.currentFilters,
      skip: pageIndex * pageSize,
      limit: pageSize,
    };

    this.loadData(newFilters, pageIndex, pageSize);
  }

  saveTableSettings(setting: ITableSetting) {
    const columnsSetting = setting.columnSetting.map((column, index) => {
      const { name, display, width } = column;

      return { name, display, order: index, width };
    });

    this.store.dispatch(
      updateUserSettingsAction({
        property: { fe_job_table_columns: columnsSetting },
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

  loadData(filters: any, pageIndex: number, pageSize: number) {
    const sortField = filters?.sortField;
    const [field, direction] = sortField ? sortField.split(":") : ["", "asc"];

    this.scicatDataSource.loadAllData(
      filters,
      field,
      direction,
      pageIndex,
      pageSize,
    );
  }

  onGlobalTextSearchChange(text: string) {
    this.globalTextSearch = text;
  }

  onGlobalTextSearchAction() {
    const newFilters = {
      ...this.currentFilters,
      skip: 0,
      limit: this.pagination.pageSize,
      globalSearch: this.globalTextSearch || undefined,
    };

    this.loadData(newFilters, 0, this.pagination.pageSize);
    this.currentFilters = newFilters;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
