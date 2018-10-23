import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker";
import { ObjKeysPipe } from "shared/pipes/obj-keys.pipe";
import { TitleCasePipe } from "shared/pipes/title-case.pipe";
import { ConfigFormComponent } from "./config-form.component";
import { TreeTableModule } from "ng-treetable";
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatSlideToggleModule
} from "@angular/material";

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule,
    NguiDatetimePickerModule
  ],
  declarations: [ConfigFormComponent, ObjKeysPipe, TitleCasePipe],
  exports: [ConfigFormComponent]
})
export class ConfigFormModule {}
