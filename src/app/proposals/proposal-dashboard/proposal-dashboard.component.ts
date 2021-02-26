import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Proposal } from "shared/sdk";
import { combineLatest, Subscription } from "rxjs";
import {
  getPage,
  getProposalsCount,
  getProposalsPerPage,
  getProposals,
  getDateRangeFilter,
  getHasAppliedFilters,
  getFilters,
  getHasPrefilledFilters,
  getTextFilter
} from "state-management/selectors/proposals.selectors";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import {
  changePageAction,
  sortByColumnAction,
  fetchProposalsAction,
  setTextFilterAction,
  setDateRangeFilterAction,
  clearFacetsAction,
  prefillFiltersAction
} from "state-management/actions/proposals.actions";
import { DateRange } from "datasets/datasets-filter/datasets-filter.component";
import * as rison from "rison";
import {
  filter,
  map,
  distinctUntilChanged,
  take
} from "rxjs/operators";
import * as deepEqual from "deep-equal";
import { ProposalFilters } from "state-management/state/proposals.store";

@Component({
  selector: "proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"]
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {
  hasAppliedFilters$ = this.store.pipe(select(getHasAppliedFilters));
  textFilter$ = this.store.pipe(select(getTextFilter));
  dateRangeFilter$ = this.store.pipe(select(getDateRangeFilter));
  readyToFetch$ = this.store.pipe(
    select(getHasPrefilledFilters),
    filter(has => has)
  );
  currentPage$ = this.store.pipe(select(getPage));
  proposalsCount$ = this.store.pipe(select(getProposalsCount));
  proposalsPerPage$ = this.store.pipe(select(getProposalsPerPage));

  clearSearchBar: boolean;
  subscriptions: Subscription[] = [];

  tableData: any[];
  tableColumns: TableColumn[] = [
    {
      name: "proposalId",
      icon: "perm_contact_calendar",
      sort: true,
      inList: false
    },
    { name: "title", icon: "fingerprint", sort: true, inList: true },
    { name: "author", icon: "face", sort: true, inList: true },
    { name: "start", icon: "timer", sort: true, inList: true },
    { name: "end", icon: "timer_off", sort: true, inList: true }
  ];
  tablePaginate = true;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<Proposal>
  ) {}

  formatTableData(proposals: Proposal[]): any[] {
    if (proposals) {
      return proposals.map(proposal => {
        const data: any = {
          proposalId: proposal.proposalId,
          title: proposal.title,
          author: proposal.firstname + " " + proposal.lastname
        };
        if (proposal.startTime && proposal.endTime) {
          data.start = this.datePipe.transform(
            proposal.startTime,
            "yyyy-MM-dd"
          );
          data.end = this.datePipe.transform(proposal.endTime, "yyyy-MM-dd");
        } else if (
          proposal.MeasurementPeriodList &&
          proposal.MeasurementPeriodList.length > 0
        ) {
          data.start = this.datePipe.transform(
            proposal.MeasurementPeriodList[0].start,
            "yyyy-MM-dd"
          );
          data.end = this.datePipe.transform(
            proposal.MeasurementPeriodList[
              proposal.MeasurementPeriodList.length - 1
            ].end,
            "yyyy-MM-dd"
          );
        } else {
          data.start = "--";
          data.end = "--";
        }
        return data;
      });
    }
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

  onDateChange(event: DateRange) {
    if (event) {
      const { begin, end } = event;
      this.store.dispatch(
        setDateRangeFilterAction({
          begin: begin.toISOString(),
          end: end.toISOString()
        })
      );
    } else {
      this.store.dispatch(
        setDateRangeFilterAction({
          begin: null,
          end: null
        })
      );
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
      this.store.pipe(select(getProposals)).subscribe(proposals => {
        this.tableData = this.formatTableData(proposals);
      })
    );

    this.subscriptions.push(
      combineLatest([this.store.pipe(select(getFilters)), this.readyToFetch$])
        .pipe(
          map(([filters, _]) => filters),
          distinctUntilChanged(deepEqual)
        )
        .subscribe((filters) => {
          this.store.dispatch(fetchProposalsAction());
          this.router.navigate(["/proposals"], {
            queryParams: { args: rison.encode(filters) },
          });
        })
    );

    this.subscriptions.push(
      this.route.queryParams
        .pipe(
          map(params => params.args as string),
          take(1),
          map(args => (args ? rison.decode<ProposalFilters>(args) : {}))
        )
        .subscribe(filters =>
          this.store.dispatch(prefillFiltersAction({ values: filters }))
        )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
