import { Component, OnInit, Input } from "@angular/core";
import { ScientificMetaData } from "../scientific-metadata.module";

@Component({
  selector: "metadata-view",
  templateUrl: "./metadata-view.component.html",
  styleUrls: ["./metadata-view.component.scss"]
})
export class MetadataViewComponent implements OnInit {
  @Input() metadata: object;

  tableData: ScientificMetaData[];
  columnsToDisplay: string[] = ["name", "value", "unit"];

  createMetadataArray(metadata: object): ScientificMetaData[] {
    let metadataArray = [];
    for (const key in metadata) {
      let metadataObject: ScientificMetaData;
      if ("type" in metadata[key]) {
        metadataObject = {
          name: key,
          type: metadata[key].type,
          value: metadata[key].value,
          unit: metadata[key].unit
        };
      } else {
        metadataObject = {
          name: key,
          type: "",
          value: JSON.stringify(metadata[key]),
          unit: ""
        };
      }
      metadataArray.push(metadataObject);
    }
    return metadataArray;
  }

  constructor() {}

  ngOnInit() {
    if (this.metadata) {
      this.tableData = this.createMetadataArray(this.metadata);
    }
  }
}
