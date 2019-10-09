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
  getProposals
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
  setTextFilterAction
} from "state-management/actions/proposals.actions";

@Component({
  selector: "proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"]
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {
  private proposalsSubscription: Subscription;

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
    { name: "start", icon: "timer", sort: false, inList: true },
    { name: "end", icon: "timer_off", sort: false, inList: true }
  ];
  tablePaginate = true;
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
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
        if (
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

  onTextSearchChange(query: string) {
    this.store.dispatch(setTextFilterAction({ text: query }));
    this.store.dispatch(fetchProposalsAction());
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
  }

  onSortChange(event: SortChangeEvent) {
    if (event.active === "author") {
      event.active = "firstname";
    }
    this.store.dispatch(
      sortByColumnAction({ column: event.active, direction: event.direction })
    );
  }

  onRowClick(proposal: Proposal) {
    this.router.navigateByUrl("/proposals/" + proposal.proposalId);
  }

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
