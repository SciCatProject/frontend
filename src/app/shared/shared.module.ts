import { BreadcrumbModule } from "shared/modules/breadcrumb/breadcrumb.module";
import { ConfigService } from "./services";
import { DialogModule } from "shared/modules/dialog/dialog.module";
import { ErrorPageModule } from "shared/modules/error-page/error-page.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { FileUploaderModule } from "./modules/file-uploader/file-uploader.module";
import { PipesModule } from "./pipes/pipes.module";
import { TableModule } from "./modules/table/table.module";
import { SearchBarModule } from "./modules/search-bar/search-bar.module";
import { ScientificMetadataModule } from "./modules/scientific-metadata/scientific-metadata.module";
import { UnitsService } from "./services/units.service";
import { FilePathTruncate } from "./pipes/file-path-truncate.pipe";
import { SearchParametersDialogModule } from "./modules/search-parameters-dialog/search-parameters-dialog.module";
import { CommonModule } from "@angular/common";
import { SharedTableModule } from "./modules/shared-table/shared-table.module";
import { ScicatDataService } from "./services/scicat-data-service";
import { ScientificMetadataTreeModule } from "./modules/scientific-metadata-tree/scientific-metadata-tree.module";
import { AttachmentService } from "./services/attachment.service";
import { DynamicMatTableModule } from "./modules/dynamic-material-table/table/dynamic-mat-table.module";
import { JsonFormsModule } from "@jsonforms/angular";
import { JsonFormsAngularMaterialModule } from "@jsonforms/angular-material";
import { JsonFormsCustomRenderersModule } from "./modules/jsonforms-custom-renderers/jsonforms-custom-renderers.module";
import { FullTextSearchBarModule } from "./modules/full-text-search-bar/full-text-search-bar.module";
import { SharedFilterModule } from "./modules/shared-filter/shared-filter.module";
import { NgxNumericRangeFormFieldModule } from "./modules/numeric-range/ngx-numeric-range-form-field.module";
import { EmptyContentModule } from "./modules/generic-empty-content/empty-content.module";
import { JsonformsAccordionRendererService } from "./services/jsonforms-accordion-renderer.service";
@NgModule({
  imports: [
    BreadcrumbModule,
    ErrorPageModule,
    FileUploaderModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    PipesModule,
    ScientificMetadataModule,
    SearchBarModule,
    FullTextSearchBarModule,
    TableModule,
    SearchParametersDialogModule,
    CommonModule,
    FormsModule,
    SharedFilterModule,
    SharedTableModule,
    ScientificMetadataTreeModule,
    DynamicMatTableModule.forRoot({}),
    TranslateModule,
    NgxNumericRangeFormFieldModule,
    EmptyContentModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    JsonFormsCustomRenderersModule,
  ],
  providers: [
    ConfigService,
    UnitsService,
    FilePathTruncate,
    ScicatDataService,
    AttachmentService,
    JsonformsAccordionRendererService,
  ],
  exports: [
    BreadcrumbModule,
    FileUploaderModule,
    DialogModule,
    ErrorPageModule,
    PipesModule,
    ScientificMetadataModule,
    SearchBarModule,
    FullTextSearchBarModule,
    TableModule,
    CommonModule,
    FormsModule,
    SharedFilterModule,
    SharedTableModule,
    ScientificMetadataTreeModule,
    DynamicMatTableModule,
    TranslateModule,
    NgxNumericRangeFormFieldModule,
    EmptyContentModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    JsonFormsCustomRenderersModule,
  ],
})
export class SharedScicatFrontendModule {}
