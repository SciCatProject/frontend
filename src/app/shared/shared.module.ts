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
import { ScientificMetadataTreeModule } from "./modules/scientific-metadata-tree/scientific-metadata-tree.modules";
import { FiltersModule } from "./modules/filters/filters.module";
import { AttachmentService } from "./services/attachment.service";
import { TranslateModule } from "@ngx-translate/core";
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
    TableModule,
    SearchParametersDialogModule,
    CommonModule,
    FormsModule,
    SharedTableModule,
    ScientificMetadataTreeModule,
    TranslateModule,
  ],
  providers: [
    ConfigService,
    UnitsService,
    FilePathTruncate,
    ScicatDataService,
    AttachmentService,
  ],
  exports: [
    BreadcrumbModule,
    FileUploaderModule,
    DialogModule,
    ErrorPageModule,
    PipesModule,
    ScientificMetadataModule,
    SearchBarModule,
    TableModule,
    CommonModule,
    FormsModule,
    SharedTableModule,
    ScientificMetadataTreeModule,
    FiltersModule,
    TranslateModule,
  ],
})
export class SharedScicatFrontendModule {}
