import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import {
  JsonSchema,
  RankedTester,
  rankWith,
  schemaMatches,
} from "@jsonforms/core";

@Component({
  selector: "app-generic-field-renderer",
  styleUrls: ["./ingestor-renderer.component.scss"],
  templateUrl: "./generic-field-renderer.html",
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFieldRendererComponent extends JsonFormsControl {
  focused = false;

  constructor(
    jsonformsService: JsonFormsAngularService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(jsonformsService);
  }

  getEventValue = (event: any) => event.target.value || undefined;

  // Force a re-check on every state update, since JsonFormsAbstractControl's
  // subscription doesn't trigger OnPush change detection on its own.
  mapAdditionalProps(): void {
    this.changeDetectorRef.markForCheck();
  }
}

const isLeafType = (schema: JsonSchema): boolean =>
  schema?.type === "string" ||
  schema?.type === "number" ||
  schema?.type === "integer";

export const genericFieldTester: RankedTester = rankWith(
  1.5,
  schemaMatches(isLeafType),
);
