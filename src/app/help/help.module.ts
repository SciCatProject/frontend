import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HelpComponent } from "./help/help.component";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, MatCardModule, RouterModule],
})
export class HelpModule {}
