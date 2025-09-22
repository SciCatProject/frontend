import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { Subscription, BehaviorSubject, combineLatest } from "rxjs";
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
      type: "text",
      description: "Filter by instrument ofthe proposal",
      enabled: true,
    },
    {
      key: "pi_lastname",
      label: "PI Last Name",
      type: "text",
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

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // TODO: Shoule we hardcode the facet counts list here?
    const facetCountsList = [
      "proposalId",
      "pi_lastname",
      "startTime",
      "endTime",
    ];
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
            facets: facetCountsList,
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
