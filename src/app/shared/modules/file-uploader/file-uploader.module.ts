import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileDropzoneComponent } from "./file-dropzone/file-dropzone.component";
import { FilePickerComponent } from "./file-picker/file-picker.component";
import { NgxFileHelpersModule } from "ngx-file-helpers";
import { PipesModule } from "shared/pipes/pipes.module";
import { MatButtonModule, MatCardModule } from "@angular/material";

@NgModule({
  declarations: [FileDropzoneComponent, FilePickerComponent],
  imports: [CommonModule, MatButtonModule, MatCardModule, NgxFileHelpersModule, PipesModule],
  exports: [FileDropzoneComponent, FilePickerComponent]
})
export class FileUploaderModule {}
