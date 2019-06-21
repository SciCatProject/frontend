import { Component, Input, Inject } from "@angular/core";
import { Proposal } from "state-management/models";
import { FetchProposalAction } from "state-management/actions/proposals.actions";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { SortChangeEvent } from "datasets";
import { getProposalCount, getProposalPage } from "state-management/selectors/proposals.selectors";

@Component({
  selector: "proposals-list",
  templateUrl: "proposals-list.component.html",
  styleUrls: ["proposals-list.component.css"]
})
export class ProposalsListComponent {
  @Input()
  proposals: Proposal[];

  displayedColumns = ["proposalId", "title", "name", "start", "end"];
  proposalsCount$ = this.store.pipe(select(getProposalCount));
  proposalsPerPage$ = this.store.pipe(select(getProposalCount));
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
    // this.store.dispatch(new SortProposalByColumnAction(column, direction));
  }
}
