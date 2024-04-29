import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { debounceTime, distinctUntilChanged, skipWhile } from "rxjs/operators";

import {
  selectCreationTimeFilter,
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
  setDateRangeFilterAction,
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
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateTime } from "luxon";
import { AppConfigService } from "app-config.service";
import { PidFilterComponent } from "./filters/pid-filter.component";
import { LocationFilterComponent } from "./filters/location-filter.component";
import { GroupFilterComponent } from "./filters/group-filter.component";
import { TypeFilterComponent } from "./filters/type-filter.component";
import { KeywordFilterComponent } from "./filters/keyword-filter.component";

interface DateRange {
  begin: string;
  end: string;
}

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

  searchTerms$ = this.store.select(selectSearchTerms);

  creationTimeFilter$ = this.store.select(selectCreationTimeFilter);
  scientificConditions$ = this.store.select(selectScientificConditions);
  metadataKeys$ = this.store.select(selectMetadataKeys);

  appConfig = this.appConfigService.getConfig();

  clearSearchBar = false;

  hasAppliedFilters$ = this.store.select(selectHasAppliedFilters);

  isInEditMode = false;

  //TODO extract to state
  selectedFilters = {
    [PidFilterComponent.kName]: false,
    [LocationFilterComponent.kName]: false,
    [KeywordFilterComponent.kName]: false,
    [GroupFilterComponent.kName]: false,
    [TypeFilterComponent.kName]: false,
    dateRange: false,
  };

  dateRange: DateRange = {
    begin: "",
    end: "",
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

  textSearchChanged(terms: string) {
    if ("string" != typeof terms) return;
    this.clearSearchBar = false;
    this.store.dispatch(setSearchTermsAction({ terms }));
  }

  dateChanged(event: MatDatepickerInputEvent<DateTime>) {
    if (event.value) {
      const name = event.targetElement.getAttribute("name");
      if (name === "begin") {
        this.dateRange.begin = event.value.toUTC().toISO();
        this.dateRange.end = "";
      }
      if (name === "end") {
        this.dateRange.end = event.value.toUTC().plus({ days: 1 }).toISO();
      }
      if (this.dateRange.begin.length > 0 && this.dateRange.end.length > 0) {
        this.store.dispatch(setDateRangeFilterAction(this.dateRange));
      }
    } else {
      this.store.dispatch(setDateRangeFilterAction({ begin: "", end: "" }));
    }
  }

  clearFacets() {
    this.clearSearchBar = true;
    this.dateRange = {
      begin: "",
      end: "",
    };
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
    this.subscriptions.push(
      this.searchTerms$
        .pipe(
          skipWhile((terms) => terms === ""),
          debounceTime(500),
          distinctUntilChanged(),
        )
        .subscribe((terms) => {
          this.store.dispatch(setTextFilterAction({ text: terms }));
        }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
