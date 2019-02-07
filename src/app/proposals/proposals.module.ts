import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { ProposalsListComponent } from "./components/proposals-list/proposals-list.component";
import { ProposalDetailComponent } from "./components/proposal-detail/proposal-detail.component";

import { ListProposalsPageComponent } from "./containers/list-proposals-page/list-proposals-page.component";
import { ViewProposalPageComponent } from "./containers/view-proposal-page/view-proposal-page.component";

import { ProposalsService } from "./proposals.service";
import { DatasetService } from "../datasets/dataset.service";

import { proposalsReducer } from "../state-management/reducers/proposals.reducer";
import { ProposalsEffects } from "../state-management/effects/proposals.effects";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  MatListModule,
  MatTableModule,
  MatTooltipModule,
  MatTabsModule,
  MatCardModule,
  MatIconModule,
  MatPaginatorModule
} from "@angular/material";
import { SharedCatanieModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedCatanieModule,
    FontAwesomeModule,
    StoreModule.forFeature("proposals", proposalsReducer),
    EffectsModule.forFeature([ProposalsEffects]),
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [
    ListProposalsPageComponent,
    ViewProposalPageComponent,

    ProposalsListComponent,
    ProposalDetailComponent
  ],
  providers: [ProposalsService, DatasetService]
})
export class ProposalsModule {}
