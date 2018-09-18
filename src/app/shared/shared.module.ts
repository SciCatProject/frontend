import { BreadcrumbModule } from "shared/modules/breadcrumb/breadcrumb.module";
import { ConfigFormModule } from "shared/modules/config-form/config-form.module";
import { ConfigService } from "./services";
import { DialogModule } from "shared/modules/dialog/dialog.module";
import { ErrorPageModule } from "shared/modules/error-page/error-page.module";
import { FileSizePipe } from "./pipes/filesize.pipe";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [BreadcrumbModule, ConfigFormModule, ErrorPageModule, DialogModule],
  declarations: [FileSizePipe],
  providers: [ConfigService],
  exports: [
    BreadcrumbModule,
    ConfigFormModule,
    FileSizePipe,
    ErrorPageModule,
    DialogModule
  ]
})
export class SharedCatanieModule {}
