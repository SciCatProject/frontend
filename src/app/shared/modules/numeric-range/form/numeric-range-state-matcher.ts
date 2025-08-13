import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class NumericRangeStateMatcher implements ErrorStateMatcher {
  private isControlTouchedInvalid(control: FormControl): boolean {
    return control.touched && control.invalid;
  }

  isErrorState(
    control: FormControl<number> | null,
    form: FormGroup | FormGroupDirective | NgForm | null,
  ): boolean {
    if (!control.parent && form instanceof FormGroup) {
      const minControl = form.get("min") as FormControl;
      const maxControl = form.get("max") as FormControl;

      const isFormInvalid = form.touched && form.invalid;

      const areFormControlsInvalid =
        this.isControlTouchedInvalid(minControl) ||
        this.isControlTouchedInvalid(maxControl);

      return isFormInvalid || areFormControlsInvalid;
    }

    return control.touched && control.invalid;
  }
}
