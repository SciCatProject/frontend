import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoliciesComponent } from "./policies/policies.component";
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
  MatExpansionModule,
  MatChipsModule
} from "@angular/material";
import { SharedCatanieModule } from "shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { policiesReducer } from "state-management/reducers/policies.reducer";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
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
    StoreModule.forFeature("policies", policiesReducer)
  ],
  declarations: [PoliciesComponent, EditDialogComponent],
  providers: [],
  exports: [PoliciesComponent],
  entryComponents: [EditDialogComponent]
})
export class PoliciesModule {}
