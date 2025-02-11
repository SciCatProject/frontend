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
  ></jsonforms>`,
})
export class IngestorMetadataEditorComponent {
  @Input() data: object;
  @Input() schema: JsonSchema;

  @Output() dataChange = new EventEmitter<string>();

  get combinedRenderers() {
    return configuredRenderer;
  }

  onDataChange(event: any) {
    this.dataChange.emit(event);
  }
}
