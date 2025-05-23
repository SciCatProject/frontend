import { NgModule } from "@angular/core";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MetadataViewComponent } from "./metadata-view/metadata-view.component";
import { MetadataEditComponent } from "./metadata-edit/metadata-edit.component";
import { PipesModule } from "shared/pipes/pipes.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexModule } from "@ngbracket/ngx-layout";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DynamicMatTableModule } from "../dynamic-material-table/table/dynamic-mat-table.module";
import { ReplaceUnderscorePipe } from "shared/pipes/replace-underscore.pipe";
import { LinkyPipe } from "ngx-linky";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  NgxMatDatetimepicker,
  NgxMatDatepickerInput,
  NgxMatDatepickerActions,
  NgxMatDatepickerApply,
  NgxMatDatepickerCancel,
  NgxMatDatepickerClear,
} from "@ngxmc/datetime-picker";

@NgModule({
  declarations: [MetadataViewComponent, MetadataEditComponent],
  imports: [
    CommonModule,
    FlexModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    PipesModule,
    ReactiveFormsModule,
    DynamicMatTableModule.forRoot({}),
    MatDatepickerModule,
    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerCancel,
    NgxMatDatepickerClear,
    NgxMatDatepickerInput,
    NgxMatDatetimepicker,
  ],
  exports: [MetadataEditComponent, MetadataViewComponent],
  providers: [ReplaceUnderscorePipe, TitleCasePipe, LinkyPipe],
})
export class ScientificMetadataModule {}

export interface ScientificMetadata {
  value: string | number;
  unit: string;
  valueSI?: number;
  unitSI?: string;
  human_name?: string;
  type?: string;
}

export interface ScientificMetadataTableData {
  name: string;
  value: string | number;
  unit: string;
  human_name?: string;
  type?: string;
  ontology_reference?: string;
}
