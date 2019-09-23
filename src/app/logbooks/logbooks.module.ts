import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogbooksTableComponent } from "./logbooks-table/logbooks-table.component";
import { LogbooksDetailComponent } from "./logbooks-detail/logbooks-detail.component";
import {
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatDividerModule
} from "@angular/material";
import { AppConfigModule } from "app-config.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { LinkyModule } from "ngx-linky";
import { RouterModule } from "@angular/router";
import { SharedCatanieModule } from "shared/shared.module";
import { ContentSelectorComponent } from "./content-selector/content-selector.component";
import { LogbooksDashboardComponent } from "./logbooks-dashboard/logbooks-dashboard.component";
import { EffectsModule } from "@ngrx/effects";
import { LogbookEffect } from "state-management/effects/logbooks.effects";
import { logbooksReducer } from "state-management/reducers/logbooks.reducer";
import { StoreModule } from "@ngrx/store";

@NgModule({
  declarations: [
    LogbooksTableComponent,
    LogbooksDetailComponent,
    ContentSelectorComponent,
    LogbooksDashboardComponent
  ],
  imports: [
    AppConfigModule,
    CommonModule,
    FlexLayoutModule,
    LinkyModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    RouterModule,
    SharedCatanieModule,
    StoreModule.forFeature("logbooks", logbooksReducer),
    EffectsModule.forFeature([LogbookEffect])
  ],
  providers: [],
  exports: [
    LogbooksTableComponent,
    LogbooksDetailComponent,
    LogbooksDashboardComponent,
    ContentSelectorComponent
  ]
})
export class LogbooksModule {}
