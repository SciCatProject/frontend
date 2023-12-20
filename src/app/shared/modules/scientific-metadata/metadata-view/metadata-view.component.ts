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

@Component({
  selector: "metadata-view",
  templateUrl: "./metadata-view.component.html",
  styleUrls: ["./metadata-view.component.scss"],
})
export class MetadataViewComponent implements OnInit, OnChanges {
  @Input() metadata: Record<string, unknown> = {};

  tableData: ScientificMetadataTableData[] = [];
  columnsToDisplay: string[] = ["name", "value", "unit"];
  constructor(private unitsService: UnitsService) {}

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
        };
      }
      metadataArray.push(metadataObject);
    });
    return metadataArray;
  }

  isDate(scientificMetadata: ScientificMetadataTableData): boolean {
    if (scientificMetadata.unit.length > 0) {
      return false;
    }
    if (typeof scientificMetadata.value === "number") {
      return false;
    }
    if (!DateTime.fromISO(scientificMetadata.value).isValid) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    if (this.metadata) {
      this.tableData = this.createMetadataArray(this.metadata);
    }
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
