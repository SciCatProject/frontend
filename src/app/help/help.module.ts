import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HelpComponent } from "./help/help.component";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";
import { LinkyModule } from "ngx-linky";

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, MatCardModule, LinkyModule, RouterModule],
})
export class HelpModule {}
