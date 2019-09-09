import { BreadcrumbModule } from "shared/modules/breadcrumb/breadcrumb.module";
import { ConfigService } from "./services";
import { DialogModule } from "shared/modules/dialog/dialog.module";
import { ErrorPageModule } from "shared/modules/error-page/error-page.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { FileUploaderModule } from "./modules/file-uploader/file-uploader.module";
import { PipesModule } from "./pipes/pipes.module";
import { TableModule } from "./modules/table/table.module";

@NgModule({
  imports: [
    BreadcrumbModule,
    ErrorPageModule,
    FileUploaderModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    PipesModule,
    TableModule
  ],
  declarations: [],
  providers: [ConfigService],
  exports: [
    BreadcrumbModule,
    FileUploaderModule,
    DialogModule,
    ErrorPageModule,
    PipesModule,
    TableModule
  ]
})
export class SharedCatanieModule {}
