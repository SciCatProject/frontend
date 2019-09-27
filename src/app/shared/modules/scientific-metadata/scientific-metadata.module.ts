import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatTabsModule,
  MatTableModule,
  MatIconModule,
  MatFormFieldModule,
  MatOptionModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule
} from "@angular/material";
import { MetadataViewComponent } from "./metadata-view/metadata-view.component";
import { MetadataEditComponent } from "./metadata-edit/metadata-edit.component";
import { PipesModule } from "shared/pipes/pipes.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexModule } from "@angular/flex-layout";

@NgModule({
  declarations: [MetadataViewComponent, MetadataEditComponent],
  imports: [
    CommonModule,
    FlexModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    PipesModule,
    ReactiveFormsModule
  ],
  exports: [MetadataEditComponent, MetadataViewComponent]
})
export class ScientificMetadataModule {}

export interface ScientificMetaData {
  name: string;
  type: string;
  value: string | number;
  unit: string;
}
