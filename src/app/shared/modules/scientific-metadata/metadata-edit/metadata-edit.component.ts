import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";

@Component({
  selector: "metadata-edit",
  templateUrl: "./metadata-edit.component.html",
  styleUrls: ["./metadata-edit.component.scss"]
})
export class MetadataEditComponent implements OnInit {
  metadataForm: FormGroup;
  typeValues: string[] = ["date", "measurement", "number", "string"];

  @Input() metadata: object;
  @Output() save = new EventEmitter<object>();

  addMetadata() {
    const field = this.formBuilder.group({
      fieldType: [],
      fieldName: [],
      fieldValue: [],
      fieldUnit: []
    });
    this.items.push(field);
  }

  detectType(index: any) {
    const typeValue = this.items.at(index).get("fieldType").value;
    if (typeValue !== "measurement") {
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

  get items() {
    return this.metadataForm.get("items") as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.metadataForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });

    this.addCurrentMetadata();
  }
}
