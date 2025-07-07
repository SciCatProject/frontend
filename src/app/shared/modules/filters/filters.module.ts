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
import { AsyncPipe, NgForOf } from "@angular/common";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";

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
    MatTooltipModule,
    MatInputModule,
    MatDatepickerModule,
    AsyncPipe,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    NgForOf,
    MatSelectModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatButtonModule,
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

export enum Filters {
  PidFilter = "PidFilter",
  PidFilterContains = "PidFilterContains",
  PidFilterStartsWith = "PidFilterStartsWith",
  LocationFilter = "LocationFilter",
  GroupFilter = "GroupFilter",
  TypeFilter = "TypeFilter",
  KeywordFilter = "KeywordFilter",
  DateRangeFilter = "DateRangeFilter",
  TextFilter = "TextFilter",
  ConditionFilter = "ConditionFilter",
}
export type FilterConfig = Partial<{
  [K in Filters]: boolean;
}>;

export interface ConditionConfig {
  condition: ScientificCondition;
  enabled: boolean;
}
