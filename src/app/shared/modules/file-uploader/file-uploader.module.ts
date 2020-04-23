import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileHelpersModule } from "ngx-file-helpers";
import { PipesModule } from "shared/pipes/pipes.module";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
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
