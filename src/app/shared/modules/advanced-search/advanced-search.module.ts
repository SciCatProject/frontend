import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { InfoPopupModule } from "shared/modules/info-popup/info-popup.module";
import { AdvancedSearchButtonComponent } from "./advanced-search-button.component";
import { AdvancedSearchDialogComponent } from "./advanced-search-dialog.component";
import { AdvancedSearchChipsComponent } from "./advanced-search-chips.component";
import { AdvancedSearchKeyPickerComponent } from "./advanced-search-key-picker.component";

@NgModule({
  declarations: [
    AdvancedSearchButtonComponent,
    AdvancedSearchChipsComponent,
    AdvancedSearchDialogComponent,
    AdvancedSearchKeyPickerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    InfoPopupModule,
  ],
  exports: [AdvancedSearchButtonComponent, AdvancedSearchChipsComponent],
})
export class AdvancedSearchModule {}
