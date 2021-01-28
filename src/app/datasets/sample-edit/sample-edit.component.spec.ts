import { DatePipe } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";

import { SampleEditComponent } from "./sample-edit.component";

describe("SampleEditComponent", () => {
  let component: SampleEditComponent;
  let fixture: ComponentFixture<SampleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleEditComponent],
      imports: [MatDialogModule],
      providers: [
        DatePipe,
        { provide: MatDialogRef, useValue: {} },
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
