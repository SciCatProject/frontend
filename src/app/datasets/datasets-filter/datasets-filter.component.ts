import {
  Component,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { cloneDeep, isEqual } from "lodash-es";
import {
  selectHasAppliedFilters,
  selectScientificConditions,
} from "state-management/selectors/datasets.selectors";
import { ScientificCondition } from "state-management/models";

import {
  clearFacetsAction,
  fetchDatasetsAction,
  fetchFacetCountsAction,
  addScientificConditionAction,
} from "state-management/actions/datasets.actions";
import {
  deselectAllCustomColumnsAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { AppConfigService } from "app-config.service";
import { DatasetsFilterSettingsComponent } from "./settings/datasets-filter-settings.component";
import {
  selectConditions,
  selectFilters,
} from "state-management/selectors/user.selectors";
import { AsyncPipe } from "@angular/common";
import { ConditionFilterComponent } from "../../shared/modules/filters/condition-filter.component";
import { PidFilterComponent } from "../../shared/modules/filters/pid-filter.component";
import { PidFilterContainsComponent } from "../../shared/modules/filters/pid-filter-contains.component";
import { PidFilterStartsWithComponent } from "../../shared/modules/filters/pid-filter-startsWith.component";
import { LocationFilterComponent } from "../../shared/modules/filters/location-filter.component";
import { GroupFilterComponent } from "../../shared/modules/filters/group-filter.component";
import { TypeFilterComponent } from "../../shared/modules/filters/type-filter.component";
import { KeywordFilterComponent } from "../../shared/modules/filters/keyword-filter.component";
import { DateRangeFilterComponent } from "../../shared/modules/filters/date-range-filter.component";
import { TextFilterComponent } from "../../shared/modules/filters/text-filter.component";
import { Filters, FilterConfig } from "shared/modules/filters/filters.module";
import { FilterComponentInterface } from "shared/modules/filters/interface/filter-component.interface";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";

const COMPONENT_MAP: { [K in Filters]: Type<any> } = {
  PidFilter: PidFilterComponent,
  PidFilterContains: PidFilterContainsComponent,
  PidFilterStartsWith: PidFilterStartsWithComponent,
  LocationFilter: LocationFilterComponent,
  GroupFilter: GroupFilterComponent,
  TypeFilter: TypeFilterComponent,
  KeywordFilter: KeywordFilterComponent,
  DateRangeFilter: DateRangeFilterComponent,
  TextFilter: TextFilterComponent,
  ConditionFilter: ConditionFilterComponent,
};

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.scss"],
  standalone: false,
})
export class DatasetsFilterComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  protected readonly ConditionFilterComponent = ConditionFilterComponent;

  filterConfigs$ = this.store.select(selectFilters);

  conditionConfigs$ = this.store.select(selectConditions);

  scientificConditions$ = this.store.select(selectScientificConditions);

  appConfig = this.appConfigService.getConfig();
  unitsEnabled = this.appConfig.scienceSearchUnitsEnabled;
  clearSearchBar = false;

  // Track the expanded state of each outgassing filter panel
  expandedPanels: { [key: string]: boolean } = {
    outgassing1h: false,
    outgassing10h: false,
    outgassing100h: false,
    outgassingGreater100h: false,
  };

  hasAppliedFilters$ = this.store.select(selectHasAppliedFilters);

  labelMaps: { [key: string]: string } = {};

  // Add form groups for the outgassing filters
  outgassingForm1h = new FormGroup({
    lhs: new FormControl("Outgassing values after 1h", [Validators.required]),
    relation: new FormControl("GREATER_THAN", [Validators.required]),
    rhs: new FormControl("", [Validators.required, Validators.minLength(1)]),
    unit: new FormControl(""),
  });

  outgassingForm10h = new FormGroup({
    lhs: new FormControl("Outgassing values after 10h", [Validators.required]),
    relation: new FormControl("GREATER_THAN", [Validators.required]),
    rhs: new FormControl("", [Validators.required, Validators.minLength(1)]),
    unit: new FormControl(""),
  });

  outgassingForm100h = new FormGroup({
    lhs: new FormControl("Outgassing values after 100h", [Validators.required]),
    relation: new FormControl("GREATER_THAN", [Validators.required]),
    rhs: new FormControl("", [Validators.required, Validators.minLength(1)]),
    unit: new FormControl(""),
  });

  outgassingFormGreater100h = new FormGroup({
    lhs: new FormControl("Outgassing values after >100h", [
      Validators.required,
    ]),
    relation: new FormControl("GREATER_THAN", [Validators.required]),
    rhs: new FormControl("", [Validators.required, Validators.minLength(1)]),
    unit: new FormControl(""),
  });

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private store: Store,
    private asyncPipe: AsyncPipe,
    private viewContainerRef: ViewContainerRef,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.getAllComponentLabels();
  }

  getAllComponentLabels() {
    Object.entries(COMPONENT_MAP).forEach(([key, component]) => {
      const componentRef = this.viewContainerRef.createComponent(component);

      const instance = componentRef.instance as FilterComponentInterface;

      if (instance.label) {
        this.labelMaps[key] = instance.label;
      }

      componentRef.destroy();
    });
  }

  reset() {
    this.clearSearchBar = true;

    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(deselectAllCustomColumnsAction());
    this.applyFilters();
    // we need to treat JS event loop here, otherwise this.clearSearchBar is false for the components
    setTimeout(() => {
      this.clearSearchBar = false; // reset value so it will be triggered again
    }, 0);
  }

  async showDatasetsFilterSettingsDialog() {
    // Get initial filter and condition configs
    // to compare with the updated ones
    // and dispatch the updated ones if they changed
    // This is to prevent unnecessary API calls
    const initialFilterConfigs = await this.filterConfigs$
      .pipe(take(1))
      .toPromise();
    const initialConditionConfigs = await this.conditionConfigs$
      .pipe(take(1))
      .toPromise();

    const initialFilterConfigsCopy = cloneDeep(initialFilterConfigs);
    const initialConditionConfigsCopy = cloneDeep(initialConditionConfigs);

    const dialogRef = this.dialog.open(DatasetsFilterSettingsComponent, {
      width: "60vw",
      data: {
        filterConfigs: this.asyncPipe.transform(this.filterConfigs$),
        conditionConfigs: this.asyncPipe.transform(this.conditionConfigs$),
        labelMaps: this.labelMaps,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const filtersChanged = !isEqual(
          initialFilterConfigsCopy,
          result.filterConfigs,
        );
        const conditionsChanged = !isEqual(
          initialConditionConfigsCopy,
          result.conditionConfigs,
        );

        if (filtersChanged || conditionsChanged) {
          const updatedProperty = {};

          if (filtersChanged) {
            updatedProperty["filters"] = result.filterConfigs;
          }

          if (conditionsChanged) {
            updatedProperty["conditions"] = result.conditionConfigs;
          }
          this.store.dispatch(
            updateUserSettingsAction({
              property: updatedProperty,
            }),
          );
        }
      }
    });
  }

  applyFilters() {
    // Apply all outgassing filters that have values
    this.applyOutgassingFilters();

    // Fetch datasets with applied filters
    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }

  // Apply all outgassing filters at once
  private applyOutgassingFilters() {
    const forms = [
      { type: "1h", form: this.outgassingForm1h },
      { type: "10h", form: this.outgassingForm10h },
      { type: "100h", form: this.outgassingForm100h },
      { type: "greater100h", form: this.outgassingFormGreater100h },
    ];
    // Process each form that has a value
    forms.forEach(({ type, form }) => {
      console.log(`Processing outgassing filter for: ${type}`, form);
      // Only process if the form has a value
      if (form.get("rhs")?.value) {
        this.processOutgassingFilter(
          type as "1h" | "10h" | "100h" | "greater100h",
        );
      }
    });
  }

  // Process a single outgassing filter
  private processOutgassingFilter(
    filterType: "1h" | "10h" | "100h" | "greater100h",
  ): void {
    let form: FormGroup;

    // Select the appropriate form based on the filter type
    switch (filterType) {
      case "1h":
        form = this.outgassingForm1h;
        break;
      case "10h":
        form = this.outgassingForm10h;
        break;
      case "100h":
        form = this.outgassingForm100h;
        break;
      case "greater100h":
        form = this.outgassingFormGreater100h;
        break;
      default:
        return;
    }

    // Check if form is valid
    if (form.invalid || !form.get("rhs")?.value) {
      return;
    }

    const { lhs, relation, unit } = form.value;
    const rawRhs = form.get("rhs")?.value;

    // Parse the value based on the relation
    const rhs =
      relation === "EQUAL_TO_STRING" ? String(rawRhs) : Number(rawRhs);

    // Create the condition
    const condition = { lhs, relation, rhs, unit };
    console.log({ condition });
    // Dispatch the action to add the scientific condition
    this.store.dispatch(addScientificConditionAction({ condition }));
  }

  renderComponent(filterObj: FilterConfig): any {
    const key = Object.keys(filterObj)[0];
    const isEnabled = filterObj[key];

    if (!isEnabled || !COMPONENT_MAP[key]) {
      return null;
    }

    return COMPONENT_MAP[key];
  }

  // Method to apply outgassing filters
  applyOutgassingFilter(
    filterType: "1h" | "10h" | "100h" | "greater100h",
  ): void {
    let form: FormGroup;

    // Select the appropriate form based on the filter type
    switch (filterType) {
      case "1h":
        form = this.outgassingForm1h;
        break;
      case "10h":
        form = this.outgassingForm10h;
        break;
      case "100h":
        form = this.outgassingForm100h;
        break;
      case "greater100h":
        form = this.outgassingFormGreater100h;
        break;
      default:
        return;
    }

    // Check if form is valid
    if (form.invalid) {
      return;
    }

    const { lhs, relation, unit } = form.value;
    const rawRhs = form.get("rhs")?.value;

    // Parse the value based on the relation
    const rhs =
      relation === "EQUAL_TO_STRING" ? String(rawRhs) : Number(rawRhs);

    // Create the condition
    const condition = { lhs, relation, rhs, unit };

    // Dispatch the action to add the scientific condition
    this.store.dispatch(addScientificConditionAction({ condition }));

    // Show success message
    this.snackBar.open(
      `Added filter: ${lhs} ${this.formatRelation(relation)} ${rhs} ${unit || ""}`,
      "Close",
      {
        duration: 2000,
      },
    );

    // Reset the value field after applying
    form.get("rhs")?.reset("");
  }

  // Helper method to format relation for display
  private formatRelation(relation: string): string {
    switch (relation) {
      case "GREATER_THAN":
        return ">";
      case "LESS_THAN":
        return "<";
      case "EQUAL_TO_NUMERIC":
      case "EQUAL_TO_STRING":
        return "=";
      default:
        return relation;
    }
  }

  // Helper method to get filter display text
  getFilterDisplayText(formGroup: FormGroup): string {
    const relation = formGroup.get("relation")?.value;
    const rhs = formGroup.get("rhs")?.value;
    const unit = formGroup.get("unit")?.value;

    if (!rhs) {
      return "No value set";
    }

    return `${this.formatRelation(relation)} ${rhs} ${unit || ""}`.trim();
  }

  // Toggle panel expansion
  togglePanel(panel: string): void {
    this.expandedPanels[panel] = !this.expandedPanels[panel];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
