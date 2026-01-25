import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Subscription } from "rxjs";
import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts-angular";
import { loadUsers } from "state-management/actions/users.actions";
import {
  selectAllUsers,
  selectUsersLoading,
  selectUsersError,
} from "state-management/selectors/users.selectors";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  ITableSetting,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  ITableEvent,
  TableEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { Sort } from "@angular/material/sort";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";

const tableDefaultSettingsConfig: ITableSetting = {
  visibleActionMenu: actionMenu,
  settingList: [
    {
      visibleActionMenu: actionMenu,
      isDefaultSetting: true,
      isCurrentSetting: true,
      columnSetting: [
        {
          name: "_id",
          header: "ID",
          icon: "key",
        },
        {
          name: "username",
          header: "Username",
          icon: "person",
        },
        {
          name: "email",
          header: "Email",
          icon: "email",
        },
        {
          name: "authStrategy",
          header: "Auth Strategy",
          icon: "security",
        },
      ],
    },
  ],
  rowStyle: {
    "border-bottom": "1px solid #d2d2d2",
  },
};

@Component({
  selector: "admin-userlist-view",
  templateUrl: "./admin-userlist-view.component.html",
  styleUrls: ["./admin-userlist-view.component.scss"],
  standalone: false,
})
export class AdminUserlistViewComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  tableName = "usersTable";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "none";

  dataSource: BehaviorSubject<ReturnedUserDto[]> = new BehaviorSubject<
    ReturnedUserDto[]
  >([]);

  pagination: TablePagination = {};

  rowSelectionMode: TableSelectionMode = "none";

  showGlobalTextSearch = false;

  error: any = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadUsers());

    this.subscriptions.push(
      this.store.select(selectUsersLoading).subscribe((loading) => {
        this.pending = loading;
      }),
    );

    this.subscriptions.push(
      this.store.select(selectUsersError).subscribe((error) => {
        this.error = error;
      }),
    );

    this.subscriptions.push(
      this.store.select(selectAllUsers).subscribe((users) => {
        this.dataSource.next(users);
        this.initTable();
      }),
    );
  }

  initTable(): void {
    const currentColumnSetting = tableDefaultSettingsConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    this.columns = currentColumnSetting;
    this.setting = tableDefaultSettingsConfig;
  }

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: sortColumn, direction: sortDirection } = sender as Sort;
      const users = this.dataSource.getValue();

      if (!sortDirection) {
        // Reset to original order
        this.store.select(selectAllUsers).subscribe((originalUsers) => {
          this.dataSource.next(originalUsers);
        }).unsubscribe();
        return;
      }

      const sortedUsers = [...users].sort((a, b) => {
        const valueA = (a[sortColumn as keyof ReturnedUserDto] || "")
          .toString()
          .toLowerCase();
        const valueB = (b[sortColumn as keyof ReturnedUserDto] || "")
          .toString()
          .toLowerCase();

        if (sortDirection === "asc") {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      });

      this.dataSource.next(sortedUsers);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
