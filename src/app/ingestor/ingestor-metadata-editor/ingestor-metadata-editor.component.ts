import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { Schema } from './ingestor-metadata-editor-helper';
import { customRenderers } from './customRenderer/custom-renderers';

@Component({
  selector: 'app-metadata-editor',
  template: `<jsonforms
  [data]="data"
  [schema]="schema"
  [renderers]="combinedRenderers"
  (dataChange)="onDataChange($event)"
></jsonforms>`,
})

export class IngestorMetadataEditorComponent {
  @Input() data: Object;
  @Input() schema: Schema;

  @Output() dataChange = new EventEmitter<string>();

  get combinedRenderers() {
    return [...angularMaterialRenderers, ...customRenderers];
  }

  onDataChange(event: any) {
    this.dataChange.emit(event);
  }
}