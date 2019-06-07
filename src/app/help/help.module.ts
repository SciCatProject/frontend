import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HelpComponent } from "./help/help.component";
import { FlexModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material";
import { AppConfigModule } from "app-config.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [HelpComponent],
  imports: [AppConfigModule, CommonModule, FlexModule, MatCardModule, RouterModule]
})
export class HelpModule {}
