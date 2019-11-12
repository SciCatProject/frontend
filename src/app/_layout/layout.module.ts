import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppHeaderComponent } from "./app-header/app-header.component";
import { MatMenuModule, MatIconModule, MatBadgeModule, MatToolbarModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { DatasetsModule } from "datasets/datasets.module";


@NgModule({
  declarations: [AppHeaderComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    MatBadgeModule,
    MatToolbarModule,
    DatasetsModule
  ],
  exports: [AppHeaderComponent ]
})
export class LayoutModule {}
