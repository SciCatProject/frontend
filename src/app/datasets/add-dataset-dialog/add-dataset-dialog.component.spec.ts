import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AddDatasetDialogComponent } from "./add-dataset-dialog.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockMatDialogRef } from "shared/MockStubs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("AddDatasetDialogComponent", () => {
  let component: AddDatasetDialogComponent;
  let fixture: ComponentFixture<AddDatasetDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddDatasetDialogComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
    });
    TestBed.overrideComponent(AddDatasetDialogComponent, {
      set: {
        providers: [
          { provide: MatDialogRef, useClass: MockMatDialogRef },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { userGroups: [] },
          },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDatasetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onSave()", () => {
    it("should close the dialog and emit the form data", () => {
      const closeSpy = spyOn(component.dialogRef, "close");

      const formValues = {
        datasetName: "Test Name",
        description: "Test description",
        ownerGroup: "test",
        sourceFolder: "/nfs/test",
        usedSoftware: "test software",
      };

      component.form.setValue(formValues);
      component.onSave();

      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(closeSpy).toHaveBeenCalledWith(formValues);
    });
  });

  describe("#onClose()", () => {
    it("should close the dialog without emitting any data", () => {
      const closeSpy = spyOn(component.dialogRef, "close");

      component.onClose();

      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(closeSpy).toHaveBeenCalledWith();
    });
  });
});
