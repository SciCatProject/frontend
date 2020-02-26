import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InstrumentsDashboardComponent } from "./instruments-dashboard/instruments-dashboard.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { StoreModule } from "@ngrx/store";
import { instrumentsReducer } from "state-management/reducers/instruments.reducer";
import { EffectsModule } from "@ngrx/effects";
import { InstrumentEffects } from "state-management/effects/instruments.effects";

@NgModule({
  declarations: [InstrumentsDashboardComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([InstrumentEffects]),
    FlexLayoutModule,
    StoreModule.forFeature("instruments", instrumentsReducer)
  ]
})
export class InstrumentsModule {}
