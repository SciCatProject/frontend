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
} from "state-management/actions/datasets.actions";
import { Subscription } from "rxjs";
import {
  deselectAllCustomColumnsAction,
  updateFilterConfigs,
} from "state-management/actions/user.actions";
import { AppConfigService } from "app-config.service";
import { DatasetsFilterSettingsComponent } from "./settings/datasets-filter-settings.component";
import {
  selectConditions,
  selectFilters,
} from "state-management/selectors/user.selectors";
import { AsyncPipe } from "@angular/common";
import { ConditionFilterComponent } from "../../shared/modules/filters/condition-filter.component";

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.scss"],
})
export class DatasetsFilterComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  filterConfigs$ = this.store.select(selectFilters);

  conditionConfigs$ = this.store.select(selectConditions);

  scientificConditions$ = this.store.select(selectScientificConditions);

  appConfig = this.appConfigService.getConfig();

  clearSearchBar = false;

  hasAppliedFilters$ = this.store.select(selectHasAppliedFilters);

  isInEditMode = false;

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private store: Store,
    private asyncPipe: AsyncPipe,
  ) {}

  reset() {
    this.clearSearchBar = true;

    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(deselectAllCustomColumnsAction());
    this.applyFilters();
  }

  showDatasetsFilterSettingsDialog() {
    const dialogRef = this.dialog.open(DatasetsFilterSettingsComponent, {
      width: "60%",
      data: {
        filterConfigs: this.asyncPipe.transform(this.filterConfigs$),
        conditionConfigs: this.asyncPipe.transform(this.conditionConfigs$),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (result) {
        // Handle the selected filter
        console.log(`Selected filter: ${result}`);
        this.store.dispatch(updateFilterConfigs({ filterConfigs: result }));
      }
    });
  }

  applyFilters() {
    this.isInEditMode = false;
    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected readonly ConditionFilterComponent = ConditionFilterComponent;
}
