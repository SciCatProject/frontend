import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/*import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';*/

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ProposalsListComponent } from './components/proposals-list/proposals-list.component';
import { ProposalDetailComponent } from './components/proposal-detail/proposal-detail.component';

import { ListProposalsPageComponent } from './containers/list-proposals-page/list-proposals-page.component';
import { ViewProposalPageComponent } from './containers/view-proposal-page/view-proposal-page.component';

import { ProposalsService } from './proposals.service';

import { proposalsReducer } from '../state-management/reducers/proposals.reducer';
import { ProposalsEffects } from '../state-management/effects/proposals.effects';

import { DatasetService } from '../datasets/dataset.service';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  // MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatFormFieldModule,
  MatOptionModule,
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
