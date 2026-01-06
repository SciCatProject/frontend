import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { EffectsModule } from "@ngrx/effects";
import { RunTimeConfigEffects } from "state-management/effects/runtime-config.effects";
import { StoreModule } from "@ngrx/store";
import { runtimeConfigReducer } from "state-management/reducers/runtime-config.reducer";
import { AdminConfigEditComponent } from "./admin-config-edit/admin-config-edit.component";
import { AdminUserlistViewComponent } from "./admin-userlist-view/admin-userlist-view.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatIconModule,
    SharedScicatFrontendModule,
    EffectsModule.forFeature([RunTimeConfigEffects]),
    StoreModule.forFeature("runtimeConfig", runtimeConfigReducer),
  ],
  declarations: [
    AdminDashboardComponent,
    AdminConfigEditComponent,
    AdminUserlistViewComponent,
  ],
  exports: [AdminDashboardComponent],
})
export class AdminModule {}
