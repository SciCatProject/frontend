import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlatNodeEdit } from '../tree-edit/tree-edit.component';
import { MetadataInputBase } from '../base-classes/metadata-input-base';

export interface InputData {
  type: string;
  key: string;
  value: any;
  unit?: string;
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
export class MetadataInputComponent extends MetadataInputBase implements OnInit {
  changeDetection: Subscription;
  types: string[];
  @Input() data: FlatNodeEdit;
  @Output() save = new EventEmitter<MetadataInput | null>();
  @Output() cancel = new EventEmitter();
  @Output() changed = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    super();
  }
  ngOnInit() {
    this.metadataForm = this.initilizeFormControl();
    this.addCurrentMetadata(this.data);
    this.changeDetection = this.metadataForm.valueChanges.subscribe(() => {this.changed.emit(); this.changeDetection.unsubscribe()});
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
      this.metadataForm.get("type").setValue("string");
      this.metadataForm.get("key").setValue(node.key);
      this.typeValues = ['string'];
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
  onSave() {
    if (this.metadataForm.dirty) {
      this.save.emit(this.metadataForm.value);
    } else {
      this.cancel.emit();
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
