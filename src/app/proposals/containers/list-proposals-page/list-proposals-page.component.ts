import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { AppState } from "state-management/state/app.store";
import { Proposal } from "state-management/models";
import {
  getProposalList,
  getHasFetched
} from "state-management/selectors/proposals.selectors";
import { FetchProposalsAction, FetchCountOfProposals } from "state-management/actions/proposals.actions";

@Component({
  selector: "list-proposals-page",
  template: `
        <proposals-list [proposals]="proposals$ | async">
        </proposals-list>
    `
})
export class ListProposalsPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  proposals$: Observable<Proposal[]>;
  private hasFetched$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.proposals$ = this.store.pipe(select(getProposalList));
    this.hasFetched$ = this.store.pipe(select(getHasFetched));
    //this.store.dispatch(new FetchCountOfProposals(null));

    this.subscription = this.hasFetched$
      .pipe(
        distinctUntilChanged(),
        map(() => new FetchProposalsAction())
      )
      .subscribe(this.store);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
