import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BreadcrumbComponent } from "./breadcrumb.component";
import { PipesModule } from "shared/pipes/pipes.module";

@NgModule({
  imports: [CommonModule, PipesModule, RouterModule],
  declarations: [BreadcrumbComponent],
  exports: [BreadcrumbComponent],
})
export class BreadcrumbModule {}
