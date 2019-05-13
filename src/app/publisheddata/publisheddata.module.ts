import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PublisheddataTableComponent } from "./publisheddata-table/publisheddata-table.component";
import { PublisheddataDetailsComponent } from "./publisheddata-details/publisheddata-details.component";
import {
  MatTableModule,
  MatPaginatorModule,
  MatCardModule
} from "@angular/material";
import { SharedCatanieModule } from "shared/shared.module";

@NgModule({
  declarations: [PublisheddataTableComponent, PublisheddataDetailsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    SharedCatanieModule
  ]
})
export class PublisheddataModule {}
