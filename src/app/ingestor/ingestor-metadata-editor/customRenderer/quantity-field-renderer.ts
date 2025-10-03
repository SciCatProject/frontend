import { Component } from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import { rankWith, scopeEndsWith, or } from "@jsonforms/core";

export const isSIFieldTester = rankWith(
  100,
  or(scopeEndsWith("unitSI"), scopeEndsWith("valueSI")),
);

@Component({
  selector: "si-field-hider",
  template: "", // Empty template - renders nothing
})
export class SIFieldHiderRendererComponent extends JsonFormsControl {
  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }
}
