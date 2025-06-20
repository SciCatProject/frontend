import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { SampleClass } from "@scicatproject/scicat-sdk-ts-angular";
import {
  changePageAction,
  fetchSamplesAction,
  sortByColumnAction,
  setTextFilterAction,
  prefillFiltersAction,
  fetchMetadataKeysAction,
  addCharacteristicsFilterAction,
  removeCharacteristicsFilterAction,
} from "state-management/actions/samples.actions";
import { BehaviorSubject, combineLatest, Subscription } from "rxjs";
import { selectSampleDashboardPageViewModel } from "state-management/selectors/samples.selectors";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { SampleDialogComponent } from "samples/sample-dialog/sample-dialog.component";

import deepEqual from "deep-equal";
import { filter, map, distinctUntilChanged, take } from "rxjs/operators";
import { SampleFilters } from "state-management/models";
import { SearchParametersDialogComponent } from "shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AppConfigService } from "app-config.service";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  ITableSetting,
  TableSettingEventType,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
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
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { Sort } from "@angular/material/sort";
import { TableConfigService } from "shared/services/table-config.service";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";

@Component({
  selector: "sample-dashboard",
  templateUrl: "./sample-dashboard.component.html",
  styleUrls: ["./sample-dashboard.component.scss"],
  standalone: false,
})
export class SampleDashboardComponent implements OnInit, OnDestroy {
  vm$ = this.store.select(selectSampleDashboardPageViewModel);

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [
          {
            name: "sampleId",
            icon: "fingerprint",
            header: "Sample ID",
          },
          {
            name: "description",
            icon: "description",
          },
          {
            name: "owner",
            icon: "face",
          },
          {
            name: "createdAt",
            header: "Creation time",
            icon: "date_range",
            customRender: (column, row) => {
              return this.datePipe.transform(row[column.name]);
            },
          },
          {
            name: "ownerGroup",
            header: "Owner group",
            icon: "group",
          },
        ],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  subscriptions: Subscription[] = [];

  appConfig = this.appConfigService.getConfig();

  metadataKeys: string[] = [];

  dialogConfig: MatDialogConfig = new MatDialogConfig();

  name = "";

  description = "";

  tableName = "samplesTable";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  dataSource: BehaviorSubject<SampleClass[]> = new BehaviorSubject<
    SampleClass[]
  >([]);

  pagination: TablePagination = {};

  rowSelectionMode: TableSelectionMode = "none";

  showGlobalTextSearch = false;

  defaultPageSize = 10;

  defaultPageSizeOptions = [5, 10, 25, 100];

  tablesSettings: object;

  constructor(
    private appConfigService: AppConfigService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private tableConfigService: TableConfigService,
  ) {}

  ngOnInit() {
    this.store.dispatch(fetchMetadataKeysAction());

    this.subscriptions.push(
      this.vm$.subscribe(({ samples, tableSettings, count }) => {
        this.tablesSettings = tableSettings;
        this.dataSource.next(samples);
        this.pending = false;

        const savedTableConfigColumns =
          tableSettings?.[this.tableName]?.columns;
        const tableSort = this.getTableSort();
        const paginationConfig = this.getTablePaginationConfig(count);

        const tableSettingsConfig =
          this.tableConfigService.getTableSettingsConfig(
            this.tableName,
            this.tableDefaultSettingsConfig,
            savedTableConfigColumns,
            tableSort,
          );

        if (tableSettingsConfig?.settingList.length) {
          this.initTable(tableSettingsConfig, paginationConfig);
        }
      }),
    );

    this.subscriptions.push(
      combineLatest([
        this.vm$.pipe(map((vm) => vm.filters)),
        this.vm$.pipe(filter((vm) => vm.hasPrefilledFilters)),
      ])
        .pipe(
          map(([filters, _]) => filters),
          distinctUntilChanged(deepEqual),
        )
        .subscribe((filters) => {
          this.store.dispatch(fetchSamplesAction());
          this.router.navigate(["/samples"], {
            // NOTE: Because of the "characteristic" object we need to additionally wrap the filters using args property and stringify it.
            queryParams: { args: JSON.stringify(filters) },
          });
        }),
    );

    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        this.metadataKeys = vm.metadataKeys;
      }),
    );

    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          map((params) => params.args),
          take(1),
          map((args) => (args ? (JSON.parse(args) as SampleFilters) : {})),
        )
        .subscribe((filters) =>
          this.store.dispatch(prefillFiltersAction({ values: filters })),
        ),
    );
  }

  formatTableData(samples: SampleClass[]): any {
    if (samples) {
      return samples.map((sample) => ({
        sampleId: sample.sampleId,
        owner: sample.owner,
        createdAt: this.datePipe.transform(sample.createdAt),
        description: sample.description,
        ownerGroup: sample.ownerGroup,
      }));
    }
  }

  openDialog() {
    this.dialog.open(SampleDialogComponent, {
      width: "250px",
      data: { name: this.name, description: this.description },
    });
  }

  onTextSearchChange(query: string) {
    if (typeof query === "string") {
      this.store.dispatch(setTextFilterAction({ text: query }));
    }
  }

  openSearchParametersDialog() {
    this.dialog
      .open(SearchParametersDialogComponent, {
        data: { parameterKeys: this.metadataKeys },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const { data } = res;
          this.store.dispatch(
            addCharacteristicsFilterAction({ characteristic: data }),
          );
        }
      });
  }

  removeCharacteristic(index: number) {
    this.store.dispatch(removeCharacteristicsFilterAction({ index }));
  }

  getTableSort(): ITableSetting["tableSort"] {
    const { queryParams } = this.route.snapshot;

    if (!queryParams.args) {
      return null;
    }

    const queryArgsParsed = JSON.parse(queryParams.args);

    if (queryArgsParsed.sortField) {
      const [sortColumn, sortDirection] = queryArgsParsed.sortField.split(":");
      return {
        sortColumn,
        sortDirection,
      };
    }

    return null;
  }

  getTablePaginationConfig(dataCount = 0): TablePagination {
    const { queryParams } = this.route.snapshot;

    if (!queryParams.args) {
      return null;
    }

    const queryArgsParsed = JSON.parse(queryParams.args);

    return {
      pageSizeOptions: this.defaultPageSizeOptions,
      pageIndex: queryArgsParsed.skip / queryArgsParsed.limit,
      pageSize: queryArgsParsed.limit || this.defaultPageSize,
      length: dataCount,
    };
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

  onPaginationChange({ pageIndex, pageSize }: TablePagination) {
    this.store.dispatch(changePageAction({ page: pageIndex, limit: pageSize }));
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const columnsSetting = setting.columnSetting.map((column) => {
      const { name, display, index, width } = column;

      return { name, display, index, width };
    });

    const tablesSettings = {
      ...this.tablesSettings,
      [setting.settingName || this.tableName]: {
        columns: columnsSetting,
      },
    };

    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          tablesSettings,
        },
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

  onRowClick(event: IRowEvent<SampleClass>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.sampleId);
      this.router.navigateByUrl("/samples/" + id);
    }
  }

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: column, direction: direction } = sender as Sort;

      this.store.dispatch(
        sortByColumnAction({
          column: direction ? column : "",
          direction,
        }),
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
