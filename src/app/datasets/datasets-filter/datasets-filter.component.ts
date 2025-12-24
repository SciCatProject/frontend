import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { cloneDeep, isEqual } from "lodash-es";
import {
  selectFacetCountByKey,
  selectFilterByKey,
  selectHasAppliedFilters,
} from "state-management/selectors/datasets.selectors";
import { ScientificCondition } from "state-management/models";
import {
  addDatasetFilterAction,
  clearFacetsAction,
  fetchDatasetsAction,
  fetchFacetCountsAction,
  removeDatasetFilterAction,
  setFiltersAction,
} from "state-management/actions/datasets.actions";
import {
  updateConditionsConfigs,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { AppConfigService } from "app-config.service";
import { DatasetsFilterSettingsComponent } from "./settings/datasets-filter-settings.component";
import { AsyncPipe } from "@angular/common";
import { selectFilters } from "state-management/selectors/user.selectors";
import { Subscription } from "rxjs";
import { selectMetadataKeys } from "state-management/selectors/datasets.selectors";
import { FilterConfig } from "state-management/state/user.store";
import { DateRange } from "state-management/state/proposals.store";
import { ActivatedRoute, Router } from "@angular/router";
import { MultiSelectFilterValue } from "shared/modules/filters/multiselect-filter.component";
import { INumericRange } from "shared/modules/numeric-range/form/model/numeric-range-field.model";
import { SharedFilterComponent } from "shared/modules/shared-filter/shared-filter.component";
import {
  addScientificConditionAction,
  removeScientificConditionAction,
} from "state-management/actions/datasets.actions";
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
  expandedFilters: { [key: string]: boolean } = {};

  filterConfigs$ = this.store.select(selectFilters);

  appConfig = this.appConfigService.getConfig();

  clearSearchBar = false;

  hasAppliedFilters$ = this.store.select(selectHasAppliedFilters);

  metadataKeys$ = this.store.select(selectMetadataKeys);

  @ViewChild("conditionFilter") conditionFilter: SharedFilterComponent;

  constructor(
    private store: Store,
    private asyncPipe: AsyncPipe,
    private route: ActivatedRoute,
    private router: Router,
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
  ) {}

  addCondition = (condition: ScientificCondition) => {
    this.store.dispatch(addScientificConditionAction({ condition }));
  };

  removeCondition = (condition: ScientificCondition) => {
    this.store.dispatch(removeScientificConditionAction({ condition }));
  };

  ngOnInit() {
    this.subscriptions.push(
      this.filterConfigs$.subscribe((filterConfigs) => {
        if (filterConfigs) {
          this.filtersList = filterConfigs;

          this.filtersList.forEach((filter) => {
            if (filter.type === "checkbox" && filter.enabled) {
              this.expandedFilters[filter.key] = true;
            }
          });

          const { queryParams } = this.route.snapshot;

          const searchQuery = JSON.parse(queryParams.searchQuery || "{}");

          this.filtersList.forEach((filter) => {
            // Apply default filter type from app config if available
            // This is to handle the case when site admin changed the filter type
            // whereas user settings still have the old filter type
            this.appConfig.defaultDatasetsListSettings?.filters?.forEach(
              (defaultFilter) => {
                if (filter.key === defaultFilter.key) {
                  filter.type = defaultFilter.type;
                }
              },
            );
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
      }),
    );

    const { queryParams } = this.route.snapshot;

    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");
    this.activeFilters = { ...searchQuery };

    this.store.dispatch(
      setFiltersAction({ datasetFilters: this.activeFilters }),
    );
  }

  toggleFilter(key: string) {
    this.expandedFilters[key] = !this.expandedFilters[key];
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
        filterConfigs: this.filtersList,
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

    if (
      this.activeFilters.creationTime &&
      !this.activeFilters.creationTime["end"]
    ) {
      this.activeFilters.creationTime["end"] = new Date().toISOString();
    }
    this.router.navigate([], {
      queryParams: {
        searchQuery: JSON.stringify({
          ...this.activeFilters,
          text: searchQuery.text,
        }),
      },
      queryParamsHandling: "merge",
    });

    if (this.conditionFilter) {
      this.conditionFilter.applyConditions();
    }

    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }

  setDateFilter(filterKey: string, value: DateRange) {
    if (value.begin || value.end) {
      this.activeFilters[filterKey] = {
        begin: value.begin,
        end: value.end,
      };

      this.store.dispatch(
        addDatasetFilterAction({
          key: filterKey,
          value: this.activeFilters[filterKey],
          filterType: "dateRange",
        }),
      );
    } else {
      delete this.activeFilters[filterKey];

      this.store.dispatch(
        removeDatasetFilterAction({
          key: filterKey,
          filterType: "dateRange",
        }),
      );
    }
  }

  setFilter(filterKey: string, value: string | string[]) {
    if (value) {
      this.activeFilters[filterKey] = value;

      this.store.dispatch(
        addDatasetFilterAction({
          key: filterKey,
          value: this.activeFilters[filterKey],
          filterType: "text",
        }),
      );
    } else {
      delete this.activeFilters[filterKey];

      this.store.dispatch(
        removeDatasetFilterAction({
          key: filterKey,
          filterType: "text",
        }),
      );
    }

    // Auto-trigger for array values or checkbox filter
    // This applies to both multiselect type and checkBoxFilter
    // skip PID text input to avoid triggering on keystrokes
    // Array check can be removed when we remove text input filter type
    if (Array.isArray(value) && this.appConfig.checkBoxFilterClickTrigger) {
      this.applyFilters();
    }
  }

  addMultiSelectFilterToActiveFilters(key: string, value: string) {
    if (this.activeFilters[key] && Array.isArray(this.activeFilters[key])) {
      if (!this.activeFilters[key].includes(value)) {
        this.activeFilters[key] = [...this.activeFilters[key], value];
      }
      // If value already exists, do nothing
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
      this.addMultiSelectFilterToActiveFilters(key, value._id);
      this.store.dispatch(
        addDatasetFilterAction({
          key,
          value: value._id,
          filterType: "multiSelect",
        }),
      );
    } else {
      this.removeMultiSelectFilterFromActiveFilters(key, value._id);
      this.store.dispatch(
        removeDatasetFilterAction({
          key,
          value: value._id,
          filterType: "multiSelect",
        }),
      );
    }
  }

  numericRangeChange(filterKey: string, { min, max }: INumericRange) {
    if (min !== null || max !== null) {
      this.activeFilters[filterKey] = { min, max };
      this.store.dispatch(
        addDatasetFilterAction({
          key: filterKey,
          value: this.activeFilters[filterKey],
          filterType: "number",
        }),
      );
    } else {
      delete this.activeFilters[filterKey];
      this.store.dispatch(
        removeDatasetFilterAction({ key: filterKey, filterType: "number" }),
      );
    }
  }

  getFilterFacetCounts$(key: string) {
    return this.store.select(selectFacetCountByKey(key));
  }

  getFilterByKey$(key: string) {
    return this.store.select(selectFilterByKey(key));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
