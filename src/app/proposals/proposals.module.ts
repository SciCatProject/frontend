import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ProposalsListComponent } from './components/proposals-list/proposals-list.component';
import { ProposalDetailComponent } from './components/proposal-detail/proposal-detail.component';

import { ListProposalsPageComponent } from './containers/list-proposals-page/list-proposals-page.component';
import { ViewProposalPageComponent } from './containers/view-proposal-page/view-proposal-page.component';

import { ProposalsService } from './proposals.service';
import { DatasetService } from '../datasets/dataset.service';

import { proposalsReducer } from '../state-management/reducers/proposals.reducer';
import { ProposalsEffects } from '../state-management/effects/proposals.effects';

import {
  MatListModule,
  MatTableModule,
  MatTabsModule,
  MatCardModule,
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        StoreModule.forFeature('proposals', proposalsReducer),
        EffectsModule.forFeature([ProposalsEffects]),

        MatListModule,
        MatCardModule,
        MatTabsModule,
        MatTableModule,
    ],
    declarations: [
        ListProposalsPageComponent,
        ViewProposalPageComponent,

        ProposalsListComponent,
        ProposalDetailComponent,
    ],
    providers: [
        ProposalsService,
        DatasetService,
    ]
})
export class ProposalsModule {
};
