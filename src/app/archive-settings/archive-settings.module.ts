import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveSettingsComponent} from 'archive-settings/archive-settings.component'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  // MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatOptionModule,
} from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { SharedCatanieModule } from 'shared/shared.module';

import { MatDatepickerModule } from 'saturn-datepicker';

import { StoreModule } from '@ngrx/store';
import { datasetsReducer } from 'state-management/reducers/datasets.reducer';


@NgModule({
  imports: [
    CommonModule, MatCardModule, MatDialogModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatFormFieldModule, MatAutocompleteModule,
    MatTabsModule, MatInputModule, MatButtonModule, MatSortModule, CommonModule, FormsModule, ReactiveFormsModule,
    SharedCatanieModule, MatSelectModule, MatOptionModule, MatNativeDateModule, MatIconModule,
    MatListModule, MatDatepickerModule, MatTooltipModule, MatButtonToggleModule, MatProgressSpinnerModule, MatChipsModule

  ],
  declarations: [ArchiveSettingsComponent],
  exports: [ArchiveSettingsComponent]
})
export class ArchiveSettingsModule { }
