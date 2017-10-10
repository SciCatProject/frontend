import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {NguiDatetimePickerModule} from '@ngui/datetime-picker';
import {AutoCompleteModule, DropdownModule, SharedModule, TreeModule, TreeTableModule} from 'primeng/primeng';

import {ObjKeysPipe, TitleCasePipe} from './pipes';
import {ConfigService} from './services';

import {BreadcrumbComponent, ConfigFormComponent, ErrorPageComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule,
    TreeTableModule,
    SharedModule,
    TreeModule,
    AutoCompleteModule,
    DropdownModule,
    RouterModule
  ],
  declarations: [
    ConfigFormComponent,
    BreadcrumbComponent,
    ErrorPageComponent,
    ObjKeysPipe,
    TitleCasePipe
  ],
  providers: [
    ConfigService,
  ],
  exports: [
    ConfigFormComponent,
    BreadcrumbComponent
  ]
})
export class SharedCatanieModule { }
