import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppConfigService } from "app-config.service";
import { DateTime } from "luxon";
import { Observable, Subscription } from "rxjs";
import { MultiSelectFilterValue } from "shared/modules/filters/multiselect-filter.component";
import {
  addProposalFilterAction,
  clearProposalsFiltersAction,
  removeProposalFilterAction,
} from "state-management/actions/proposals.actions";
import {
  selectFilterByKey,
  selectProposalsFacetCountsWithInstrumentName,
  selectProposalsFacetCountsWithInstrumentNameByKey,
} from "state-management/selectors/proposals.selectors";
import { selectFilters } from "state-management/selectors/user.selectors";

import { DateRange } from "state-management/state/proposals.store";
import { FilterConfig } from "state-management/state/user.store";

@Component({
  selector: "proposal-side-filter",
  templateUrl: "./proposal-side-filter.component.html",
  styleUrls: ["./proposal-side-filter.component.scss"],
  standalone: false,
})
export class ProposalSideFilterComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  appConfig = this.appConfigService.getConfig();
  activeFilters: Record<string, string[] | DateRange> = {};
  collapsed = false;
  expandedFilters: { [key: string]: boolean } = {};
  @Output() collapsedChange = new EventEmitter<boolean>();

  filterLists: FilterConfig[] = [];

  filterConfigs$ = this.store.select(selectFilters);
  facetCounts$ = this.store.select(
    selectProposalsFacetCountsWithInstrumentName,
  );

  localization = "proposal";

  @Input() clearFilters = false;
  @Input() dateRangeValue: DateRange = {
    begin: null,
    end: null,
  };

  @Output() searchChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<MatDatepickerInputEvent<DateTime>>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public appConfigService: AppConfigService,
  ) {}

  ngOnInit(): void {
    // TODO: externalSettings structure is not ideal, should be improved
    // Currently it is like externalSettings: { filters: [...], columns: [...], proposalTable:{ columns: [...]} }
    // Ideally it should be like externalSettings: { proposals: { filters: [...], columns: [...] }, datasets: { ... } }
    // This will require a migration of user settings in the backend
    this.subscriptions.push(
      this.filterConfigs$.subscribe((filterConfigs) => {
        if (filterConfigs) {
          this.filterLists =
            this.appConfig.defaultProposalsListSettings?.filters;

          this.filterLists.forEach((filter) => {
            if (filter.type === "checkbox" && filter.enabled) {
              this.expandedFilters[filter.key] = true;
            }
          });

          const { queryParams } = this.route.snapshot;

          const searchQuery = JSON.parse(queryParams.searchQuery || "{}");

          this.filterLists.forEach((filter) => {
            // NOTE: The commented code below is to update filter type from user settings
            // to default filter type from app config if available
            // This is to handle the case when site admin changed the filter type
            // whereas user settings still have the old filter type
            // It is commented out for now because we don't get proposals filter from user settings yet

            // this.appConfig.defaultProposalsListSettings?.filters?.forEach(
            //   (defaultFilter) => {
            //     if (filter.key === defaultFilter.key) {
            //       filter.type = defaultFilter.type;
            //     }
            //   },
            // );

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
  }

  toggleFilter(key: string) {
    this.expandedFilters[key] = !this.expandedFilters[key];
  }

  setFilter(filterKey: string, value: string[]) {
    // Text filter type is not supported for proposal side panel filters
    // This is to seperate the logic of side filter panel and top text search box
    if (value && value.length > 0) {
      this.activeFilters[filterKey] = value;

      this.store.dispatch(
        addProposalFilterAction({
          key: filterKey,
          value: this.activeFilters[filterKey],
          filterType: "checkbox",
        }),
      );
    } else {
      delete this.activeFilters[filterKey];

      this.store.dispatch(
        removeProposalFilterAction({
          key: filterKey,
          filterType: "checkbox",
        }),
      );
    }
    if (this.appConfig.checkBoxFilterClickTrigger) {
      this.applyFilters();
    }
  }

  setDateFilter(filterKey: string, value: DateRange) {
    if (value.begin || value.end) {
      this.activeFilters[filterKey] = {
        begin: value.begin,
        end: value.end,
      };
      this.store.dispatch(
        addProposalFilterAction({
          key: filterKey,
          value: this.activeFilters[filterKey],
          filterType: "text",
        }),
      );
    } else {
      delete this.activeFilters[filterKey];

      this.store.dispatch(
        removeProposalFilterAction({
          key: filterKey,
          filterType: "text",
        }),
      );
    }
  }
  addMultiSelectFilterToActiveFilters(key: string, value: string) {
    if (this.activeFilters[key] && Array.isArray(this.activeFilters[key])) {
      if (!this.activeFilters[key].includes(value)) {
        this.activeFilters[key] = [...this.activeFilters[key], value];
      }
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
        addProposalFilterAction({
          key,
          value: value._id,
          filterType: "multiSelect",
        }),
      );
    } else {
      this.removeMultiSelectFilterFromActiveFilters(key, value._id);
      this.store.dispatch(
        removeProposalFilterAction({
          key,
          value: value._id,
          filterType: "multiSelect",
        }),
      );
    }
  }
  applyFilters() {
    const { queryParams } = this.route.snapshot;
    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");

    if (this.activeFilters.startTime && !this.activeFilters.startTime["end"]) {
      this.activeFilters.startTime["end"] = new Date().toISOString();
    }
    this.router.navigate([], {
      queryParams: {
        searchQuery: JSON.stringify({
          ...this.activeFilters,
          text: searchQuery.text,
        }),
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
  }

  getFacetCounts$(key: string): Observable<any> {
    return this.store.select(
      selectProposalsFacetCountsWithInstrumentNameByKey(key),
    );
  }

  getFilterByKey$(key: string) {
    return this.store.select(selectFilterByKey(key));
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  reset() {
    this.clearFilters = true;

    if (this.activeFilters.text) {
      this.activeFilters = { text: this.activeFilters.text };
    } else {
      this.activeFilters = {};
    }

    this.store.dispatch(clearProposalsFiltersAction());

    this.applyFilters();

    setTimeout(() => {
      this.clearFilters = false; // reset value so it will be triggered again
    }, 0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
