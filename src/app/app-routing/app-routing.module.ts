import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from '../datasets/dashboard/dashboard.component';
import {DatafilesComponent} from '../datasets/datafiles/datafiles.component';
import {DatablocksComponent} from '../datasets/datablocks-table/datablocks-table.component';
import {DatasetDetailComponent} from '../datasets/dataset-detail/dataset-detail.component';
import {EndOfShiftComponent} from '../end-of-shift/end-of-shift.component';
import {LoginComponent} from '../users/login/login.component';
import {JobsComponent} from '../jobs/jobs.component';
import {AppComponent} from '../app.component';
import {ErrorPageComponent} from '../shared/components/error-page/error-page.component';
import {UserSettingsComponent} from '../users/user-settings/user-settings.component';
import {UserDetailsComponent} from '../users/user-details/user-details.component';
import {SampleDataFormComponent} from '../sample-data-form/sample-data-form.component';
import {AuthCheck} from '../AuthCheck';



export const routes: Routes = [
  { path: '', redirectTo: '/datasets', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: AppComponent, canActivate: [AuthCheck] },
  { path: 'dataset', redirectTo: '/datasets', pathMatch: 'full' },
  { path: 'datasets',  component: DashboardComponent, canActivate: [AuthCheck], },
  { path: 'end-of-shift', component: EndOfShiftComponent, canActivate: [AuthCheck] },
  { path: 'dataset/:id', component: DatasetDetailComponent, canActivate: [AuthCheck] },
  { path: 'dataset/:id/datablocks', component: DatablocksComponent, canActivate: [AuthCheck] },
  { path: 'dataset/:id/datafiles', component: DatafilesComponent, canActivate: [AuthCheck] },
  { path: 'user/settings', component: UserSettingsComponent, canActivate: [AuthCheck] },
  { path: 'user/details', component: UserDetailsComponent, canActivate: [AuthCheck] },
  { path: 'user/jobs', component: JobsComponent, canActivate: [AuthCheck] },
  { path: 'sample-data/add', component: SampleDataFormComponent, canActivate: [AuthCheck] },
  { path: 'error', component: ErrorPageComponent, data: {message: 'Location Not Found', 'breadcrumb': 'Error'} }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}




