import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { Subscription, BehaviorSubject, combineLatest } from "rxjs";
import { fetchInstrumentsAction } from "state-management/actions/instruments.actions";
import {
  fetchFacetCountsAction,
  fetchProposalsAction,
  setInitialProposalsFiltersAction,
} from "state-management/actions/proposals.actions";

@Component({
  selector: "app-proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"],
  standalone: false,
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  dataSource$ = new BehaviorSubject<ProposalClass[]>([]);
  params$ = this.route.queryParams;
  defaultPageSize = 10;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchInstrumentsAction({ skip: 0, limit: 1000 }));

    this.subscriptions.push(
      combineLatest([this.params$]).subscribe(([queryParams]) => {
        const limit = queryParams.pageSize
          ? +queryParams.pageSize
          : this.defaultPageSize;
        const skip = queryParams.pageIndex ? +queryParams.pageIndex * limit : 0;
        const searchQuery = JSON.parse(queryParams.searchQuery || "{}");
        this.store.dispatch(
          setInitialProposalsFiltersAction({ fields: searchQuery }),
        );
        this.store.dispatch(
          fetchProposalsAction({
            limit,
            skip,
            search: searchQuery,
            sortColumn: queryParams.sortColumn,
            sortDirection: queryParams.sortDirection,
          }),
        );

        this.store.dispatch(fetchFacetCountsAction());
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
