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
import { SharedScicatFrontendModule } from "shared/shared.module";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { ProposalFilterComponent } from "./proposal-filter/proposal-filter.component";
import { LogbooksModule } from "logbooks/logbooks.module";
import { ProposalDashboardComponent } from "./proposal-dashboard/proposal-dashboard.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { LogbookEffects } from "state-management/effects/logbooks.effects";
import { logbooksReducer } from "state-management/reducers/logbooks.reducer";
import { ProposalLogbookComponent } from "./proposal-logbook/proposal-logbook.component";
import { RelatedProposalsComponent } from "./related-proposals/related-proposals.component";
import { ProposalDatasetsComponent } from "./proposal-datasets/proposal-datasets.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([ProposalEffects, LogbookEffects]),
    FlexLayoutModule,
    LogbooksModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
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
    SharedScicatFrontendModule,
    StoreModule.forFeature("proposals", proposalsReducer),
    StoreModule.forFeature("logbooks", logbooksReducer),
    TranslateModule,
  ],
  declarations: [
    ViewProposalPageComponent,
    ProposalDetailComponent,
    ProposalFilterComponent,
    ProposalDashboardComponent,
    ProposalLogbookComponent,
    RelatedProposalsComponent,
    ProposalDatasetsComponent,
  ],
  exports: [],
  providers: [DatePipe, FileSizePipe, SlicePipe],
})
export class ProposalsModule {}
