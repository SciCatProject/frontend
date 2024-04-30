import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";

import {
  selectHasAppliedFilters,
  selectMetadataKeys,
  selectScientificConditions,
  selectSearchTerms,
} from "state-management/selectors/datasets.selectors";

import {
  addScientificConditionAction,
  clearFacetsAction,
  fetchDatasetsAction,
  removeScientificConditionAction,
  setSearchTermsAction,
  setTextFilterAction,
} from "state-management/actions/datasets.actions";
import { Subscription } from "rxjs";
import {
  deselectAllCustomColumnsAction,
  deselectColumnAction,
  selectColumnAction,
} from "state-management/actions/user.actions";
import { ScientificCondition } from "state-management/models";
import { SearchParametersDialogComponent } from "shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AsyncPipe } from "@angular/common";
import { AppConfigService } from "app-config.service";
import { PidFilterComponent } from "./filters/pid-filter.component";
import { LocationFilterComponent } from "./filters/location-filter.component";
import { GroupFilterComponent } from "./filters/group-filter.component";
import { TypeFilterComponent } from "./filters/type-filter.component";
import { KeywordFilterComponent } from "./filters/keyword-filter.component";
import { DateRangeFilterComponent } from "./filters/date-range-filter.component";
import {TextFilterComponent} from "./filters/text-filter.component";

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.scss"],
})
export class DatasetsFilterComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  protected readonly LocationFilterComponent = LocationFilterComponent;
  protected readonly PidFilterComponent = PidFilterComponent;
  protected readonly GroupFilterComponent = GroupFilterComponent;
  protected readonly TypeFilterComponent = TypeFilterComponent;
  protected readonly KeywordFilterComponent = KeywordFilterComponent;
  protected readonly DateRangeFilterComponent = DateRangeFilterComponent;



  scientificConditions$ = this.store.select(selectScientificConditions);
  metadataKeys$ = this.store.select(selectMetadataKeys);

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
    private asyncPipe: AsyncPipe,
    public dialog: MatDialog,
    private store: Store,
  ) {}

  toggleEditMode() {
    this.isInEditMode = !this.isInEditMode;
  }

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

  showAddConditionDialog() {
    this.dialog
      .open(SearchParametersDialogComponent, {
        data: { parameterKeys: this.asyncPipe.transform(this.metadataKeys$) },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const { data } = res;
          this.store.dispatch(
            addScientificConditionAction({ condition: data }),
          );
          this.store.dispatch(
            selectColumnAction({ name: data.lhs, columnType: "custom" }),
          );
        }
      });
  }

  applyFilters() {
    this.isInEditMode = false;
    this.store.dispatch(fetchDatasetsAction());
  }

  removeCondition(condition: ScientificCondition, index: number) {
    this.store.dispatch(removeScientificConditionAction({ index }));
    this.store.dispatch(
      deselectColumnAction({ name: condition.lhs, columnType: "custom" }),
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected readonly TextFilterComponent = TextFilterComponent;
}
