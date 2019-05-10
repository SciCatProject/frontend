import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PublisheddataTableComponent } from "./publisheddata-table/publisheddata-table.component";
import { PublisheddataDetailsComponent } from "./publisheddata-details/publisheddata-details.component";
import { MatTableModule, MatPaginatorModule } from "@angular/material";

@NgModule({
  declarations: [PublisheddataTableComponent, PublisheddataDetailsComponent],
  imports: [CommonModule, MatTableModule, MatPaginatorModule]
})
export class PublisheddataModule {}
