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
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { IngestorNewTransferDialogComponent } from "./ingestor/dialog/ingestor.new-transfer-dialog.component";
import { IngestorUserMetadataDialogComponent } from "./ingestor/dialog/ingestor.user-metadata-dialog.component";
import { JsonFormsModule } from "@jsonforms/angular";
import { JsonFormsAngularMaterialModule } from "@jsonforms/angular-material";
import { IngestorExtractorMetadataDialogComponent } from "./ingestor/dialog/ingestor.extractor-metadata-dialog.component";
import { IngestorConfirmTransferDialogComponent } from "./ingestor/dialog/ingestor.confirm-transfer-dialog.component";
import { MatStepperModule } from "@angular/material/stepper";
import { IngestorDialogStepperComponent } from "./ingestor/dialog/ingestor.dialog-stepper.component.component";
import { AnyOfRendererComponent } from "./ingestor-metadata-editor/customRenderer/any-of-renderer";
import { OneOfRendererComponent } from "./ingestor-metadata-editor/customRenderer/one-of-renderer";
import { MatRadioModule } from "@angular/material/radio";
import { ArrayLayoutRendererCustom } from "./ingestor-metadata-editor/customRenderer/array-renderer";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [
    IngestorComponent,
    IngestorMetadataEditorComponent,
    IngestorNewTransferDialogComponent,
    IngestorUserMetadataDialogComponent,
    IngestorExtractorMetadataDialogComponent,
    IngestorConfirmTransferDialogComponent,
    IngestorDialogStepperComponent,
    AnyOfRendererComponent,
    OneOfRendererComponent,
    ArrayLayoutRendererCustom,
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
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    MatStepperModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatBadgeModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
  ],
})
export class IngestorModule {}
