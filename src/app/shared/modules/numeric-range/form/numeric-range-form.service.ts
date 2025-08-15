import { Injectable } from "@angular/core";
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn,
} from "@angular/forms";
import { NumericRangeFormGroup } from "./model/numeric-range-field.model";
import { numericRangeValues } from "./numeric-range.validator";

@Injectable()
export class NumericRangeFormService {
  private form: NumericRangeFormGroup;

  constructor() {
    this.form = new FormGroup(
      {
        min: new FormControl(null, { updateOn: "blur" }),
        max: new FormControl(null, { updateOn: "blur" }),
      },
      { validators: numericRangeValues },
    );
  }

  get minControl(): FormControl<number> {
    return this.form.get("min") as FormControl<number>;
  }

  get maxControl(): FormControl<number> {
    return this.form.get("max") as FormControl<number>;
  }

  get formGroup(): NumericRangeFormGroup {
    return this.form;
  }

  setDynamicValidators(validators: ValidatorFn | ValidatorFn[]): void {
    if (!validators) {
      return;
    }

    this.minControl.setErrors(null);
    this.maxControl.setErrors(null);

    this.minControl.setValidators(validators); // sets the validators on child control
    this.maxControl.setValidators(validators); // sets the validators on child control

    this.minControl.updateValueAndValidity({ emitEvent: false });
    this.maxControl.updateValueAndValidity({ emitEvent: false });
  }

  setSyncValidators(validator: ValidatorFn): void {
    if (!validator) {
      return;
    }

    this.minControl.addValidators(validator); // sets the validators on child control
    this.maxControl.addValidators(validator); // sets the validators on child control
    this.formGroup.updateValueAndValidity();
  }

  setAsyncValidators(asyncValidator: AsyncValidatorFn): void {
    if (!asyncValidator) {
      return;
    }

    this.minControl.addAsyncValidators(asyncValidator);
    this.maxControl.addAsyncValidators(asyncValidator);
    this.formGroup.updateValueAndValidity();
  }
}
