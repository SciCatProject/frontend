import { NgModule } from "@angular/core";

import { ScientificCondition } from "state-management/models";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CommonModule } from "@angular/common";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SharedFilterComponent } from "./shared-filter.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";

export type FilterConfig<K extends PropertyKey, V = boolean> = {
  [P in K]?: V;
};

export interface FilterComponentInterface {
  readonly componentName: string;
  readonly label: string;
}

export interface ConditionConfig {
  condition: ScientificCondition;
  enabled: boolean;
}

@NgModule({
  declarations: [SharedFilterComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatInputModule,
    MatChipsModule,
    MatDatepickerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
  ],
  exports: [SharedFilterComponent],
})
export class SharedFilterModule {}
