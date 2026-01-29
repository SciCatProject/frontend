import { NgModule } from "@angular/core";

import { AccordionArrayLayoutRendererComponent } from "./expand-panel-renderer/accordion-array-layout-renderer.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { JsonFormsModule } from "@jsonforms/angular";
import { JsonFormsAngularMaterialModule } from "@jsonforms/angular-material";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatBadgeModule } from "@angular/material/badge";
import { ExpandGroupRendererComponent } from "./expand-group-renderer/expand-group-renderer";

@NgModule({
  declarations: [
    AccordionArrayLayoutRendererComponent,
    ExpandGroupRendererComponent,
  ],
  imports: [
    MatExpansionModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  exports: [
    AccordionArrayLayoutRendererComponent,
    ExpandGroupRendererComponent,
  ],
  providers: [],
})
export class JsonFormsCustomRenderersModule {}
