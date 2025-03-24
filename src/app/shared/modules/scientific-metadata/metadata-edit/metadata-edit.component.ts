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
import { ReplaceUnderscorePipe } from "shared/pipes/replace-underscore.pipe";
import { TitleCasePipe } from "@angular/common";
import { DateTime } from "luxon";

export enum MetadataTypes {
  quantity = "quantity",
  number = "number",
  string = "string",
  date = "date",
  link = "link",
  number_range = "number_range",
  quantity_range = "quantity_range",
}

@Component({
  selector: "metadata-edit",
  templateUrl: "./metadata-edit.component.html",
  styleUrls: ["./metadata-edit.component.scss"],
})
export class MetadataEditComponent implements OnInit, OnChanges {
  metadataForm: FormGroup = this.formBuilder.group({
    items: this.formBuilder.array([]),
  });
  typeValues: MetadataTypes[] = Object.values(MetadataTypes);
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
    private replaceUnderscore: ReplaceUnderscorePipe,
    private titleCase: TitleCasePipe,
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
      fieldHumanName: (value = "") => new FormControl(value, []),
      fieldValue: (value: string | number = "") =>
        new FormControl(value, [
          Validators.required,
          Validators.minLength(1),
          this.dateValidator(),
          this.urlValidator(),
        ]),
      fieldUnit: (value = "") =>
        new FormControl(value, [
          Validators.required,
          this.whiteSpaceValidator(),
        ]),
    };
  }

  private isRangeType(type: MetadataTypes): boolean {
    return (
      type === MetadataTypes.number_range ||
      type === MetadataTypes.quantity_range
    );
  }

  addMetadata() {
    const field = this.formBuilder.group({
      fieldType: this.formControlFields["fieldType"](),
      fieldName: this.formControlFields["fieldName"](),
      fieldHumanName: this.formControlFields["fieldHumanName"](),
      fieldValue: this.formControlFields["fieldValue"](),
      fieldUnit: this.formControlFields["fieldUnit"](),
    });

    this.items.push(field);

    this.setupFieldUnitValueChangeListeners();
  }

  detectType(index: any) {
    const type = this.items.at(index).get("fieldType")?.value;
    if (
      type === MetadataTypes.quantity ||
      type === MetadataTypes.quantity_range
    ) {
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

    if (type === MetadataTypes.date) {
      this.items
        .at(index)
        .get("fieldValue")
        ?.addValidators([this.dateValidator()]);
      this.items.at(index).get("fieldValue")?.updateValueAndValidity();
      this.items.at(index).get("fieldValue")?.markAsTouched();
    } else {
      this.items
        .at(index)
        .get("fieldValue")
        ?.removeValidators([this.dateValidator()]);
      this.items.at(index).get("fieldValue")?.updateValueAndValidity();
    }

    if (type === MetadataTypes.link) {
      this.items
        .at(index)
        .get("fieldValue")
        ?.addValidators([this.urlValidator()]);
      this.items.at(index).get("fieldValue")?.updateValueAndValidity();
      this.items.at(index).get("fieldValue")?.markAsTouched();
    } else {
      this.items
        .at(index)
        .get("fieldValue")
        ?.removeValidators([this.urlValidator()]);
      this.items.at(index).get("fieldValue")?.updateValueAndValidity();
    }

    if (this.isRangeType(type)) {
      this.items
        .at(index)
        .get("fieldValue")
        ?.addValidators([this.numberRangeValidator()]);
      this.items.at(index).get("fieldValue")?.updateValueAndValidity();
      this.items.at(index).get("fieldValue")?.markAsTouched();
    } else {
      this.items
        .at(index)
        .get("fieldValue")
        ?.removeValidators([this.numberRangeValidator()]);
      this.items.at(index).get("fieldValue")?.updateValueAndValidity();
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

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent?.value.fieldType === MetadataTypes.date) {
        if (
          DateTime.fromISO(control.value).toUTC().isValid ||
          DateTime.fromFormat(control.value, this.appConfig.dateFormat).isValid
        ) {
          return null;
        } else {
          return { dateValidator: { valid: false } };
        }
      }

      return null;
    };
  }

  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent?.value.fieldType === MetadataTypes.link) {
        let validUrl = true;

        try {
          new URL(control.value);
        } catch {
          validUrl = false;
        }

        return validUrl ? null : { invalidUrl: true };
      }

      return null;
    };
  }

  numberRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        this.isRangeType(control.parent?.value.fieldType) &&
        typeof control.value === "string"
      ) {
        const numbers = control.value.split(",").map((item) => item.trim());

        if (numbers.length !== 2) {
          return { invalidNumberRange: true };
        }

        const validNumberRange =
          numbers[0] &&
          numbers[1] &&
          !isNaN(Number(numbers[0])) &&
          !isNaN(Number(numbers[1]));

        return validNumberRange ? null : { invalidNumberRange: true };
      }

      return null;
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

  formatFields() {
    for (const [key, value] of Object.entries(this.metadata)) {
      if (value.type === MetadataTypes.date) {
        if (
          DateTime.fromFormat(value.value, this.appConfig.dateFormat).isValid
        ) {
          this.metadata[key].value = DateTime.fromFormat(
            value.value,
            this.appConfig.dateFormat,
          ).toISO();
        } else {
          this.metadata[key].value = DateTime.fromISO(value.value).toISO();
        }
      }

      if (this.isRangeType(value.type) && typeof value.value === "string") {
        this.metadata[key].value = value.value.split(",").map(Number);
      }
    }
  }

  doSave() {
    this.metadata = this.createMetadataObject();
    this.formatFields();
    this.save.emit(this.metadata);
  }

  onRemove(index: number) {
    this.items.removeAt(index);
  }

  getHumanNameFieldValue(metadata: ScientificMetadata, key: string): string {
    return (
      metadata.human_name ||
      this.titleCase.transform(this.replaceUnderscore.transform(key))
    );
  }

  addCurrentMetadata() {
    if (this.metadata) {
      Object.keys(this.metadata).forEach((key, index) => {
        let field: FormGroup;
        if (
          typeof this.metadata[key] === "object" &&
          "value" in (this.metadata[key] as ScientificMetadata)
        ) {
          if (this.metadata[key].unit?.length > 0) {
            const quantityType =
              this.metadata[key].type === MetadataTypes.quantity_range
                ? MetadataTypes.quantity_range
                : MetadataTypes.quantity;

            field = this.formBuilder.group({
              fieldType: this.formControlFields["fieldType"](quantityType),
              fieldName: this.formControlFields["fieldName"](key),
              fieldHumanName: this.formControlFields["fieldHumanName"](
                this.getHumanNameFieldValue(this.metadata[key], key),
              ),
              fieldValue: this.formControlFields["fieldValue"](
                this.metadata[key]["value"],
              ),
              fieldUnit: this.formControlFields["fieldUnit"](
                this.metadata[key]["unit"],
              ),
            });
          } else if (
            typeof this.metadata[key]["value"] === MetadataTypes.number ||
            this.metadata[key]["type"] === MetadataTypes.number
          ) {
            field = this.formBuilder.group({
              fieldType: this.formControlFields["fieldType"](
                MetadataTypes.number,
              ),
              fieldName: this.formControlFields["fieldName"](key),
              fieldHumanName: this.formControlFields["fieldHumanName"](
                this.getHumanNameFieldValue(this.metadata[key], key),
              ),
              fieldValue: this.formControlFields["fieldValue"](
                Number(this.metadata[key]["value"]),
              ),
              fieldUnit: this.formControlFields["fieldUnit"](
                this.metadata[key]["unit"],
              ),
            });
          } else if (this.isRangeType(this.metadata[key]["type"])) {
            const rangeFieldType =
              this.metadata[key]["type"] === MetadataTypes.number_range
                ? MetadataTypes.number_range
                : MetadataTypes.quantity_range;

            field = this.formBuilder.group({
              fieldType: this.formControlFields["fieldType"](rangeFieldType),
              fieldName: this.formControlFields["fieldName"](key),
              fieldHumanName: this.formControlFields["fieldHumanName"](
                this.getHumanNameFieldValue(this.metadata[key], key),
              ),
              fieldValue: this.formControlFields["fieldValue"](
                this.metadata[key]["value"],
              ),
              fieldUnit: this.formControlFields["fieldUnit"](
                this.metadata[key]["unit"],
              ),
            });
          } else {
            let fieldType = MetadataTypes.string;

            if (this.metadata[key]["type"] === MetadataTypes.link) {
              fieldType = MetadataTypes.link;
            }
            if (this.metadata[key]["type"] === MetadataTypes.date) {
              fieldType = MetadataTypes.date;
            }

            field = this.formBuilder.group({
              fieldType: fieldType,
              fieldName: this.formControlFields["fieldName"](key),
              fieldHumanName: this.formControlFields["fieldHumanName"](
                this.getHumanNameFieldValue(this.metadata[key], key),
              ),
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
            fieldType: this.formControlFields["fieldType"](
              MetadataTypes.string,
            ),
            fieldName: this.formControlFields["fieldName"](key),
            fieldHumanName: this.formControlFields["fieldHumanName"](
              this.getHumanNameFieldValue(this.metadata[key], key),
            ),
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
      const { fieldName, fieldHumanName, fieldType, fieldValue, fieldUnit } =
        control.value;
      metadata[fieldName] = {
        value:
          fieldType === MetadataTypes.number ||
          fieldType === MetadataTypes.quantity
            ? Number(fieldValue)
            : fieldValue,
        unit:
          fieldType === MetadataTypes.quantity ||
          fieldType === MetadataTypes.quantity_range
            ? fieldUnit
            : "",
        human_name: fieldHumanName,
        type: fieldType,
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
      case MetadataTypes.number:
      case MetadataTypes.quantity: {
        return MetadataTypes.number;
      }
      case MetadataTypes.string: {
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

  fieldHasDateError(index: number, field: string): boolean {
    const formField = this.items.at(index).get(field);
    if (formField.parent?.value.fieldType === MetadataTypes.date) {
      return formField ? formField.hasError("dateValidator") : true;
    }

    return false;
  }

  fieldHasLinkError(index: number, field: string): boolean {
    const formField = this.items.at(index).get(field);
    if (formField.parent?.value.fieldType === MetadataTypes.link) {
      return formField ? formField.hasError("invalidUrl") : true;
    }

    return false;
  }

  fieldHasRangeError(index: number, field: string): boolean {
    const formField = this.items.at(index).get(field);
    if (this.isRangeType(formField.parent?.value.fieldType)) {
      return formField ? formField.hasError("invalidNumberRange") : true;
    }

    return false;
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
