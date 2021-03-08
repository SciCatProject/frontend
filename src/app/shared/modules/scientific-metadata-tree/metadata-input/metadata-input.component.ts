import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UnitsService } from 'shared/services/units.service';
import { FlatNodeEdit } from '../tree-edit/tree-edit.component';
import { startWith, map } from "rxjs/operators";

export interface InputData {
  type: string;
  key: string;
  value?: any;
  unit?:string;
}
export interface MetadataInput {
  valid: boolean;
  data: InputData;
}
@Component({
  selector: 'metadata-input',
  templateUrl: './metadata-input.component.html',
  styleUrls: ['./metadata-input.component.scss']
})
export class MetadataInputComponent implements OnInit {
  typeValues: string[] = ["date", "quantity", "number", "string", "object", 'list'];
  types: string[];
  units: string[];
  filteredUnits$: Observable<string[]>;
  metadataForm: FormGroup;
  @Input() currentData: MetadataInput;
  @Input() data: FlatNodeEdit;
  @Output() save = new EventEmitter<MetadataInput | null>();
  changeDetection : {next: (data :InputData) => void};
  constructor(private formBuilder: FormBuilder, private unitsService: UnitsService) {
    this.changeDetection = {
      next: (data: InputData) => {
        console.log(this.metadataForm);
        this.save.emit({valid: this.metadataForm.valid, data})
      }
    }
  }
  ngOnInit() {
    this.metadataForm = this.initilizeFormControl();

    this.types = this.typeValues;
    this.addCurrentMetadata(this.data);
    this.metadataForm
    this.metadataForm.valueChanges.subscribe(this.changeDetection);
  }

  unitValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const allowed = this.unitsService.getUnits().includes(control.value);
      return allowed ? null : { forbiddenUnit: { value: control.value } };
    };
  }
  initilizeFormControl() {
    const field = this.formBuilder.group({
      type: new FormControl("", [Validators.required]),
      key: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      value: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      unit: new FormControl("", [
        Validators.required,
        this.unitValidator(),
      ]),
    });
    return field;
  }
  addCurrentMetadata(node: FlatNodeEdit) {
    if (node.expandable) {
      this.metadataForm.get("type").setValue("object");
      this.metadataForm.get("key").setValue(node.key);
    } else {
      if (node.unit) {
        this.metadataForm.get("type").setValue("quantity");
        this.metadataForm.get("key").setValue(node.key);
        this.metadataForm.get("value").setValue(node.value || "");
        this.metadataForm.get("unit").setValue(node.unit || "");

      } else if (typeof node.value === "number") {
        this.metadataForm.get("type").setValue("number");
        this.metadataForm.get("key").setValue(node.key);
        this.metadataForm.get("value").setValue(node.value);

      } else if (isNaN(Date.parse(node.value))) {
        this.metadataForm.get("type").setValue("string");
        this.metadataForm.get("key").setValue(node.key);
        this.metadataForm.get("value").setValue(node.value);

      } else {
        this.metadataForm.get("type").setValue("date");
        this.metadataForm.get("key").setValue(node.key);
        this.metadataForm.get("value").setValue(node.value);
      }
    }
    this.detectType();
  }
  getUnits(): void {
    const name = this.metadataForm.get("key").value;
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
  setValueInputType() {
    const type = this.metadataForm.get("type").value;
    switch (type) {
      case "number":
      case "quantity":
        return "number";

      case "string":
        return "text";

      case "date":
        return "datetime-local";

      default:
        return "text";
    }
  }

  detectType() {
    const type = this.metadataForm.get("type").value;
    switch (type) {
      case "quantity":
        this.metadataForm.get("unit").enable();
        this.metadataForm.get("value").enable();
        break;
      case "object":
        if(this.data.expandable){
          this.types = ["object"];
        }
        this.metadataForm.get("value").disable();
        this.metadataForm.get("unit").disable();
        break;
      default:
        this.metadataForm.get("value").enable();
        this.metadataForm.get("unit").disable();
    }
  }
  fieldHasError(field: string): boolean {
    return this.metadataForm.get(field).hasError("required");
  }
}
