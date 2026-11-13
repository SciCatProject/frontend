import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Sort } from "@angular/material/sort";
import { OutputJobV3Dto } from "@scicatproject/scicat-sdk-ts-angular";
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
  ITableEvent,
  RowEventType,
  TableEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { TableConfigService } from "shared/services/table-config.service";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import {
  changePageAction,
  fetchJobsAction,
  setTextFilterAction,
  sortByColumnAction,
} from "state-management/actions/jobs.actions";
import { selectJobsDashboardPageViewModel } from "state-management/selectors/jobs.selectors";

type JobRow = OutputJobV3Dto & { jobId: string };

@Component({
  selector: "app-jobs-dashboard",
  templateUrl: "./jobs-dashboard.component.html",
  styleUrls: ["./jobs-dashboard.component.scss"],
  standalone: false,
})
export class JobsDashboardComponent implements OnInit, OnDestroy {
  public vm$ = this.store.select(selectJobsDashboardPageViewModel);

  columns: TableField<any>[] = [];
  setting: ITableSetting = {};

  tableName = "jobsTable";
  rowSelectionMode: TableSelectionMode = "none";
  paginationMode: TablePaginationMode = "server-side";
  pending = true;
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
    pageSize: 25,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 100],
    length: 0,
  };

  dataSource: BehaviorSubject<JobRow[]> = new BehaviorSubject<JobRow[]>([]);

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private tableConfigService: TableConfigService,
  ) {}

  ngOnInit() {
    // Table settings and the page limit come from the user settings,
    // so wait for them before configuring the table and fetching jobs.
    this.subscriptions.push(
      this.vm$
        .pipe(
          filter((vm) => vm.hasFetchedSettings),
          take(1),
        )
        .subscribe((vm) => {
          const { sortField, text } = vm.filters;
          const [sortColumn, sortDirection] = sortField
            ? sortField.split(":")
            : [];

          const tableSettingsConfig =
            this.tableConfigService.getTableSettingsConfig(
              this.tableName,
              this.tableDefaultSettingsConfig,
              vm.tableSettings?.columns || [],
              sortColumn
                ? {
                    sortColumn: sortColumn === "id" ? "jobId" : sortColumn,
                    sortDirection: sortDirection as "asc" | "desc",
                  }
                : null,
            );

          this.columns =
            tableSettingsConfig.settingList.find((s) => s.isCurrentSetting)
              ?.columnSetting ?? [];
          this.setting = tableSettingsConfig;
          this.globalTextSearch = text || "";

          this.store.dispatch(fetchJobsAction());
        }),
    );

    this.subscriptions.push(
      this.vm$.subscribe(({ jobs, count, filters, isLoading }) => {
        this.dataSource.next(jobs.map((job) => ({ ...job, jobId: job.id })));
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
  }

  onRowEvent(event: IRowEvent<JobRow>) {
    if (event?.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.jobId);
      this.router.navigateByUrl("/user/jobs/" + id);
    }
  }

  onPaginationChange({ pageIndex, pageSize }: TablePagination) {
    this.store.dispatch(changePageAction({ page: pageIndex, limit: pageSize }));
  }

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active, direction } = sender as Sort;
      // jobId is only a display alias for the backend "id" field
      const column = active === "jobId" ? "id" : active;

      this.store.dispatch(
        sortByColumnAction({
          column: direction ? column : "",
          direction,
        }),
      );
    }
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

  onGlobalTextSearchChange(text: string) {
    this.globalTextSearch = text;
  }

  onGlobalTextSearchAction() {
    this.store.dispatch(setTextFilterAction({ text: this.globalTextSearch }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
