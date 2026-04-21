import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { firstValueFrom } from "rxjs";
import { ContextMenuItem } from "shared/modules/dynamic-material-table/models/context-menu.model";
import {
  showMessageAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { Message, MessageType, TableColumn } from "state-management/models";
import {
  selectColumnsWithHasFetchedSettings,
  selectCurrentUser,
} from "state-management/selectors/user.selectors";

export interface ScientificMetadataColumnEntry {
  name: string;
  columnName: string;
  human_name?: string;
}

@Injectable({ providedIn: "root" })
export class ScientificMetadataColumnsService {
  readonly addAsColumnAction: ContextMenuItem = {
    name: "addAsColumn",
    text: "Add as column",
    color: undefined,
  };

  constructor(private store: Store) {}

  private showMessage(content: string, type: MessageType) {
    this.store.dispatch(
      showMessageAction({
        message: new Message(content, type, 3000),
      }),
    );
  }

  buildColumn(
    entry: ScientificMetadataColumnEntry,
    order: number,
  ): TableColumn {
    return {
      name: entry.columnName,
      header: entry.human_name || entry.name,
      userAdded: true,
      order,
      type: "standard",
      enabled: true,
      tooltip: entry.name,
      width: 250,
    };
  }

  upsertColumn(
    columns: TableColumn[],
    entry: ScientificMetadataColumnEntry,
  ): TableColumn[] {
    const nextColumn = this.buildColumn(entry, columns.length);
    const existingColumnIndex = columns.findIndex(
      (column) => column.name === nextColumn.name,
    );

    return existingColumnIndex === -1
      ? [...columns, nextColumn]
      : columns.map((column, index) =>
          index === existingColumnIndex
            ? {
                ...column,
                ...nextColumn,
                order: column.order ?? existingColumnIndex,
              }
            : column,
        );
  }

  async addMetadataColumn(entry: ScientificMetadataColumnEntry): Promise<void> {
    const currentUser = await firstValueFrom(
      this.store.select(selectCurrentUser),
    );

    if (!currentUser) {
      this.showMessage(
        "Log in to save dataset list columns.",
        MessageType.Info,
      );
      return;
    }

    const { columns, hasFetchedSettings } = await firstValueFrom(
      this.store.select(selectColumnsWithHasFetchedSettings),
    );

    if (!hasFetchedSettings) {
      this.showMessage("Unable to fetch settings.", MessageType.Info);
      return;
    }

    const nextColumns = this.upsertColumn(columns, entry);
    const nextColumn = nextColumns.find(
      (column) => column.name === entry.columnName,
    );

    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          columns: nextColumns,
        },
      }),
    );

    this.showMessage(
      `"${nextColumn?.header || entry.human_name || entry.name}" was added to the datasets list.`,
      MessageType.Success,
    );
  }
}
