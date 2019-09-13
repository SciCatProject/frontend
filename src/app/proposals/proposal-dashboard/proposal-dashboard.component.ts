import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Proposal } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  getHasFetched,
  getProposalPage,
  getProposalCount,
  getProposalsPerPage,
  getProposalList
} from "state-management/selectors/proposals.selectors";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import {
  ChangePageAction,
  SortProposalByColumnAction,
  FetchProposalAction,
  FetchProposalsAction,
  SearchProposalAction
} from "state-management/actions/proposals.actions";
import { distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"]
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    private router: Router,
    private store: Store<Proposal>
  ) {}

  private proposalSubscription: Subscription;
  private hasFetchedSubscription: Subscription;

  private hasFetched$ = this.store.pipe(select(getHasFetched));
  currentPage$ = this.store.pipe(select(getProposalPage));
  dataCount$ = this.store.pipe(select(getProposalCount));
  dataPerPage$ = this.store.pipe(select(getProposalsPerPage));

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
    { name: "start", icon: "timer", sort: false, inList: true },
    { name: "end", icon: "timer_off", sort: false, inList: true }
  ];
  tablePaginate = true;

  formatTableData(proposals: Proposal[]): any[] {
    if (proposals) {
      return proposals.map(proposal => {
        let data: any = {
          proposalId: proposal.proposalId,
          title: proposal.title,
          author: proposal.firstname + " " + proposal.lastname
        };
        if (
          proposal.MeasurementPeriodList &&
          proposal.MeasurementPeriodList.length > 0
        ) {
          data.start = this.datePipe.transform(
            proposal.MeasurementPeriodList[0].start,
            "yyyy-MM-dd"
          );
          data.end = this.datePipe.transform(
            proposal.MeasurementPeriodList[0].end,
            "yyyy-MM-dd"
          );
        } else {
          data.start = "--";
          data.end = "--";
        }
        return data;
      });
    } else {
      return [];
    }
  }

  onTextSearchChange(query: string) {
    this.store.dispatch(new SearchProposalAction(query));
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(new ChangePageAction(event.pageIndex, event.pageSize));
  }

  onSortChange(event: SortChangeEvent) {
    if (event.active === "author") {
      event.active = "firstname";
    }
    this.store.dispatch(
      new SortProposalByColumnAction(event.active, event.direction)
    );
  }

  onRowSelect(proposal: Proposal) {
    this.store.dispatch(new FetchProposalAction(proposal.proposalId));
    this.router.navigateByUrl("/proposals/" + proposal.proposalId);
  }

  ngOnInit() {
    this.hasFetchedSubscription = this.hasFetched$
      .pipe(
        distinctUntilChanged(),
        map(() => new FetchProposalsAction())
      )
      .subscribe(this.store);

    this.proposalSubscription = this.store
      .pipe(select(getProposalList))
      .subscribe(proposals => {
        this.tableData = this.formatTableData(proposals);
      });
  }

  ngOnDestroy() {
    this.proposalSubscription.unsubscribe();
    this.hasFetchedSubscription.unsubscribe();
  }
}
