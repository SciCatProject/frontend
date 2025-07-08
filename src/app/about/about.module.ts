import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutComponent } from "./about/about.component";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { LinkyModule } from "ngx-linky";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, FlexLayoutModule, LinkyModule, MatCardModule, RouterModule],
})
export class AboutModule {}
