import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import {
  Actions,
  and,
  isDateControl,
  isEnumControl,
  not,
  JsonSchema,
  RankedTester,
  rankWith,
  schemaMatches,
} from "@jsonforms/core";

const numericTypes = ["number", "integer"];
const leafTypes = [...numericTypes, "string"];
const completeNumberPattern = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/;

const isNumericSchema = (schema: JsonSchema): boolean =>
  Array.isArray(schema?.type)
    ? schema.type.some((type) => numericTypes.includes(type))
    : numericTypes.includes(schema?.type);

const isLeafType = (schema: JsonSchema): boolean => {
  return Array.isArray(schema?.type)
    ? schema.type.some((type) => leafTypes.includes(type))
    : leafTypes.includes(schema?.type);
};

@Component({
  selector: "app-generic-field-renderer",
  styleUrls: ["./ingestor-renderer.component.scss"],
  templateUrl: "./generic-field-renderer.html",
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFieldRendererComponent extends JsonFormsControl {
  private numericDraft: string | null = null;
  focused = false;

  constructor(
    jsonformsService: JsonFormsAngularService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(jsonformsService);
  }

  private updateNumericValue(value: number | undefined): void {
    this.jsonFormsService.updateCore(
      Actions.update(this.propsPath, () => value),
    );
    this.triggerValidation();
  }

  get isNumeric(): boolean {
    return isNumericSchema(this.scopedSchema);
  }

  getEventValue = (event: Event) => (event.target as HTMLInputElement).value;

  override onChange(event: Event): void {
    if (!this.isNumeric) {
      super.onChange(event);
      return;
    }

    const value = (event.target as HTMLInputElement).value;
    this.numericDraft = value;

    if (value === "") {
      this.numericDraft = null;
      this.updateNumericValue(undefined);
      return;
    }

    const numericValue = Number(value);
    if (completeNumberPattern.test(value) && Number.isFinite(numericValue)) {
      this.updateNumericValue(numericValue);
    }
  }

  onBlur(): void {
    if (!this.isNumeric || this.numericDraft === null) return;

    this.numericDraft = null;
    this.form.setValue(this.data ?? "", { emitEvent: false });
  }

  // Force a re-check on every state update, since JsonFormsAbstractControl's
  // subscription doesn't trigger OnPush change detection on its own.
  mapAdditionalProps(): void {
    if (this.numericDraft !== null) {
      this.form.setValue(this.numericDraft, { emitEvent: false });
    }
    this.changeDetectorRef.markForCheck();
  }
}

export const genericFieldTester: RankedTester = rankWith(
  2,
  and(schemaMatches(isLeafType), not(isEnumControl), not(isDateControl)),
);
