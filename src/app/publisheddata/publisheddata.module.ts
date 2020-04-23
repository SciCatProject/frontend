import { EffectsModule } from '@ngrx/effects';
import { PublishedDataEffects } from './../state-management/effects/published-data.effects';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PublisheddataDetailsComponent } from "./publisheddata-details/publisheddata-details.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
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
    EffectsModule.forFeature([ PublishedDataEffects]),
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
