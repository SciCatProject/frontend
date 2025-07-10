import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { Subscription, BehaviorSubject } from "rxjs";
import { TablePagination } from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  RowEventType,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { changePageAction } from "state-management/actions/datasets.actions";

import { fetchProposalsAction } from "state-management/actions/proposals.actions";

@Component({
  selector: "app-proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"],
  standalone: false,
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  dataSource: BehaviorSubject<ProposalClass[]> = new BehaviorSubject<
    ProposalClass[]
  >([]);

  textSearch = "";

  showGlobalTextSearch = false;

  defaultPageSize = 10;

  tablesSettings: object;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onTextChange(term: string) {
    this.textSearch = term;
  }

  onSearchAction() {
    this.router.navigate([], {
      queryParams: {
        textSearch: this.textSearch || undefined,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
  }

  ngOnInit(): void {
    const params = { ...this.route.snapshot.queryParams };
    if (params.textSearch) {
      // remove the textSearch from params on initial load
      delete params.textSearch;

      this.router.navigate([], {
        queryParams: params,
        replaceUrl: true,
      });
    }

    this.subscriptions.push(
      this.route.queryParams.subscribe((queryParams) => {
        const limit = queryParams.pageSize
          ? +queryParams.pageSize
          : this.defaultPageSize;
        const skip = queryParams.pageIndex ? +queryParams.pageIndex * limit : 0;

        this.store.dispatch(
          fetchProposalsAction({
            limit: limit,
            skip: skip,
            search: queryParams.textSearch,
            sortColumn: queryParams.sortColumn,
            sortDirection: queryParams.sortDirection,
          }),
        );
      }),
    );
  }

  onPageChange(pagination: TablePagination) {
    this.router.navigate([], {
      queryParams: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      queryParamsHandling: "merge",
    });
  }

  onRowClick(proposal: ProposalClass) {
    const id = encodeURIComponent(proposal.proposalId);
    this.router.navigateByUrl(`/proposals/${id}`);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
