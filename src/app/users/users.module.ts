import { ADAuthService } from "./adauth.service";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "users/login/login.component";
import { NgModule } from "@angular/core";
import { SharedCatanieModule } from "shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { UserSettingsComponent } from "users/user-settings/user-settings.component";
import { userReducer } from "state-management/reducers/user.reducer";
import {
  MatCardModule,
  MatCheckboxModule,
  MatGridListModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule
} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedCatanieModule,
    StoreModule.forFeature("users", userReducer)
  ],
  declarations: [LoginComponent, UserSettingsComponent],
  providers: [ADAuthService]
})
export class UsersModule {}
