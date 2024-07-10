import { NgModule } from "@angular/core";
import { PidFilterContainsComponent } from "./pid-filter-contains.component";
import { PidFilterComponent } from "./pid-filter.component";
import { PidFilterStartsWithComponent } from "./pid-filter-startsWith.component";
import { ClearableInputComponent } from "./clearable-input.component";
import { LocationFilterComponent } from "./location-filter.component";
import { GroupFilterComponent } from "./group-filter.component";
import { ConditionFilterComponent } from "./condition-filter.component";
import { TypeFilterComponent } from "./type-filter.component";
import { TextFilterComponent } from "./text-filter.component";
import { KeywordFilterComponent } from "./keyword-filter.component";
import { DateRangeFilterComponent } from "./date-range-filter.component";
import { ScientificCondition } from "state-management/models";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { AsyncPipe } from "@angular/common";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@NgModule({
  declarations: [
    ClearableInputComponent,
    PidFilterComponent,
    PidFilterContainsComponent,
    PidFilterStartsWithComponent,
    LocationFilterComponent,
    GroupFilterComponent,
    TypeFilterComponent,
    KeywordFilterComponent,
    DateRangeFilterComponent,
    TextFilterComponent,
    ConditionFilterComponent,
  ],
  imports: [
    MatInputModule,
    MatDatepickerModule,
    AsyncPipe,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  exports: [
    ClearableInputComponent,
    PidFilterComponent,
    PidFilterContainsComponent,
    PidFilterStartsWithComponent,
    LocationFilterComponent,
    GroupFilterComponent,
    TypeFilterComponent,
    KeywordFilterComponent,
    DateRangeFilterComponent,
    TextFilterComponent,
    ConditionFilterComponent,
  ],
})
export class FiltersModule {}

export interface FilterConfig {
  type: any;
  visible: boolean;
}

export interface ConditionConfig {
  condition: ScientificCondition;
  enabled: boolean;
}
