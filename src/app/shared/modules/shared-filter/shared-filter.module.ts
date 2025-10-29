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
import { MAT_DATE_FORMATS, MatOptionModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { NgxNumericRangeFormFieldModule } from "../numeric-range/ngx-numeric-range-form-field.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDividerModule } from "@angular/material/divider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { PipesModule } from "shared/pipes/pipes.module";
import { provideLuxonDateAdapter } from "@angular/material-luxon-adapter";
import { AppConfigService } from "app-config.service";

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
    MatDividerModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDividerModule,
    MatButtonModule,
    PipesModule,
    MatChipsModule,
    NgxNumericRangeFormFieldModule,
  ],
  // Force shared-filter to use the Luxon adapter.
  // Needed because JsonFormsAngularMaterialModule brings in MatNativeDateModule,
  // which otherwise switches the DateAdapter to the native one.
  providers: [
    provideLuxonDateAdapter(),
    {
      provide: MAT_DATE_FORMATS,
      useFactory: (appConfigService: AppConfigService) => {
        const base = appConfigService.getConfig().dateFormat;
        return {
          parse: { dateInput: base },
          display: {
            dateInput: base,
            monthYearLabel: "MMM yyyy",
            dateA11yLabel: "LL",
            monthYearA11yLabel: "MMMM yyyy",
          },
        };
      },
      deps: [AppConfigService],
    },
  ],
  exports: [SharedFilterComponent, MultiSelectFilterComponent],
})
export class SharedFilterModule {}
