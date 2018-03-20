import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { ProposalsListComponent } from './proposals-list/proposals-list.component';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';

import { proposalsReducer } from '../state-management/reducers/proposals.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature('proposals', proposalsReducer),
		RouterModule,

		MatListModule,
		MatCardModule,
	],
	declarations: [
		ProposalsListComponent,
		ProposalDetailComponent,
	],
})
export class ProposalsModule {
};