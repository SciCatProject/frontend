import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { TranslateService } from "@ngx-translate/core";
import { selectIsLoading } from "state-management/selectors/user.selectors";

@Component({
  selector: "view-proposal-page",
  templateUrl: "view-proposal-page.component.html",
  styleUrls: ["view-proposal-page.component.scss"],
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
  vm$ = this.store.select(selectViewProposalPageViewModel);
  loading$ = this.store.select(selectIsLoading);
  appConfig = this.appConfigService.getConfig();
  proposal: ProposalClass;
  subscriptions: Subscription[] = [];
  public selectedTabIndex = 0;

  constructor(
    public appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private translateService: TranslateService,
  ) {
    this.translateService.use("proposalDefault");
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
  }

  onTabChanged(newIndex: number): void {
    this.selectedTabIndex = newIndex;

    // Clear the query params when we change tab
    this.router.navigate([], {
      queryParams: {},
    });
  }

  resetTabs(): void {
    this.selectedTabIndex = 0;
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
