import { Component, ChangeDetectionStrategy } from "@angular/core";
import {
  JsonFormsAngularService,
  JsonFormsBaseRenderer,
  JsonFormsControl,
} from "@jsonforms/angular";
import {
  GroupLayout,
  Layout,
  RankedTester,
  rankWith,
  uiTypeIs,
} from "@jsonforms/core";

@Component({
  selector: "app-expand-group-renderer",
  templateUrl: "./expand-group-renderer.html",
  styleUrls: ["./expand-group-renderer.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ExpandGroupRendererComponent extends JsonFormsBaseRenderer<Layout> {
  getProps(idx: number) {
    return {
      uischema: this.uischema.elements[idx],
      schema: this.schema,
      path: this.path,
    };
  }

  trackByFn(index: number) {
    return index;
  }

  isExpandable() {
    return this.uischema.options?.expandable === true;
  }
}

export const expandGroupTester: RankedTester = rankWith(3, uiTypeIs("Group"));
