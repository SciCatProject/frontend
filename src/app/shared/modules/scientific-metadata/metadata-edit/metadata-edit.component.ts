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
} from "@angular/forms";
import { UnitsService } from "shared/services/units.service";
import { startWith, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "metadata-edit",
  templateUrl: "./metadata-edit.component.html",
  styleUrls: ["./metadata-edit.component.scss"],
})
export class MetadataEditComponent implements OnInit, OnChanges {
  metadataForm: FormGroup;
  typeValues: string[] = ["date", "quantity", "number", "string"];
  units: string[];
  filteredUnits$: Observable<string[]>;

  @Input() metadata: object;
  @Output() save = new EventEmitter<object>();

  constructor(
    private formBuilder: FormBuilder,
    private unitsService: UnitsService
  ) {}

  addMetadata() {
    const field = this.formBuilder.group({
      fieldType: new FormControl("", [Validators.required]),
      fieldName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      fieldValue: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      fieldUnit: new FormControl("", [
        Validators.required,
        this.unitValidator(),
      ]),
    });
    this.items.push(field);
  }

  detectType(index: any) {
    const type = this.items.at(index).get("fieldType").value;
    if (type === "quantity") {
      this.items.at(index).get("fieldUnit").enable();
      this.items
        .at(index)
        .get("fieldUnit")
        .setValidators([Validators.required, this.unitValidator()]);
      this.items.at(index).get("fieldUnit").updateValueAndValidity();
    } else {
      this.items.at(index).get("fieldUnit").clearValidators();
      this.items.at(index).get("fieldUnit").setValue("");
      this.items.at(index).get("fieldUnit").disable();
    }
  }

  unitValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const allowed = this.unitsService.getUnits().includes(control.value);
      return allowed ? null : { forbiddenUnit: { value: control.value } };
    };
  }

  doSave() {
    this.metadata = this.createMetadataObjects();
    this.save.emit(this.metadata);
  }

  onRemove(index: any) {
    this.items.removeAt(index);
  }

  addCurrentMetadata() {
    if (this.metadata) {
      Object.keys(this.metadata).forEach((key, index) => {
        let field: FormGroup;
        if ("value" in this.metadata[key]) {
          if (this.metadata[key]["unit"].length > 0) {
            field = this.formBuilder.group({
              fieldName: key,
              fieldType: "quantity",
              fieldValue: this.metadata[key].value,
              fieldUnit: this.metadata[key].unit,
            });
          } else if (typeof this.metadata[key]["value"] === "number") {
            field = this.formBuilder.group({
              fieldName: key,
              fieldType: "number",
              fieldValue: Number(this.metadata[key].value),
              fieldUnit: this.metadata[key].unit,
            });
          } else if (isNaN(Date.parse(this.metadata[key]["value"]))) {
            field = this.formBuilder.group({
              fieldName: key,
              fieldType: "string",
              fieldValue: this.metadata[key].value,
              fieldUnit: this.metadata[key].unit,
            });
          } else {
            field = this.formBuilder.group({
              fieldName: key,
              fieldType: "date",
              fieldValue: this.metadata[key].value,
              fieldUnit: this.metadata[key].unit,
            });
          }
        } else {
          field = this.formBuilder.group({
            fieldName: key,
            fieldType: "string",
            fieldValue: JSON.stringify(this.metadata[key]),
            fieldUnit: "",
          });
        }
        this.items.push(field);
        this.detectType(index);
      });
    }
  }

  createMetadataObjects(): object {
    const metadata = {};
    this.items.controls.forEach((control) => {
      const { fieldName, fieldType, fieldValue, fieldUnit } = control.value;
      metadata[fieldName] = {
        value: fieldValue,
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
    const name = this.items.at(index).get("fieldName").value;
    this.units = this.unitsService.getUnits(name);
    this.filteredUnits$ = this.items
      .at(index)
      .get("fieldUnit")
      .valueChanges.pipe(
        startWith(""),
        map((value: string) => {
          const filterValue = value.toLowerCase();
          return this.units.filter((unit) =>
            unit.toLowerCase().includes(filterValue)
          );
        })
      );
  }

  setValueInputType(index: number): string {
    const type = this.items.at(index).get("fieldType").value;
    switch (type) {
      case "number":
      case "quantity": {
        return "number";
      }
      case "string": {
        return "text";
      }
      case "date": {
        return "datetime-local";
      }
      default: {
        return "text";
      }
    }
  }

  fieldHasError(index: number, field: string): boolean {
    return this.items.at(index).get(field).hasError("required");
  }

  get items() {
    return this.metadataForm.get("items") as FormArray;
  }

  ngOnInit() {
    this.metadataForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });

    this.addCurrentMetadata();
    this.units = this.unitsService.getUnits();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
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
