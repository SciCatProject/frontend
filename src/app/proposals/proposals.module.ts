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

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SharedCatanieModule } from "shared/shared.module";
import { ProposalDashboardComponent } from "./proposal-dashboard/proposal-dashboard.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { SatDatepickerModule } from "saturn-datepicker";
import { ProposalFilterComponent } from "./proposal-filter/proposal-filter.component";
import { LogbooksModule } from "logbooks/logbooks.module";

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ProposalEffects]),
    FlexLayoutModule,
    LogbooksModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NgxJsonViewerModule,
    RouterModule,
    SatDatepickerModule,
    SharedCatanieModule,
    StoreModule.forFeature("proposals", proposalsReducer)
  ],
  declarations: [
    ViewProposalPageComponent,
    ProposalDetailComponent,
    ProposalDashboardComponent,
    ProposalFilterComponent
  ],
  exports: [],
  providers: [DatePipe, FileSizePipe, SlicePipe]
})
export class ProposalsModule {}
