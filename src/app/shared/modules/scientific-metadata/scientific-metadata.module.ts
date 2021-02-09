import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { FlexModule } from "@angular/flex-layout";

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
  value: string | number;
  unit: string;
}
