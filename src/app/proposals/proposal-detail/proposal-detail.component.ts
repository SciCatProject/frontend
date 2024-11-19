import { Component, Input, OnInit } from "@angular/core";
import { Proposal } from "state-management/models";
import { AppConfigService } from "app-config.service";
import { Store } from "@ngrx/store";
import {
  selectCurrentProposal,
  selectParentProposal,
} from "state-management/selectors/proposals.selectors";
import { Router } from "@angular/router";
import { updatePropertyAction } from "state-management/actions/proposals.actions";
import { Observable, Subscription, combineLatest, fromEvent, map } from "rxjs";
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { clearProposalsStateAction } from "state-management/actions/proposals.actions";

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"],
})
export class ProposalDetailComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  private _hasUnsavedChanges = false;
  @Input() proposal: Proposal;
  parentProposal: Proposal | undefined;
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
    private store: Store,
    private router: Router,
  ) {}

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
      this.store.select(selectCurrentProposal).subscribe((proposal) => {
        this.proposal = proposal;

        combineLatest([this.accessGroups$, this.isAdmin$]).subscribe(
          ([groups, isAdmin]) => {
            this.editingAllowed =
              groups.indexOf(this.proposal?.ownerGroup) !== -1 || isAdmin;
          },
        );
      }),
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
      const proposalId = this.proposal.proposalId;
      const property = { metadata };
      this.store.dispatch(updatePropertyAction({ proposalId, property }));
    }
  }

  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }
}
