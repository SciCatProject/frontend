import { Component, EventEmitter, Output, Input } from "@angular/core";
import { JsonSchema } from "@jsonforms/core";
import { configuredRenderer } from "./ingestor-metadata-editor-helper";

@Component({
  selector: "app-metadata-editor",
  template: `<jsonforms
    [data]="data"
    [schema]="schema"
    [renderers]="combinedRenderers"
    (dataChange)="onDataChange($event)"
    (errors)="onErrors($event)"
  ></jsonforms>`,
})
export class IngestorMetadataEditorComponent {
  @Input() data: object;
  @Input() schema: JsonSchema;

  @Output() dataChange = new EventEmitter<string>();
  @Output() errors = new EventEmitter<any[]>();

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
