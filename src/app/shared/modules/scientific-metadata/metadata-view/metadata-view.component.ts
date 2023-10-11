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

@Component({
  selector: "metadata-view",
  templateUrl: "./metadata-view.component.html",
  styleUrls: ["./metadata-view.component.scss"],
})
export class MetadataViewComponent implements OnInit, OnChanges {
  @Input() metadata: Record<string, unknown> = {};

  tableData: ScientificMetadataTableData[] = [];
  columnsToDisplay: string[] = ["name", "value", "unit"];

  createMetadataArray(
    metadata: Record<string, any>
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
