import {
  Component,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { cloneDeep, cond, isEqual } from "lodash-es";
import {
  selectHasAppliedFilters,
  selectScientificConditions,
} from "state-management/selectors/datasets.selectors";

import {
  clearFacetsAction,
  fetchDatasetsAction,
  fetchFacetCountsAction,
} from "state-management/actions/datasets.actions";
import {
  deselectAllCustomColumnsAction,
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
import { SearchParametersDialogComponent } from "../../shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import {
  selectMetadataKeys,
  selectDatasets,
} from "state-management/selectors/datasets.selectors";
import { ConditionConfig } from "shared/modules/filters/filters.module";
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

  clearSearchBar = false;

  hasAppliedFilters$ = this.store.select(selectHasAppliedFilters);

  labelMaps: { [key: string]: string } = {};

  metadataKeys$ = this.store.select(selectMetadataKeys);

  datasets$ = this.store.select(selectDatasets);

  humanNameMap: { [key: string]: string } = {};

  fieldTypeMap: { [key: string]: string } = {};

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private store: Store,
    private asyncPipe: AsyncPipe,
    private viewContainerRef: ViewContainerRef,
    private snackBar: MatSnackBar,
    private unitsService: UnitsService,
  ) {}

  ngOnInit() { 
    this.getAllComponentLabels(); 
    this.applyEnabledConditions();
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
    this.store.dispatch(deselectAllCustomColumnsAction());
    this.store.dispatch(
      updateConditionsConfigs({
        conditionConfigs: [],
      }),
    );

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
      data: {
        filterConfigs: this.asyncPipe.transform(this.filterConfigs$),
        conditionConfigs: this.asyncPipe.transform(this.conditionConfigs$),
        labelMaps: this.labelMaps,
      },
      restoreFocus: false,
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
    this.conditionConfigs$.pipe(take(1)).subscribe((oldConditions) => {
      (oldConditions || []).forEach((oldCondition) => {
        this.store.dispatch(
          removeScientificConditionAction({
            condition: oldCondition.condition,
          }),
        );
      });
    });

    this.conditionConfigs$.pipe(take(1)).subscribe((conditionConfigs) => {
      (conditionConfigs || []).forEach((config) => {
        if (config.enabled && config.condition.lhs && config.condition.rhs) {
          this.store.dispatch(
            addScientificConditionAction({ condition: config.condition }),
          );
        }
      });
      this.store.dispatch(
        updateUserSettingsAction({
          property: { conditions: conditionConfigs },
        }),
      );
    });
    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
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
      if (datasets && datasets.length > 0) {
        this.humanNameMap = {};
        this.fieldTypeMap = {};

        datasets.forEach((dataset) => {
          const metadata = dataset.scientificMetadata;

          Object.keys(metadata).forEach((key) => {
            if (metadata[key]?.human_name) {
              this.humanNameMap[key] = metadata[key].human_name;
            }
            if (metadata[key]?.type) {
              this.fieldTypeMap[key] = metadata[key].type;
            }
          });
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

                  console.log("updatedConditions: ", updatedConditions);

                  this.store.dispatch(
                    updateUserSettingsAction({
                      property: { conditions: updatedConditions },
                    }),
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

  updateCondition(newCondition: ConditionConfig, index: number) {
    const currentConditions =
      this.asyncPipe.transform(this.conditionConfigs$) || [];
    const updatedConditions = [...currentConditions];

    const oldCondition = updatedConditions[index];
    updatedConditions.splice(index, 1);

    // Removes the old condition if enabled
    if (oldCondition.enabled) {
      this.store.dispatch(
        removeScientificConditionAction({ condition: oldCondition.condition }),
      );
      this.store.dispatch(
        deselectColumnAction({
          name: oldCondition.condition.lhs,
          columnType: "custom",
        }),
      );
    }

    // Adds the new condition if enabled
    if (newCondition) {
      updatedConditions.splice(index, 0, newCondition);

      if (newCondition.enabled) {
        this.store.dispatch(
          addScientificConditionAction({ condition: newCondition.condition }),
        );
        this.store.dispatch(
          selectColumnAction({
            name: newCondition.condition.lhs,
            columnType: "custom",
          }),
        );
      }
    }

    this.updateConditionInStore(updatedConditions);

    this.store.dispatch(
      updateUserSettingsAction({ property: { conditions: updatedConditions } }),
    );
  }

  updateConditionField(index: number, updates: Partial<ScientificCondition>) {
    const currentConditions =
      this.asyncPipe.transform(this.conditionConfigs$) || [];
    const updatedConditions = [...currentConditions];
    const conditionConfig = updatedConditions[index];

    updatedConditions[index] = {
      ...conditionConfig,
      condition: {
        ...conditionConfig.condition,
        ...updates,
      },
    };

    this.updateConditionInStore(updatedConditions);
  }

  updateConditionOperator(
    index: number,
    newOperator: ScientificCondition["relation"],
  ) {
    let updates: Partial<ScientificCondition> = {
      relation: newOperator,
      rhs: newOperator === "RANGE" ? [undefined, undefined] : "",
      unit: newOperator === "EQUAL_TO_STRING" ? "" : undefined,
    };
    this.updateConditionField(index, updates);
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
      this.updateConditionField(index, {
        rhs: isNumeric ? Number(newValue) : newValue,
        relation: isNumeric ? "EQUAL_TO_NUMERIC" : "EQUAL_TO_STRING",
      });
    } else {
      this.updateConditionField(index, { rhs: Number(newValue) });
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
    this.updateConditionField(index, { rhs });
  }

  getOperatorUIValue(relation: string): string {
    return relation === "EQUAL_TO_NUMERIC" || relation === "EQUAL_TO_STRING"
      ? "EQUAL_TO"
      : relation;
  }

  updateConditionUnit(index: number, event: Event) {
    const newUnit = (event.target as HTMLInputElement).value;
    this.updateConditionField(index, { unit: newUnit || undefined });
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

  renderComponent(filterObj: FilterConfig): any {
    const key = Object.keys(filterObj)[0];
    const isEnabled = filterObj[key];

    if (!isEnabled || !COMPONENT_MAP[key]) {
      return null;
    }

    return COMPONENT_MAP[key];
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
