import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DialogComponent } from "./dialog.component";
import { MockMatDialogRef, MockMatDialogData } from "shared/MockStubs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedScicatFrontendModule } from "shared/shared.module";

describe("DialogComponent", () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let dialogRef: MatDialogRef<DialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [SharedScicatFrontendModule],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useClass: MockMatDialogData },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should close the dialog when cancelling", () => {
    const closeSpy = spyOn(dialogRef, "close");

    component.onNoClick();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it("should render dynamic additional fields and disable submit when required data is missing", () => {
    component.data = {
      title: "Mark for deletion reason",
      additionalFields: {
        deletiionCode: {
          label: "Deletion code",
          type: "select",
          required: true,
          options: [
            { label: "MARKED_FOR_DELETION", value: "MARKED_FOR_DELETION" },
          ],
        },
        explanation: {
          label: "Explanation for deletion",
          type: "textarea",
          required: true,
        },
      },
    };

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.textContent).toContain("Deletion code");
    expect(compiled.textContent).toContain("Explanation for deletion");
    expect(compiled.querySelector("textarea")).toBeTruthy();
  });
});
