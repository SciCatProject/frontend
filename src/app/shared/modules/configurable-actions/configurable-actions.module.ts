import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { ConfigurableActionsComponent } from "./configurable-actions.component";
import { ConfigurableActionComponent } from "./configurable-action.component";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  declarations: [ConfigurableActionsComponent, ConfigurableActionComponent],
  exports: [ConfigurableActionsComponent, ConfigurableActionComponent],
})
export class ConfigurableActionsModule {}
