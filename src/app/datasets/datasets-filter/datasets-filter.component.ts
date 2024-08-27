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
  updateConditionsConfigs,
  updateFilterConfigs,
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

const COMPONENT_MAP: { [key: string]: any } = {
  PidFilterComponent: PidFilterComponent,
  PidFilterContainsComponent: PidFilterContainsComponent,
  PidFilterStartsWithComponent: PidFilterStartsWithComponent,
  LocationFilterComponent: LocationFilterComponent,
  GroupFilterComponent: GroupFilterComponent,
  TypeFilterComponent: TypeFilterComponent,
  KeywordFilterComponent: KeywordFilterComponent,
  DateRangeFilterComponent: DateRangeFilterComponent,
  TextFilterComponent: TextFilterComponent,
  ConditionFilterComponent: ConditionFilterComponent,
};

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.scss"],
})
export class DatasetsFilterComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  protected readonly ConditionFilterComponent = ConditionFilterComponent;

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
    // we need to treat JS event loop here, otherwise this.clearSearchBar is false for the components
    setTimeout(() => {
      this.clearSearchBar = false; // reset value so it will be triggered again
    }, 0);
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
        this.store.dispatch(
          updateFilterConfigs({ filterConfigs: result.filterConfigs }),
        );
        this.store.dispatch(
          updateUserSettingsAction({
            property: { filters: result.filterConfigs },
          }),
        );
        this.store.dispatch(
          updateConditionsConfigs({
            conditionConfigs: result.conditionConfigs,
          }),
        );
        this.store.dispatch(
          updateUserSettingsAction({
            property: { conditions: result.conditionConfigs },
          }),
        );

        // this.cdr.detectChanges();
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

  resolveComponentType(typeAsString: string): any {
    return COMPONENT_MAP[typeAsString];
  }
}
