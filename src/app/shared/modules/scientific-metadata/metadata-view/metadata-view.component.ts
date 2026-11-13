import {
  Component,
  OnInit,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
} from "@angular/core";
import {
  ScientificMetadataTableData,
  ScientificMetadata,
} from "../scientific-metadata.module";
import { UnitsService } from "shared/services/units.service";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { Direction } from "@angular/cdk/bidi";
import {
  ITableSetting,
  TableSettingEventType,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import { BehaviorSubject, Subscription } from "rxjs";
import { PrintConfig } from "shared/modules/dynamic-material-table/models/print-config.model";
import { TableSelectionMode } from "shared/modules/dynamic-material-table/models/table-row.model";
import { DatePipe } from "@angular/common";
import { LinkyPipe } from "ngx-linky";
import { PrettyUnitPipe } from "shared/pipes/pretty-unit.pipe";
import { MetadataTypes } from "../metadata-edit/metadata-edit.component";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TablePaginationMode } from "shared/modules/dynamic-material-table/models/table-pagination.model";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import {
  IRowEvent,
  RowEventType,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { ContextMenuItem } from "shared/modules/dynamic-material-table/models/context-menu.model";
import { ScientificMetadataColumnsService } from "shared/services/scientific-metadata-columns.service";
import { AppConfigService } from "app-config.service";
import { TableConfigService } from "shared/services/table-config.service";

@Component({
  selector: "metadata-view",
  templateUrl: "./metadata-view.component.html",
  styleUrls: ["./metadata-view.component.scss"],
  standalone: false,
})
export class MetadataViewComponent implements OnInit, OnChanges, OnDestroy {
  private columnChangeSub?: Subscription;
  @Input() metadata: object = {};

  @Input() tableId?: string;

  tableData: ScientificMetadataTableData[] = [];

  tableName = "scientificMetadataTable";

  columns: TableField<any>[];

  direction: Direction = "ltr";

  showReloadData = true;

  rowHeight = 50;

  pending = true;

  setting: ITableSetting = {};

  showNoData = true;

  dataSource: BehaviorSubject<ScientificMetadataTableData[]> =
    new BehaviorSubject<ScientificMetadataTableData[]>([]);

  stickyHeader = true;

  pagination = null;

  pagingMode: TablePaginationMode = "none";

  printConfig: PrintConfig = {};

  showProgress = true;

  rowSelectionMode: TableSelectionMode = "none";

  defaultPageSize = 10;

  tablesSettings: object;

  showGlobalTextSearch = false;

  rowContextMenuItems: ContextMenuItem[];
  canAddScientificMetadataKeysAsColumn: boolean;

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [
          {
            name: "human_name",
            header: "Name",
            width: 300,
            hoverContent: true,
            hoverOnCell: true,
            customRender: (column, row) => {
              const displayName = row.human_name || row.name || "";

              if (row.human_name && row.name) {
                return `
                  <div class="metadata-name-wrapper">
                    <div class="metadata-human-name">${row.human_name}</div>
                    <div class="metadata-raw-name">${row.name}</div>
                  </div>
                `;
              }
              return `<span class="metadata-name">${displayName}</span>`;
            },
          },
          {
            name: "value",
            header: "Value",
            width: 250,
            customRender: (column, row) => {
              if (row.type === "date") {
                return this.datePipe.transform(row[column.name]);
              }

              if (row.type === "link") {
                return this.linkyPipe.transform(row[column.name] || "", {
                  urls: true,
                  newWindow: true,
                  stripPrefix: false,
                  sanitizeHtml: true,
                });
              }

              return row[column.name];
            },
            toExport: (column, row) => {
              if (row.type === "date") {
                return this.datePipe.transform(row[column.name]);
              }

              if (row.type === "link") {
                return this.linkyPipe.transform(row[column.name] || "", {
                  urls: true,
                  newWindow: true,
                  stripPrefix: false,
                  sanitizeHtml: true,
                });
              }

              return row[column.name];
            },
            renderContentIcon: (column, row) => {
              return row.ontology_reference ? "hub" : "";
            },
            contentIconLink: (column, row) => {
              return row.ontology_reference;
            },
          },
          {
            name: "unit",
            header: "Unit",
            customRender: (column, row) => {
              return row[column.name]
                ? this.prettyUnit.transform(row[column.name])
                : "--";
            },
            toExport: (row) => {
              return row.unit ? this.prettyUnit.transform(row.unit) : "--";
            },
            renderContentIcon: (column, row) => {
              return row.type === "quantity" && row.validUnit === false
                ? "error"
                : "";
            },
            contentIconTooltip: "Unrecognized unit, conversion disabled",
            contentIconClass: "general-warning",
            cellClass: "unit-input",
          },
          {
            name: "type",
            header: "Type",
            display: "hidden",
          },
        ],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  constructor(
    private appConfigService: AppConfigService,
    private unitsService: UnitsService,
    private datePipe: DatePipe,
    private formatNumberPipe: FormatNumberPipe,
    private scientificMetadataColumnsService: ScientificMetadataColumnsService,
    private tableConfigService: TableConfigService,
    public linkyPipe: LinkyPipe,
    public prettyUnit: PrettyUnitPipe,
  ) {
    this.canAddScientificMetadataKeysAsColumn =
      this.appConfigService.getConfig().addScientificMetadataKeysAsColumn ===
      true;
    this.rowContextMenuItems = this.canAddScientificMetadataKeysAsColumn
      ? [this.scientificMetadataColumnsService.addAsColumnAction]
      : [];
  }

  private resolveTableSetting(): ITableSetting {
    return this.tableConfigService.getTableSettingsConfig(
      this.storageKey,
      this.tableDefaultSettingsConfig,
      this.tableConfigService.preferSavedColumns(
        this.storageKey,
        this.tableDefaultSettingsConfig.settingList[0].columnSetting,
      ),
    );
  }

  private subscribeToColumnChanges(): void {
    this.columnChangeSub?.unsubscribe();
    this.columnChangeSub = this.tableConfigService
      .watchColumnChanges(this.storageKey)
      .subscribe(() => {
        this.initTable(this.resolveTableSetting());
      });
  }

  createMetadataArray(
    metadata: Record<string, any>,
  ): ScientificMetadataTableData[] {
    const metadataArray: ScientificMetadataTableData[] = [];
    Object.keys(metadata).forEach((key) => {
      let metadataObject: ScientificMetadataTableData;
      const entry = metadata[key];
      const humanReadableName =
        entry !== null && typeof entry === "object"
          ? entry["human_name"]
          : undefined;
      const columnName = `scientificMetadata.${key}${
        entry !== null &&
        typeof entry === "object" &&
        "value" in (entry as ScientificMetadata)
          ? ".value"
          : ""
      }`;

      if (
        entry !== null &&
        typeof entry === "object" &&
        "value" in (entry as ScientificMetadata)
      ) {
        const formattedValue = this.formatNumberPipe.transform(entry["value"]);

        metadataObject = {
          name: key,
          columnName,
          value: formattedValue,
          unit: entry["unit"],
          human_name: humanReadableName,
          type: entry["type"],
          ontology_reference: entry["ontology_reference"],
        };

        const validUnit = this.unitsService.unitValidation(entry["unit"]);

        metadataObject["validUnit"] = validUnit;
      } else {
        const metadataValue =
          typeof entry === MetadataTypes.string ||
          typeof entry === MetadataTypes.number
            ? entry
            : JSON.stringify(entry);

        const formattedValue = this.formatNumberPipe.transform(metadataValue);

        metadataObject = {
          name: key,
          columnName,
          value: formattedValue,
          unit: "",
          human_name: humanReadableName,
          type:
            entry !== null && typeof entry === "object"
              ? entry["type"]
              : undefined,
          ontology_reference:
            entry !== null && typeof entry === "object"
              ? entry["ontology_reference"]
              : undefined,
        };
      }
      metadataArray.push(metadataObject);
    });
    return metadataArray;
  }

  ngOnInit() {
    if (this.metadata) {
      this.tableData = this.createMetadataArray(this.metadata);
      this.dataSource.next(this.tableData);

      this.initTable(this.resolveTableSetting());
      this.subscribeToColumnChanges();

      this.pending = false;
    }
  }

  ngOnDestroy() {
    this.columnChangeSub?.unsubscribe();
  }

  async onRowEvent({ event, sender }: IRowEvent<ScientificMetadataTableData>) {
    if (
      !this.canAddScientificMetadataKeysAsColumn ||
      event !== RowEventType.RowActionMenu ||
      sender.action?.name !==
        this.scientificMetadataColumnsService.addAsColumnAction.name ||
      !sender.row
    ) {
      return;
    }

    await this.scientificMetadataColumnsService.addMetadataColumn(sender.row);
  }

  initTable(settingConfig: ITableSetting): void {
    const currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    this.columns = currentColumnSetting;
    this.setting = settingConfig;
  }

  private get storageKey(): string {
    return this.tableId ? `${this.tableName}.${this.tableId}` : this.tableName;
  }

  onSettingChange(event: {
    type: TableSettingEventType;
    setting: ITableSetting;
  }) {
    if (
      event.type === TableSettingEventType.apply ||
      event.type === TableSettingEventType.reset
    ) {
      this.tableConfigService.saveColumns(
        this.storageKey,
        event.setting.columnSetting,
      );
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "metadata") {
        this.metadata = changes[propName].currentValue;
        this.tableData = this.createMetadataArray(this.metadata);
        this.dataSource.next(this.tableData);
      }
      if (propName === "tableId") {
        this.tableId = changes[propName].currentValue;
        this.initTable(this.resolveTableSetting());
        this.subscribeToColumnChanges();
      }
    }
  }
}
