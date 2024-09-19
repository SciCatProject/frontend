import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IngestorComponent } from "./ingestor/ingestor.component";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";
import { IngestorMetadataEditorComponent } from "./ingestor-metadata-editor/ingestor-metadata-editor.component";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormsModule } from "@angular/forms";
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    IngestorComponent,
    IngestorMetadataEditorComponent
  ],
  imports: [
    CommonModule, 
    MatCardModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatProgressSpinnerModule, 
    RouterModule,
    MatListModule,
    MatIconModule
  ],
})
export class IngestorModule { }
