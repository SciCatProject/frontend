import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileHelpersModule } from "ngx-file-helpers";
import { PipesModule } from "shared/pipes/pipes.module";
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from "@angular/material";
import { FileUploaderComponent } from "./file-uploader.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [FileUploaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgxFileHelpersModule,
    PipesModule,
    ReactiveFormsModule
  ],
  exports: [FileUploaderComponent]
})
export class FileUploaderModule {}
