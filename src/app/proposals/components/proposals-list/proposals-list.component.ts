import { Component, Input, Inject, OnDestroy } from "@angular/core";
import { Proposal } from "state-management/models";
import { FetchProposalAction, ChangePageAction } from "state-management/actions/proposals.actions";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { SortChangeEvent } from "datasets";
import {
  getProposalCount,
  getProposalPage,
  getProposalsPerPage
} from "state-management/selectors/proposals.selectors";
import { Subscription } from "rxjs";

@Component({
  selector: "proposals-list",
  templateUrl: "proposals-list.component.html",
  styleUrls: ["proposals-list.component.css"]
})
export class ProposalsListComponent implements OnDestroy {
  @Input()
  proposals: Proposal[];
  private subscriptions: Subscription;
  public page: number;

  displayedColumns = ["proposalId", "title", "name", "start", "end"];
  proposalsCount$ = this.store.pipe(select(getProposalCount));
  proposalsPerPage$ = this.store.pipe(select(getProposalsPerPage));
  currentPage$ = this.store.pipe(select(getProposalPage));
  pageSize$ = this.store.pipe(select(getProposalCount));

  constructor(
    private store: Store<Proposal>,
    private router: Router,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  onRowSelect(event, proposal) {
    this.store.dispatch(new FetchProposalAction(proposal));
    this.router.navigateByUrl(
      "/proposals/" + encodeURIComponent(proposal.proposalId)
    );
  }

  onSortChange(event: SortChangeEvent): void {
    const { active: column, direction } = event;
    console.log("gm", column, direction);
    // this.store.dispatch(new SortProposalByColumnAction(column, direction));
  }

  ngOnDestroy() {
    // this.subscriptions.unsubscribe();
  }


  onPageChange(event: any): void {
    this.store.dispatch(
      new ChangePageAction( event.pageIndex, event.pageSize)
    );
    this.page = event.pageIndex;
  }
}
