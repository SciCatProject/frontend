import { Component, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";

import {
  selectHasAppliedFilters,
  selectScientificConditions,
} from "state-management/selectors/datasets.selectors";

import {
  clearFacetsAction,
  fetchDatasetsAction,
  fetchFacetCountsAction,
  removeScientificConditionAction,
} from "state-management/actions/datasets.actions";
import { Subscription } from "rxjs";
import {
  deselectAllCustomColumnsAction,
  deselectColumnAction,
} from "state-management/actions/user.actions";
import { ScientificCondition } from "state-management/models";
import { AppConfigService } from "app-config.service";
import { PidFilterComponent } from "./filters/pid-filter.component";
import { LocationFilterComponent } from "./filters/location-filter.component";
import { GroupFilterComponent } from "./filters/group-filter.component";
import { TypeFilterComponent } from "./filters/type-filter.component";
import { KeywordFilterComponent } from "./filters/keyword-filter.component";
import { DateRangeFilterComponent } from "./filters/date-range-filter.component";
import { TextFilterComponent } from "./filters/text-filter.component";
import { DatasetsFilterSettingsComponent } from "./settings/datasets-filter-settings.component";

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.scss"],
})
export class DatasetsFilterComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  protected readonly LocationFilterComponent = LocationFilterComponent;
  protected readonly PidFilterComponent = PidFilterComponent;
  protected readonly GroupFilterComponent = GroupFilterComponent;
  protected readonly TypeFilterComponent = TypeFilterComponent;
  protected readonly KeywordFilterComponent = KeywordFilterComponent;
  protected readonly DateRangeFilterComponent = DateRangeFilterComponent;
  protected readonly TextFilterComponent = TextFilterComponent;

  scientificConditions$ = this.store.select(selectScientificConditions);

  appConfig = this.appConfigService.getConfig();

  clearSearchBar = false;

  hasAppliedFilters$ = this.store.select(selectHasAppliedFilters);

  isInEditMode = false;

  //TODO extract to state
  selectedFilters = {
    [PidFilterComponent.kName]: true,
    [LocationFilterComponent.kName]: true,
    [KeywordFilterComponent.kName]: true,
    [GroupFilterComponent.kName]: true,
    [TypeFilterComponent.kName]: true,
    [DateRangeFilterComponent.kName]: true,
    [TextFilterComponent.kName]: true,
  };

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private store: Store,
  ) {}

  addFilter(filter: string) {
    this.selectedFilters[filter] = true;
  }

  removeFilter(filter: string) {
    this.selectedFilters[filter] = false;
  }

  clearFacets() {
    this.clearSearchBar = true;

    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(deselectAllCustomColumnsAction());
  }

  showDatasetsFilterSettingsDialog() {
    const dialogRef = this.dialog.open(DatasetsFilterSettingsComponent, {
      // width: '250px'
      data: this.appConfig,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (result) {
        // Handle the selected filter
        console.log(`Selected filter: ${result}`);
      }
    });
  }

  applyFilters() {
    this.isInEditMode = false;
    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }

  removeCondition(condition: ScientificCondition, index: number) {
    this.store.dispatch(removeScientificConditionAction({ index }));
    this.store.dispatch(
      deselectColumnAction({ name: condition.lhs, columnType: "custom" }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
