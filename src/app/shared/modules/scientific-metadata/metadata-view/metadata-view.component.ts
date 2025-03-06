import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import { DateTime } from "luxon";
import {
  ScientificMetadataTableData,
  ScientificMetadata,
} from "../scientific-metadata.module";
import { UnitsService } from "shared/services/units.service";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { Direction } from "@angular/cdk/bidi";
import { ITableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";
import { BehaviorSubject } from "rxjs";
import { PrintConfig } from "shared/modules/dynamic-material-table/models/print-config.model";
import { TableSelectionMode } from "shared/modules/dynamic-material-table/models/table-row.model";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-config";
import { ReplaceUnderscorePipe } from "shared/pipes/replace-underscore.pipe";
import { DatePipe, TitleCasePipe } from "@angular/common";
import { LinkyPipe } from "ngx-linky";
import { PrettyUnitPipe } from "shared/pipes/pretty-unit.pipe";

@Component({
  selector: "metadata-view",
  templateUrl: "./metadata-view.component.html",
  styleUrls: ["./metadata-view.component.scss"],
})
export class MetadataViewComponent implements OnInit, OnChanges {
  @Input() metadata: object = {};

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

  printConfig: PrintConfig = {};

  showProgress = true;

  rowSelectionMode: TableSelectionMode = "none";

  defaultPageSize = 10;

  tablesSettings: object;

  showGlobalTextSearch = false;

  tableDefaultSettingsConfig: ITableSetting = {
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
            header: "Name",
            name: "human_name",
            width: 250,
            customRender: (column, row) => {
              return (
                row[column.name] ||
                this.titleCase.transform(
                  this.replaceUnderscore.transform(row.name),
                )
              );
            },
          },
          {
            name: "name",
            header: "Raw property name",
            width: 250,
            display: "hidden",
          },
          {
            name: "value",
            customRender: (column, row) => {
              if (row.type === "date" || this.isDate(row)) {
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
            width: 500,
          },
          {
            name: "unit",
            customRender: (column, row) => {
              return row[column.name]
                ? this.prettyUnit.transform(row[column.name])
                : "--";
            },
            renderIcon: (column, row) => {
              return !row.validUnit;
            },
            contentIcon: "error",
            warningIconTooltip: "Unrecognized unit, conversion disabled",
            cellClass: "unit-input",
          },
          {
            name: "type",
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
    private unitsService: UnitsService,
    private replaceUnderscore: ReplaceUnderscorePipe,
    private titleCase: TitleCasePipe,
    private datePipe: DatePipe,
    public linkyPipe: LinkyPipe,
    public prettyUnit: PrettyUnitPipe,
  ) {}

  createMetadataArray(
    metadata: Record<string, any>,
  ): ScientificMetadataTableData[] {
    const metadataArray: ScientificMetadataTableData[] = [];
    Object.keys(metadata).forEach((key) => {
      let metadataObject: ScientificMetadataTableData;
      if (
        typeof metadata[key] === "object" &&
        "value" in (metadata[key] as ScientificMetadata)
      ) {
        metadataObject = {
          name: key,
          value: metadata[key]["value"],
          unit: metadata[key]["unit"],
          human_name: metadata[key]["human_name"],
          type: metadata[key]["type"],
        };

        const validUnit = this.unitsService.unitValidation(
          metadata[key]["unit"],
        );

        metadataObject["validUnit"] = validUnit;
      } else {
        metadataObject = {
          name: key,
          value: JSON.stringify(metadata[key]),
          unit: "",
          human_name: metadata[key]["human_name"],
          type: metadata[key]["type"],
        };
      }
      metadataArray.push(metadataObject);
    });
    return metadataArray;
  }

  isDate(scientificMetadata: ScientificMetadataTableData): boolean {
    // NOTE: If the type is date, we expect the value to be in ISO format.
    if (scientificMetadata.type === "date") {
      return true;
    }

    if (
      typeof scientificMetadata.value !== "number" &&
      DateTime.fromISO(scientificMetadata.value).isValid
    ) {
      return true;
    }

    return false;
  }

  ngOnInit() {
    if (this.metadata) {
      this.tableData = this.createMetadataArray(this.metadata);
      this.dataSource.next(this.tableData);

      this.initTable(this.tableDefaultSettingsConfig);

      this.pending = false;
    }
  }

  initTable(settingConfig: ITableSetting): void {
    const currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    this.columns = currentColumnSetting;
    this.setting = settingConfig;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "metadata") {
        this.metadata = changes[propName].currentValue;
        this.tableData = this.createMetadataArray(this.metadata);
      }
    }
  }
}
