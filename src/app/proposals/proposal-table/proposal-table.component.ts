import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
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
import { Store } from "@ngrx/store";
import { selectProposalsWithCountAndTableSettings } from "state-management/selectors/proposals.selectors";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Instrument,
  OutputDatasetObsoleteDto,
  ProposalClass,
} from "@scicatproject/scicat-sdk-ts-angular";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { Sort } from "@angular/material/sort";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableConfigService } from "shared/services/table-config.service";

const tableDefaultSettingsConfig: ITableSetting = {
  visibleActionMenu: actionMenu,
  settingList: [
    {
      visibleActionMenu: actionMenu,
      isDefaultSetting: true,
      isCurrentSetting: true,
      columnSetting: [
        {
          name: "proposalId",
          header: "Proposal ID",
          icon: "perm_device_information",
          type: "text",
        },
        {
          name: "title",
          icon: "description",
          width: 250,
        },
        {
          name: "abstract",
          icon: "chrome_reader_mode",
          width: 250,
        },
        {
          name: "firstname",
          header: "First Name",
          icon: "person",
        },
        {
          name: "lastname",
          header: "Last Name",
        },
        { name: "email", icon: "email", width: 200 },
        { name: "type", icon: "badge", width: 200 },
        {
          name: "parentProposalId",
          header: "Parent Proposal",
          icon: "badge",
        },
        {
          name: "pi_firstname",
          header: "PI First Name",
          icon: "person_pin",
        },
        {
          name: "pi_lastname",
          header: "PI Last Name",
          icon: "person_pin",
        },
        {
          name: "pi_email",
          header: "PI Email",
          icon: "email",
        },
      ],
    },
  ],
  rowStyle: {
    "border-bottom": "1px solid #d2d2d2",
  },
};

@Component({
  selector: "proposal-table",
  templateUrl: "./proposal-table.component.html",
  styleUrls: ["./proposal-table.component.scss"],
  standalone: false,
})
export class ProposalTableComponent implements OnInit, OnDestroy {
  proposalsWithCountAndTableSettings$ = this.store.select(
    selectProposalsWithCountAndTableSettings,
  );

  subscriptions: Subscription[] = [];

  tableName = "proposalsTable";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  pagination: TablePagination = {};

  rowSelectionMode: TableSelectionMode = "none";

  showGlobalTextSearch = false;

  defaultPageSizeOptions = [5, 10, 25, 100];

  tablesSettings: object;

  datasets: OutputDatasetObsoleteDto[] = [];
  instruments: Instrument[] = [];
  instrumentMap: Map<string, Instrument> = new Map();

  @Input()
  dataSource!: BehaviorSubject<ProposalClass[]>;

  @Input()
  defaultPageSize: number;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private tableConfigService: TableConfigService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.proposalsWithCountAndTableSettings$.subscribe(
        ({ proposals, count, tablesSettings }) => {
          this.tablesSettings = tablesSettings;
          this.dataSource.next(proposals);
          this.pending = false;

          const savedTableConfigColumns =
            tablesSettings?.[this.tableName]?.columns;
          const tableSort = this.getTableSort();
          const paginationConfig = this.getTablePaginationConfig(count);

          const tableSettingsConfig =
            this.tableConfigService.getTableSettingsConfig(
              this.tableName,
              tableDefaultSettingsConfig,
              savedTableConfigColumns,
              tableSort,
            );

          if (tableSettingsConfig?.settingList.length) {
            this.initTable(tableSettingsConfig, paginationConfig);
          }
        },
      ),
    );
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

  getTablePaginationConfig(dataCount = 0): TablePagination {
    const { queryParams } = this.route.snapshot;

    return {
      pageSizeOptions: this.defaultPageSizeOptions,
      pageIndex: queryParams.pageIndex,
      pageSize: queryParams.pageSize || this.defaultPageSize,
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

  onPageChange(pagination: TablePagination) {
    this.router.navigate([], {
      queryParams: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      queryParamsHandling: "merge",
    });
  }

  onRowClick(event: IRowEvent<ProposalClass>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row!.proposalId);
      this.router.navigateByUrl(`/proposals/${id}`);
    }
  }

  onGlobalTextSearchChange(text: string) {
    this.router.navigate([], {
      queryParams: {
        textSearch: text || undefined,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
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

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: sortColumn, direction: sortDirection } = sender as Sort;

      this.router.navigate([], {
        queryParams: {
          pageIndex: 0,
          sortDirection: sortDirection || undefined,
          sortColumn: sortDirection ? sortColumn : undefined,
        },
        queryParamsHandling: "merge",
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
