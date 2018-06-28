import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {LoginComponent} from 'users/login/login.component';
import {UserDetailsComponent} from 'users/user-details/user-details.component';
import {UserSettingsComponent} from 'users/user-settings/user-settings.component';
import {ADAuthService} from './adauth.service';

import {SharedCatanieModule} from 'shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { userReducer } from 'state-management/reducers/user.reducer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedCatanieModule,
    ReactiveFormsModule,
    StoreModule.forFeature('users', userReducer),
  ],
  declarations: [
    LoginComponent,
    UserDetailsComponent,
    UserSettingsComponent
  ],
  providers: [ADAuthService]
})
export class UsersModule { }
