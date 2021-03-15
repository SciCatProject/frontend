import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { MetadataEditComponent } from "./metadata-edit.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { FormBuilder } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";

describe("MetadataEditComponent", () => {
  let component: MetadataEditComponent;
  let fixture: ComponentFixture<MetadataEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MetadataEditComponent],
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
      ],
      providers: [FormBuilder],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#addMetadata()", () => {
    it("should add a new FormGroup to metadataForm items", () => {
      expect(component.items.length).toEqual(0);

      component.addMetadata();

      expect(component.items.length).toEqual(1);
    });
  });

  describe("#detectType() ", () => {
    it("should keep fieldUnit enabled if fieldType is 'quantity'", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("quantity");

      expect(component.items.at(0).get("fieldUnit").enabled).toEqual(true);

      component.detectType(0);

      expect(component.items.at(0).get("fieldUnit").enabled).toEqual(true);
    });

    it("should disable fieldUnit if fieldType is not 'quantity'", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("string");

      expect(component.items.at(0).get("fieldUnit").enabled).toEqual(true);

      component.detectType(0);

      expect(component.items.at(0).get("fieldUnit").status).toEqual("DISABLED");
    });
  });

  describe("#doSave()", () => {
    it("should emit an event", () => {
      spyOn(component.save, "emit");

      component.metadata = {};
      component.doSave();

      expect(component.save.emit).toHaveBeenCalledTimes(1);
      expect(component.save.emit).toHaveBeenCalledWith(component.metadata);
    });
  });

  describe("#onRemove()", () => {
    it("should remove remove the FormGroup at the provided index", () => {
      component.addMetadata();

      expect(component.items.length).toEqual(1);

      component.onRemove(0);

      expect(component.items.length).toEqual(0);
    });
  });

  describe("#addCurrentMetadata()", () => {
    it("should add typed metadata from the provided metadata object to the FormGroup array", () => {
      expect(component.items.length).toEqual(0);

      component.metadata = {
        testName: {
          type: "quantity",
          value: 100,
          unit: "Hz",
        },
      };

      component.addCurrentMetadata();

      expect(component.items.length).toEqual(1);
      expect(component.items.at(0).get("fieldName").value).toEqual("testName");
      expect(component.items.at(0).get("fieldType").value).toEqual("quantity");
      expect(component.items.at(0).get("fieldValue").value).toEqual(100);
      expect(component.items.at(0).get("fieldUnit").value).toEqual("Hz");
    });

    it("should add untyped metadata from the provided metadata object to the FormGroup array", () => {
      expect(component.items.length).toEqual(0);

      component.metadata = {
        testName: {
          v: 100,
          u: "Hz",
        },
      };

      component.addCurrentMetadata();

      expect(component.items.length).toEqual(1);
      expect(component.items.at(0).get("fieldName").value).toEqual("testName");
      expect(component.items.at(0).get("fieldType").value).toEqual("string");
      expect(component.items.at(0).get("fieldValue").value).toEqual(
        // tslint:disable-next-line: quotemark
        '{"v":100,"u":"Hz"}'
      );
      expect(component.items.at(0).get("fieldUnit").status).toEqual("DISABLED");
    });

    it("should do nothing if the metadata object is undefined", () => {
      expect(component.items.length).toEqual(0);
      expect(component.metadata).toBeUndefined();

      component.addCurrentMetadata();

      expect(component.items.length).toEqual(0);
    });
  });

  describe("#createMetaDataObject()", () => {
    it("should create a metadata object with a date value from the FormGroup array", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("date");

      component.detectType(0);

      component.items.at(0).get("fieldName").setValue("testName");
      component.items.at(0).get("fieldValue").setValue("2019-09-03 10:25:40");

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].value).toEqual("2019-09-03 10:25:40");
      expect(metadataObject["testName"].unit).toEqual("");
    });

    it("should create a metadata object with a quantity from the FormGroup array", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("quantity");

      component.detectType(0);

      component.items.at(0).get("fieldName").setValue("testName");
      component.items.at(0).get("fieldValue").setValue(100);
      component.items.at(0).get("fieldUnit").setValue("Hz");

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].value).toEqual(100);
      expect(metadataObject["testName"].unit).toEqual("Hz");
    });

    it("should create a metadata object with a number value from the FormGroup array", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("number");

      component.detectType(0);

      component.items.at(0).get("fieldName").setValue("testName");
      component.items.at(0).get("fieldValue").setValue(100);

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].value).toEqual(100);
      expect(metadataObject["testName"].unit).toEqual("");
    });

    it("should create a metadata object with a string value from the FormGroup array", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("string");

      component.detectType(0);

      component.items.at(0).get("fieldName").setValue("testName");
      component.items.at(0).get("fieldValue").setValue("test");

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].value).toEqual("test");
      expect(metadataObject["testName"].unit).toEqual("");
    });
  });

  describe("#isInvalid()", () => {
    it("should return true if the form is invalid", () => {
      component.addMetadata();

      const invalid = component.isInvalid();

      expect(invalid).toEqual(true);
    });

    it("should return false if the form is valid", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("string");
      component.detectType(0);
      component.items.at(0).get("fieldName").setValue("test");
      component.items.at(0).get("fieldValue").setValue("testValue");

      const invalid = component.isInvalid();

      expect(invalid).toEqual(false);
    });
  });

  describe("#getUnits()", () => {
    it("should get an array of units based on the value of fieldName", () => {
      component.addMetadata();
      component.items.at(0).get("fieldName").setValue("elapsed_time");

      component.getUnits(0);

      expect(component.units.includes("seconds")).toEqual(true);
    });
  });

  describe("#setValueInputType()", () => {
    it("should return 'number' if metadata type is 'number'", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("number");

      const inputType = component.setValueInputType(0);

      expect(inputType).toEqual("number");
    });

    it("should return 'number' if metadata type is 'quantity'", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("quantity");

      const inputType = component.setValueInputType(0);

      expect(inputType).toEqual("number");
    });

    it("should return 'text' if metadata type is 'string'", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("string");

      const inputType = component.setValueInputType(0);

      expect(inputType).toEqual("text");
    });

    it("should return 'datetime-local' if metadata type is 'date'", () => {
      component.addMetadata();
      component.items.at(0).get("fieldType").setValue("date");

      const inputType = component.setValueInputType(0);

      expect(inputType).toEqual("datetime-local");
    });

    it("should return 'text' if metadata type is undefined", () => {
      component.addMetadata();

      const inputType = component.setValueInputType(0);

      expect(inputType).toEqual("text");
    });
  });
});
