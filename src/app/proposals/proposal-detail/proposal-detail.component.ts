import { Component, Input } from "@angular/core";
import { Proposal } from "state-management/models";
import { AppConfigService } from "app-config.service";
import { Store } from "@ngrx/store";
import { selectParentProposal } from "state-management/selectors/proposals.selectors";
import { Router } from "@angular/router";

@Component({
  selector: "proposal-detail",
  templateUrl: "proposal-detail.component.html",
  styleUrls: ["proposal-detail.component.scss"],
})
export class ProposalDetailComponent {
  @Input() proposal: Proposal;
  parentProposal: Proposal | undefined;
  parentProposal$ = this.store.select(selectParentProposal);

  appConfig = this.appConfigService.getConfig();

  show = false;

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private router: Router,
  ) {}

  onClickProposal(proposalId: string): void {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }
}
