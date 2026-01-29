import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { JsonPreviewDialogComponent } from "./json-preview-dialog.component";

@NgModule({
  declarations: [JsonPreviewDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    NgxJsonViewerModule,
  ],
})
export class JsonPreviewDialogModule {}
