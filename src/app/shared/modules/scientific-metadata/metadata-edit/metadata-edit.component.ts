import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators
} from "@angular/forms";
import { UnitsService } from "shared/services/units.service";
import { startWith, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "metadata-edit",
  templateUrl: "./metadata-edit.component.html",
  styleUrls: ["./metadata-edit.component.scss"]
})
export class MetadataEditComponent implements OnInit, OnChanges {
  metadataForm: FormGroup;
  typeValues: string[] = ["date", "measurement", "number", "string"];
  units: string[];
  filteredUnits$: Observable<string[]>;

  @Input() metadata: object;
  @Output() save = new EventEmitter<object>();

  addMetadata() {
    const field = this.formBuilder.group({
      fieldType: new FormControl("", [Validators.required]),
      fieldName: new FormControl("", [
        Validators.required,
        Validators.minLength(2)
      ]),
      fieldValue: new FormControl("", [
        Validators.required,
        Validators.minLength(1)
      ]),
      fieldUnit: new FormControl("", [
        Validators.required,
        Validators.minLength(2)
      ])
    });
    this.items.push(field);
  }

  detectType(index: any) {
    const typeValue = this.items.at(index).get("fieldType").value;
    if (typeValue !== "measurement") {
      this.items
        .at(index)
        .get("fieldUnit")
        .clearValidators();
      this.items
        .at(index)
        .get("fieldUnit")
        .reset();
      this.items
        .at(index)
        .get("fieldUnit")
        .disable();
    } else {
      this.items
        .at(index)
        .get("fieldUnit")
        .enable();
      this.items
        .at(index)
        .get("fieldUnit")
        .setValidators([Validators.required, Validators.minLength(2)]);
    }
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
      Object.keys(this.metadata).forEach(key => {
        let field = {};
        if (this.metadata[key]["type"]) {
          field = {
            fieldName: key,
            fieldType: this.metadata[key].type,
            fieldValue: this.metadata[key].value,
            fieldUnit: this.metadata[key].unit
          };
        } else {
          field = {
            fieldName: key,
            fieldType: "string",
            fieldValue: JSON.stringify(this.metadata[key]),
            fieldUnit: ""
          };
        }
        this.items.push(this.formBuilder.group(field));
      });
      for (let i = 0; i < this.items.length; i++) {
        this.detectType(i);
      }
    }
  }

  createMetadataObjects(): object {
    const metadata = {};
    this.items.controls.forEach(control => {
      metadata[control.value.fieldName] = {
        type: control.value.fieldType
      };

      switch (control.value.fieldType) {
        case "date": {
          metadata[control.value.fieldName].value = new Date(
            control.value.fieldValue
          );
          metadata[control.value.fieldName].unit = "";
          break;
        }
        case "measurement": {
          metadata[control.value.fieldName].value = Number(
            control.value.fieldValue
          );
          metadata[control.value.fieldName].unit = control.value.fieldUnit;
          break;
        }
        case "number": {
          metadata[control.value.fieldName].value = Number(
            control.value.fieldValue
          );
          metadata[control.value.fieldName].unit = "";
          break;
        }
        case "string": {
          metadata[control.value.fieldName].value = control.value.fieldValue;
          metadata[control.value.fieldName].unit = "";
          break;
        }
        default: {
          metadata[control.value.fieldName].type = "";
          metadata[control.value.fieldName].value = control.value.fieldValue;
          metadata[control.value.fieldName].unit = control.value.fieldUnit;
          break;
        }
      }
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
  }

  filterUnits(index: number): void {
    this.filteredUnits$ = this.items
      .at(index)
      .get("fieldUnit")
      .valueChanges.pipe(
        startWith(""),
        map((value: string) => {
          const filterValue = value.toLowerCase();
          return this.units.filter(unit =>
            unit.toLowerCase().includes(filterValue)
          );
        })
      );
  }

  get items() {
    return this.metadataForm.get("items") as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private unitsService: UnitsService
  ) {}

  ngOnInit() {
    this.metadataForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });

    this.addCurrentMetadata();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "metadata") {
        this.metadata = changes[propName].currentValue;

        this.metadataForm = this.formBuilder.group({
          items: this.formBuilder.array([])
        });

        this.addCurrentMetadata();
      }
    }
  }
}
