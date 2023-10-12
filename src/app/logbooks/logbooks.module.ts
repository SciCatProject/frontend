import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogbooksTableComponent } from "./logbooks-table/logbooks-table.component";
import { LogbooksDetailComponent } from "./logbooks-detail/logbooks-detail.component";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { LinkyModule } from "ngx-linky";
import { RouterModule } from "@angular/router";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { LogbookFilterComponent } from "./logbook-filter/logbook-filter.component";
import { LogbooksDashboardComponent } from "./logbooks-dashboard/logbooks-dashboard.component";
import { EffectsModule } from "@ngrx/effects";
import { LogbookEffects } from "state-management/effects/logbooks.effects";
import { logbooksReducer } from "state-management/reducers/logbooks.reducer";
import { StoreModule } from "@ngrx/store";

@NgModule({
  declarations: [
    LogbooksTableComponent,
    LogbooksDetailComponent,
    LogbookFilterComponent,
    LogbooksDashboardComponent,
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([LogbookEffects]),
    FlexLayoutModule,
    LinkyModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterModule,
    SharedScicatFrontendModule,
    StoreModule.forFeature("logbooks", logbooksReducer),
  ],
  providers: [],
  exports: [
    LogbooksTableComponent,
    LogbooksDetailComponent,
    LogbooksDashboardComponent,
    LogbookFilterComponent,
  ],
})
export class LogbooksModule {}
