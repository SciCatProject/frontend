import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-metadata-editor',
  templateUrl: './ingestor-metadata-editor.component.html',
  styleUrls: ['./ingestor-metadata-editor.component.scss']
})
export class IngestorMetadataEditorComponent {
  metadata: string = '';

    // Optional: EventEmitter, um Änderungen an der Metadata zu melden
    @Output() metadataChange = new EventEmitter<string>();

    onMetadataChange(newMetadata: string) {
      this.metadata = newMetadata;
      this.metadataChange.emit(this.metadata);
    }
}