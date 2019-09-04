import { DatasetFormComponent } from "./dataset-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockStore } from "../../shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { rootReducer } from "state-management/reducers/root.reducer";
import { MatSelectModule, MatFormFieldModule } from "@angular/material";
import { SaveDatasetAction } from "state-management/actions/datasets.actions";
import { RawDataset } from "shared/sdk";

describe("DatasetFormComponent", () => {
  let component: DatasetFormComponent;
  let fixture: ComponentFixture<DatasetFormComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetFormComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        StoreModule.forRoot({ rootReducer })
      ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
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
    it("should keep fieldUnit enabled if fieldType is 'measurement'", () => {
      component.addMetadata();
      component.items
        .at(0)
        .get("fieldType")
        .setValue("measurement");

      expect(component.items.at(0).get("fieldUnit").status).toEqual("VALID");

      component.detectType(0);

      expect(component.items.at(0).get("fieldUnit").status).toEqual("VALID");
    });

    it("should disable fieldUnit if fieldType is not 'measurement'", () => {
      component.addMetadata();
      component.items
        .at(0)
        .get("fieldType")
        .setValue("string");

      expect(component.items.at(0).get("fieldUnit").status).toEqual("VALID");

      component.detectType(0);

      expect(component.items.at(0).get("fieldUnit").status).toEqual("DISABLED");
    });
  });

  describe("#onSubmit()", () => {
    it("should dispatch a SaveDataset action", () => {
      dispatchSpy = spyOn(store, "dispatch");
      component.dataset = new RawDataset();
      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SaveDatasetAction(component.dataset)
      );
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
    it("should add typed metadata from the current dataset to the FormGroup array", () => {
      expect(component.items.length).toEqual(0);

      component.dataset = new RawDataset();
      component.dataset.scientificMetadata = {
        testName: {
          type: "measurement",
          value: 100,
          unit: "Hz"
        }
      };

      component.addCurrentMetadata();

      expect(component.items.length).toEqual(1);
      expect(component.items.at(0).get("fieldName").value).toEqual("testName");
      expect(component.items.at(0).get("fieldType").value).toEqual(
        "measurement"
      );
      expect(component.items.at(0).get("fieldValue").value).toEqual(100);
      expect(component.items.at(0).get("fieldUnit").value).toEqual("Hz");
    });

    it("should add untyped metadata from the current dataset to the FormGroup array", () => {
      expect(component.items.length).toEqual(0);

      component.dataset = new RawDataset();
      component.dataset.scientificMetadata = {
        testName: {
          v: 100,
          u: "Hz"
        }
      };

      component.addCurrentMetadata();

      expect(component.items.length).toEqual(1);
      expect(component.items.at(0).get("fieldName").value).toEqual("testName");
      expect(component.items.at(0).get("fieldType").value).toEqual("string");
      expect(component.items.at(0).get("fieldValue").value).toEqual(
        '{"v":100,"u":"Hz"}'
      );
      expect(component.items.at(0).get("fieldUnit").status).toEqual("DISABLED");
    });
    it("should do nothing if current dataset is undefined", () => {
      expect(component.items.length).toEqual(0);
      expect(component.dataset).toBeUndefined();

      component.addCurrentMetadata();

      expect(component.items.length).toEqual(0);
    });
  });

  describe("#createMetaDataObject()", () => {
    it("should create a metadata object with type 'date' from the FormGroup array", () => {
      component.addMetadata();
      component.items
        .at(0)
        .get("fieldName")
        .setValue("testName");
      component.items
        .at(0)
        .get("fieldType")
        .setValue("date");

      component.detectType(0);

      component.items
        .at(0)
        .get("fieldValue")
        .setValue("2019-09-03 10:25:40");

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].type).toEqual("date");
      expect(metadataObject["testName"].value).toEqual(
        new Date("2019-09-03 10:25:40")
      );
      expect(metadataObject["testName"].unit).toEqual("");
    });

    it("should create a metadata object with type 'measurement' from the FormGroup array", () => {
      component.addMetadata();
      component.items
        .at(0)
        .get("fieldName")
        .setValue("testName");
      component.items
        .at(0)
        .get("fieldType")
        .setValue("measurement");

      component.detectType(0);

      component.items
        .at(0)
        .get("fieldValue")
        .setValue(100);
      component.items
        .at(0)
        .get("fieldUnit")
        .setValue("Hz");

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].type).toEqual("measurement");
      expect(metadataObject["testName"].value).toEqual(100);
      expect(metadataObject["testName"].unit).toEqual("Hz");
    });

    it("should create a metadata object with type 'number' from the FormGroup array", () => {
      component.addMetadata();
      component.items
        .at(0)
        .get("fieldName")
        .setValue("testName");
      component.items
        .at(0)
        .get("fieldType")
        .setValue("number");

      component.detectType(0);

      component.items
        .at(0)
        .get("fieldValue")
        .setValue(100);

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].type).toEqual("number");
      expect(metadataObject["testName"].value).toEqual(100);
      expect(metadataObject["testName"].unit).toEqual("");
    });

    it("should create a metadata object with type 'string' from the FormGroup array", () => {
      component.addMetadata();
      component.items
        .at(0)
        .get("fieldName")
        .setValue("testName");
      component.items
        .at(0)
        .get("fieldType")
        .setValue("string");

      component.detectType(0);

      component.items
        .at(0)
        .get("fieldValue")
        .setValue("test");

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].type).toEqual("string");
      expect(metadataObject["testName"].value).toEqual("test");
      expect(metadataObject["testName"].unit).toEqual("");
    });

    it("should create a metadata object with no type from the FormGroup array", () => {
      component.addMetadata();
      component.items
        .at(0)
        .get("fieldName")
        .setValue("testName");
      component.items
        .at(0)
        .get("fieldType")
        .setValue("");
      component.items
        .at(0)
        .get("fieldValue")
        .setValue("test");
      component.items
        .at(0)
        .get("fieldUnit")
        .setValue("test");

      const metadataObject = component.createMetadataObjects();

      expect(metadataObject).toBeDefined();
      expect(Object.keys(metadataObject).length).toBe(1);
      expect(Object.keys(metadataObject)[0]).toEqual("testName");
      expect(metadataObject["testName"].type).toEqual("");
      expect(metadataObject["testName"].value).toEqual("test");
      expect(metadataObject["testName"].unit).toEqual("test");
    });
  });
});
