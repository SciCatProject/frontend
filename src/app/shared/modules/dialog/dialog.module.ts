import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogComponent } from "./dialog.component";
import { FormsModule } from "@angular/forms";

import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule
} from "@angular/material";
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule
  ],
  entryComponents: [DialogComponent],
  declarations: [DialogComponent]
})
export class DialogModule {}
