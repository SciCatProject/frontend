import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { ConfigurableActionsComponent } from "./configurable-actions.component";
import { ConfigurableActionComponent } from "./configurable-action.component";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule],
  declarations: [ConfigurableActionsComponent, ConfigurableActionComponent],
  exports: [ConfigurableActionsComponent, ConfigurableActionComponent],
})
export class ConfigurableActionsModule {}
