import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { StoreModule } from '@ngrx/store';

import { ProposalsListComponent } from './proposals-list/proposals-list.component';
import { proposalsReducer } from '../state-management/reducers/proposals.reducer';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature('proposals', proposalsReducer),

		MatListModule,
	],
	declarations: [
		ProposalsListComponent,
	],
})
export class ProposalsModule {
};