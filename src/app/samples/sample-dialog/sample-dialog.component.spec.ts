import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleDialogComponent } from "./sample-dialog.component";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material";
import { FormBuilder } from "@angular/forms";

describe("SampleDialogComponent", () => {
  let component: SampleDialogComponent;
  let fixture: ComponentFixture<SampleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleDialogComponent],
      imports: [MatDialogModule, FormBuilder],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
