import { EffectsModule } from "@ngrx/effects";
import { PublishedDataEffects } from "./../state-management/effects/published-data.effects";
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
import { PublisheddataEditComponent } from "./publisheddata-edit/publisheddata-edit.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatOptionModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [
    PublisheddataDetailsComponent,
    PublisheddataDashboardComponent,
    PublisheddataEditComponent,
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([ PublishedDataEffects]),
    FlexLayoutModule,
    LinkyModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    NgxJsonViewerModule,
    SharedCatanieModule,
    StoreModule.forFeature("publishedData", publishedDataReducer),
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatOptionModule
  ]
})
export class PublisheddataModule {}
