import { NgModule } from "@angular/core";

import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SharedFilterComponent } from "./shared-filter.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MultiSelectFilterComponent } from "../filters/multiselect-filter.component";
import { MatOptionModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { NgxNumericRangeFormFieldModule } from "../numeric-range/ngx-numeric-range-form-field.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@NgModule({
  declarations: [SharedFilterComponent, MultiSelectFilterComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatChipsModule,
    NgxNumericRangeFormFieldModule,
  ],
  exports: [SharedFilterComponent, MultiSelectFilterComponent],
})
export class SharedFilterModule {}
