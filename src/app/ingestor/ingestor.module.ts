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
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { IngestorNewTransferDialogComponent } from "./ingestor/dialog/ingestor.new-transfer-dialog";
import { IngestorUserMetadataDialog } from "./ingestor/dialog/ingestor.user-metadata-dialog";
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from "@jsonforms/angular-material";
import { IngestorExtractorMetadataDialog } from "./ingestor/dialog/ingestor.extractor-metadata-dialog";
import { IngestorConfirmTransferDialog } from "./ingestor/dialog/ingestor.confirm-transfer-dialog";
import { MatStepperModule } from "@angular/material/stepper";
import { IngestorDialogStepperComponent } from "./ingestor/dialog/ingestor.dialog-stepper.component";

@NgModule({
  declarations: [
    IngestorComponent,
    IngestorMetadataEditorComponent,
    IngestorNewTransferDialogComponent,
    IngestorUserMetadataDialog,
    IngestorExtractorMetadataDialog,
    IngestorConfirmTransferDialog,
    IngestorDialogStepperComponent,
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
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatStepperModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
  ],
})
export class IngestorModule { }
