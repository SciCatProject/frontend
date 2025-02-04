import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
import { Store } from "@ngrx/store";
import {
  selectCurrentProposal,
  selectParentProposal,
} from "state-management/selectors/proposals.selectors";
import { Router } from "@angular/router";
import { updateProposalPropertyAction } from "state-management/actions/proposals.actions";
import {
  Observable,
  Subscription,
  combineLatest,
  fromEvent,
  map,
  switchMap,
} from "rxjs";
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { clearProposalsStateAction } from "state-management/actions/proposals.actions";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"],
})
export class ProposalDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private _hasUnsavedChanges = false;
  @Input() proposal: ProposalClass;
  parentProposal: ProposalClass | undefined;
  parentProposal$ = this.store.select(selectParentProposal);
  editingAllowed = false;
  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : [])),
  );

  appConfig = this.appConfigService.getConfig();

  show = false;

  constructor(
    public appConfigService: AppConfigService,
    private translateService: TranslateService,
    private store: Store,
    private router: Router,
  ) {
    this.translateService.use(this.appConfig.labelsLocalization?.proposal);
  }

  ngOnInit(): void {
    // Prevent user from reloading page if there are unsave changes
    this.subscriptions.push(
      fromEvent(window, "beforeunload").subscribe((event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      }),
    );

    this.subscriptions.push(
      this.store
        .select(selectCurrentProposal)
        .pipe(
          switchMap((proposal) => {
            this.proposal = proposal;
            return combineLatest([this.accessGroups$, this.isAdmin$]).pipe(
              map(([groups, isAdmin]) => ({
                proposal,
                groups,
                isAdmin,
              })),
            );
          }),
          map(({ proposal, groups, isAdmin }) => {
            this.editingAllowed =
              groups.indexOf(proposal?.ownerGroup) !== -1 || isAdmin;
          }),
        )
        .subscribe(),
    );
  }

  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }

  onClickProposal(proposalId: string): void {
    this.store.dispatch(clearProposalsStateAction());
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }

  onSaveMetadata(metadata: Record<string, any>) {
    if (this.proposal) {
      const { proposalId } = this.proposal;
      const property = { metadata };

      this.store.dispatch(
        updateProposalPropertyAction({ proposalId, property }),
      );
    }
  }

  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
