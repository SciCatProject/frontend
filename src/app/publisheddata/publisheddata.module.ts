import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PublisheddataTableComponent } from "./publisheddata-table/publisheddata-table.component";
import { PublisheddataDetailsComponent } from "./publisheddata-details/publisheddata-details.component";
import {
  MatTableModule,
  MatPaginatorModule,
  MatCardModule
} from "@angular/material";
import { SharedCatanieModule } from "shared/shared.module";
import { LinkyModule } from "ngx-linky";
import { NgxJsonViewerModule } from "ngx-json-viewer";

import { StoreModule } from "@ngrx/store";
import { publishedDataReducer } from "state-management/reducers/published-data.reducer";

@NgModule({
  declarations: [PublisheddataTableComponent, PublisheddataDetailsComponent],
  imports: [
    CommonModule,
    LinkyModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    NgxJsonViewerModule,
    SharedCatanieModule,
    StoreModule.forFeature("PublishedData", publishedDataReducer),
  ]
})
export class PublisheddataModule {}
