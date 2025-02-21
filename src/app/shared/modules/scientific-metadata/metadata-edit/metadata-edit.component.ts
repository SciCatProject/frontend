import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { UnitsService } from "shared/services/units.service";
import { startWith, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ScientificMetadata } from "../scientific-metadata.module";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "metadata-edit",
  templateUrl: "./metadata-edit.component.html",
  styleUrls: ["./metadata-edit.component.scss"],
})
export class MetadataEditComponent implements OnInit, OnChanges {
  metadataForm: FormGroup = this.formBuilder.group({
    items: this.formBuilder.array([]),
  });
  typeValues: string[] = ["quantity", "number", "string"];
  units: string[] = [];
  appConfig = this.appConfigService.getConfig();

  filteredUnits$: Observable<string[]> | undefined = new Observable<string[]>();
  invalidUnitWarning: string[] = [];
  @Input() metadata: Record<string, any> | undefined;
  @Output() save = new EventEmitter<Record<string, unknown>>();

  constructor(
    private formBuilder: FormBuilder,
    private unitsService: UnitsService,
    private appConfigService: AppConfigService,
  ) {}

  get formControlFields() {
    return {
      fieldType: (value = "") => new FormControl(value, [Validators.required]),
      fieldName: (value = "") =>
        new FormControl(value, [
          Validators.required,
          Validators.minLength(2),
          this.duplicateValidator(),
        ]),
      fieldValue: (value: string | number = "") =>
        new FormControl(value, [Validators.required, Validators.minLength(1)]),
      fieldUnit: (value = "") =>
        new FormControl(value, [
          Validators.required,
          this.whiteSpaceValidator(),
        ]),
    };
  }

  addMetadata() {
    const field = this.formBuilder.group({
      fieldType: this.formControlFields["fieldType"](),
      fieldName: this.formControlFields["fieldName"](),
      fieldValue: this.formControlFields["fieldValue"](),
      fieldUnit: this.formControlFields["fieldUnit"](),
    });

    this.items.push(field);

    this.setupFieldUnitValueChangeListeners();
  }

  detectType(index: any) {
    const type = this.items.at(index).get("fieldType")?.value;
    if (type === "quantity") {
      this.items.at(index).get("fieldUnit")?.enable();
      this.items
        .at(index)
        .get("fieldUnit")
        ?.setValidators([Validators.required, this.whiteSpaceValidator()]);
      this.items.at(index).get("fieldUnit")?.updateValueAndValidity();
    } else {
      this.items.at(index).get("fieldUnit")?.clearValidators();
      this.items.at(index).get("fieldUnit")?.setValue("");
      this.items.at(index).get("fieldUnit")?.disable();
    }
  }

  duplicateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const duplicate = this.items.controls.filter(
        (item: AbstractControl) =>
          item.get("fieldName")?.value === control.value,
      );
      return duplicate.length > 1
        ? { duplicateField: { value: control.value } }
        : null;
    };
  }
  whiteSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value.length > 0 && !control.value.trim()) {
        return { whitespace: true };
      }
      return null;
    };
  }

  doSave() {
    this.metadata = this.createMetadataObject();
    this.save.emit(this.metadata);
  }

  onRemove(index: number) {
    this.items.removeAt(index);
  }

  addCurrentMetadata() {
    if (this.metadata) {
      Object.keys(this.metadata).forEach((key, index) => {
        let field: FormGroup;
        if (
          typeof this.metadata[key] === "object" &&
          "value" in (this.metadata[key] as ScientificMetadata)
        ) {
          if (this.metadata[key]["unit"].length > 0) {
            field = this.formBuilder.group({
              fieldType: this.formControlFields["fieldType"]("quantity"),
              fieldName: this.formControlFields["fieldName"](key),
              fieldValue: this.formControlFields["fieldValue"](
                this.metadata[key]["value"],
              ),
              fieldUnit: this.formControlFields["fieldUnit"](
                this.metadata[key]["unit"],
              ),
            });
          } else if (typeof this.metadata[key]["value"] === "number") {
            field = this.formBuilder.group({
              fieldType: this.formControlFields["fieldType"]("number"),
              fieldName: this.formControlFields["fieldName"](key),
              fieldValue: this.formControlFields["fieldValue"](
                Number(this.metadata[key]["value"]),
              ),
              fieldUnit: this.formControlFields["fieldUnit"](
                this.metadata[key]["unit"],
              ),
            });
          } else {
            field = this.formBuilder.group({
              fieldType: this.formControlFields["fieldType"]("string"),
              fieldName: this.formControlFields["fieldName"](key),
              fieldValue: this.formControlFields["fieldValue"](
                this.metadata[key]["value"],
              ),
              fieldUnit: this.formControlFields["fieldUnit"](
                this.metadata[key]["unit"],
              ),
            });
          }
        } else {
          field = this.formBuilder.group({
            fieldType: this.formControlFields["fieldType"]("string"),
            fieldName: this.formControlFields["fieldName"](key),
            fieldValue: this.formControlFields["fieldValue"](
              JSON.stringify(this.metadata[key]),
            ),
            fieldUnit: this.formControlFields["fieldUnit"](""),
          });
        }
        this.items.push(field);
        this.setupFieldUnitValueChangeListeners();

        this.detectType(index);
      });
    }
  }

  createMetadataObject(): Record<string, ScientificMetadata> {
    const metadata: Record<string, any> = {};
    this.items.controls.forEach((control) => {
      const { fieldName, fieldType, fieldValue, fieldUnit } = control.value;
      metadata[fieldName] = {
        value:
          fieldType === "number" || fieldType === "quantity"
            ? Number(fieldValue)
            : fieldValue,
        unit: fieldType === "quantity" ? fieldUnit : "",
      };
    });
    return metadata;
  }

  isInvalid(): boolean {
    const { invalid } = this.metadataForm;
    return invalid;
  }

  getUnits(index: number): void {
    const name = this.items.at(index).get("fieldName")?.value;
    this.units = this.appConfig.metadataEditingUnitListDisabled
      ? []
      : this.unitsService.getUnits(name);

    this.filteredUnits$ = this.items
      .at(index)
      .get("fieldUnit")
      ?.valueChanges.pipe(
        startWith(""),
        map((value: string) => {
          const filterValue = value.toLowerCase();
          return this.units.filter((unit) =>
            unit.toLowerCase().includes(filterValue),
          );
        }),
      );
  }

  setValueInputType(index: number): string {
    const type = this.items.at(index).get("fieldType")?.value;
    switch (type) {
      case "number":
      case "quantity": {
        return "number";
      }
      case "string": {
        return "text";
      }
      default: {
        return "text";
      }
    }
  }

  fieldHasError(index: number, field: string): boolean {
    const formField = this.items.at(index).get(field);
    return formField ? formField.hasError("required") : true;
  }

  fieldHasDuplicateError(index: number, field: string): boolean {
    const formField = this.items.at(index).get(field);
    return formField ? formField.hasError("duplicateField") : true;
  }

  get items() {
    return this.metadataForm.get("items") as FormArray;
  }

  setupFieldUnitValueChangeListeners() {
    this.items.controls.forEach((control, index) => {
      control
        .get("fieldUnit")
        .valueChanges.pipe(debounceTime(600), distinctUntilChanged())
        .subscribe((value) => {
          this.invalidUnitWarning[index] = this.getCustomUnitWarning(value);
        });
    });
  }

  getCustomUnitWarning(value: string): string {
    if (value.length > 0 && !value.trim()) {
      return "A unit is required for quantities";
    }
    return this.unitsService.unitValidation(value)
      ? ""
      : "Unrecognized unit, conversion disabled";
  }
  ngOnInit() {
    this.addCurrentMetadata();
    this.units = this.unitsService.getUnits();

    this.setupFieldUnitValueChangeListeners();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.metadata.firstChange) {
      return;
    }

    for (const propName in changes) {
      if (propName === "metadata") {
        this.metadata = changes[propName].currentValue;

        this.metadataForm = this.formBuilder.group({
          items: this.formBuilder.array([]),
        });

        this.addCurrentMetadata();
      }
    }
  }
}
