import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HelpComponent } from "./help/help.component";
import { MatCardModule } from "@angular/material/card";
import { AppConfigModule } from "app-config.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [HelpComponent],
  imports: [AppConfigModule, CommonModule, MatCardModule, RouterModule]
})
export class HelpModule {}
