import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IngestorComponent } from "./ingestor-page/ingestor.component";
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
import { IngestorNewTransferDialogComponent } from "./ingestor-dialogs/creation-dialog/ingestor.new-transfer-dialog.component";
import { IngestorUserMetadataDialogComponent } from "./ingestor-dialogs/creation-dialog/ingestor.user-metadata-dialog.component";
import { JsonFormsModule } from "@jsonforms/angular";
import { JsonFormsAngularMaterialModule } from "@jsonforms/angular-material";
import { IngestorExtractorMetadataDialogComponent } from "./ingestor-dialogs/creation-dialog/ingestor.extractor-metadata-dialog.component";
import { IngestorConfirmTransferDialogComponent } from "./ingestor-dialogs/creation-dialog/ingestor.confirm-transfer-dialog.component";
import { MatStepperModule } from "@angular/material/stepper";
import { IngestorDialogStepperComponent } from "./ingestor-dialogs/dialog-mounting-components/ingestor.dialog-stepper.component";
import { AnyOfRendererComponent } from "./ingestor-metadata-editor/customRenderer/any-of-renderer";
import { MatRadioModule } from "@angular/material/radio";
import { ArrayLayoutRendererCustom } from "./ingestor-metadata-editor/customRenderer/array-renderer";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IngestorConfirmationDialogComponent } from "./ingestor-dialogs/confirmation-dialog/ingestor.confirmation-dialog.component";
import { ExportTemplateHelperComponent } from "./ingestor-dialogs/dialog-mounting-components/ingestor.export-helper.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CustomObjectControlRendererComponent } from "./ingestor-metadata-editor/customRenderer/object-group-renderer";
import { IngestorFileBrowserComponent } from "./ingestor-dialogs/ingestor-file-browser/ingestor.file-browser.component";
import { MatTreeModule } from "@angular/material/tree";
import { OwnerGroupFieldComponent } from "./ingestor-metadata-editor/customRenderer/owner-group-field-renderer";
import { QuantityValueObjectComponent } from "./ingestor-metadata-editor/customRenderer/quantity-value-renderer";
import {
  CustomLayoutChildrenRenderPropsPipe,
  QuantityValueLayoutRendererComponent,
} from "./ingestor-metadata-editor/customRenderer/quantity-value-layout-renderer";
import { MatMenuModule } from "@angular/material/menu";
import { EffectsModule } from "@ngrx/effects";
import { IngestorEffects } from "state-management/effects/ingestor.effect";
import { StoreModule } from "@ngrx/store";
import { ingestorReducer } from "state-management/reducers/ingestor.reducer";

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
    ArrayLayoutRendererCustom,
    CustomObjectControlRendererComponent,
    IngestorConfirmationDialogComponent,
    ExportTemplateHelperComponent,
    IngestorFileBrowserComponent,
    OwnerGroupFieldComponent,
    QuantityValueObjectComponent,
    QuantityValueLayoutRendererComponent,
    CustomLayoutChildrenRenderPropsPipe,
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
    MatTreeModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    CommonModule,
    MatPaginatorModule,
    MatMenuModule,
    EffectsModule.forFeature([IngestorEffects]),
    StoreModule.forFeature("ingestor", ingestorReducer),
  ],
})
export class IngestorModule {}
