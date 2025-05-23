import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
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
import { ReplaceUnderscorePipe } from "shared/pipes/replace-underscore.pipe";
import { DatePipe, TitleCasePipe } from "@angular/common";
import { LinkyPipe } from "ngx-linky";
import { PrettyUnitPipe } from "shared/pipes/pretty-unit.pipe";
import { DateTime } from "luxon";
import { MetadataTypes } from "../metadata-edit/metadata-edit.component";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";

@Component({
  selector: "metadata-view",
  templateUrl: "./metadata-view.component.html",
  styleUrls: ["./metadata-view.component.scss"],
  standalone: false,
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
            contentIcon: "hub",
            renderContentIcon: (column, row) => {
              return !!row.ontology_reference;
            },
            contentIconLink: (column, row) => {
              return row.ontology_reference;
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
            renderContentIcon: (column, row) => {
              return row.validUnit === false;
            },
            contentIcon: "error",
            contentIconTooltip: "Unrecognized unit, conversion disabled",
            contentIconClass: "general-warning",
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

  getHumanReadableName(name: string): string {
    return this.titleCase.transform(this.replaceUnderscore.transform(name));
  }

  createMetadataArray(
    metadata: Record<string, any>,
  ): ScientificMetadataTableData[] {
    const metadataArray: ScientificMetadataTableData[] = [];
    Object.keys(metadata).forEach((key) => {
      let metadataObject: ScientificMetadataTableData;
      const humanReadableName =
        metadata[key]["human_name"] || this.getHumanReadableName(key);

      if (
        typeof metadata[key] === "object" &&
        "value" in (metadata[key] as ScientificMetadata)
      ) {
        metadataObject = {
          name: key,
          value: metadata[key]["value"],
          unit: metadata[key]["unit"],
          human_name: humanReadableName,
          type: metadata[key]["type"],
          ontology_reference: metadata[key]["ontology_reference"],
        };

        const validUnit = this.unitsService.unitValidation(
          metadata[key]["unit"],
        );

        metadataObject["validUnit"] = validUnit;
      } else {
        const metadataValue =
          typeof metadata[key] === MetadataTypes.string ||
          typeof metadata[key] === MetadataTypes.number
            ? metadata[key]
            : JSON.stringify(metadata[key]);

        metadataObject = {
          name: key,
          value: metadataValue,
          unit: "",
          human_name: humanReadableName,
          type: metadata[key]["type"],
          ontology_reference: metadata[key]["ontology_reference"],
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

    const isValidDate =
      typeof scientificMetadata.value !== "number" &&
      new Date(scientificMetadata.value).toString() !== "Invalid Date" &&
      DateTime.fromISO(scientificMetadata.value).isValid;

    if (isValidDate) {
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
