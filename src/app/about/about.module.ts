import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutComponent } from "./about/about.component";
import { MatCardModule } from "@angular/material";
import { AppConfigModule } from "app-config.module";

@NgModule({
  declarations: [AboutComponent],
  imports: [AppConfigModule, CommonModule, MatCardModule]
})
export class AboutModule {}
