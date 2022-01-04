import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Proposal } from "shared/sdk";
import { combineLatest, Subscription } from "rxjs";
import {
  selectPage,
  selectProposalsCount,
  selectProposalsPerPage,
  selectProposals,
  selectDateRangeFilter,
  selectHasAppliedFilters,
  selectFilters,
  selectHasPrefilledFilters,
  selectTextFilter,
} from "state-management/selectors/proposals.selectors";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import {
  changePageAction,
  sortByColumnAction,
  fetchProposalsAction,
  setTextFilterAction,
  setDateRangeFilterAction,
  clearFacetsAction,
  prefillFiltersAction,
} from "state-management/actions/proposals.actions";
import { filter, map, distinctUntilChanged, take } from "rxjs/operators";
import deepEqual from "deep-equal";
import { ProposalFilters } from "state-management/state/proposals.store";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateTime } from "luxon";

interface ProposalTableData {
  proposalId: string;
  title: string;
  author: string;
  start: string;
  end: string;
}

interface DateRange {
  begin: string;
  end: string;
}

@Component({
  selector: "proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"],
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {
  hasAppliedFilters$ = this.store.select(selectHasAppliedFilters);
  textFilter$ = this.store.select(selectTextFilter);
  dateRangeFilter$ = this.store.select(selectDateRangeFilter);
  readyToFetch$ = this.store
    .select(selectHasPrefilledFilters)
    .pipe(filter((has) => has));
  currentPage$ = this.store.select(selectPage);
  proposalsCount$ = this.store.select(selectProposalsCount);
  proposalsPerPage$ = this.store.select(selectProposalsPerPage);

  clearSearchBar = false;
  dateRange: DateRange = {
    begin: "",
    end: "",
  };
  subscriptions: Subscription[] = [];

  tableData: ProposalTableData[] = [];
  tableColumns: TableColumn[] = [
    {
      name: "proposalId",
      icon: "perm_contact_calendar",
      sort: true,
      inList: false,
    },
    { name: "title", icon: "fingerprint", sort: true, inList: true },
    { name: "author", icon: "face", sort: true, inList: true },
    { name: "start", icon: "timer", sort: true, inList: true },
    { name: "end", icon: "timer_off", sort: true, inList: true },
  ];
  tablePaginate = true;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  formatTableData(proposals: Proposal[]): ProposalTableData[] {
    return proposals.map((proposal) => {
      const data: ProposalTableData = {
        proposalId: proposal.proposalId,
        title: proposal.title,
        author: proposal.firstname + " " + proposal.lastname,
        start: "--",
        end: "--",
      };
      if (proposal.startTime && proposal.endTime) {
        data.start =
          this.datePipe.transform(proposal.startTime, "yyyy-MM-dd") ?? "--";
        data.end =
          this.datePipe.transform(proposal.endTime, "yyyy-MM-dd") ?? "--";
      } else if (
        proposal.MeasurementPeriodList &&
        proposal.MeasurementPeriodList.length > 0
      ) {
        data.start =
          this.datePipe.transform(
            proposal.MeasurementPeriodList[0].start,
            "yyyy-MM-dd"
          ) ?? "--";
        data.end =
          this.datePipe.transform(
            proposal.MeasurementPeriodList[
              proposal.MeasurementPeriodList.length - 1
            ].end,
            "yyyy-MM-dd"
          ) ?? "--";
      }
      return data;
    });
  }

  onClear() {
    this.clearSearchBar = true;
    this.store.dispatch(clearFacetsAction());
  }

  onTextSearchChange(query: string) {
    this.clearSearchBar = false;
    this.store.dispatch(setTextFilterAction({ text: query }));
    this.store.dispatch(fetchProposalsAction());
  }

  onDateChange(event: MatDatepickerInputEvent<DateTime>) {
    if (event.value) {
      const name = event.targetElement.getAttribute("name");
      if (name === "begin") {
        this.dateRange.begin = event.value.toUTC().toISO();
      }
      if (name === "end") {
        this.dateRange.end = event.value.toUTC().plus({ days: 1 }).toISO();
      }
      if (this.dateRange.begin.length > 0 && this.dateRange.end.length > 0) {
        this.store.dispatch(
          setDateRangeFilterAction({
            begin: this.dateRange.begin,
            end: this.dateRange.end,
          })
        );
      }
    }
    this.store.dispatch(fetchProposalsAction());
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
  }

  onSortChange(event: SortChangeEvent) {
    switch (event.active) {
      case "author": {
        event.active = "firstname";
        break;
      }
      case "start": {
        event.active = "startTime";
        break;
      }
      case "end": {
        event.active = "endTime";
        break;
      }
      default: {
        break;
      }
    }
    this.store.dispatch(
      sortByColumnAction({ column: event.active, direction: event.direction })
    );
  }

  onRowClick(proposal: Proposal) {
    const id = encodeURIComponent(proposal.proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(selectProposals).subscribe((proposals) => {
        this.tableData = this.formatTableData(proposals);
      })
    );

    this.subscriptions.push(
      combineLatest([this.store.select(selectFilters), this.readyToFetch$])
        .pipe(
          map(([filters, _]) => filters),
          distinctUntilChanged(deepEqual)
        )
        .subscribe((filters) => {
          this.store.dispatch(fetchProposalsAction());
          this.router.navigate(["/proposals"], {
            queryParams: { args: JSON.stringify(filters) },
          });
        })
    );

    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          map((params) => params.args as string),
          take(1),
          map((args) => (args ? (JSON.parse(args) as ProposalFilters) : {}))
        )
        .subscribe((filters) =>
          this.store.dispatch(prefillFiltersAction({ values: filters }))
        )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
