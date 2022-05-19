import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchParametersDialogComponent } from "./search-parameters-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [SearchParametersDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
})
export class SearchParametersDialogModule {}
