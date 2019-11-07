import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PublisheddataDetailsComponent } from "./publisheddata-details/publisheddata-details.component";
import {
  MatCardModule,
  MatButtonModule,
  MatIconModule
} from "@angular/material";
import { SharedCatanieModule } from "shared/shared.module";
import { LinkyModule } from "ngx-linky";
import { NgxJsonViewerModule } from "ngx-json-viewer";

import { StoreModule } from "@ngrx/store";
import { publishedDataReducer } from "state-management/reducers/published-data.reducer";
import { PublisheddataDashboardComponent } from "./publisheddata-dashboard/publisheddata-dashboard.component";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [
    PublisheddataDetailsComponent,
    PublisheddataDashboardComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    LinkyModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgxJsonViewerModule,
    SharedCatanieModule,
    StoreModule.forFeature("publishedData", publishedDataReducer)
  ]
})
export class PublisheddataModule {}
