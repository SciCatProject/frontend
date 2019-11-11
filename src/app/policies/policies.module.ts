import { PolicyEffects } from './../state-management/effects/policies.effects';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditDialogComponent } from "./edit-dialog/edit-dialog.component";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatOptionModule,
  MatChipsModule,
  MatExpansionModule
} from "@angular/material";
import { SharedCatanieModule } from "shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { policiesReducer } from "state-management/reducers/policies.reducer";
import { PoliciesDashboardComponent } from "./policies-dashboard/policies-dashboard.component";
import { FlexModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([PolicyEffects]),
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    SharedCatanieModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatChipsModule,
    StoreModule.forFeature("policies", policiesReducer),
    MatDialogModule,
    MatExpansionModule,
    FlexModule
  ],
  declarations: [EditDialogComponent, PoliciesDashboardComponent],
  exports: [],
  entryComponents: [EditDialogComponent]
})
export class PoliciesModule {}
