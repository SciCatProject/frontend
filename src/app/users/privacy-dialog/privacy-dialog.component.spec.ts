import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PrivacyDialogComponent } from "./privacy-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";

describe("PrivacyDialogComponent", () => {
  let component: PrivacyDialogComponent;
  let fixture: ComponentFixture<PrivacyDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyDialogComponent],
      imports: [MatDialogModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
