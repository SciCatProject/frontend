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
import { TableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";
import { BehaviorSubject } from "rxjs";
import { PrintConfig } from "shared/modules/dynamic-material-table/models/print-config.model";
import { TableSelectionMode } from "shared/modules/dynamic-material-table/models/table-row.model";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-config";
import { ReplaceUnderscorePipe } from "shared/pipes/replace-underscore.pipe";
import { TitleCasePipe } from "@angular/common";
import { ToLinkPipe } from "shared/pipes/to-link.pipe";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "metadata-view",
  templateUrl: "./metadata-view.component.html",
  styleUrls: ["./metadata-view.component.scss"],
})
export class MetadataViewComponent implements OnInit, OnChanges {
  @Input() metadata: object = {};

  tableData: ScientificMetadataTableData[] = [];
  columnsToDisplay: string[] = ["name", "value", "unit"];

  tableName = "scientificMetadataTable";

  columns: TableField<any>[];

  direction: Direction = "ltr";

  showReloadData = true;

  rowHeight = 50;

  pending = true;

  setting: TableSetting = {};

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

  tableDefaultSettingsConfig: TableSetting = {
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
            header: "Human readable name",
            name: "human_name",
            icon: "perm_device_information",
          },
          {
            name: "name",
            header: "Property name",
            icon: "perm_device_information",
          },
          {
            name: "value",
            icon: "compare_arrows",
            customRender: (column, row) => {
              if (typeof row[column.name] === "string") {
                return this.linkPipe.transform(row[column.name] || "");
              }

              return row[column.name];
            },
            width: 500,
          },
          {
            name: "unit",
            icon: "description",
          },
          {
            name: "type",
            icon: "description",
          },
        ],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  defaultDateFormat = "dd-mm-yyyy HH:MM";

  constructor(
    private unitsService: UnitsService,
    private replaceUnderscore: ReplaceUnderscorePipe,
    private titleCase: TitleCasePipe,
    private linkPipe: ToLinkPipe,
    public appConfigService: AppConfigService,
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
        const isDate = this.isDate(
          metadata[key] as ScientificMetadataTableData,
        );

        if (isDate) {
          // TODO: This format should be retreived from a config
          metadata[key].value = DateTime.fromISO(metadata[key].value).toFormat(
            this.appConfigService.getConfig().dateFormat ||
              this.defaultDateFormat,
          );
        }

        metadataObject = {
          name: key,
          value: metadata[key]["value"],
          unit: metadata[key]["unit"],
          human_name:
            metadata[key]["human_name"] ||
            this.titleCase.transform(this.replaceUnderscore.transform(key)),
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
          human_name:
            metadata[key]["human_name"] ||
            this.titleCase.transform(this.replaceUnderscore.transform(key)),
          type: metadata[key]["type"],
        };
      }
      metadataArray.push(metadataObject);
    });
    return metadataArray;
  }

  isDate(scientificMetadata: ScientificMetadataTableData): boolean {
    if (
      scientificMetadata.type === "date" &&
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

  initTable(settingConfig: TableSetting): void {
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
