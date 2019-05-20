import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutComponent } from "./about/about.component";
import { MatCardModule } from "@angular/material";
import { AppConfigModule } from "app-config.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { LinkyModule } from "ngx-linky";

@NgModule({
  declarations: [AboutComponent],
  imports: [
    AppConfigModule,
    CommonModule,
    FlexLayoutModule,
    LinkyModule,
    MatCardModule
  ]
})
export class AboutModule {}
