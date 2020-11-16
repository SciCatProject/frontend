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
import { AppConfigModule } from "app-config.module";

@NgModule({
  declarations: [SearchParametersDialogComponent],
  imports: [
    AppConfigModule,
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
  ],
})
export class SearchParametersDialogModule {}
