import { NgxJsonViewerModule } from "ngx-json-viewer";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { ProposalDetailComponent } from "./components/proposal-detail/proposal-detail.component";

import { ViewProposalPageComponent } from "./containers/view-proposal-page/view-proposal-page.component";

import { proposalsReducer } from "../state-management/reducers/proposals.reducer";
import { ProposalsEffects } from "../state-management/effects/proposals.effects";

import {
  MatTableModule,
  MatTooltipModule,
  MatTabsModule,
  MatCardModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule
} from "@angular/material";
import { SharedCatanieModule } from "../shared/shared.module";
import { ProposalDashboardComponent } from "./proposal-dashboard/proposal-dashboard.component";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ProposalsEffects]),
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NgxJsonViewerModule,
    RouterModule,
    SharedCatanieModule,
    StoreModule.forFeature("proposals", proposalsReducer)
  ],
  declarations: [
    ViewProposalPageComponent,
    ProposalDetailComponent,
    ProposalDashboardComponent
  ],
  exports: [],
  providers: [DatePipe]
})
export class ProposalsModule {}
