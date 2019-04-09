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
  MatTooltipModule
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

@NgModule({
  declarations: [LogbooksTableComponent, LogbooksDetailComponent],
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
    SharedCatanieModule
  ],
  providers: [LogbookService],
  exports: [LogbooksTableComponent, LogbooksDetailComponent]
})
export class LogbooksModule {}
