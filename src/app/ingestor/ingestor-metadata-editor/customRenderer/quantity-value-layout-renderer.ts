import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Pipe,
  PipeTransform,
} from "@angular/core";
import {
  JsonSchema,
  Layout,
  OwnPropsOfRenderer,
  RankedTester,
  rankWith,
  UISchemaElement,
  uiTypeIs,
} from "@jsonforms/core";
import { JsonFormsAngularService } from "@jsonforms/angular";
import { LayoutRenderer } from "@jsonforms/angular-material";

@Component({
  selector: "QuantityValueLayoutRendererComponent",
  template: `
    <div
      [ngStyle]="{ display: hidden ? 'none' : '' }"
      class="quantity-value-box"
    >
      <div
        class="quantity-value-element"
        *ngFor="
          let props of uischema
            | customLayoutChildrenRenderProps: schema : path;
          trackBy: trackElement
        "
      >
        <jsonforms-outlet [renderProps]="props"></jsonforms-outlet>
      </div>
    </div>
  `,
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityValueLayoutRendererComponent extends LayoutRenderer<QuantityValueLayout> {
  constructor(
    jsonFormsService: JsonFormsAngularService,
    changeDetectionRef: ChangeDetectorRef,
  ) {
    super(jsonFormsService, changeDetectionRef);
  }
}
export const quantityValueLayoutTester: RankedTester = rankWith(
  6,
  uiTypeIs("QuantityValueLayout"),
);

export interface QuantityValueLayout extends Layout {
  type: "QuantityValueLayout";
}

@Pipe({ name: "customLayoutChildrenRenderProps" })
export class CustomLayoutChildrenRenderPropsPipe implements PipeTransform {
  transform(
    uischema: Layout,
    schema: JsonSchema,
    path: string,
  ): OwnPropsOfRenderer[] {
    const elements = (uischema.elements || [])
      .map((el: UISchemaElement) => ({
        uischema: el,
        schema: schema,
        path: path,
      }))
      .sort((a: any, b: any) => {
        const scopeA = a.uischema.scope || "";
        const scopeB = b.uischema.scope || "";

        // Check if one of the scopes contains "value" and the other contains "unit"
        const isValueA = scopeA.includes("value");
        const isUnitA = scopeA.includes("unit");
        const isValueB = scopeB.includes("value");
        const isUnitB = scopeB.includes("unit");

        if (isValueA && isUnitB) {
          return -1; // a comes before b
        }
        if (isValueB && isUnitA) {
          return 1; // b comes before a
        }

        // Fallback to localeCompare if neither condition is met
        return scopeA.localeCompare(scopeB);
      });

    return elements;
  }
}
