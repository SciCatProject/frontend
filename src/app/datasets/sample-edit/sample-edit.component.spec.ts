import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";
import {
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { Sample } from "shared/sdk";
import {
  changePageAction,
  setTextFilterAction,
  sortByColumnAction,
} from "state-management/actions/samples.actions";

import { SampleEditComponent } from "./sample-edit.component";

describe("SampleEditComponent", () => {
  let component: SampleEditComponent;
  let fixture: ComponentFixture<SampleEditComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SampleEditComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: Store, useClass: MockStore },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleEditComponent);
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

  describe("#onTextSearchChange()", () => {
    it("should dispatch a setTextFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onTextSearchChange();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ text: "" })
      );
    });
  });

  describe("#onClear()", () => {
    it("should do nothing if text filter is empty", () => {
      spyOn(component, "onTextSearchChange");

      component.onClear();

      expect(component.onTextSearchChange).toHaveBeenCalledTimes(0);
    });

    it("should set text filter to empty string and call #ontextSearchChange() if filter is not empty", () => {
      spyOn(component, "onTextSearchChange");

      component.text = "test";
      component.onClear();

      expect(component.text).toEqual("");
      expect(component.onTextSearchChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 1,
        pageSize: 10,
        length: 100,
      };

      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a sortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "createdAt",
        direction: "asc",
      };

      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column: event.active, direction: event.direction })
      );
    });
  });

  describe("#isInvalid()", () => {
    it("should return false if form does not contain a sample", () => {
      const invalid = component.isInvalid();

      expect(invalid).toEqual(true);
    });

    it("should return false if sample in form has same id as current sample", () => {
      const sampleId = "abc123";

      const sample = new Sample({
        sampleId,
        owner: "test",
        description: "test",
        createdAt: new Date(),
        sampleCharacteristics: {},
        isPublished: false,
        ownerGroup: "test",
        accessGroups: [],
        createdBy: "test",
        updatedBy: "test",
        datasetId: "test",
        datasetsId: "test",
        rawDatasetId: "test",
        derivedDatasetId: "test",
        updatedAt: new Date(),
      });

      component.data.sampleId = sampleId;
      component.sample.setValue(sample);

      const invalid = component.isInvalid();

      expect(invalid).toEqual(true);
    });

    it("should return true if form is valid", () => {
      const sampleId = "abc123";

      const sample = new Sample({
        sampleId: "123abc",
        owner: "test",
        description: "test",
        createdAt: new Date(),
        sampleCharacteristics: {},
        isPublished: false,
        ownerGroup: "test",
        accessGroups: [],
        createdBy: "test",
        updatedBy: "test",
        datasetId: "test",
        datasetsId: "test",
        rawDatasetId: "test",
        derivedDatasetId: "test",
        updatedAt: new Date(),
      });

      component.data.sampleId = sampleId;
      component.sample.setValue(sample);

      const invalid = component.isInvalid();

      expect(invalid).toEqual(false);
    });
  });

  describe("#cancel()", () => {
    it("should close the dialog", () => {
      const dialogCloseSpy = spyOn(component.dialogRef, "close");

      component.cancel();

      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("#save()", () => {
    it("should close the dialog and emit data", () => {
      const dialogCloseSpy = spyOn(component.dialogRef, "close");

      const sample = new Sample({
        sampleId: "123abc",
        owner: "test",
        description: "test",
        createdAt: new Date(),
        sampleCharacteristics: {},
        isPublished: false,
        ownerGroup: "test",
        accessGroups: [],
        createdBy: "test",
        updatedBy: "test",
        datasetId: "test",
        datasetsId: "test",
        rawDatasetId: "test",
        derivedDatasetId: "test",
        updatedAt: new Date(),
      });

      component.sample.setValue(sample);

      component.save();

      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(dialogCloseSpy).toHaveBeenCalledWith({ sample });
    });
  });
});
