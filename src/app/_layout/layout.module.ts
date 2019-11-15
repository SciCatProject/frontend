import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppHeaderComponent } from "./app-header/app-header.component";
import {
  MatMenuModule,
  MatIconModule,
  MatBadgeModule,
  MatToolbarModule,
  MatButtonModule
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { DatasetsModule } from "datasets/datasets.module";

@NgModule({
  declarations: [AppHeaderComponent],
  imports: [
    CommonModule,
    DatasetsModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    RouterModule
  ],
  exports: [AppHeaderComponent]
})
export class LayoutModule {}
