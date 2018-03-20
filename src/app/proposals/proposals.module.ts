import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { ProposalsListComponent } from './components/proposals-list/proposals-list.component';
import { ProposalDetailComponent } from './components/proposal-detail/proposal-detail.component';

import { ListProposalsPageComponent } from './containers/list-proposals-page/list-proposals-page.component';
import { ViewProposalPageComponent } from './containers/view-proposal-page/view-proposal-page.component';

import { proposalsReducer } from '../state-management/reducers/proposals.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature('proposals', proposalsReducer),
		RouterModule,

		MatListModule,
		MatCardModule,
		MatTabsModule,
	],
	declarations: [
		ListProposalsPageComponent,
		ViewProposalPageComponent,

		ProposalsListComponent,
		ProposalDetailComponent,
	],
})
export class ProposalsModule {
};