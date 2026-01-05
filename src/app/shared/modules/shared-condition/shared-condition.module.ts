import { NgModule } from "@angular/core";
import { CommonModule, AsyncPipe } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { OverlayModule } from "@angular/cdk/overlay";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SharedConditionComponent } from "./shared-condition.component";

@NgModule({
  declarations: [SharedConditionComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    OverlayModule,
    MatDialogModule,
    MatSnackBarModule,
  ],

  providers: [AsyncPipe],
  exports: [SharedConditionComponent],
})
export class SharedConditionModule {}