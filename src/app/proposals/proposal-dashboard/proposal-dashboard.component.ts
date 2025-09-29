import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { Subscription, BehaviorSubject, combineLatest } from "rxjs";
import { fetchInstrumentsAction } from "state-management/actions/instruments.actions";
import {
  fetchFacetCountsAction,
  fetchProposalsAction,
} from "state-management/actions/proposals.actions";
import { FilterConfig } from "state-management/state/user.store";

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

  filterLists: FilterConfig[] = [
    {
      key: "instrumentIds",
      label: "Instrument",
      type: "checkbox",
      description: "Filter by instrument of the proposal",
      enabled: true,
    },
    {
      key: "pi_lastname",
      label: "PI Last Name",
      type: "checkbox",
      description: "Filter by principal investigator last name",
      enabled: true,
    },
    {
      key: "startTime",
      label: "Start Date",
      type: "dateRange",
      description: "Filter by Start time of the proposal",
      enabled: true,
    },
  ];
  facetLists: string[] = ["pi_lastname", "instrumentIds"];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchInstrumentsAction({ skip: 0, limit: 1000 }));

    // TODO: Shoule we hardcode the facet counts list here?
    this.subscriptions.push(
      combineLatest([this.params$]).subscribe(([queryParams]) => {
        const limit = queryParams.pageSize
          ? +queryParams.pageSize
          : this.defaultPageSize;
        const skip = queryParams.pageIndex ? +queryParams.pageIndex * limit : 0;
        const searchQuery = JSON.parse(queryParams.searchQuery || "{}");

        this.store.dispatch(
          fetchProposalsAction({
            limit,
            skip,
            search: searchQuery,
            sortColumn: queryParams.sortColumn,
            sortDirection: queryParams.sortDirection,
          }),
        );

        this.store.dispatch(
          fetchFacetCountsAction({
            fields: searchQuery,
            facets: this.facetLists,
          }),
        );
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
