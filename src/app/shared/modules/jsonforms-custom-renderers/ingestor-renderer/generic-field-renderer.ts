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

const numericTypes = ["number", "integer"];

const isNumericSchema = (schema: JsonSchema): boolean =>
  Array.isArray(schema?.type)
    ? schema.type.some((type) => numericTypes.includes(type))
    : numericTypes.includes(schema?.type);

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

  get isNumeric(): boolean {
    return isNumericSchema(this.schema);
  }

  getEventValue = (event: any) => {
    const value = event.target.value;
    if (value === "") return undefined;
    return this.isNumeric ? Number(value) : value;
  };

  // Force a re-check on every state update, since JsonFormsAbstractControl's
  // subscription doesn't trigger OnPush change detection on its own.
  mapAdditionalProps(): void {
    this.changeDetectorRef.markForCheck();
  }
}

const isLeafType = (schema: JsonSchema): boolean => {
  const leafTypes = ["string", "number", "integer"];

  return Array.isArray(schema?.type)
    ? schema.type.some((type) => leafTypes.includes(type))
    : leafTypes.includes(schema?.type);
};

export const genericFieldTester: RankedTester = rankWith(
  2,
  schemaMatches(isLeafType),
);
