import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoliciesComponent } from "./policies/policies.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PoliciesService } from "./policies.service";
import { EditDialogComponent } from "./edit-dialog/edit-dialog.component";
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
  MatOptionModule
} from "@angular/material";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { SharedCatanieModule } from "shared/shared.module";

import { StoreModule } from "@ngrx/store";
import { policiesReducer } from "state-management/reducers/policies.reducer";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTableModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedCatanieModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    StoreModule.forFeature("policies", policiesReducer),
    MatDialogModule,
    FlexLayoutModule,
    MatExpansionModule
  ],
  declarations: [PoliciesComponent, EditDialogComponent],
  providers: [PoliciesService],
  exports: [PoliciesComponent],
  entryComponents: [EditDialogComponent]
})
export class PoliciesModule {}
