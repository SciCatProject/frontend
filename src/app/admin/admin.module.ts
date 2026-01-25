import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { EffectsModule } from "@ngrx/effects";
import { RunTimeConfigEffects } from "state-management/effects/runtime-config.effects";
import { UsersEffects } from "state-management/effects/users.effects";
import { StoreModule } from "@ngrx/store";
import { runtimeConfigReducer } from "state-management/reducers/runtime-config.reducer";
import { usersReducer } from "state-management/reducers/users.reducer";
import { AdminConfigEditComponent } from "./admin-config-edit/admin-config-edit.component";
import { AdminUserlistViewComponent } from "./admin-userlist-view/admin-userlist-view.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedScicatFrontendModule,
    EffectsModule.forFeature([RunTimeConfigEffects, UsersEffects]),
    StoreModule.forFeature("runtimeConfig", runtimeConfigReducer),
    StoreModule.forFeature("usersList", usersReducer),
  ],
  declarations: [
    AdminDashboardComponent,
    AdminConfigEditComponent,
    AdminUserlistViewComponent,
  ],
  exports: [AdminDashboardComponent],
})
export class AdminModule {}
