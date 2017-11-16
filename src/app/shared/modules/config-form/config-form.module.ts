import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/primeng';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { ObjKeysPipe } from 'shared/pipes/obj-keys.pipe';
import { TitleCasePipe } from 'shared/pipes/title-case.pipe';
import { ConfigFormComponent } from './config-form.component';

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule,
    NguiDatetimePickerModule
  ],
  declarations : [
    ConfigFormComponent,
    ObjKeysPipe,
    TitleCasePipe
  ],
  exports: [ConfigFormComponent]
})
export class ConfigFormModule {
}
