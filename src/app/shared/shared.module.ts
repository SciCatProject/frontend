import {NgModule} from '@angular/core';

import {BreadcrumbModule} from 'shared/modules/breadcrumb/breadcrumb.module';
import {ConfigFormModule} from 'shared/modules/config-form/config-form.module';
import {ErrorPageModule} from 'shared/modules/error-page/error-page.module';
import {DialogModule} from 'shared/modules/dialog/dialog.module';
import {ConfigService} from './services';

@NgModule({
  imports: [
    BreadcrumbModule,
    ConfigFormModule,
    ErrorPageModule,
    DialogModule,
  ],
  declarations: [
  ],
  providers: [
    ConfigService,
  ],
  exports: [
    BreadcrumbModule,
    ConfigFormModule,
    ErrorPageModule,
    DialogModule,
  ]
})
export class SharedCatanieModule { }
