import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InstrumentsDashboardComponent } from "./instruments-dashboard/instruments-dashboard.component";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { StoreModule } from "@ngrx/store";
import { instrumentsReducer } from "state-management/reducers/instruments.reducer";
import { EffectsModule } from "@ngrx/effects";
import { InstrumentEffects } from "state-management/effects/instruments.effects";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { JsonHeadPipe } from "shared/pipes/json-head.pipe";
import { InstrumentDetailsComponent } from "./instrument-details/instrument-details.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";

@NgModule({
  declarations: [InstrumentsDashboardComponent, InstrumentDetailsComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([InstrumentEffects]),
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    SharedScicatFrontendModule,
    StoreModule.forFeature("instruments", instrumentsReducer),
  ],
  providers: [JsonHeadPipe],
})
export class InstrumentsModule {}
