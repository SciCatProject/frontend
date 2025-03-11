import { JsonFormsControl } from "@jsonforms/angular";
import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  scopeEndsWith,
} from "@jsonforms/core";

export class ReleaseDateRenderer extends JsonFormsControl {
  options = [
    { value: "RE", label: "Release after submission" },
    { value: "EP", label: "Release after EMDB entry" },
    { value: "HP", label: "Release after citation" },
    { value: "HO", label: "Delay by one year" },
  ];

  onChange(value: any) {
    this.onChange({ data: value });
  }
}

export const releaseDateRendererEntry: JsonFormsRendererRegistryEntry = {
  tester: rankWith(4, scopeEndsWith("release_date")),
  renderer: ReleaseDateRenderer,
};
