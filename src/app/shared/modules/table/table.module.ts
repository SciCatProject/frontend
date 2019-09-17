import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableComponent } from "./table.component";
import {
  MatTableModule,
  MatIconModule,
  MatSortModule,
  MatListModule,
  MatCardModule,
  MatPaginatorModule,
  MatCheckboxModule
} from "@angular/material";
import { PipesModule } from "shared/pipes/pipes.module";

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    PipesModule
  ],
  exports: [TableComponent]
})
export class TableModule {}
