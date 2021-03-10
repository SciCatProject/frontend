import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { UnitsService } from "shared/services/units.service";
import { startWith, map } from "rxjs/operators";
export enum Type {
  quantity = "quantity",
  date = "date",
  number = "number",
  string = "string"
}
export class MetadataInputBase {
  unitsService: UnitsService;
  metadataForm: FormGroup;
  filteredUnits$: Observable<string[]>;
  units: string[];
  typeValues: string[] = Object.values(Type);
  constructor() {
    this.unitsService = new UnitsService();
    this.unitsService.getUnits();
  }
  unitValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const allowed = this.unitsService.getUnits().includes(control.value);
      return allowed ? null : { forbiddenUnit: { value: control.value } };
    };
  }
  detectType() {
    const type = this.metadataForm.get("type").value;
    switch (type) {
      case Type.quantity:
        this.metadataForm.get("unit").enable();
        this.metadataForm.get("value").enable();
        break;
      default:
        this.metadataForm.get("value").enable();
        this.metadataForm.get("unit").disable();
    }
  }
  setValueInputType() {
    const type = this.metadataForm.get("type").value;
    switch (type) {
      case Type.number:
      case Type.quantity:
        return "number";
      case Type.string:
        return "text";
      case Type.date:
        return "datetime-local";
      default:
        return "text";
    }
  }
  getUnits(fieldName: string): void {
    const name = this.metadataForm.get(fieldName).value;
    this.units = this.unitsService.getUnits(name);
    this.filteredUnits$ = this.metadataForm.get("unit").valueChanges.pipe(
      startWith(""),
      map((value: string) => {
        const filterValue = value.toLowerCase();
        return this.units.filter((unit) =>
          unit.toLowerCase().includes(filterValue)
        );
      })
    );
  }
  fieldHasError(field: string): boolean {
    return this.metadataForm.get(field).hasError("required");
  }
}
