import { Component, EventEmitter, Output, Input, OnInit } from "@angular/core";
import { JsonSchema } from "@jsonforms/core";
import { configuredRenderer } from "./ingestor-metadata-editor-helper";

@Component({
  selector: "app-metadata-editor",
  template: `<jsonforms
    [data]="visualData"
    [schema]="schema"
    [renderers]="combinedRenderers"
    (dataChange)="onDataChange($event)"
    (errors)="onErrors($event)"
  ></jsonforms>`,
})
export class IngestorMetadataEditorComponent implements OnInit {
  @Input() data: object;
  @Input() schema: JsonSchema;

  @Output() dataChange = new EventEmitter<string>();
  @Output() errors = new EventEmitter<any[]>();

  visualData: object = {};

  ngOnInit() {
    // Do a deep clone
    this.visualData = JSON.parse(JSON.stringify(this.data));

    // Update the data with the same keys as the schema, including nested properties
    // This is necessary, otherwise the error checks will not work correctly
    // Fill empty boolean with false to avoid undefined errors
    const initializeVisualData = (schema: JsonSchema, target: any) => {
      Object.keys(schema.properties).forEach((key) => {
        const property = schema.properties[key];
        if (property.type === "object") {
          if (target[key] === undefined || target[key] === null) {
            target[key] = {};
          }
          initializeVisualData(property, target[key]);
        } else if (property.type === "boolean") {
          if (target[key] === undefined || target[key] === null) {
            target[key] = false;
          }
        }
      });
    };

    initializeVisualData(this.schema, this.visualData);

    //console.log(this.schema);
  }

  get combinedRenderers() {
    return configuredRenderer;
  }

  onDataChange(event: any) {
    this.dataChange.emit(event);
  }

  onErrors(errors: any[]) {
    this.errors.emit(errors);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}
