import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { IngestorMetadaEditorHelper, Schema, UISchema } from './ingestor-metadata-editor-helper';

@Component({
  selector: 'app-metadata-editor',
  template: `<jsonforms
  [data]="data"
  [schema]="schema"
  [uischema]="uischema"
  [renderers]="renderers"
  (dataChange)="onDataChange($event)"
></jsonforms>`,
})

export class IngestorMetadataEditorComponent implements OnChanges {
  @Input() data: Object;
  @Input() schema: Schema;

  @Output() dataChange = new EventEmitter<string>();

  renderers = angularMaterialRenderers;

  uischema: UISchema;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.schema) {
      this.uischema = IngestorMetadaEditorHelper.generateUISchemaFromSchema(JSON.stringify(this.schema));
    }
  }

  onDataChange(event: any) {
    this.dataChange.emit(event);
  }
}