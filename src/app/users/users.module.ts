import { UserEffects } from "./../state-management/effects/user.effects";
import { EffectsModule } from "@ngrx/effects";
import { ADAuthService } from "./adauth.service";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "users/login/login.component";
import { NgModule } from "@angular/core";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { UserSettingsComponent } from "users/user-settings/user-settings.component";
import { userReducer } from "state-management/reducers/user.reducer";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { PrivacyDialogComponent } from "./privacy-dialog/privacy-dialog.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AuthCallbackComponent } from "./auth-callback/auth-callback.component";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxJsonViewerModule } from "ngx-json-viewer";

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([UserEffects]),
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    SharedScicatFrontendModule,
    StoreModule.forFeature("users", userReducer),
  ],
  declarations: [
    LoginComponent,
    UserSettingsComponent,
    PrivacyDialogComponent,
    AuthCallbackComponent,
  ],
  providers: [ADAuthService],
})
export class UsersModule {}
