import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PipesModule } from "shared/pipes/pipes.module";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FileUploaderComponent } from "./file-uploader.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragAndDropDirective } from "./directives/drag-and-drop.directive";

@NgModule({
  declarations: [FileUploaderComponent, DragAndDropDirective],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    PipesModule,
    ReactiveFormsModule,
  ],
  exports: [FileUploaderComponent],
})
export class FileUploaderModule {}
