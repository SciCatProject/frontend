import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { InfoPopupModule } from "shared/modules/info-popup/info-popup.module";
import { ConditionFilterButtonComponent } from "./condition-filter-button.component";
import { ConditionFilterDialogComponent } from "./condition-filter-dialog.component";
import { ConditionFilterChipsComponent } from "./condition-filter-chips.component";
import { ConditionKeyPickerComponent } from "./condition-key-picker.component";

@NgModule({
  declarations: [
    ConditionFilterButtonComponent,
    ConditionFilterChipsComponent,
    ConditionFilterDialogComponent,
    ConditionKeyPickerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    InfoPopupModule,
  ],
  exports: [ConditionFilterButtonComponent, ConditionFilterChipsComponent],
})
export class ConditionFilterModule {}
