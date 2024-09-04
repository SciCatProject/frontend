import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
} from "@angular/core";
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
import { Filter, FilterConfig } from "shared/modules/filters/filters.module";
import { FilterComponentInterface } from "shared/modules/filters/interface/filter-component.interface";
import { Subscription } from "rxjs";

const COMPONENT_MAP: { [K in Filter]: Type<any> } = {
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

  isInEditMode = false;

  labelMaps: { [key: string]: string } = {};

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private store: Store,
    private asyncPipe: AsyncPipe,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit() {
    this.getAllComponentLabels();
  }

  getAllComponentLabels() {
    Object.entries(COMPONENT_MAP).forEach(([key, component]) => {
      const componentRef = this.viewContainerRef.createComponent(component);

      const instance = componentRef.instance as FilterComponentInterface;

      const label = instance.label;

      this.labelMaps[key] = label;

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

  showDatasetsFilterSettingsDialog() {
    const dialogRef = this.dialog.open(DatasetsFilterSettingsComponent, {
      width: "60vw",
      data: {
        filterConfigs: this.asyncPipe.transform(this.filterConfigs$),
        conditionConfigs: this.asyncPipe.transform(this.conditionConfigs$),
        labelMaps: this.labelMaps,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.cdr.detectChanges();
      if (result) {
        this.store.dispatch(
          updateUserSettingsAction({
            property: {
              conditions: result.conditionConfigs,
              filters: result.filterConfigs,
            },
          }),
        );
      }
    });
  }

  applyFilters() {
    this.isInEditMode = false;
    this.store.dispatch(fetchDatasetsAction());
    this.store.dispatch(fetchFacetCountsAction());
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
