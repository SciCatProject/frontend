import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ShareDialogComponent } from "./share-dialog.component";

describe("ShareDialogComponent", () => {
  let component: ShareDialogComponent;
  let fixture: ComponentFixture<ShareDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareDialogComponent],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: { close: () => {} } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#isInvalid()", () => {
    it("should return true if form value is empty", () => {
      const isInvalid = component.isInvalid();

      expect(isInvalid).toEqual(true);
    });

    it("should return true if form value is not a valid email address", () => {
      component.emailFormControl.setValue("test");

      const isInvalid = component.isInvalid();

      expect(isInvalid).toEqual(true);
    });

    it("should return false if form value is a valid email address", () => {
      const email = "test@email.com";
      component.emailFormControl.setValue(email);

      const isInvalid = component.isInvalid();

      expect(isInvalid).toEqual(false);
    });
  });

  describe("#add()", () => {
    it("should add the email to the emails array and reset the form field", () => {
      const email = "test@email.com";
      component.emailFormControl.setValue(email);
      expect(component.emailFormControl.value).toEqual(email);

      component.add(email);

      expect(component.emails).toContain(email);
      expect(component.emailFormControl.value).toEqual(null);
    });
  });

  describe("#remove()", () => {
    it("should do nothing if trying to remove an email not in the array", () => {
      const email = "test@email.com";
      component.emails.push(email);
      expect(component.emails).toContain(email);
      const emails = component.emails;

      component.remove("noInArray@email.com");

      expect(component.emails).toEqual(emails);
    });

    it("should remove the email from the emails array if the array contains the email", () => {
      const email = "test@email.com";
      component.emails.push(email);
      expect(component.emails).toContain(email);

      component.remove(email);

      expect(component.emails).not.toContain(email);
    });
  });

  describe("#isEmpty()", () => {
    it("should return false if emails array is not empty", () => {
      const email = "test@gmail.com";
      component.emails.push(email);

      const isEmpty = component.isEmpty();

      expect(isEmpty).toEqual(false);
    });

    it("should return true if emails array is empty", () => {
      const isEmpty = component.isEmpty();

      expect(isEmpty).toEqual(true);
    });
  });

  describe("#share()", () => {
    it("should close the dialog and emit data", () => {
      const dialogCloseSpy = spyOn(component.dialogRef, "close");

      const email = "test@email.com";
      component.emails.push(email);
      const users = component.emails;

      component.share();

      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(dialogCloseSpy).toHaveBeenCalledWith({ users });
    });
  });

  describe("#cancel()", () => {
    it("should close the dialog", () => {
      const dialogCloseSpy = spyOn(component.dialogRef, "close");

      component.cancel();

      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
