import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DialogComponent } from "./dialog.component";
import { MockMatDialogRef, MockMatDialogData } from "shared/MockStubs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedScicatFrontendModule } from "shared/shared.module";
describe("DialogComponent", () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

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
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
