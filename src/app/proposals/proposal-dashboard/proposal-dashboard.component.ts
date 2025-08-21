import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { Subscription, BehaviorSubject, combineLatest } from "rxjs";
import {
  fetchFacetCountsAction,
  fetchProposalsAction,
} from "state-management/actions/proposals.actions";

export type FilterType = "text" | "dateRange";

export interface FilterLists {
  key: string;
  label: string;
  description?: string;
  type?: FilterType;
}

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

  filterLists: FilterLists[] = [
    {
      key: "proposalId",
      label: "Proposal ID",
      type: "text",
      description: "Filter by Unique identifier for the proposal",
    },
    {
      key: "firstname",
      label: "First Name",
      type: "text",
      description: "Filter by First name of the proposal submitter",
    },
    {
      key: "email",
      label: "Email",
      type: "text",
      description: "Filter by Email of the proposal submitter",
    },
    {
      key: "pi_firstname",
      label: "PI First Name",
      type: "text",
      description: "Filter by First name of the Principal Investigator",
    },
    {
      key: "startTime",
      label: "Start Time",
      type: "dateRange",
      description: "Filter by Start time of the proposal",
    },
    {
      key: "endTime",
      label: "End Time",
      type: "dateRange",
      description: "Filter by End time of the proposal",
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
      "firstname",
      "email",
      "pi_firstname",
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
