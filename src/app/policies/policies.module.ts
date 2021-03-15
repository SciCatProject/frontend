import { PolicyEffects } from "./../state-management/effects/policies.effects";
import { EffectsModule } from "@ngrx/effects";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditDialogComponent } from "./edit-dialog/edit-dialog.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
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
    FlexModule,
  ],
  declarations: [EditDialogComponent, PoliciesDashboardComponent],
  exports: [],
})
export class PoliciesModule {}
