import { NgxJsonViewerModule } from "ngx-json-viewer";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe, SlicePipe } from "@angular/common";
import { RouterModule } from "@angular/router";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { ProposalDetailComponent } from "./proposal-detail/proposal-detail.component";

import { ViewProposalPageComponent } from "./view-proposal-page/view-proposal-page.component";

import { proposalsReducer } from "../state-management/reducers/proposals.reducer";
import { ProposalEffects } from "../state-management/effects/proposals.effects";

import {
  MatTableModule,
  MatTooltipModule,
  MatTabsModule,
  MatCardModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatButtonModule
} from "@angular/material";
import { SharedCatanieModule } from "../shared/shared.module";
import { ProposalDashboardComponent } from "./proposal-dashboard/proposal-dashboard.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FileSizePipe } from "shared/pipes/filesize.pipe";

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ProposalEffects]),
    FlexLayoutModule,
    MatButtonModule,
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
  providers: [DatePipe, FileSizePipe, SlicePipe]
})
export class ProposalsModule {}
