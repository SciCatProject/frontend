import { FormControl, FormGroup } from "@angular/forms";

export type INumericRange = {
  min: number;
  max: number;
};

type ControlsOf<T extends Record<string, unknown>> = {
  [K in keyof T]: FormControl<T[K]>;
};

export type NumericRangeFormGroup = FormGroup<ControlsOf<INumericRange>>;
