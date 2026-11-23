import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import {
  fetchProposalAction,
  fetchParentProposalAction,
  clearProposalsStateAction,
} from "state-management/actions/proposals.actions";
import { selectViewProposalPageViewModel } from "state-management/selectors/proposals.selectors";
import { AppConfigService } from "app-config.service";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { selectIsLoading } from "state-management/selectors/user.selectors";

// the url params of a table in a tab
const TABLE_PARAMS = ["sortColumn", "sortDirection", "pageIndex", "pageSize"];

@Component({
  selector: "view-proposal-page",
  templateUrl: "view-proposal-page.component.html",
  styleUrls: ["view-proposal-page.component.scss"],
  standalone: false,
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
  vm$ = this.store.select(selectViewProposalPageViewModel);
  loading$ = this.store.select(selectIsLoading);
  appConfig = this.appConfigService.getConfig();
  proposal: ProposalClass;
  subscriptions: Subscription[] = [];
  public selectedTabIndex = 0;

  localization = "proposal";

  readonly tabIndexMap: Record<string, number> = {
    details: 0,
    datasets: 1,
    relatedProposals: 2,
    logbook: 3,
  };

  constructor(
    public appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
  ) {}

  // the datasets and the related proposals tabs keep a table in the url
  private hasTable(tabIndex: number): boolean {
    return (
      tabIndex === this.tabIndexMap.datasets ||
      tabIndex === this.tabIndexMap.relatedProposals
    );
  }

  // a reload or the back button can leave table params on a tab without a table
  private removeStrayTableParams(params: Params): void {
    if (this.hasTable(this.selectedTabIndex)) {
      return;
    }
    if (!TABLE_PARAMS.some((param) => param in params)) {
      return;
    }
    this.router.navigate([], {
      queryParams: Object.fromEntries(TABLE_PARAMS.map((p) => [p, null])),
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        if (vm.proposal) {
          this.proposal = vm.proposal;

          if (
            this.proposal["parentProposalId"] &&
            this.selectedTabIndex === 0
          ) {
            this.fetchProposalRelatedDocuments();
          }
        }
      }),
    );

    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.store.dispatch(fetchProposalAction({ proposalId: params.id }));
        this.resetTabs();
      }),
    );

    this.subscriptions.push(
      this.route.queryParams.subscribe((params) =>
        this.removeStrayTableParams(params),
      ),
    );
  }

  onTabChanged(newIndex: number): void {
    this.selectedTabIndex = newIndex;

    // Clear the query params when we change tab
    this.router.navigate([], {
      queryParams: {},
    });
  }

  resetTabs(): void {
    const defaultTab = this.appConfig.defaultTab?.proposal || "details";
    this.selectedTabIndex = this.tabIndexMap[defaultTab] || 0;
  }

  fetchProposalRelatedDocuments(): void {
    this.store.dispatch(
      fetchParentProposalAction({
        proposalId: this.proposal["parentProposalId"] as string,
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.store.dispatch(clearProposalsStateAction());
  }
}
