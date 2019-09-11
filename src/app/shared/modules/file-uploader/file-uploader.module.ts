import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileHelpersModule } from "ngx-file-helpers";
import { PipesModule } from "shared/pipes/pipes.module";
import { MatButtonModule, MatCardModule } from "@angular/material";
import { FileUploaderComponent } from "./file-uploader.component";

@NgModule({
  declarations: [FileUploaderComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    NgxFileHelpersModule,
    PipesModule
  ],
  exports: [FileUploaderComponent]
})
export class FileUploaderModule {}
