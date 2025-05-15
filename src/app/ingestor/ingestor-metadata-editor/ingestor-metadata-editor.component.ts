import { Component, EventEmitter, Output, Input, OnInit } from "@angular/core";
import { JsonSchema } from "@jsonforms/core";
import {
  configuredRenderer,
  IngestorMetadataEditorHelper,
} from "./ingestor-metadata-editor-helper";

export type renderView = "requiredOnly" | "all";

/* We need to jsonforms renderer here. If we change the view and we only use one instance, 
it will produce errors when changing the schema. */
@Component({
  selector: "app-metadata-editor",
  template: `<div>
    <jsonforms
      *ngIf="renderView === 'requiredOnly'"
      [data]="visualData"
      [schema]="reducedSchema"
      [renderers]="combinedRenderers"
      (dataChange)="onDataChange($event)"
      (errors)="onErrors($event)"
    ></jsonforms>

    <jsonforms
      *ngIf="renderView === 'all'"
      [data]="visualData"
      [schema]="schema"
      [renderers]="combinedRenderers"
      (dataChange)="onDataChange($event)"
      (errors)="onErrors($event)"
    ></jsonforms>
  </div>`,
  standalone: false,
})
export class IngestorMetadataEditorComponent implements OnInit {
  @Input() data: object;
  @Input() schema: JsonSchema;
  @Input() renderView: renderView;

  @Output() dataChange = new EventEmitter<string>();
  @Output() errors = new EventEmitter<any[]>();

  visualData: object = {};
  reducedSchema: JsonSchema = {};

  ngOnInit() {
    this.updateVisualData();

    this.reducedSchema =
      IngestorMetadataEditorHelper.reduceToRequiredProperties(this.schema);

    //console.log(this.schema);
  }

  updateVisualData() {
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

    if (this.schema !== undefined && this.data !== undefined) {
      initializeVisualData(this.schema, this.visualData);
    }
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
