import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogbooksTableComponent } from "./logbooks-table/logbooks-table.component";
import { LogbooksDetailComponent } from "./logbooks-detail/logbooks-detail.component";
import { LogbookService } from "./logbook.service";
import {
  MatCardModule,
  MatDatepickerModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  MatButtonToggleModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSortModule,
  MatTabsModule,
  MatTooltipModule,
  MatExpansionModule
} from "@angular/material";
import { AppConfigModule } from "app-config.module";
import { FileHelpersModule } from "ngx-file-helpers";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LinkyModule } from "ngx-linky";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { RouterModule } from "@angular/router";
import { SatDatepickerModule } from "saturn-datepicker";
import { SharedCatanieModule } from "shared/shared.module";
import { ContentSelectorComponent } from "./content-selector/content-selector.component";
import { LogbooksDashboardComponent } from "./logbooks-dashboard/logbooks-dashboard.component";
import { LogbooksFilterComponent } from "./logbooks-filter/logbooks-filter.component";
import { EffectsModule } from "@ngrx/effects";
import { LogbookEffect } from "state-management/effects/logbooks.effects";
import { logbooksReducer } from "state-management/reducers/logbooks.reducer";
import { StoreModule } from "@ngrx/store";

@NgModule({
  declarations: [
    LogbooksTableComponent,
    LogbooksDetailComponent,
    ContentSelectorComponent,
    LogbooksDashboardComponent,
    LogbooksFilterComponent
  ],
  imports: [
    AppConfigModule,
    CommonModule,
    FileHelpersModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FormsModule,
    LinkyModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonToggleModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    RouterModule,
    SatDatepickerModule,
    SharedCatanieModule,
    StoreModule.forFeature("logbooks", logbooksReducer),
    EffectsModule.forFeature([LogbookEffect])
  ],
  providers: [LogbookService],
  exports: [
    LogbooksTableComponent,
    LogbooksDetailComponent,
    LogbooksDashboardComponent,
    ContentSelectorComponent
  ]
})
export class LogbooksModule {}
