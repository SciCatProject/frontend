import { ADAuthService } from "./adauth.service";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "users/login/login.component";
import { LoginService } from "./login.service";
import { NgModule } from "@angular/core";
import { SharedCatanieModule } from "shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { UserSettingsComponent } from "users/user-settings/user-settings.component";
import { userReducer } from "state-management/reducers/user.reducer";
import {
  MatCardModule,
  MatCheckboxModule,
  MatGridListModule
} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatGridListModule,
    ReactiveFormsModule,
    SharedCatanieModule,
    StoreModule.forFeature("users", userReducer)
  ],
  declarations: [LoginComponent,  UserSettingsComponent],
  providers: [ADAuthService, LoginService]
})
export class UsersModule {}
