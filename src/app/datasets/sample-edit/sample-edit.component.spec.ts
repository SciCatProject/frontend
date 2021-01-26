import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

import { SampleEditComponent } from "./sample-edit.component";

describe("SampleEditComponent", () => {
  let component: SampleEditComponent;
  let fixture: ComponentFixture<SampleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleEditComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
