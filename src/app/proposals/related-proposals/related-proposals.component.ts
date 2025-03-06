import { Component, OnDestroy, OnInit } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { BehaviorSubject, Subscription } from "rxjs";
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
import {
  Direction,
  ITableSetting,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  actionMenu,
  getTableSettingsConfig,
} from "shared/modules/dynamic-material-table/utilizes/default-table-config";
import { fetchRelatedProposalsAction } from "state-management/actions/proposals.actions";
import { selectRelatedProposalsPageViewModel } from "state-management/selectors/proposals.selectors";

const tableDefaultSettingsConfig: ITableSetting = {
  visibleActionMenu: actionMenu,
  saveSettingMode: "none",
  settingList: [
    {
      visibleActionMenu: actionMenu,
      saveSettingMode: "none",
      isDefaultSetting: true,
      isCurrentSetting: true,
      columnSetting: [
        {
          name: "proposalId",
          header: "Proposal ID",
          icon: "perm_device_information",
        },
        {
          name: "relation",
          icon: "compare_arrows",
        },
        {
          name: "title",
          icon: "description",
        },
        {
          name: "abstract",
          icon: "description",
        },
        {
          name: "email",
          icon: "badge",
        },
        {
          name: "type",
          icon: "text_format",
        },
      ],
    },
  ],
  rowStyle: {
    "border-bottom": "1px solid #d2d2d2",
  },
};

@Component({
  selector: "app-related-proposals",
  templateUrl: "./related-proposals.component.html",
  styleUrls: ["./related-proposals.component.scss"],
})
export class RelatedProposalsComponent implements OnInit, OnDestroy {
  relatedProposalsWithCount$ = this.store.select(
    selectRelatedProposalsPageViewModel,
  );

  subscription: Subscription;

  tableName = "relatedProposalsTable";

  columns: TableField<any>[];

  direction: Direction = "ltr";

  showReloadData = true;

  rowHeight = 50;

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  showNoData = true;

  dataSource: BehaviorSubject<ProposalClass[]> = new BehaviorSubject<
    ProposalClass[]
  >([]);

  pagination: TablePagination = {};

  stickyHeader = true;

  printConfig: PrintConfig = {};

  showProgress = true;

  rowSelectionMode: TableSelectionMode = "none";

  defaultPageSize = 10;

  tablesSettings: object;

  showGlobalTextSearch = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  ngOnInit() {
    const initialQueryParams = this.route.snapshot.queryParams;
    this.store.dispatch(
      fetchRelatedProposalsAction({
        limit: initialQueryParams.pageSize || this.defaultPageSize,
        skip: initialQueryParams.pageIndex * initialQueryParams.pageSize,
        sortColumn: initialQueryParams.sortColumn,
        sortDirection: initialQueryParams.sortDirection,
      }),
    );

    this.subscription = this.relatedProposalsWithCount$.subscribe(
      ({ relatedProposals, relatedProposalsCount }) => {
        const queryParams = this.route.snapshot.queryParams;

        this.dataSource.next(relatedProposals);
        this.pending = false;

        let tableSort: ITableSetting["tableSort"];
        if (queryParams.sortDirection && queryParams.sortColumn) {
          tableSort = {
            sortColumn: queryParams.sortColumn,
            sortDirection: queryParams.sortDirection,
          };
        }

        const tableSettingsConfig = getTableSettingsConfig(
          this.tableName,
          tableDefaultSettingsConfig,
          null,
          tableSort,
        );

        const pagginationConfig = {
          pageSizeOptions: [5, 10, 25, 100],
          pageIndex: queryParams.pageIndex,
          pageSize: queryParams.pageSize || this.defaultPageSize,
          length: relatedProposalsCount,
        };

        if (tableSettingsConfig?.settingList.length) {
          this.initTable(tableSettingsConfig, pagginationConfig);
        }
      },
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
      fetchRelatedProposalsAction({
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
        fetchRelatedProposalsAction({
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

  onRowClick(event: IRowEvent<ProposalClass>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.proposalId);
      this.router.navigateByUrl("/proposals/" + id);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
