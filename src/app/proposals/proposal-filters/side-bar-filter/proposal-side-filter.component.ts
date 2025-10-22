import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppConfigService } from "app-config.service";
import { DateTime } from "luxon";
import { distinctUntilChanged, map, Observable, shareReplay } from "rxjs";
import { selectProposalsfacetCountsWithInstrumentName } from "state-management/selectors/proposals.selectors";

import { DateRange } from "state-management/state/proposals.store";
import { FilterConfig } from "state-management/state/user.store";

@Component({
  selector: "proposal-side-filter",
  templateUrl: "./proposal-side-filter.component.html",
  styleUrls: ["./proposal-side-filter.component.scss"],
  standalone: false,
})
export class ProposalSideFilterComponent implements OnInit {
  appConfig = this.appConfigService.getConfig();
  activeFilters: Record<string, string[] | DateRange> = {};
  collapsed = false;

  facetCounts$ = this.store.select(
    selectProposalsfacetCountsWithInstrumentName,
  );

  localization = "proposal";

  @Input() clearFilters = false;
  @Input() dateRangeValue: DateRange = {
    begin: null,
    end: null,
  };
  @Input() filterLists: FilterConfig[];

  @Output() searchChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<MatDatepickerInputEvent<DateTime>>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public appConfigService: AppConfigService,
  ) {}

  ngOnInit(): void {
    const { queryParams } = this.route.snapshot;

    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");
    this.activeFilters = { ...searchQuery };
  }

  setFilter(filterKey: string, value: string[]) {
    if (value && value.length > 0) {
      this.activeFilters[filterKey] = value;
    } else {
      delete this.activeFilters[filterKey];
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
    } else {
      delete this.activeFilters[filterKey];
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
    return this.facetCounts$.pipe(
      map((all) => all[key] || []),
      distinctUntilChanged(),
    );
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  reset() {
    this.activeFilters = {};
    this.clearFilters = true;
    this.applyFilters();

    setTimeout(() => {
      this.clearFilters = false; // reset value so it will be triggered again
    }, 0);
  }
}
