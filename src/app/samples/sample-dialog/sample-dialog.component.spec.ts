import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleDialogComponent } from "./sample-dialog.component";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
} from "@angular/material";
import { FormBuilder, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("SampleDialogComponent", () => {
  let component: SampleDialogComponent;
  let fixture: ComponentFixture<SampleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleDialogComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: MatDialogRef, useValue: {} },
        FormBuilder,
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
