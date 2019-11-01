import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Proposal } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  getPage,
  getProposalsCount,
  getProposalsPerPage,
  getProposals,
  getDateRangeFilter,
  getHasAppliedFilters
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
  clearFacetsAction
} from "state-management/actions/proposals.actions";
import { MatDatepickerInputEvent } from "@angular/material";
import { DateRange } from "datasets/datasets-filter/datasets-filter.component";

@Component({
  selector: "proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"]
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {
  private proposalsSubscription: Subscription;
  clearSearchBar: boolean;

  hasAppliedFilters$ = this.store.pipe(select(getHasAppliedFilters));
  dateRangeFilter$ = this.store.pipe(select(getDateRangeFilter));
  currentPage$ = this.store.pipe(select(getPage));
  proposalsCount$ = this.store.pipe(select(getProposalsCount));
  proposalsPerPage$ = this.store.pipe(select(getProposalsPerPage));

  tableData: any[];
  tableColumns: TableColumn[] = [
    {
      name: "proposalId",
      icon: "perm_contact_calendar",
      sort: false,
      inList: false
    },
    { name: "title", icon: "fingerprint", sort: true, inList: true },
    { name: "author", icon: "face", sort: true, inList: true },
    { name: "start", icon: "timer", sort: true, inList: true },
    { name: "end", icon: "timer_off", sort: true, inList: true }
  ];
  tablePaginate = true;

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

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    private router: Router,
    private store: Store<Proposal>
  ) {}

  ngOnInit() {
    this.store.dispatch(fetchProposalsAction());

    this.proposalsSubscription = this.store
      .pipe(select(getProposals))
      .subscribe(proposals => {
        this.tableData = this.formatTableData(proposals);
      });
  }

  ngOnDestroy() {
    this.proposalsSubscription.unsubscribe();
  }
}
