import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UnitsService } from 'shared/services/units.service';
import { FlatNodeEdit } from '../tree-edit/tree-edit.component';
import { startWith, map } from "rxjs/operators";

export interface MetadataInput {
  fieldType: string;
  fieldName: string;
  fieldValue?: string;
  fieldUnit?: string;
}
@Component({
  selector: 'metadata-input',
  templateUrl: './metadata-input.component.html',
  styleUrls: ['./metadata-input.component.css']
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
  changeDetection : {next: (data :MetadataInput) => void};
  constructor(private formBuilder: FormBuilder, private unitsService: UnitsService) {
    this.changeDetection = {
      next: (data: MetadataInput) => this.save.emit(data)
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
    return field;
  }
  addCurrentMetadata(node: FlatNodeEdit) {
    if (node.expandable) {
      this.metadataForm.get("fieldType").setValue("object");
      this.metadataForm.get("fieldName").setValue(node.key);
    } else {
      if (node.unit) {
        this.metadataForm.get("fieldType").setValue("quantity");
        this.metadataForm.get("fieldName").setValue(node.key);
        this.metadataForm.get("fieldValue").setValue(node.value || "");
        this.metadataForm.get("fieldUnit").setValue(node.unit || "");

      } else if (typeof node.value === "number") {
        this.metadataForm.get("fieldType").setValue("number");
        this.metadataForm.get("fieldName").setValue(node.key);
        this.metadataForm.get("fieldValue").setValue(node.value);

      } else if (isNaN(Date.parse(node.value))) {
        this.metadataForm.get("fieldType").setValue("string");
        this.metadataForm.get("fieldName").setValue(node.key);
        this.metadataForm.get("fieldValue").setValue(node.value);

      } else {
        this.metadataForm.get("fieldType").setValue("date");
        this.metadataForm.get("fieldName").setValue(node.key);
        this.metadataForm.get("fieldValue").setValue(node.value);
      }
    }
    this.detectType();
  }
  getUnits(): void {
    const name = this.metadataForm.get("fieldName").value;
    this.units = this.unitsService.getUnits(name);
    this.filteredUnits$ = this.metadataForm.get("fieldUnit").valueChanges.pipe(
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
    const type = this.metadataForm.get("fieldType").value;
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
    const type = this.metadataForm.get("fieldType").value;
    switch (type) {
      case "quantity":
        this.metadataForm.get("fieldUnit").enable();
        this.metadataForm.get("fieldValue").enable();
        break;
      case "object":
        if(this.data.expandable){
          this.types = ["object"];
        }
        this.metadataForm.get("fieldValue").disable();
        this.metadataForm.get("fieldUnit").disable();
        break;
      default:
        this.metadataForm.get("fieldValue").enable();
        this.metadataForm.get("fieldUnit").disable();
    }
  }
  fieldHasError(field: string): boolean {
    return this.metadataForm.get(field).hasError("required");
  }
}
