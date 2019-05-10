import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PublisheddataTableComponent } from "./publisheddata-table/publisheddata-table.component";
import { PublisheddataDetailsComponent } from "./publisheddata-details/publisheddata-details.component";

@NgModule({
  declarations: [PublisheddataTableComponent, PublisheddataDetailsComponent],
  imports: [CommonModule]
})
export class PublisheddataModule {}
