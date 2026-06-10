import { DatePipe } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
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
import { BehaviorSubject, Subscription, take, combineLatest } from "rxjs";
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
import { AppConfigService } from "app-config.service";
import { TableConfigService } from "shared/services/table-config.service";
import { DatasetsListService } from "shared/services/datasets-list.service";
import { TableColumn } from "state-management/models";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { selectColumnsWithHasFetchedSettings } from "state-management/selectors/user.selectors";

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

  subscription: Subscription;

  relatedDatasets$ = this.store.select(selectRelatedDatasetsPageViewModel);

  appConfig = this.appConfigService.getConfig();

  selectColumnsWithFetchedSettings$ = this.store.select(
    selectColumnsWithHasFetchedSettings,
  );

  tableName = "relatedDatasetsTable";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

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
    private appConfigService: AppConfigService,
    private tableConfigService: TableConfigService,
    private datasetsListService: DatasetsListService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchRelatedDatasetsAction());

    this.subscription = combineLatest([
      this.vm$,
      this.selectColumnsWithFetchedSettings$.pipe(take(1)),
      this.currentPage$,
      this.datasetsPerPage$,
    ]).subscribe(([vm, defaultTableColumns, currentPage, datasetsPerPage]) => {
      this.dataSource.next(vm.relatedDatasets);
      this.pending = false;

      const defaultConfigColumns =
        this.appConfig?.defaultDatasetsListSettings?.columns || [];

      const userTableConfigColumns =
        this.datasetsListService.convertSavedDatasetColumns(
          defaultTableColumns.columns ?? [],
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
        pageIndex: currentPage || 0,
        pageSize: datasetsPerPage || 10,
        length: vm.relatedDatasetsCount || 0,
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
    let currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    if (!currentColumnSetting && settingConfig.settingList.length > 0) {
      currentColumnSetting = settingConfig.settingList[0].columnSetting;
    }

    this.columns = currentColumnSetting;
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
