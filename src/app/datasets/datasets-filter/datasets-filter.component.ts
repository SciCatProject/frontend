import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { cloneDeep, isEqual } from "lodash-es";
import {
  selectFacetCountByKey,
  selectFilterByKey,
  selectHasAppliedFilters,
  selectScientificConditions,
} from "state-management/selectors/datasets.selectors";

import {
  addMultiselectFilterAction,
  clearFacetsAction,
  fetchDatasetsAction,
  fetchFacetCountsAction,
  removeMultiselectFilterAction,
  setMultiselectFilterAction,
} from "state-management/actions/datasets.actions";
import {
  updateConditionsConfigs,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { AppConfigService } from "app-config.service";
import { DatasetsFilterSettingsComponent } from "./settings/datasets-filter-settings.component";
import {
  selectConditions,
  selectFilters,
} from "state-management/selectors/user.selectors";
import { AsyncPipe } from "@angular/common";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { SearchParametersDialogComponent } from "../../shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import {
  selectMetadataKeys,
  selectDatasets,
} from "state-management/selectors/datasets.selectors";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  addScientificConditionAction,
  removeScientificConditionAction,
} from "state-management/actions/datasets.actions";
import {
  selectColumnAction,
  deselectColumnAction,
} from "state-management/actions/user.actions";
import { UnitsService } from "shared/services/units.service";
import { ScientificCondition } from "state-management/models";
import {
  FilterConfig,
  ConditionConfig,
} from "state-management/state/user.store";
import { DateRange } from "state-management/state/proposals.store";
import { ActivatedRoute, Router } from "@angular/router";
import { MultiSelectFilterValue } from "shared/modules/filters/multiselect-filter.component";
import { INumericRange } from "shared/modules/numeric-range/form/model/numeric-range-field.model";

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.scss"],
  standalone: false,
})
export class DatasetsFilterComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  activeFilters: Record<string, string | DateRange | string[] | INumericRange> =
    {};
  filtersList: FilterConfig[];

  filterConfigs$ = this.store.select(selectFilters);

  conditionConfigs$ = this.store.select(selectConditions);

  scientificConditions$ = this.store.select(selectScientificConditions);

  appConfig = this.appConfigService.getConfig();

  clearSearchBar = false;

  hasAppliedFilters$ = this.store.select(selectHasAppliedFilters);

  metadataKeys$ = this.store.select(selectMetadataKeys);

  datasets$ = this.store.select(selectDatasets);

  humanNameMap: { [key: string]: string } = {};

  fieldTypeMap: { [key: string]: string } = {};

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private store: Store,
    private asyncPipe: AsyncPipe,
    private snackBar: MatSnackBar,
    private unitsService: UnitsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.applyEnabledConditions();

    this.filterConfigs$.subscribe((filterConfigs) => {
      if (filterConfigs) {
        this.filtersList = filterConfigs;

        const { queryParams } = this.route.snapshot;

        const searchQuery = JSON.parse(queryParams.searchQuery || "{}");

        this.filtersList.forEach((filter) => {
          if (!filter.enabled && searchQuery[filter.key]) {
            delete searchQuery[filter.key];
            delete this.activeFilters[filter.key];
          }
        });

        this.router.navigate([], {
          queryParams: {
            searchQuery: JSON.stringify(searchQuery),
          },
          queryParamsHandling: "merge",
        });
      }
    });

    const { queryParams } = this.route.snapshot;

    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");
    this.activeFilters = { ...searchQuery };

    this.store.dispatch(
      setMultiselectFilterAction({ multiSelectFilters: this.activeFilters }),
    );
  }

  applyEnabledConditions() {
    this.conditionConfigs$.pipe(take(1)).subscribe((conditionConfigs) => {
      (conditionConfigs || []).forEach((config) => {
        if (config.enabled && config.condition.lhs && config.condition.rhs) {
          this.store.dispatch(
            addScientificConditionAction({
              condition: config.condition,
            }),
          );
        }
      });
    });
  }

  reset() {
    this.clearSearchBar = true;

    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(
      updateConditionsConfigs({
        conditionConfigs: [],
      }),
    );
    this.store.dispatch(
      updateUserSettingsAction({
        property: { conditions: [] },
      }),
    );

    this.activeFilters = {};

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
    const initialFilterConfigsCopy = cloneDeep(
      this.asyncPipe.transform(this.filterConfigs$),
    );

    const dialogRef = this.dialog.open(DatasetsFilterSettingsComponent, {
      data: {
        filterConfigs: this.asyncPipe.transform(this.filterConfigs$),
      },
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const filtersChanged = !isEqual(
          initialFilterConfigsCopy,
          result.filterConfigs,
        );

        if (filtersChanged) {
          this.store.dispatch(
            updateUserSettingsAction({
              property: { filters: result.filterConfigs },
            }),
          );

          this.store.dispatch(fetchFacetCountsAction());
        }
      }
    });
  }

  applyFilters() {
    const { queryParams } = this.route.snapshot;
    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");

    this.router.navigate([], {
      queryParams: {
        searchQuery: JSON.stringify({
          ...this.activeFilters,
          text: searchQuery.text,
        }),
      },
      queryParamsHandling: "merge",
    });

    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }

  setDateFilter(filterKey: string, value: DateRange) {
    if (value.begin || value.end) {
      this.activeFilters[filterKey] = {
        begin: value.begin,
        end: value.end,
      };
    } else {
      delete this.activeFilters[filterKey];
    }

    this.store.dispatch(
      setMultiselectFilterAction({ multiSelectFilters: this.activeFilters }),
    );
  }

  setFilter(filterKey: string, value: string) {
    if (value) {
      this.activeFilters[filterKey] = value;
    } else {
      delete this.activeFilters[filterKey];
    }

    this.store.dispatch(
      setMultiselectFilterAction({ multiSelectFilters: this.activeFilters }),
    );
  }

  addMultiSelectFilterToActiveFilters(key: string, value: string) {
    if (this.activeFilters[key] && Array.isArray(this.activeFilters[key])) {
      this.activeFilters[key] = [...this.activeFilters[key], value];
    } else {
      this.activeFilters[key] = [value];
    }
  }

  removeMultiSelectFilterFromActiveFilters(key: string, value: string) {
    if (this.activeFilters[key] && Array.isArray(this.activeFilters[key])) {
      if (this.activeFilters[key].length > 1) {
        this.activeFilters[key] = this.activeFilters[key].filter(
          (item: string) => item !== value,
        );
      } else {
        delete this.activeFilters[key];
      }
    }
  }

  selectionChange({ event, key, value }: MultiSelectFilterValue) {
    if (event === "add") {
      this.addMultiSelectFilterToActiveFilters(key, value);
      this.store.dispatch(addMultiselectFilterAction({ key, value }));
    } else {
      this.removeMultiSelectFilterFromActiveFilters(key, value);
      this.store.dispatch(removeMultiselectFilterAction({ key, value }));
    }
  }

  numericRangeChange(filterKey: string, { min, max }: INumericRange) {
    if (min !== null && max !== null) {
      this.activeFilters[filterKey] = { min, max };
    } else {
      delete this.activeFilters[filterKey];
    }

    this.store.dispatch(
      setMultiselectFilterAction({ multiSelectFilters: this.activeFilters }),
    );
  }

  getFilterFacetCounts$(key: string) {
    return this.store.select(selectFacetCountByKey(key));
  }

  getFilterByKey$(key: string) {
    return this.store.select(selectFilterByKey(key));
  }

  trackByCondition(index: number, conditionConfig: ConditionConfig): string {
    const condition = conditionConfig.condition;
    return `${condition.lhs}-${index}`;
  }

  getConditionDisplayText(condition: ScientificCondition): string {
    if (!condition.lhs || !condition.rhs) return "Configure condition...";

    let relationSymbol = "";
    switch (condition.relation) {
      case "EQUAL_TO_NUMERIC":
      case "EQUAL_TO_STRING":
        relationSymbol = "=";
        break;
      case "LESS_THAN":
        relationSymbol = "<";
        break;
      case "GREATER_THAN":
        relationSymbol = ">";
        break;
      case "GREATER_THAN_OR_EQUAL":
        relationSymbol = "≥";
        break;
      case "LESS_THAN_OR_EQUAL":
        relationSymbol = "≤";
        break;
      case "RANGE":
        relationSymbol = "<->";
        break;
      default:
        relationSymbol = "";
    }

    const rhsValue =
      condition.relation === "EQUAL_TO_STRING"
        ? `"${condition.rhs}"`
        : condition.rhs;

    const unit = condition.unit ? ` ${condition.unit}` : "";
    return `${relationSymbol} ${rhsValue}${unit}`;
  }

  toggleConditionEnabled(index: number, enabled: boolean) {
    const currentConditions =
      this.asyncPipe.transform(this.conditionConfigs$) || [];
    const updatedConditions = [...currentConditions];
    updatedConditions[index] = { ...updatedConditions[index], enabled };
    const condition = updatedConditions[index].condition;

    if (enabled && condition.lhs && condition.rhs) {
      this.store.dispatch(addScientificConditionAction({ condition }));
      this.store.dispatch(
        selectColumnAction({ name: condition.lhs, columnType: "custom" }),
      );
    } else {
      this.store.dispatch(removeScientificConditionAction({ condition }));
      this.store.dispatch(
        deselectColumnAction({ name: condition.lhs, columnType: "custom" }),
      );
    }

    this.store.dispatch(
      updateUserSettingsAction({ property: { conditions: updatedConditions } }),
    );

    this.updateConditionInStore(updatedConditions);
  }

  addCondition() {
    this.datasets$.pipe(take(1)).subscribe((datasets) => {
      if (datasets && datasets.length > 0 && datasets[0].scientificMetadata) {
        const metadata = datasets[0].scientificMetadata;
        this.humanNameMap = {};
        this.fieldTypeMap = {};
        Object.keys(metadata).forEach((key) => {
          if (metadata[key]?.human_name) {
            this.humanNameMap[key] = metadata[key].human_name;
          }
          if (metadata[key]?.type) {
            this.fieldTypeMap[key] = metadata[key].type;
          }
        });
      }
    });

    this.metadataKeys$.pipe(take(1)).subscribe((allKeys) => {
      this.conditionConfigs$.pipe(take(1)).subscribe((currentConditions) => {
        const usedFields = (currentConditions || []).map(
          (config) => config.condition.lhs,
        );
        const availableKeys = (allKeys || []).filter(
          (key) => !usedFields.includes(key),
        );

        this.dialog
          .open(SearchParametersDialogComponent, {
            data: {
              usedFields: usedFields,
              parameterKeys: availableKeys,
            },
            restoreFocus: false,
          })
          .afterClosed()
          .subscribe((res) => {
            if (res) {
              const { data } = res;

              this.conditionConfigs$
                .pipe(take(1))
                .subscribe((currentConditions) => {
                  const existingConditionIndex = currentConditions.findIndex(
                    (config) => isEqual(config.condition, data),
                  );
                  if (existingConditionIndex !== -1) {
                    this.snackBar.open("Condition already exists", "Close", {
                      duration: 2000,
                      panelClass: ["snackbar-warning"],
                    });
                    return;
                  }

                  const newCondition: ConditionConfig = {
                    condition: data,
                    enabled: true,
                  };

                  const updatedConditions = [
                    ...(currentConditions || []),
                    newCondition,
                  ];

                  this.store.dispatch(
                    updateConditionsConfigs({
                      conditionConfigs: updatedConditions,
                    }),
                  );

                  this.store.dispatch(
                    updateUserSettingsAction({
                      property: { conditions: updatedConditions },
                    }),
                  );

                  this.store.dispatch(
                    addScientificConditionAction({ condition: data }),
                  );
                  this.store.dispatch(
                    selectColumnAction({
                      name: data.lhs,
                      columnType: "custom",
                    }),
                  );

                  this.snackBar.open("Condition added successfully", "Close", {
                    duration: 2000,
                    panelClass: ["snackbar-success"],
                  });
                });
            }
          });
      });
    });
  }

  getUnits(parameterKey: string): string[] {
    return this.unitsService.getUnits(parameterKey);
  }

  updateCondition(index: number, updates: Partial<any>) {
    const currentConditions =
      this.asyncPipe.transform(this.conditionConfigs$) || [];
    const updatedConditions = [...currentConditions];
    const condition = updatedConditions[index];
    const oldCondition = condition.condition;

    // Removes the old condition if enabled
    if (condition.enabled) {
      this.store.dispatch(
        removeScientificConditionAction({ condition: oldCondition }),
      );
      this.store.dispatch(
        deselectColumnAction({ name: oldCondition.lhs, columnType: "custom" }),
      );
    }

    // Updates the condition
    updatedConditions[index] = {
      ...condition,
      condition: { ...oldCondition, ...updates },
    };

    // Adds the updated condition if enabled
    if (condition.enabled) {
      this.store.dispatch(
        addScientificConditionAction({
          condition: updatedConditions[index].condition,
        }),
      );
      this.store.dispatch(
        selectColumnAction({
          name: updatedConditions[index].condition.lhs,
          columnType: "custom",
        }),
      );
    }

    this.updateConditionInStore(updatedConditions);

    this.store.dispatch(
      updateUserSettingsAction({ property: { conditions: updatedConditions } }),
    );
  }

  updateConditionOperator(index: number, newOperator: string) {
    this.updateCondition(index, {
      relation: newOperator,
      rhs: newOperator === "RANGE" ? [undefined, undefined] : "",
      unit: newOperator === "EQUAL_TO_STRING" ? "" : undefined,
    });
  }

  updateConditionValue(index: number, event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    const currentRelation = this.asyncPipe.transform(this.conditionConfigs$)?.[
      index
    ]?.condition.relation;
    if (
      currentRelation === "EQUAL_TO" ||
      currentRelation === "EQUAL_TO_NUMERIC" ||
      currentRelation === "EQUAL_TO_STRING"
    ) {
      const isNumeric = newValue !== "" && !isNaN(Number(newValue));
      this.updateCondition(index, {
        rhs: isNumeric ? Number(newValue) : newValue,
        relation: isNumeric ? "EQUAL_TO_NUMERIC" : "EQUAL_TO_STRING",
      });
    } else {
      this.updateCondition(index, { rhs: Number(newValue) });
    }
  }

  updateConditionRangeValue(index: number, event: Event, rangeIndex: 0 | 1) {
    const newValue = (event.target as HTMLInputElement).value;
    const currentRhs = this.asyncPipe.transform(this.conditionConfigs$)?.[index]
      ?.condition.rhs;
    const rhs = Array.isArray(currentRhs)
      ? [...currentRhs]
      : [undefined, undefined];
    rhs[rangeIndex] = Number(newValue);
    this.updateCondition(index, { rhs });
  }

  getOperatorUIValue(relation: string): string {
    return relation === "EQUAL_TO_NUMERIC" || relation === "EQUAL_TO_STRING"
      ? "EQUAL_TO"
      : relation;
  }

  updateConditionUnit(index: number, event: Event) {
    const newUnit = (event.target as HTMLInputElement).value;
    this.updateCondition(index, { unit: newUnit || undefined });
  }

  updateConditionInStore(updatedConditions: ConditionConfig[]) {
    this.store.dispatch(
      updateConditionsConfigs({
        conditionConfigs: updatedConditions,
      }),
    );
  }

  removeCondition(condition: ConditionConfig, index: number) {
    const currentConditions =
      this.asyncPipe.transform(this.conditionConfigs$) || [];
    const updatedConditions = [...currentConditions];

    // Removes the condition from the array
    updatedConditions.splice(index, 1);

    if (condition.enabled) {
      this.store.dispatch(
        removeScientificConditionAction({ condition: condition.condition }),
      );
      this.store.dispatch(
        deselectColumnAction({
          name: condition.condition.lhs,
          columnType: "custom",
        }),
      );
    }

    this.updateConditionInStore(updatedConditions);
    this.store.dispatch(
      updateUserSettingsAction({ property: { conditions: updatedConditions } }),
    );
  }

  getHumanName(key: string): string {
    return this.humanNameMap[key] || key;
  }

  getAllowedOperators(key: string): string[] {
    const type = this.fieldTypeMap[key];
    if (type === "string") {
      return ["EQUAL_TO"];
    }
    if (type === "quantity" || type === "number") {
      return [
        "EQUAL_TO",
        "GREATER_THAN",
        "LESS_THAN",
        "GREATER_THAN_OR_EQUAL",
        "LESS_THAN_OR_EQUAL",
        "RANGE",
      ];
    }
    // Default: allow all
    return [
      "EQUAL_TO",
      "GREATER_THAN",
      "LESS_THAN",
      "GREATER_THAN_OR_EQUAL",
      "LESS_THAN_OR_EQUAL",
      "RANGE",
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
