import { ChangeDetectionStrategy, Component } from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import { FormControl } from "@angular/forms";
import {
  and,
  isDateTimeControl,
  not,
  RankedTester,
  rankWith,
  scopeEndsWith,
  StatePropsOfControl,
} from "@jsonforms/core";
import { DateTime } from "luxon";

@Component({
  selector: "date-time-field-renderer",
  styleUrls: ["./ingestor-renderer.component.scss"],
  templateUrl: "./date-time-field-renderer.html",
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeFieldRendererComponent extends JsonFormsControl {
  readonly pickerControl = new FormControl<DateTime | null>(null);

  constructor(jsonFormsService: JsonFormsAngularService) {
    super(jsonFormsService);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.addSubscription(
      this.pickerControl.valueChanges.subscribe((value) => {
        this.saveDateTime(value);
      }),
    );
  }

  saveDateTime2(value: DateTime | null): void {
    let isoValue: string | null = null;
    if (isoValue != null && value.isValid) {
      isoValue = value.toUTC().toISO();
    }
    this.onChange({ value: isoValue });
  }

  saveDateTime(value: unknown): void {
    let isoValue: string | null = null;

    if (DateTime.isDateTime(value)) {
      isoValue = (value as DateTime).isValid
        ? (value as DateTime).toUTC().toISO()
        : null;
    } else if (value instanceof Date) {
      isoValue = DateTime.fromJSDate(value).toUTC().toISO();
    } else if (typeof value === "string") {
      const parsed = DateTime.fromISO(value);
      isoValue = parsed.isValid ? parsed.toUTC().toISO() : value;
    }

    this.onChange({ value: isoValue });
  }

  override mapAdditionalProps(props: StatePropsOfControl): void {
    const dateTime =
      typeof props.data === "string" ? DateTime.fromISO(props.data) : null;
    const next = dateTime?.isValid ? dateTime : null;
    const current = this.pickerControl.value;

    const unchanged =
      (next === null && current === null) ||
      (next !== null && current !== null && next.equals(current));

    if (!unchanged) {
      this.pickerControl.setValue(next, { emitEvent: false });
    }
    if (props.enabled) {
      this.pickerControl.enable({ emitEvent: false });
    } else {
      this.pickerControl.disable({ emitEvent: false });
    }
  }
}

export const dateTimeFieldTester: RankedTester = rankWith(
  3,
  and(isDateTimeControl),
);
