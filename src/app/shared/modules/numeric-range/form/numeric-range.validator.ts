import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const numericRangeValues: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const max = group.get("max").value ? Number(group.get("max").value) : null;
  const min = group.get("min").value ? Number(group.get("min").value) : null;

  if (max !== null && min !== null && max < min) {
    return { notValidRange: true };
  }
  return null;
};
