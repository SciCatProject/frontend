import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { DateTime } from "luxon";
import { FilterLists } from "proposals/proposal-dashboard/proposal-dashboard.component";
import { distinctUntilChanged, map, Observable } from "rxjs";
import { selectProposalsfacetCounts } from "state-management/selectors/proposals.selectors";

import { DateRange } from "state-management/state/proposals.store";

@Component({
  selector: "proposal-side-filter",
  templateUrl: "./proposal-side-filter.component.html",
  styleUrls: ["./proposal-side-filter.component.scss"],
  standalone: false,
})
export class ProposalSideFilterComponent implements OnInit {
  activeFilters: Record<string, string | DateRange> = {};
  collapsed = false;

  fullfacetCounts$ = this.store.select(selectProposalsfacetCounts);

  @Input() clearFilters = false;
  @Input() dateRangeValue: DateRange = {
    begin: null,
    end: null,
  };
  @Input() filterLists: FilterLists[];

  @Output() searchChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<MatDatepickerInputEvent<DateTime>>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const { queryParams } = this.route.snapshot;

    const searchQuery = JSON.parse(queryParams.searchQuery || "{}");
    this.activeFilters = { ...searchQuery };
  }

  setFilter(filterKey: string, value: string) {
    if (value) {
      this.activeFilters[filterKey] = value;
    } else {
      delete this.activeFilters[filterKey];
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
    return this.fullfacetCounts$.pipe(
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
