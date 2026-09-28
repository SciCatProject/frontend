import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import {
  TableColumn,
  ConditionConfig,
  ScientificCondition,
  getSettingKey,
} from "state-management/models";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  combineLatestWith,
  filter,
  map,
  Observable,
  take,
} from "rxjs";
import { Store } from "@ngrx/store";
import {
  clearSelectionAction,
  selectDatasetAction,
  deselectDatasetAction,
  selectAllDatasetsAction,
  sortByColumnAction,
  setSearchTermsAction,
  setTextFilterAction,
  fetchFacetCountsAction,
  fetchDatasetsAction,
  setPublicViewModeAction,
  addScientificConditionAction,
  removeScientificConditionAction,
  setScientificConditionsAction,
} from "state-management/actions/datasets.actions";
import { fetchInstrumentsAction } from "state-management/actions/instruments.actions";
import { updateConditionsConfigs } from "state-management/actions/user.actions";
import { AdvancedSearchDialogComponent } from "shared/modules/advanced-search-dialog/advanced-search-dialog.component";

import {
  selectDatasets,
  selectDatasetsPerPage,
  selectPage,
  selectTotalSets,
  selectMyDataCount,
  selectPublicDataCount,
  selectSelectedDatasets,
  selectDatasetsInBatch,
  selectDatasetsFacetCountsIsLoading,
  selectTextFilter,
  selectMetadataKeys,
  selectPublicViewMode,
} from "state-management/selectors/datasets.selectors";
import { AppConfigService } from "app-config.service";
import {
  selectColumnsWithHasFetchedSettings,
  selectCurrentUser,
  selectConditions,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";
import {
  OutputDatasetObsoleteDto,
  Instrument,
} from "@scicatproject/scicat-sdk-ts-angular";
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
import { ActivatedRoute } from "@angular/router";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableConfigService } from "shared/services/table-config.service";
import { selectInstruments } from "state-management/selectors/instruments.selectors";
import { DatasetsListService } from "shared/services/datasets-list.service";
import { DatasetInlineEditCellComponent } from "./dataset-inline-edit-cell.component";
import { Router } from "@angular/router";
import { DynamicMatTableComponent } from "shared/modules/dynamic-material-table/table/dynamic-mat-table.component";

export interface SortChangeEvent {
  active: string;
  direction: "asc" | "desc" | "";
}

@Component({
  selector: "dataset-table",
  templateUrl: "dataset-table.component.html",
  styleUrls: ["dataset-table.component.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DatasetTableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @ViewChild("datasetTable")
  datasetTable: DynamicMatTableComponent<OutputDatasetObsoleteDto>;

  selectionIds: string[] = [];
  appConfig = this.appConfigService.getConfig();
  currentPage$ = this.store.select(selectPage);
  datasetsPerPage$ = this.store.select(selectDatasetsPerPage);
  datasetCount$ = this.store.select(selectTotalSets);
  myDataCount$ = this.store.select(selectMyDataCount);
  publicDataCount$ = this.store.select(selectPublicDataCount);
  publicScope$ = this.store.select(selectPublicViewMode) as Observable<boolean | "">;
  loggedIn$ = this.store.select(selectIsLoggedIn);
  currentUser$ = this.store.select(selectCurrentUser);
  datasets$ = this.store.select(selectDatasets);
  selectedDatasets$ = this.store.select(selectDatasetsInBatch);
  selectedRows$ = this.store.select(selectSelectedDatasets);
  selectColumnsWithFetchedSettings$ = this.store.select(
    selectColumnsWithHasFetchedSettings,
  );
  isFacetCountsLoading$ = this.store.select(selectDatasetsFacetCountsIsLoading);
  instruments$ = this.store.select(selectInstruments);

  @Output() pageChange = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  datasets: OutputDatasetObsoleteDto[] = [];
  instruments: Instrument[] = [];
  instrumentMap: Map<string, Instrument> = new Map();

  @Output() rowClick = new EventEmitter<OutputDatasetObsoleteDto>();
  @Output() textSearch = new EventEmitter<string>();

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  tableName = "datasetsTable";

  localization = "dataset";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  dataSource: BehaviorSubject<OutputDatasetObsoleteDto[]> = new BehaviorSubject<
    OutputDatasetObsoleteDto[]
  >([]);

  pagination: TablePagination = {};

  rowSelectionMode: TableSelectionMode = "multi";

  showGlobalTextSearch = false;

  defaultPageSize = 20;

  defaultPageSizeOptions = this.appConfig.datasetPageSizeOptions;

  tablesSettings: object;

  globalTextSearch = "";

  activeAdvancedFilters$ = this.store
    .select(selectConditions("dataset"))
    .pipe(
      map((conditions) =>
        (conditions || [])
          .filter((c) => c.enabled && c.condition?.lhs)
          .map((c) => ({
            label: this.getConditionChipLabel(c),
            conditionConfig: c,
          })),
      ),
    );

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private route: ActivatedRoute,
    private tableConfigService: TableConfigService,
    private datasetsListService: DatasetsListService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  getConditionChipLabel(conditionConfig: ConditionConfig): string {
    const lhs = conditionConfig?.condition?.lhs;
    if (!lhs) return "";
    const name =
      conditionConfig.condition.human_name ||
      this.appConfig?.labelsLocalization?.dataset?.[lhs] ||
      this.formatConditionKey(lhs);

    const rhs = conditionConfig.condition.rhs;
    if (rhs !== undefined && rhs !== null && rhs !== "") {
      const unit = conditionConfig.condition.unit ? ` ${conditionConfig.condition.unit}` : "";
      if (conditionConfig.condition.relation === "RANGE" && Array.isArray(rhs)) {
        if (rhs[0] && rhs[1]) {
          return `${name}: ${rhs[0]} - ${rhs[1]}${unit}`;
        }
      }
      return `${name}: ${rhs}${unit}`;
    }
    return name;
  }

  formatConditionKey(key: string): string {
    if (!key) return "";
    const parts = key.split(".");
    const lastPart = parts[parts.length - 1];
    return lastPart
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  openAdvancedSearchDialog(filterItem?: { conditionConfig?: ConditionConfig }): void {
    const focusConditionLhs = filterItem?.conditionConfig?.condition?.lhs;
    this.subscriptions.push(
      combineLatest([
        this.store.select(selectConditions("dataset")),
        this.store.select(selectMetadataKeys),
      ])
        .pipe(take(1))
        .subscribe(([conditions, metadataKeys]) => {
          const dialogRef = this.dialog.open(AdvancedSearchDialogComponent, {
            panelClass: "advanced-search-dialog-panel",
            width: "960px",
            maxWidth: "94vw",
            data: {
              conditions: conditions || [],
              metadataKeys: metadataKeys || [],
              unitsEnabled: this.appConfig.scienceSearchUnitsEnabled,
              dialogTitle: "Advanced Search",
              conditionSettingScope: "dataset",
              focusConditionLhs,
            },
            restoreFocus: false,
          });

          dialogRef.afterClosed().subscribe((res) => {
            if (res && res.applied) {
              const updatedConditions: ConditionConfig[] = res.conditions || [];
              this.applyConditions(updatedConditions);
            }
          });
        }),
    );
  }

  applyConditions(updatedConditions: ConditionConfig[]): void {
    this.store.dispatch(
      updateConditionsConfigs({
        conditionConfigs: updatedConditions,
        scope: "dataset",
      }),
    );

    const key = getSettingKey("dataset", "conditions");
    this.store.dispatch(
      updateUserSettingsAction({
        property: { [key]: updatedConditions },
      }),
    );

    const activeScientificConditions: ScientificCondition[] = [];
    (updatedConditions || []).forEach((config) => {
      if (config.enabled && config.condition?.lhs && config.condition?.rhs !== undefined && config.condition?.rhs !== null && config.condition?.rhs !== "") {
        const condition = { ...config.condition };
        const rhsValue = condition.rhs;
        const isNumeric = typeof rhsValue === "number" || (typeof rhsValue === "string" && rhsValue.trim() !== "" && !isNaN(Number(rhsValue)));

        if (isNumeric && typeof rhsValue === "string") {
          condition.rhs = Number(rhsValue);
        }

        if (condition.relation === "EQUAL_TO") {
          condition.relation = !isNumeric
            ? "EQUAL_TO_STRING"
            : "EQUAL_TO_NUMERIC";
        }

        activeScientificConditions.push(condition);
      }
    });

    this.store.dispatch(
      setScientificConditionsAction({ scientific: activeScientificConditions }),
    );

    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }

  onRemoveAdvancedFilter(filterItem: { label: string; conditionConfig: ConditionConfig }): void {
    if (!filterItem?.conditionConfig) return;
    const targetKey = filterItem.conditionConfig.condition.lhs;

    this.subscriptions.push(
      this.store
        .select(selectConditions("dataset"))
        .pipe(take(1))
        .subscribe((conditions = []) => {
          const updated = conditions.filter((c) => c.condition.lhs !== targetKey);
          this.applyConditions(updated);
        }),
    );
  }

  onPublicScopeChange(isPublished: boolean): void {
    this.store.dispatch(setPublicViewModeAction({ isPublished }));
    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }

  clearAdvancedConditions(): void {
    this.applyConditions([]);
  }


  private decorateColumns(columns: TableField<any>[] = []): TableField<any>[] {
    return columns.map((column) => {
      if (column.type !== "editable") {
        return column;
      }

      return {
        ...column,
        dynamicCellComponent: DatasetInlineEditCellComponent,
      };
    });
  }

  getTableSort(): ITableSetting["tableSort"] {
    const { queryParams } = this.route.snapshot;

    if (queryParams.sortDirection && queryParams.sortColumn) {
      return {
        sortColumn: queryParams.sortColumn,
        sortDirection: queryParams.sortDirection,
      };
    }

    return null;
  }

  getTablePaginationConfig(dataCount = 0, isLoading = false): TablePagination {
    const { queryParams } = this.route.snapshot;

    const { skip = 0, limit = 25 } = JSON.parse(queryParams.args ?? "{}");

    return {
      pageSizeOptions: this.defaultPageSizeOptions,
      pageIndex: skip / limit || 0,
      pageSize: limit || this.defaultPageSize,
      length: dataCount,
      isLoading,
    };
  }

  initTable(
    settingConfig: ITableSetting,
    paginationConfig: TablePagination,
  ): void {
    let currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    if (!currentColumnSetting && settingConfig.settingList.length > 0) {
      currentColumnSetting = settingConfig.settingList[0].columnSetting;
    }

    this.columns = this.decorateColumns(currentColumnSetting);
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const columnsSetting = setting.columnSetting.map((column, index) => {
      const { name, header, display, width, type, format, path, tooltip } =
        column;

      return {
        name,
        header,
        enabled: !!(display === "visible"),
        order: index,
        width,
        path,
        userAdded: column.userAdded || undefined,
        type,
        format,
        tooltip,
      };
    });
    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          fe_dataset_table_columns: columnsSetting,
        },
      }),
    );

    this.pending = false;
  }

  onSettingChange(event: {
    type: TableSettingEventType;
    setting: ITableSetting;
  }) {
    if (
      event.type === TableSettingEventType.save ||
      event.type === TableSettingEventType.create ||
      event.type === TableSettingEventType.reset
    ) {
      this.saveTableSettings(event.setting);
    }
  }

  onRowEvent({ event, sender }: IRowEvent<OutputDatasetObsoleteDto>) {
    if (event === RowEventType.RowClick) {
      const dataset = sender.row;
      this.rowClick.emit(dataset);
    } else if (event === RowEventType.RowSelectionChange) {
      const dataset = sender.row;
      if (sender.checked) {
        this.store.dispatch(selectDatasetAction({ dataset }));
      } else {
        this.store.dispatch(deselectDatasetAction({ dataset }));
      }
    } else if (event === RowEventType.MasterSelectionChange) {
      if (sender.checked) {
        this.store.dispatch(selectAllDatasetsAction());
      } else {
        this.store.dispatch(clearSelectionAction());
      }
    }
  }

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active, direction } = sender as Sort;

      const column = active;

      this.store.dispatch(sortByColumnAction({ column, direction }));
    }
  }

  onPageChange({ pageIndex, pageSize }: TablePagination) {
    this.pageChange.emit({
      pageIndex,
      pageSize,
    });
  }

  onSelect(event: MatCheckboxChange, dataset: OutputDatasetObsoleteDto): void {
    if (event.checked) {
      this.store.dispatch(selectDatasetAction({ dataset }));
    } else {
      this.store.dispatch(deselectDatasetAction({ dataset }));
    }
  }

  onSelectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.store.dispatch(selectAllDatasetsAction());
    } else {
      this.store.dispatch(clearSelectionAction());
    }
  }

  onSortChange(event: SortChangeEvent): void {
    const { active, direction } = event;
    const column = active.split("_")[1];
    this.store.dispatch(sortByColumnAction({ column, direction }));
  }

  ngOnInit() {
    this.store.dispatch(fetchInstrumentsAction({ limit: 1000, skip: 0 }));

    this.subscriptions.push(
      this.selectedDatasets$.subscribe((datasets) => {
        // NOTE: In the selectionIds we are storing either _id or pid. Dynamic material table works only with these two.
        this.selectionIds = datasets.map((dataset) => {
          return dataset.pid;
        });
      }),
    );

    this.subscriptions.push(
      combineLatest([this.selectedRows$, this.selectedDatasets$]).subscribe(
        ([selectedRows, datasetsInBatch]) => {
          // Only clear internal selection when neither active selection nor
          // cart membership remains; this preserves indeterminate header state
          // after "Add to Selection" while still resetting after submit success.
          if (selectedRows.length === 0 && datasetsInBatch.length === 0) {
            this.datasetTable?.clearSelection();
          }
        },
      ),
    );

    this.subscriptions.push(
      this.datasets$
        .pipe(
          combineLatestWith(
            this.currentUser$,
            this.datasetCount$,
            this.isFacetCountsLoading$,
            this.selectColumnsWithFetchedSettings$.pipe(
              filter(
                ({ hasFetchedSettings, columns }) =>
                  hasFetchedSettings && columns.length > 0,
              ),
            ),
          ),
        )
        .subscribe(
          ([
            datasets,
            currentUser,
            count,
            isFacetCountsLoading,
            defaultTableColumns,
          ]) => {
            const userConfigColumns = defaultTableColumns.columns;

            this.rowSelectionMode = currentUser ? "multi" : "none";
            if (userConfigColumns) {
              this.dataSource.next(datasets);
              this.pending = false;

              const tableSort = this.getTableSort();
              const paginationConfig = this.getTablePaginationConfig(
                count,
                isFacetCountsLoading,
              );

              const defaultConfigColumns =
                this.appConfig?.defaultDatasetsListSettings?.columns;
              const userTableConfigColumns =
                this.datasetsListService.convertSavedDatasetColumns(
                  userConfigColumns,
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
                  tableSort,
                );
              if (tableSettingsConfig?.settingList.length) {
                this.initTable(tableSettingsConfig, paginationConfig);
              }
            }
          },
        ),
    );
    this.subscriptions.push(
      this.route.queryParams
        .pipe(combineLatestWith(this.store.select(selectTextFilter)))
        .subscribe(([queryParams, storeSearchTerm]) => {
          const searchQuery = JSON.parse(queryParams.searchQuery || "{}");
          this.globalTextSearch = searchQuery.text || storeSearchTerm || "";
        }),
    );
  }

  onTextSearchChange(term: string) {
    this.globalTextSearch = term;
    this.store.dispatch(setSearchTermsAction({ terms: term }));
    this.store.dispatch(setTextFilterAction({ text: term }));

    const { queryParams } = this.route.snapshot;
    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");

    this.router.navigate([], {
      queryParams: {
        searchQuery: JSON.stringify({
          ...searchQuery,
          text: term,
        }),
      },
      queryParamsHandling: "merge",
    });
  }

  onTextSearchAction() {
    this.store.dispatch(fetchDatasetsAction());

    // Exact Persistent ID searches only need the dataset result; the
    // OpenSearch facet path can reject this query with an invalid size value.
    if (!/^20\.\d+\/[0-9a-f-]+$/i.test(this.globalTextSearch.trim())) {
      this.store.dispatch(fetchFacetCountsAction());
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
